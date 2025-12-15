'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';

const menuItems = [
  { name: '首页', href: '/' },
  { name: '空投', href: '/airdrop' },
  { name: '兑换', href: '/swap' },
  { name: '我的', href: '/profile' },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // 关闭菜单
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* 移动端顶部导航条 */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#0a0a0a] border-b border-[#222] flex items-center justify-between px-5 z-50 lg:hidden">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8">
            <Image src="/img/logo.png" alt="Logo" fill className="object-contain" />
          </div>
          <span className="font-semibold text-lg text-[#ddba82]">Local Life DAO</span>
        </div>
        <button 
          onClick={() => setIsOpen(true)} 
          className="text-white/80 p-2 hover:text-white transition-colors"
        >
          <Menu size={24} strokeWidth={1.5} />
        </button>
      </header>

      {/* 遮罩层 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMenu}
            className="fixed inset-0 bg-black/60 z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* 侧边栏主体 */}
      <aside
        className={clsx(
          "fixed top-0 bottom-0 left-0 w-[280px] bg-[#0a0a0a] z-[70] flex flex-col",
          "transition-transform duration-300 ease-out",
          "lg:translate-x-0 lg:static lg:z-40 lg:min-h-screen",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isDesktop && "!translate-x-0"
        )}
      >
        {/* Logo 区域 */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-[#222]">
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9">
              <Image src="/img/logo.png" alt="Logo" fill className="object-contain" />
            </div>
            <span className="font-semibold text-xl text-[#ddba82]">Local Life DAO</span>
          </div>
          <button 
            onClick={closeMenu} 
            className="lg:hidden text-white/60 hover:text-white transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* 分割线 */}
        <div className="mx-6 border-t border-[#333] my-2" />

        {/* 导航菜单 */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={clsx(
                  "block px-4 py-3.5 rounded-md transition-all duration-200 text-base font-medium",
                  isActive 
                    ? "text-[#ddba82] bg-[#ddba82]/10" 
                    : "text-[#ddba82]/80 hover:text-[#ddba82] hover:bg-[#ddba82]/5"
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* 底部语言切换 */}
        <div className="p-4 mt-auto">
          <button className="w-full py-3 rounded-md border border-[#333] text-white/90 hover:border-[#ddba82]/50 hover:text-[#ddba82] transition-all text-sm font-medium">
            English
          </button>
        </div>
      </aside>
    </>
  );
}