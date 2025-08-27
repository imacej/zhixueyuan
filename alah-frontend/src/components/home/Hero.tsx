import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import {
  BeakerIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">让AI学习</span>{' '}
                <span className="block text-primary-600 xl:inline">不再困惑</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                专注解决大语言模型学习认知困境的工具平台。
                通过可视化工具、实战练习和智能辅导，
                帮助学习者克服“黑盒”认知困境、幻觉识别难题和技术迭代焦虑。
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link href="/auth/signup">
                    <Button size="lg" className="w-full flex items-center justify-center">
                      免费开始学习
                      <ArrowRightIcon className="ml-2 -mr-1 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link href="/tools/visualization">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full flex items-center justify-center"
                    >
                      体验演示
                      <BeakerIcon className="ml-2 -mr-1 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div className="h-56 w-full bg-gradient-to-br from-primary-400 to-primary-600 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
          {/* 这里可以放置一个交互式的模型可视化演示 */}
          <div className="text-center text-white">
            <BeakerIcon className="h-24 w-24 mx-auto mb-4 opacity-80" />
            <p className="text-lg font-medium">实时模型可视化</p>
            <p className="text-sm opacity-75">看见AI的思考过程</p>
          </div>
        </div>
      </div>
    </div>
  );
}