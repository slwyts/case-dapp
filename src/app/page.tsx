import { Wallet, ArrowRight, TrendingUp, Users, Activity } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="w-full min-h-full pb-12">
      
      {/* Hero Section */}
      <div className="space-y-6 mb-16">
        {/* 小标签 */}
        <p className="text-[#ddba82]/70 text-base">
          欢迎来到
        </p>
        
        <h1 className="text-4xl lg:text-5xl font-bold text-[#ddba82] leading-tight">
          Local Life DAO
        </h1>
        
        <h2 className="text-xl lg:text-2xl text-white font-medium">
          CasE = 消费 + 治理 + 收益
        </h2>
        
        <p className="text-white/70 text-base leading-relaxed max-w-2xl">
          Local Life DAO 是一个专注于本地生活商业生态建设的去中心化自治组织（DAO）。
          我们致力于通过 Web3 技术，链接消费者、商户与服务提供者，建立一个开放、透明、
          高效、共治共享的本地经济体系。通过发行 CasE 通证，赋能用户参与社区治理、享受消费奖励。
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button className="bg-[#ddba82] text-black px-6 py-3 rounded-md font-semibold hover:bg-[#e8c992] transition-colors flex items-center justify-center gap-2">
            <Wallet size={20} /> 连接钱包
          </button>
          <button className="border border-[#ddba82]/50 text-[#ddba82] px-6 py-3 rounded-md font-medium hover:bg-[#ddba82]/10 transition-colors flex items-center justify-center gap-2">
            查看白皮书 <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* 右侧装饰图 - PC端显示 */}
      <div className="hidden lg:block fixed top-20 right-12 w-[400px] h-[400px] pointer-events-none opacity-80">
        <Image 
          src="/img/hero-1.png" 
          alt="Hero" 
          fill 
          className="object-contain"
        />
      </div>

      {/* 数据概览 */}
      <div className="space-y-4">
        <h3 className="text-lg text-[#ddba82]/60 font-medium mb-6">数据概览</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'CASE 价格', value: '$0.52', sub: '+2.4%', icon: TrendingUp },
            { label: '持币地址数', value: '1,234', sub: 'Addresses', icon: Users },
            { label: '总质押量 (TVL)', value: '$4.2M', sub: 'Locked', icon: Activity },
          ].map((stat, i) => (
            <div 
              key={i} 
              className="bg-[#111] border border-[#222] p-6 rounded-lg hover:border-[#ddba82]/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <stat.icon size={28} className="text-[#ddba82]/70" />
                <span className="text-xs text-green-400 font-medium">{stat.sub}</span>
              </div>
              <h4 className="text-[#ddba82]/50 text-sm mb-1">{stat.label}</h4>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}