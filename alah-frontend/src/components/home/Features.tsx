import {
  BeakerIcon,
  ExclamationTriangleIcon,
  AcademicCapIcon,
  ChartBarIcon,
  EyeIcon,
  CubeTransparentIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    name: '模型行为可视化',
    description: '通过热力图、Token分析和决策路径追踪，直观理解模型的内部工作机制。',
    icon: BeakerIcon,
    color: 'bg-primary-500',
    features: [
      'Attention热力图生成器',
      'Token概率分布分析',
      '逐层激活可视化',
      '交互式探索界面',
    ],
  },
  {
    name: '幻觉检测训练器',
    description: '通过游戏化的练习方式，提高识别和处理模型幻觉的能力。',
    icon: ExclamationTriangleIcon,
    color: 'bg-warning-500',
    features: [
      '丰富的幻觉案例库',
      '分级闯关练习模式',
      'AI辅助评分系统',
      '实时事实核查工具',
    ],
  },
  {
    name: '个性化学习路径',
    description: '基于技能评估和学习目标，智能生成个性化的学习计划和进度追踪。',
    icon: AcademicCapIcon,
    color: 'bg-accent-500',
    features: [
      '多维度技能评估',
      '智能学习计划生成',
      '进度可视化仪表盘',
      '成就奖励系统',
    ],
  },
  {
    name: '实时技术追踪',
    description: '自动追踪最新的AI研究进展和技术趋势，帮助学习者保持前沿。',
    icon: ChartBarIcon,
    color: 'bg-blue-500',
    features: [
      '论文自动摘要生成',
      '技本热度趋势分析',
      '个性化内容推荐',
      '学习优先级指导',
    ],
  },
];

export function Features() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
            功能特性
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            解决LLM学习的核心难题
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            从认知困境到实践应用，我们提供全方位的学习支持工具。
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <div key={feature.name} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 p-3 rounded-md ${feature.color}`}>
                      <IconComponent className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {feature.name}
                      </h3>
                      <p className="mt-2 text-base text-gray-500">
                        {feature.description}
                      </p>
                      <ul className="mt-4 space-y-2">
                        {feature.features.map((item) => (
                          <li key={item} className="flex items-center text-sm text-gray-600">
                            <EyeIcon className="h-4 w-4 text-primary-500 mr-2" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 统计数据展示 */}
        <div className="mt-16">
          <div className="bg-primary-600 rounded-lg">
            <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                <span className="block">加入成长中的</span>
                <span className="block">AI学习者社区</span>
              </h2>
              <p className="mt-4 text-lg leading-6 text-primary-200">
                与千万同行者一起，在AI学习的道路上不断成长。
              </p>
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <div className="text-3xl font-bold text-white">10,000+</div>
                  <div className="text-primary-200">活跃学习者</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">50,000+</div>
                  <div className="text-primary-200">完成练习</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">95%</div>
                  <div className="text-primary-200">用户满意度</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}