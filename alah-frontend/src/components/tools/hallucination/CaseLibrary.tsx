'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  BookOpenIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

interface HallucinationCase {
  id: string;
  title: string;
  type: 'factual' | 'logical' | 'consistency';
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  scenario: string;
  aiResponse: string;
  issues: string[];
  correctVersion: string;
  explanation: string;
  tags: string[];
}

const casesData: HallucinationCase[] = [
  {
    id: '1',
    title: '地理知识错误',
    type: 'factual',
    difficulty: 'easy',
    category: '地理',
    scenario: '用户询问中国首都',
    aiResponse: '中国的首都是上海，这是中国最大的经济中心，有着2400万人口。',
    issues: ['首都信息错误', '人口数据可能不准确'],
    correctVersion: '中国的首都是北京，上海是中国最大的经济中心。',
    explanation: '这是一个典型的事实性错误。AI混淆了政治中心（北京）和经济中心（上海）的概念。',
    tags: ['地理', '首都', '基础知识']
  },
  {
    id: '2',
    title: '历史时间错误',
    type: 'factual',
    difficulty: 'medium',
    category: '历史',
    scenario: '询问二战结束时间',
    aiResponse: '第二次世界大战于1946年正式结束，德国投降后一年才彻底结束所有冲突。',
    issues: ['结束时间错误', '逻辑混乱'],
    correctVersion: '第二次世界大战于1945年结束，德国于5月8日投降，日本于8月15日投降。',
    explanation: 'AI可能混淆了战争结束和战后处理的时间，或者记忆了错误的信息。',
    tags: ['历史', '二战', '时间']
  },
  {
    id: '3',
    title: '逻辑推理错误',
    type: 'logical',
    difficulty: 'medium',
    category: '逻辑',
    scenario: '动物分类推理',
    aiResponse: '所有哺乳动物都生活在陆地上，鲸鱼是哺乳动物，所以鲸鱼生活在陆地上。',
    issues: ['大前提错误', '结论错误'],
    correctVersion: '鲸鱼是哺乳动物但生活在海洋中，哺乳动物可以生活在不同环境中。',
    explanation: '这是典型的三段论逻辑错误，大前提"所有哺乳动物都生活在陆地上"是错误的。',
    tags: ['逻辑', '生物学', '推理']
  },
  {
    id: '4',
    title: '前后矛盾',
    type: 'consistency',
    difficulty: 'hard',
    category: '物理',
    scenario: '解释光的性质',
    aiResponse: '光是一种波，具有波长和频率等波的特性。同时，光只能表现为粒子行为，不具备任何波动特征。在双缝实验中，光表现出明显的波动干涉现象。',
    issues: ['自相矛盾', '前后不一致'],
    correctVersion: '光具有波粒二象性，既可以表现为波的特性，也可以表现为粒子特性，这取决于观测条件。',
    explanation: 'AI在同一段回答中既说光是波，又说光只能是粒子，最后又承认波动现象，存在明显的自相矛盾。',
    tags: ['物理', '光学', '量子力学']
  },
  {
    id: '5',
    title: '数学计算错误',
    type: 'factual',
    difficulty: 'easy',
    category: '数学',
    scenario: '简单算术问题',
    aiResponse: '25乘以4等于120，这是基本的乘法运算。',
    issues: ['计算结果错误'],
    correctVersion: '25乘以4等于100。',
    explanation: '这是一个基础的数学计算错误，可能是由于训练数据中的错误或模型的计算能力不足造成。',
    tags: ['数学', '乘法', '计算']
  },
  {
    id: '6',
    title: '科学原理错误',
    type: 'factual',
    difficulty: 'hard',
    category: '物理',
    scenario: '解释重力原理',
    aiResponse: '重力是地球吸引物体向上的力，这就是为什么我们不会飘浮在空中。重力的方向总是向上的，强度与物体的高度成正比。',
    issues: ['重力方向错误', '重力强度关系错误'],
    correctVersion: '重力是地球吸引物体向下（向地心方向）的力，强度与距离地心的距离平方成反比。',
    explanation: 'AI完全颠倒了重力的方向，并且错误描述了重力与高度的关系。',
    tags: ['物理', '重力', '牛顿定律']
  }
];

