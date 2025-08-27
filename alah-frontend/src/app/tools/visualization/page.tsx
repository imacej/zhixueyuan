'use client';

import { useState } from 'react';
import { AttentionHeatmap } from '@/components/tools/AttentionHeatmap';
import { TokenAnalyzer } from '@/components/tools/TokenAnalyzer';
import { DecisionPath } from '@/components/tools/DecisionPath';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  BeakerIcon,
  CubeTransparentIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

type VisualizationMode = 'attention' | 'tokens' | 'decision-path';

const visualizationModes = [
  {
    id: 'attention' as const,
    name: 'Attention 热力图',
    description: '可视化模型的注意力机制，了解模型关注的重点',
    icon: BeakerIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'tokens' as const,
    name: 'Token 分析器',
    description: '逐个分析Token的概率分布和处理过程',
    icon: CubeTransparentIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    id: 'decision-path' as const,
    name: '决策路径追踪',
    description: '追踪模型推理的逐步决策过程',
    icon: ChartBarIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
];

export default function VisualizationPage() {
  const [currentMode, setCurrentMode] = useState<VisualizationMode>('attention');
  const [inputText, setInputText] = useState('人工智能将会如何改变我们的未来？');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // 模拟分析过程
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsAnalyzing(false);
  };

  const renderVisualization = () => {
    switch (currentMode) {
      case 'attention':
        return <AttentionHeatmap text={inputText} isLoading={isAnalyzing} />;
      case 'tokens':
        return <TokenAnalyzer text={inputText} isLoading={isAnalyzing} />;
      case 'decision-path':
        return <DecisionPath text={inputText} isLoading={isAnalyzing} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面头部 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            模型行为可视化工具
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            通过交互式可视化工具，深入理解大语言模型的内部工作机制。
            看见AI如何处理和理解文本信息。
          </p>
        </div>

        {/* 模式选择 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">选择可视化模式</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {visualizationModes.map((mode) => {
              const IconComponent = mode.icon;
              const isActive = currentMode === mode.id;
              
              return (
                <Card
                  key={mode.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    isActive 
                      ? 'ring-2 ring-primary-500 border-primary-200 bg-primary-50' 
                      : 'hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => setCurrentMode(mode.id)}
                >
                  <div className="p-6">
                    <div className={`inline-flex p-3 rounded-lg ${mode.bgColor} mb-4`}>
                      <IconComponent className={`h-6 w-6 ${mode.color}`} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {mode.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {mode.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* 输入区域 */}
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">输入文本</h2>
            <div className="space-y-4">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 resize-none"
                placeholder="输入您想要分析的文本..."
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  字符数: {inputText.length}
                </span>
                <Button
                  onClick={handleAnalyze}
                  isLoading={isAnalyzing}
                  leftIcon={<Cog6ToothIcon className="h-4 w-4" />}
                  disabled={!inputText.trim()}
                >
                  {isAnalyzing ? '分析中...' : '开始分析'}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* 可视化结果 */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {visualizationModes.find(m => m.id === currentMode)?.name} 结果
              </h2>
              {isAnalyzing && (
                <div className="flex items-center text-sm text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500 mr-2"></div>
                  正在处理...
                </div>
              )}
            </div>
            
            {/* 渲染对应的可视化组件 */}
            {renderVisualization()}
          </div>
        </Card>

        {/* 使用说明 */}
        <Card className="mt-8">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">使用说明</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">1. 选择模式</h3>
                <p className="text-sm text-gray-600">
                  根据您的需求选择不同的可视化模式，每种模式提供不同的分析视角。
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">2. 输入文本</h3>
                <p className="text-sm text-gray-600">
                  在文本框中输入您想要分析的内容，支持中文和英文文本。
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">3. 查看结果</h3>
                <p className="text-sm text-gray-600">
                  分析结果将以交互式图表的形式展示，您可以深入探索细节。
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}