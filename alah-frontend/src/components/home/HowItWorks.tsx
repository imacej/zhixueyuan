import { 
  UserPlusIcon,
  BeakerIcon,
  AcademicCapIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';

const steps = [
  {
    name: '注册账户',
    description: '快速注册，开始您的AI学习之旅。',
    icon: UserPlusIcon,
    color: 'text-primary-600',
  },
  {
    name: '技能评估',
    description: '通过智能评估，了解您当前的水平和知识结构。',
    icon: BeakerIcon,
    color: 'text-accent-600',
  },
  {
    name: '个性化学习',
    description: '根据评估结果，获得个性化的学习计划和路径。',
    icon: AcademicCapIcon,
    color: 'text-warning-600',
  },
  {
    name: '持续成长',
    description: '通过实践练习和反馈，不断提升您的AI能力。',
    icon: TrophyIcon,
    color: 'text-danger-600',
  },
];

export function HowItWorks() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
            如何使用
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            四步开始您的AI学习之旅
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            从零开始到成为专家，我们为您提供全程指导。
          </p>
        </div>

        <div className="mt-16">
          <div className="relative">
            {/* 连接线 */}
            <div className="hidden md:block absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300" />
            </div>
            
            {/* 步骤 */}
            <div className="relative flex justify-between">
              {steps.map((step, stepIdx) => {
                const IconComponent = step.icon;
                return (
                  <div key={step.name} className="text-center">
                    <div className={`mx-auto w-16 h-16 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center group hover:border-primary-600 transition-colors duration-200`}>
                      <IconComponent className={`w-8 h-8 ${step.color} group-hover:text-primary-600`} />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {stepIdx + 1}. {step.name}
                      </h3>
                      <p className="mt-2 text-sm text-gray-500 max-w-xs">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 行动号召 */}
        <div className="mt-16 text-center">
          <div className="inline-flex rounded-md shadow">
            <a
              href="/auth/signup"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
            >
              立即开始
            </a>
          </div>
          <div className="mt-3 inline-flex">
            <a href="/demo" className="inline-flex items-center text-base font-medium text-primary-600 hover:text-primary-500">
              观看演示
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}