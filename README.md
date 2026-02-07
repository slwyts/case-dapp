# 本地生活 CasE DApp

基于 Next.js 构建的本地生活服务 DApp，提供链上CasE通证充值提兑换现等功能。

## 技术栈

- Next.js 16
- React 19
- wagmi / viem (区块链交互)
- Tailwind CSS
- shadcn/ui

## 开始使用

1. 安装依赖：

```bash
npm install
```

2. 配置环境变量：

```bash
cp .env.example .env.local
```

其中项目方接口配置项：

- `PARTNER_API_BASE_URL`：项目方接口域名
- `PARTNER_AUTH_USERNAME`：鉴权用户名
- `PARTNER_AUTH_PASSWORD`：鉴权密码
- `PARTNER_CLIENT_NAME`：客户端名称

3. 启动开发服务器：

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## API Docs
- chain [DAPP鉴权](https://s.apifox.cn/6d5274aa-519a-4e07-a659-0d2155d678a5/api-413949000.md): 
- chain [绑定EVM地址](https://s.apifox.cn/6d5274aa-519a-4e07-a659-0d2155d678a5/api-413950582.md): 
- chain [查询用户数字资产](https://s.apifox.cn/6d5274aa-519a-4e07-a659-0d2155d678a5/api-413953349.md): 