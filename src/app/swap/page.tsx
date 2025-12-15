'use client';
import { ArrowDown, Settings, Wallet } from 'lucide-react';
import { useState } from 'react';

export default function SwapPage() {
  const [payAmount, setPayAmount] = useState('');
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] animate-fade-in pb-10">
      
      {/* 标题 */}
      <div className="text-center mb-8 space-y-2">
        <h1 className="text-3xl font-bold text-white">快速兑换</h1>
        <p className="text-[#ddba82]/60">使用 Polygon 网络进行实时 Token 交换</p>
      </div>

      {/* 交易卡片 */}
      <div className="w-full max-w-[480px] bg-[#1a1a1a] border border-[#ddba82]/20 rounded-3xl p-2 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
        
        {/* 卡片顶部的金色光条装饰 */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ddba82] to-transparent opacity-50"></div>

        <div className="p-4">
            <div className="flex justify-between items-center mb-6 px-2">
              <span className="font-bold text-[#ddba82] text-lg">Swap</span>
              <button className="text-[#ddba82]/60 hover:text-[#ddba82] hover:bg-[#ddba82]/10 p-2 rounded-full transition-colors">
                <Settings size={20} />
              </button>
            </div>

            {/* 支付 (Pay) 区域 */}
            <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-transparent hover:border-[#ddba82]/10 transition-colors group">
                <div className="flex justify-between mb-3">
                    <span className="text-sm text-[#888] font-medium group-hover:text-[#ddba82]/80 transition-colors">支付 (Pay)</span>
                    <span className="text-sm text-[#888]">余额: 0.00</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <input 
                        type="number" 
                        placeholder="0.0"
                        value={payAmount}
                        onChange={(e) => setPayAmount(e.target.value)}
                        className="bg-transparent text-4xl font-bold text-white outline-none w-full placeholder-[#333]"
                    />
                    <button className="shrink-0 bg-[#252525] hover:bg-[#333] border border-[#333] px-3 py-2 rounded-xl flex items-center gap-2 transition-all">
                        {/* 模拟 USDT 图标 */}
                        <div className="w-6 h-6 rounded-full bg-[#26A17B] flex items-center justify-center text-[10px] text-white font-bold">T</div> 
                        <span className="font-bold text-white">USDT</span>
                    </button>
                </div>
                <div className="text-right text-xs text-[#555] mt-2">≈ $0.00</div>
            </div>

            {/* 交换箭头 */}
            <div className="relative h-2 z-10">
                <div className="absolute left-1/2 -translate-x-1/2 -top-5">
                    <button className="bg-[#1a1a1a] border-4 border-[#1a1a1a] p-2.5 rounded-xl text-[#ddba82] hover:text-white hover:bg-[#ddba82] transition-all shadow-lg">
                        <ArrowDown size={20} strokeWidth={3} />
                    </button>
                </div>
            </div>

            {/* 接收 (Receive) 区域 */}
            <div className="bg-[#0f0f0f] rounded-2xl p-5 pt-6 mt-1 border border-transparent hover:border-[#ddba82]/10 transition-colors group">
                <div className="flex justify-between mb-3">
                    <span className="text-sm text-[#888] font-medium group-hover:text-[#ddba82]/80 transition-colors">接收 (Receive)</span>
                    <span className="text-sm text-[#888]">余额: 0.00</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <input 
                        type="number" 
                        placeholder="0.0"
                        disabled
                        className="bg-transparent text-4xl font-bold text-[#ddba82] outline-none w-full placeholder-[#333] cursor-not-allowed opacity-80"
                    />
                    <button className="shrink-0 bg-[#252525] hover:bg-[#333] border border-[#333] px-3 py-2 rounded-xl flex items-center gap-2 transition-all">
                         {/* 模拟 CASE 图标 */}
                        <div className="w-6 h-6 rounded-full bg-[#ddba82] flex items-center justify-center text-[10px] text-black font-bold">C</div>
                        <span className="font-bold text-white">CASE</span>
                    </button>
                </div>
                <div className="text-right text-xs text-[#555] mt-2">≈ $0.00 (-0.3%)</div>
            </div>

            {/* 价格信息 */}
            <div className="flex justify-between items-center px-3 mt-6 mb-6 text-xs font-medium">
                <span className="text-[#ddba82]">1 USDT ≈ 2.0 CASE</span>
                <span className="flex items-center gap-1 text-[#888]">
                    Network Cost <span className="text-[#ddba82]">$0.01</span>
                </span>
            </div>

            {/* 核心按钮 */}
            <button className="w-full bg-gradient-to-r from-[#ddba82] to-[#FFD700] text-black font-bold text-xl py-4 rounded-2xl hover:shadow-[0_0_20px_rgba(221,186,130,0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3">
                <Wallet size={24} />
                连接钱包
            </button>
        </div>
      </div>
    </div>
  );
}