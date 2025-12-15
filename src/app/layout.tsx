import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "Local Life DAO DApp",
  description: "Web3 Loyalty Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className="bg-[#0a0a0a] min-h-screen flex flex-col lg:flex-row">
        {/* 侧边栏 */}
        <Sidebar />
        
        {/* 主内容区域 */}
        <main className="flex-1 w-full pt-20 lg:pt-0 overflow-y-auto min-h-screen">
          <div className="px-6 py-8 lg:px-12 lg:py-10 max-w-5xl">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}