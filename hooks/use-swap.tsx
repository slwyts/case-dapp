"use client"

import { useCallback, useState } from "react"
import { useReadContract, useWriteContract, useChainId, useSwitchChain, usePublicClient } from "wagmi"
import { polygon } from "wagmi/chains"
import { 
  QUICKSWAP_ROUTER, 
  SUPPORTED_TOKENS, 
  quickswapRouterAbi, 
  erc20ApproveAbi,
  parseTokenAmount,
  formatTokenAmount,
  calculateMinAmountOut,
  getDeadline,
} from "@/lib/swap"

interface UseSwapProps {
  fromToken: string
  toToken: string
  fromAmount: string
  userAddress?: string
}

export function useSwap({ fromToken, toToken, fromAmount, userAddress }: UseSwapProps) {
  const [isApproving, setIsApproving] = useState(false)
  const chainId = useChainId()
  const { switchChainAsync } = useSwitchChain()
  const publicClient = usePublicClient()
  
  const fromTokenConfig = SUPPORTED_TOKENS[fromToken]
  const toTokenConfig = SUPPORTED_TOKENS[toToken]
  
  const fromAmountParsed = parseTokenAmount(fromAmount, fromTokenConfig?.decimals || 18)
  
  // 读取用户的 fromToken 余额
  const { data: fromBalance, refetch: refetchFromBalance } = useReadContract({
    address: fromTokenConfig?.address,
    abi: erc20ApproveAbi,
    functionName: "balanceOf",
    args: userAddress ? [userAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!userAddress && !!fromTokenConfig?.address,
    },
  })

  // 读取用户的 toToken 余额
  const { data: toBalance, refetch: refetchToBalance } = useReadContract({
    address: toTokenConfig?.address,
    abi: erc20ApproveAbi,
    functionName: "balanceOf",
    args: userAddress ? [userAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!userAddress && !!toTokenConfig?.address,
    },
  })

  // 读取授权额度
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: fromTokenConfig?.address,
    abi: erc20ApproveAbi,
    functionName: "allowance",
    args: userAddress && QUICKSWAP_ROUTER ? [userAddress as `0x${string}`, QUICKSWAP_ROUTER] : undefined,
    query: {
      enabled: !!userAddress && !!fromTokenConfig?.address && !!QUICKSWAP_ROUTER,
    },
  })

  // 获取预估输出金额
  const { data: amountsOut, isLoading: isLoadingQuote } = useReadContract({
    address: QUICKSWAP_ROUTER,
    abi: quickswapRouterAbi,
    functionName: "getAmountsOut",
    args: fromAmountParsed > BigInt(0) && fromTokenConfig && toTokenConfig
      ? [fromAmountParsed, [fromTokenConfig.address, toTokenConfig.address]]
      : undefined,
    query: {
      enabled: fromAmountParsed > BigInt(0) && !!fromTokenConfig?.address && !!toTokenConfig?.address && !!QUICKSWAP_ROUTER,
    },
  })

  // 预估输出金额
  const estimatedOutput = amountsOut?.[1] || BigInt(0)
  const estimatedOutputFormatted = formatTokenAmount(estimatedOutput, toTokenConfig?.decimals || 18)

  // 计算汇率
  const exchangeRate = fromAmountParsed > BigInt(0) && estimatedOutput > BigInt(0)
    ? Number(estimatedOutput) / Number(fromAmountParsed) * Math.pow(10, (fromTokenConfig?.decimals || 18) - (toTokenConfig?.decimals || 18))
    : 0

  // 检查是否需要授权
  const needsApproval = allowance !== undefined && fromAmountParsed > BigInt(0) && allowance < fromAmountParsed

  // 写合约 hooks
  const { writeContractAsync } = useWriteContract()

  // 授权
  const approve = useCallback(async () => {
    if (!fromTokenConfig?.address || !QUICKSWAP_ROUTER) {
      throw new Error("Token or router not configured")
    }

    // 如果不在 Polygon，先切换网络
    if (chainId !== polygon.id) {
      await switchChainAsync({ chainId: polygon.id })
      // 短暂等待让钱包状态同步
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    setIsApproving(true)
    try {
      const txHash = await writeContractAsync({
        address: fromTokenConfig.address,
        abi: erc20ApproveAbi,
        functionName: "approve",
        args: [QUICKSWAP_ROUTER, fromAmountParsed * BigInt(2)], // 授权 2 倍金额
        chain: polygon,
      })
      
      // 等待交易上链确认
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash: txHash })
      }
      
      // 刷新授权额度
      await refetchAllowance()
      
      return txHash
    } finally {
      setIsApproving(false)
    }
  }, [fromTokenConfig, fromAmountParsed, writeContractAsync, refetchAllowance, chainId, switchChainAsync, publicClient])

  // 执行 swap
  const swap = useCallback(async () => {
    if (!fromTokenConfig?.address || !toTokenConfig?.address || !QUICKSWAP_ROUTER || !userAddress) {
      throw new Error("Missing required parameters")
    }

    if (fromAmountParsed <= BigInt(0)) {
      throw new Error("Invalid amount")
    }

    // 如果不在 Polygon，先切换网络
    if (chainId !== polygon.id) {
      await switchChainAsync({ chainId: polygon.id })
      // 短暂等待让钱包状态同步
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    const minAmountOut = calculateMinAmountOut(estimatedOutput)
    const deadline = getDeadline()
    const path = [fromTokenConfig.address, toTokenConfig.address]

    const txHash = await writeContractAsync({
      address: QUICKSWAP_ROUTER,
      abi: quickswapRouterAbi,
      functionName: "swapExactTokensForTokens",
      args: [fromAmountParsed, minAmountOut, path, userAddress as `0x${string}`, deadline],
      chain: polygon,
    })

    return txHash
  }, [fromTokenConfig, toTokenConfig, fromAmountParsed, estimatedOutput, userAddress, writeContractAsync, chainId, switchChainAsync])

  // 格式化余额
  const fromBalanceFormatted = fromBalance 
    ? formatTokenAmount(fromBalance as bigint, fromTokenConfig?.decimals || 18, 2) 
    : "0"
  const toBalanceFormatted = toBalance 
    ? formatTokenAmount(toBalance as bigint, toTokenConfig?.decimals || 18, 2) 
    : "0"

  // 是否在错误网络
  const isWrongNetwork = chainId !== polygon.id

  return {
    // 余额
    fromBalance: fromBalance as bigint | undefined,
    toBalance: toBalance as bigint | undefined,
    fromBalanceFormatted,
    toBalanceFormatted,
    
    // 报价
    estimatedOutput,
    estimatedOutputFormatted,
    exchangeRate,
    isLoadingQuote,
    
    // 授权
    needsApproval,
    allowance: allowance as bigint | undefined,
    isApproving,
    approve,
    
    // Swap
    swap,
    
    // 网络
    isWrongNetwork,
    switchToPolygon: () => switchChainAsync({ chainId: polygon.id }),
    
    // 刷新
    refetchBalances: () => {
      refetchFromBalance()
      refetchToBalance()
    },
  }
}
