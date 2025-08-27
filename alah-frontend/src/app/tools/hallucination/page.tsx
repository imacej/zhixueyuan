'use client';

import { useState } from 'react';
import { HallucinationTrainer } from '@/components/tools/hallucination/HallucinationTrainer';
import { CaseLibrary } from '@/components/tools/hallucination/CaseLibrary';
import { ProgressDashboard } from '@/components/tools/hallucination/ProgressDashboard';
import {
  AcademicCapIcon,
  BookOpenIcon,
  ChartBarIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';

type Mode = 'training' | 'library' | 'progress';

const modes = [
  {
    id: 'training' as const,
    name: '训练模式',
    description: '游戏化的幻觉检测练习，通过实战提高识别能力',
    icon: PlayIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'library' as const,
    name: '案例库',
    description: '丰富的幻觉案例库，涵盖各种类型的AI错误',
    icon: BookOpenIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    id: 'progress' as const,
    name: '学习进度',
    description: '跟踪学习进展，可视化技能提升曲线',
    icon: ChartBarIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
];

export default function HallucinationDetectorPage() {
  const [currentMode, setCurrentMode] = useState<Mode>('training');

  const renderContent = () => {
    switch (currentMode) {
      case 'training':
        return <HallucinationTrainer />;
      case 'library':
        return <CaseLibrary />;
      case 'progress':
        return <ProgressDashboard />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面头部 */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full">
              <AcademicCapIcon className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI幻觉检测训练器
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            通过游戏化的训练方式，提高识别AI幻觉的能力。
            掌握事实核查、逻辑推理和一致性检验的关键技能。
          </p>
        </div>

        {/* 模式选择 */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {modes.map((mode) => {
              const IconComponent = mode.icon;
              const isActive = currentMode === mode.id;
              
              return (
                <div
                  key={mode.id}
                  className={`cursor-pointer transition-all duration-200 rounded-lg border-2 p-6 ${
                    isActive 
                      ? 'ring-4 ring-primary-200 border-primary-500 bg-primary-50 transform scale-105' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-lg bg-white'
                  }`}
                  onClick={() => setCurrentMode(mode.id)}
                >
                  <div className="text-center">
                    <div className={`inline-flex p-4 rounded-full ${mode.bgColor} mb-4`}>
                      <IconComponent className={`h-8 w-8 ${mode.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {mode.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {mode.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 内容区域 */}
        <div className="transition-all duration-300">
          {renderContent()}
        </div>

        {/* 底部说明 */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">什么是AI幻觉？</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">🔢 事实性错误</h4>
              <p>AI模型生成错误的事实信息，如错误的日期、数字或历史事件。</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">🧮 逻辑性错误</h4>
              <p>推理过程中的逻辑漏洞，导致前后不一致或结论错误。</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">📝 一致性错误</h4>
              <p>在同一对话或文档中，AI给出相互矛盾的信息。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}