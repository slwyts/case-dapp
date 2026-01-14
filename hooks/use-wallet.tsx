"use client"

import { useEffect, useCallback, useState } from "react"
import { useAccount, useConnect, useDisconnect, useSignMessage, useReadContract, useSwitchChain, useChainId, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { polygon } from "wagmi/chains"
import { erc20Abi, CASE_TOKEN_ADDRESS, formatTokenBalance, parseTokenAmount } from "@/lib/case-token"

export function useWallet() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { signMessageAsync } = useSignMessage()
  const { switchChainAsync } = useSwitchChain()
  const chainId = useChainId()
  const [isSwitchingChain, setIsSwitchingChain] = useState(false)

  // 强制切换到 Polygon 的函数
  const forceSwitchToPolygon = useCallback(async () => {
    if (isSwitchingChain) return false
    
    setIsSwitchingChain(true)
    try {
      await switchChainAsync({ chainId: polygon.id })
      return true
    } catch (error) {
      console.error("Failed to switch chain:", error)
      // 切换失败时断开连接，防止在错误的链上操作
      disconnect()
      return false
    } finally {
      setIsSwitchingChain(false)
    }
  }, [switchChainAsync, disconnect, isSwitchingChain])

  // 连接后强制切换到 Polygon，如果切换失败则断开连接
  useEffect(() => {
    const autoSwitch = async () => {
      if (isConnected && chainId && chainId !== polygon.id && !isSwitchingChain) {
        await forceSwitchToPolygon()
      }
    }
    autoSwitch()
  }, [isConnected, chainId, forceSwitchToPolygon, isSwitchingChain])

  // 查询链上 CASE 余额（只有在 Polygon 链上才查询）
  const { data: walletBalanceRaw, refetch: refetchWalletBalance } = useReadContract({
    address: CASE_TOKEN_ADDRESS,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!CASE_TOKEN_ADDRESS && chainId === polygon.id,
    },
  })

  // 格式化钱包地址（显示用）
  const displayAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null

  // 格式化钱包余额
  const walletBalance = formatTokenBalance(walletBalanceRaw as bigint | undefined)

  const connectWallet = async () => {
    const injectedConnector = connectors.find((c) => c.id === "injected")
    if (injectedConnector) {
      try {
        // 连接时指定链
        await connect({ connector: injectedConnector, chainId: polygon.id })
        // 连接成功后，如果不在 Polygon 链上，强制切换
        // 注意：这里的切换会在 useEffect 中自动触发
      } catch (error) {
        console.error("Failed to connect:", error)
      }
    }
  }

  const disconnectWallet = () => {
    disconnect()
  }

  const signMessage = async (message: string): Promise<string> => {
    // 签名前确保在 Polygon 链上
    if (chainId !== polygon.id) {
      const switched = await forceSwitchToPolygon()
      if (!switched) {
        throw new Error("Must be on Polygon network to sign messages")
      }
    }
    const signature = await signMessageAsync({ message })
    return signature
  }

  // 发送 CASE Token
  const { writeContractAsync, isPending: isSendingToken, data: sendTxHash } = useWriteContract()
  
  // 等待交易确认
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: sendTxHash,
  })

  const sendToken = async (to: string, amount: string): Promise<string> => {
    // 发送前确保在 Polygon 链上
    if (chainId !== polygon.id) {
      const switched = await forceSwitchToPolygon()
      if (!switched) {
        throw new Error("Must be on Polygon network to send tokens")
      }
    }

    if (!CASE_TOKEN_ADDRESS) {
      throw new Error("CASE Token address not configured")
    }

    // 验证地址格式
    if (!to || !/^0x[a-fA-F0-9]{40}$/.test(to)) {
      throw new Error("Invalid recipient address")
    }

    // 解析数量为 wei
    const amountInWei = parseTokenAmount(amount)
    if (amountInWei <= BigInt(0)) {
      throw new Error("Amount must be greater than 0")
    }

    // 调用合约 transfer 方法
    const txHash = await writeContractAsync({
      address: CASE_TOKEN_ADDRESS,
      abi: erc20Abi,
      functionName: "transfer",
      args: [to as `0x${string}`, amountInWei],
    })

    return txHash
  }

  // 是否在正确的链上
  const isCorrectChain = chainId === polygon.id

  return {
    isConnected,
    isCorrectChain,
    isSwitchingChain,
    chainId,
    walletAddress: displayAddress,
    fullAddress: address,
    walletBalance,
    walletBalanceRaw: walletBalanceRaw as bigint | undefined,
    connectWallet,
    disconnectWallet,
    signMessage,
    sendToken,
    isSendingToken,
    isConfirming,
    isConfirmed,
    sendTxHash,
    refetchWalletBalance,
    switchToPolygon: forceSwitchToPolygon,
  }
}

// 保留 WalletProvider 以保持向后兼容（现在是空壳，真正的 Provider 在 wagmi）
export function WalletProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
