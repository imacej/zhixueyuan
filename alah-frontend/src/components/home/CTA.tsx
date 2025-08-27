import { Button } from '@/components/ui/Button';
import { ArrowRightIcon, BeakerIcon } from '@heroicons/react/24/outline';

export function CTA() {
  return (
    <div className="bg-primary-600">
      <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          <span className="block">准备好开始您的</span>
          <span className="block">AI学习之旅了吗？</span>
        </h2>
        <p className="mt-4 text-lg leading-6 text-primary-200">
          加入成千上万学习者的行列，让AI学习变得更加高效和有趣。
          现在注册，免费体验所有功能！
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg"
            className="bg-white text-primary-600 hover:bg-gray-50 font-medium px-8 py-3"
          >
            免费注册账户
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-primary-600 font-medium px-8 py-3"
          >
            查看演示
            <BeakerIcon className="ml-2 h-5 w-5" />
          </Button>
        </div>
        
        {/* 信任标识 */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-8 opacity-75">
          <div className="flex items-center text-primary-200 text-sm">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            无需信用卡
          </div>
          <div className="flex items-center text-primary-200 text-sm">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            即时开始使用
          </div>
          <div className="flex items-center text-primary-200 text-sm">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            随时取消
          </div>
        </div>
      </div>
    </div>
  );
}