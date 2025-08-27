'use client';

import { useState } from 'react';
import { LearningAssessment } from '@/components/learning/LearningAssessment';
import { LearningPathRecommendation } from '@/components/learning/LearningPathRecommendation';
import { SkillRadar } from '@/components/learning/SkillRadar';
import { LearningProgress } from '@/components/learning/LearningProgress';
import {
  AcademicCapIcon,
  ChartBarIcon,
  LightBulbIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';

interface UserSkills {
  factualDetection: number;
  logicalReasoning: number;
  consistencyCheck: number;
  attentionAnalysis: number;
  decisionPath: number;
  overallLevel: number;
}

interface LearningModule {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  skills: string[];
  completed: boolean;
  progress: number;
}

export default function LearningPathPage() {
  const [currentView, setCurrentView] = useState<'assessment' | 'path' | 'progress'>('assessment');
  const [userSkills, setUserSkills] = useState<UserSkills | null>(null);
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false);

  const views = [
    {
      id: 'assessment' as const,
      name: '技能评估',
      description: '评估你的当前能力水平',
      icon: ChartBarIcon,
    },
    {
      id: 'path' as const,
      name: '学习路径',
      description: '个性化的学习建议',
      icon: LightBulbIcon,
    },
    {
      id: 'progress' as const,
      name: '学习进度',
      description: '跟踪你的学习历程',
      icon: TrophyIcon,
    },
  ];

  const handleAssessmentComplete = (skills: UserSkills) => {
    setUserSkills(skills);
    setHasCompletedAssessment(true);
    setCurrentView('path');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'assessment':
        return (
          <LearningAssessment 
            onComplete={handleAssessmentComplete}
            existingSkills={userSkills}
          />
        );
      case 'path':
        return userSkills ? (
          <div className="space-y-8">
            <SkillRadar skills={userSkills} />
            <LearningPathRecommendation skills={userSkills} />
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">请先完成技能评估以获得个性化学习路径</p>
          </div>
        );
      case 'progress':
        return <LearningProgress skills={userSkills} />;
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
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <AcademicCapIcon className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            个性化学习路径
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            通过科学的技能评估，为你量身定制最适合的学习计划。
            系统性地提升AI幻觉检测和模型理解能力。
          </p>
        </div>

        {/* 导航标签 */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="flex space-x-1 bg-white p-1 rounded-lg border">
              {views.map((view) => {
                const IconComponent = view.icon;
                const isActive = currentView === view.id;
                const isDisabled = view.id !== 'assessment' && !hasCompletedAssessment;
                
                return (
                  <button
                    key={view.id}
                    onClick={() => !isDisabled && setCurrentView(view.id)}
                    disabled={isDisabled}
                    className={`flex items-center px-6 py-3 rounded-md font-medium transition-all ${
                      isActive
                        ? 'bg-primary-500 text-white shadow-md'
                        : isDisabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="h-5 w-5 mr-2" />
                    <div className="text-left">
                      <div className="text-sm font-medium">{view.name}</div>
                      <div className="text-xs opacity-75">{view.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="transition-all duration-300">
          {renderContent()}
        </div>

        {/* 底部说明 */}
        <div className="mt-12 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">学习路径特色</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🎯</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">精准评估</h4>
              <p>多维度技能测试，准确识别你的强项和改进点</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🚀</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">个性化推荐</h4>
              <p>基于AI分析的定制学习计划，最大化学习效率</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">📊</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">可视化追踪</h4>
              <p>直观的进度图表，清晰展示学习成长轨迹</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🏆</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">成就激励</h4>
              <p>丰富的成就系统，让学习过程充满乐趣和动力</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}