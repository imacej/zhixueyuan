import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ALAH - AI Learning Assistant Hub',
  description: 'LLM学习助手工具站 - 专注解决大语言模型学习认知困境的工具平台',
  keywords: 'AI, LLM, 大语言模型, 学习, 可视化, 幻觉检测, 教育',
  authors: [{ name: 'ALAH Team' }],
  openGraph: {
    title: 'ALAH - AI Learning Assistant Hub',
    description: '通过可视化工具、实战练习和智能辅导，帮助学习者克服LLM学习困境',
    type: 'website',
    locale: 'zh_CN',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}