export function CaseLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCase, setSelectedCase] = useState<HallucinationCase | null>(null);

  const filteredCases = casesData.filter(caseItem => {
    const matchesSearch = caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || caseItem.type === selectedType;
    const matchesDifficulty = selectedDifficulty === 'all' || caseItem.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesType && matchesDifficulty;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'factual': return '📚';
      case 'logical': return '🧠';
      case 'consistency': return '🔄';
      default: return '❓';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'factual': return 'text-blue-600 bg-blue-100';
      case 'logical': return 'text-purple-600 bg-purple-100';
      case 'consistency': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (selectedCase) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            onClick={() => setSelectedCase(null)}
            variant="outline"
            size="sm"
          >
            ← 返回案例库
          </Button>
        </div>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{getTypeIcon(selectedCase.type)}</span>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{selectedCase.title}</h1>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedCase.type)}`}>
                      {selectedCase.type}
                    </span>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedCase.difficulty)}`}>
                      {selectedCase.difficulty}
                    </span>
                    <span className="text-sm text-gray-500">{selectedCase.category}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* 场景描述 */}
              <div>
                <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                  <InformationCircleIcon className="h-5 w-5 mr-2 text-blue-500" />
                  场景描述
                </h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-gray-700">{selectedCase.scenario}</p>
                </div>
              </div>

              {/* AI错误回答 */}
              <div>
                <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                  <XCircleIcon className="h-5 w-5 mr-2 text-red-500" />
                  AI错误回答
                </h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-gray-800 leading-relaxed">{selectedCase.aiResponse}</p>
                </div>
              </div>

              {/* 问题识别 */}
              <div>
                <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                  <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-yellow-500" />
                  问题识别
                </h3>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {selectedCase.issues.map((issue, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        <span className="text-gray-700">{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 正确版本 */}
              <div>
                <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                  <CheckCircleIcon className="h-5 w-5 mr-2 text-green-500" />
                  正确版本
                </h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-gray-800 leading-relaxed">{selectedCase.correctVersion}</p>
                </div>
              </div>

              {/* 详细解释 */}
              <div>
                <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                  <BookOpenIcon className="h-5 w-5 mr-2 text-purple-500" />
                  详细解释
                </h3>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">{selectedCase.explanation}</p>
                </div>
              </div>

              {/* 相关标签 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">相关标签</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCase.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* 搜索和过滤器 */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索案例..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div className="relative">
            <FunnelIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white"
            >
              <option value="all">所有类型</option>
              <option value="factual">事实性错误</option>
              <option value="logical">逻辑性错误</option>
              <option value="consistency">一致性错误</option>
            </select>
          </div>
          
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white"
            >
              <option value="all">所有难度</option>
              <option value="easy">简单</option>
              <option value="medium">中等</option>
              <option value="hard">困难</option>
            </select>
          </div>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {casesData.filter(c => c.type === 'factual').length}
          </div>
          <div className="text-sm text-blue-600">事实性错误</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {casesData.filter(c => c.type === 'logical').length}
          </div>
          <div className="text-sm text-purple-600">逻辑性错误</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {casesData.filter(c => c.type === 'consistency').length}
          </div>
          <div className="text-sm text-orange-600">一致性错误</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{casesData.length}</div>
          <div className="text-sm text-green-600">总案例数</div>
        </div>
      </div>

      {/* 案例列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCases.map((caseItem) => (
          <Card
            key={caseItem.id}
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => setSelectedCase(caseItem)}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getTypeIcon(caseItem.type)}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{caseItem.title}</h3>
                    <p className="text-sm text-gray-500">{caseItem.category}</p>
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(caseItem.type)}`}>
                    {caseItem.type}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(caseItem.difficulty)}`}>
                    {caseItem.difficulty}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {caseItem.scenario}
              </p>
              
              <div className="bg-gray-50 rounded p-3 mb-4">
                <p className="text-xs text-gray-500 mb-1">AI错误回答示例：</p>
                <p className="text-sm text-gray-700 line-clamp-2">
                  {caseItem.aiResponse}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {caseItem.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                  >
                    #{tag}
                  </span>
                ))}
                {caseItem.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                    +{caseItem.tags.length - 3}
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredCases.length === 0 && (
        <div className="text-center py-12">
          <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到匹配的案例</h3>
          <p className="text-gray-500">请尝试调整搜索条件或过滤器</p>
        </div>
      )}
    </div>
  );
}