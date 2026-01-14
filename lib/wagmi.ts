import { http, createConfig, cookieStorage, createStorage } from "wagmi"
import { polygon } from "wagmi/chains"
import { injected } from "wagmi/connectors"

// 自定义 Polygon 配置，使用环境变量的 RPC
const polygonChain = {
  ...polygon,
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_POLYGON_RPC || "https://polygon-rpc.com"],
    },
  },
}

export const config = createConfig({
  chains: [polygonChain],
  connectors: [injected()],
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  transports: {
    [polygon.id]: http(process.env.NEXT_PUBLIC_POLYGON_RPC || "https://polygon-rpc.com"),
  },
})

declare module "wagmi" {
  interface Register {
    config: typeof config
  }
}
