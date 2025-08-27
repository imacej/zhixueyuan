'use client';

import { useState, useEffect } from 'react';
import {
  BookOpenIcon,
  ClockIcon,
  StarIcon,
  PlayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  ChevronRightIcon,
  FireIcon,
  TrophyIcon
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
  prerequisites?: string[];
  completed: boolean;
  progress: number;
  type: 'theory' | 'practice' | 'project' | 'assessment';
  priority: 'high' | 'medium' | 'low';
  estimatedImprovement: {
    [key: string]: number;
  };
}

interface LearningPathRecommendationProps {
  skills: UserSkills;
}

export function LearningPathRecommendation({ skills }: LearningPathRecommendationProps) {
  const [recommendedModules, setRecommendedModules] = useState<LearningModule[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState(true);

  // 基础学习模块库
  const allModules: LearningModule[] = [
    // 事实检测相关模块
    {
      id: 'factual-basics',
      title: '事实检测基础',
      description: '学习如何识别和验证AI生成内容中的事实性错误',
      difficulty: 'beginner',
      duration: '2小时',
      skills: ['factualDetection'],
      completed: false,
      progress: 0,
      type: 'theory',
      priority: 'high',
      estimatedImprovement: { factualDetection: 15 }
    },
    {
      id: 'fact-verification',
      title: '事实验证技巧',
      description: '掌握多种事实验证方法和工具',
      difficulty: 'intermediate',
      duration: '3小时',
      skills: ['factualDetection', 'logicalReasoning'],
      prerequisites: ['factual-basics'],
      completed: false,
      progress: 0,
      type: 'practice',
      priority: 'high',
      estimatedImprovement: { factualDetection: 20, logicalReasoning: 10 }
    },
    {
      id: 'advanced-factual',
      title: '高级事实分析',
      description: '处理复杂、模糊的事实性声明',
      difficulty: 'advanced',
      duration: '4小时',
      skills: ['factualDetection', 'consistencyCheck'],
      prerequisites: ['fact-verification'],
      completed: false,
      progress: 0,
      type: 'project',
      priority: 'medium',
      estimatedImprovement: { factualDetection: 25, consistencyCheck: 15 }
    },

    // 逻辑推理相关模块
    {
      id: 'logic-fundamentals',
      title: '逻辑推理基础',
      description: '理解逻辑推理的基本原理和常见谬误',
      difficulty: 'beginner',
      duration: '2.5小时',
      skills: ['logicalReasoning'],
      completed: false,
      progress: 0,
      type: 'theory',
      priority: 'high',
      estimatedImprovement: { logicalReasoning: 18 }
    },
    {
      id: 'fallacy-detection',
      title: '逻辑谬误识别',
      description: '学习识别和分类常见的逻辑谬误',
      difficulty: 'intermediate',
      duration: '3.5小时',
      skills: ['logicalReasoning', 'factualDetection'],
      prerequisites: ['logic-fundamentals'],
      completed: false,
      progress: 0,
      type: 'practice',
      priority: 'high',
      estimatedImprovement: { logicalReasoning: 22, factualDetection: 12 }
    },

    // 一致性检验相关模块
    {
      id: 'consistency-basics',
      title: '一致性检验入门',
      description: '学习如何检查文本内部的逻辑一致性',
      difficulty: 'beginner',
      duration: '2小时',
      skills: ['consistencyCheck'],
      completed: false,
      progress: 0,
      type: 'theory',
      priority: 'medium',
      estimatedImprovement: { consistencyCheck: 16 }
    },
    {
      id: 'context-analysis',
      title: '上下文分析技能',
      description: '深入理解文本上下文和语义一致性',
      difficulty: 'intermediate',
      duration: '3小时',
      skills: ['consistencyCheck', 'attentionAnalysis'],
      prerequisites: ['consistency-basics'],
      completed: false,
      progress: 0,
      type: 'practice',
      priority: 'medium',
      estimatedImprovement: { consistencyCheck: 20, attentionAnalysis: 15 }
    },

    // 注意力分析相关模块
    {
      id: 'attention-mechanisms',
      title: '注意力机制原理',
      description: '理解Transformer注意力机制的工作原理',
      difficulty: 'intermediate',
      duration: '4小时',
      skills: ['attentionAnalysis'],
      completed: false,
      progress: 0,
      type: 'theory',
      priority: 'medium',
      estimatedImprovement: { attentionAnalysis: 25 }
    },
    {
      id: 'attention-visualization',
      title: '注意力可视化分析',
      description: '学习如何解读和分析注意力热图',
      difficulty: 'advanced',
      duration: '3小时',
      skills: ['attentionAnalysis', 'decisionPath'],
      prerequisites: ['attention-mechanisms'],
      completed: false,
      progress: 0,
      type: 'practice',
      priority: 'medium',
      estimatedImprovement: { attentionAnalysis: 20, decisionPath: 18 }
    },

    // 决策路径相关模块
    {
      id: 'decision-trees',
      title: '决策路径分析',
      description: '学习AI模型的决策过程和推理链',
      difficulty: 'intermediate',
      duration: '3.5小时',
      skills: ['decisionPath', 'logicalReasoning'],
      completed: false,
      progress: 0,
      type: 'theory',
      priority: 'medium',
      estimatedImprovement: { decisionPath: 20, logicalReasoning: 15 }
    },

    // 综合项目模块
    {
      id: 'hallucination-project',
      title: '幻觉检测综合项目',
      description: '完整的幻觉检测案例分析和实践',
      difficulty: 'advanced',
      duration: '6小时',
      skills: ['factualDetection', 'logicalReasoning', 'consistencyCheck'],
      prerequisites: ['fact-verification', 'fallacy-detection'],
      completed: false,
      progress: 0,
      type: 'project',
      priority: 'high',
      estimatedImprovement: { 
        factualDetection: 15, 
        logicalReasoning: 12, 
        consistencyCheck: 18 
      }
    },

    // 评估模块
    {
      id: 'comprehensive-assessment',
      title: '综合能力评估',
      description: '全面测试你的幻觉检测能力',
      difficulty: 'advanced',
      duration: '2小时',
      skills: ['factualDetection', 'logicalReasoning', 'consistencyCheck', 'attentionAnalysis', 'decisionPath'],
      completed: false,
      progress: 0,
      type: 'assessment',
      priority: 'low',
      estimatedImprovement: {}
    }
  ];

  // 智能推荐算法
  const generateRecommendations = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      // 计算每个技能的优先级权重
      const skillWeights = {
        factualDetection: skills.factualDetection < 60 ? 3 : skills.factualDetection < 80 ? 2 : 1,
        logicalReasoning: skills.logicalReasoning < 60 ? 3 : skills.logicalReasoning < 80 ? 2 : 1,
        consistencyCheck: skills.consistencyCheck < 60 ? 3 : skills.consistencyCheck < 80 ? 2 : 1,
        attentionAnalysis: skills.attentionAnalysis < 60 ? 3 : skills.attentionAnalysis < 80 ? 2 : 1,
        decisionPath: skills.decisionPath < 60 ? 3 : skills.decisionPath < 80 ? 2 : 1,
      };

      // 为每个模块计算推荐分数
      const modulesWithScores = allModules.map(module => {
        let score = 0;

        // 基于技能需求计算分数
        module.skills.forEach(skill => {
          if (skillWeights[skill as keyof typeof skillWeights]) {
            score += skillWeights[skill as keyof typeof skillWeights] * 10;
          }
        });

        // 基于难度适配性
        const overallSkill = skills.overallLevel;
        if (module.difficulty === 'beginner' && overallSkill < 40) score += 15;
        else if (module.difficulty === 'intermediate' && overallSkill >= 30 && overallSkill < 70) score += 15;
        else if (module.difficulty === 'advanced' && overallSkill >= 60) score += 15;
        else score += 5;

        // 基于优先级
        if (module.priority === 'high') score += 10;
        else if (module.priority === 'medium') score += 5;

        // 基于类型多样性
        if (module.type === 'theory') score += 8;
        else if (module.type === 'practice') score += 12;
        else if (module.type === 'project') score += 10;
        else if (module.type === 'assessment') score += 6;

        return { ...module, recommendationScore: score };
      });

      // 排序并选择前8个推荐模块
      const recommended = modulesWithScores
        .sort((a, b) => b.recommendationScore - a.recommendationScore)
        .slice(0, 8);

      setRecommendedModules(recommended);
      setIsGenerating(false);
    }, 1500);
  };

  useEffect(() => {
    generateRecommendations();
  }, [skills]);

  // 过滤函数
  const filteredModules = recommendedModules.filter(module => {
    const difficultyMatch = selectedDifficulty === 'all' || module.difficulty === selectedDifficulty;
    const typeMatch = selectedType === 'all' || module.type === selectedType;
    return difficultyMatch && typeMatch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'theory': return BookOpenIcon;
      case 'practice': return PlayIcon;
      case 'project': return LightBulbIcon;
      case 'assessment': return TrophyIcon;
      default: return BookOpenIcon;
    }
  };

  const getPriorityIndicator = (priority: string) => {
    switch (priority) {
      case 'high': return { icon: FireIcon, color: 'text-red-500' };
      case 'medium': return { icon: ExclamationTriangleIcon, color: 'text-yellow-500' };
      case 'low': return { icon: StarIcon, color: 'text-gray-500' };
      default: return { icon: StarIcon, color: 'text-gray-500' };
    }
  };

  if (isGenerating) {
    return (
      <div className="bg-white rounded-lg border p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">AI正在分析你的技能...</h3>
          <p className="text-gray-600">正在为你生成个性化的学习路径推荐</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border">
      {/* 头部 */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">个性化学习路径</h3>
            <p className="text-gray-600">基于你的技能评估结果，我们为你推荐以下学习内容</p>
          </div>
          <button 
            onClick={generateRecommendations}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            重新生成
          </button>
        </div>

        {/* 过滤器 */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">难度:</label>
            <select 
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="text-sm border rounded px-3 py-1"
            >
              <option value="all">全部</option>
              <option value="beginner">初级</option>
              <option value="intermediate">中级</option>
              <option value="advanced">高级</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">类型:</label>
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-sm border rounded px-3 py-1"
            >
              <option value="all">全部</option>
              <option value="theory">理论</option>
              <option value="practice">实践</option>
              <option value="project">项目</option>
              <option value="assessment">评估</option>
            </select>
          </div>
        </div>
      </div>

      {/* 学习路径 */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module, index) => {
            const TypeIcon = getTypeIcon(module.type);
            const priorityInfo = getPriorityIndicator(module.priority);
            const PriorityIcon = priorityInfo.icon;

            return (
              <div key={module.id} className="group border rounded-lg p-4 hover:shadow-lg transition-all duration-200 hover:border-primary-200">
                {/* 模块头部 */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-primary-50 rounded-lg">
                      <TypeIcon className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs font-medium text-gray-500">#{index + 1}</span>
                      <PriorityIcon className={`h-4 w-4 ${priorityInfo.color}`} />
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(module.difficulty)}`}>
                    {module.difficulty === 'beginner' ? '初级' : 
                     module.difficulty === 'intermediate' ? '中级' : '高级'}
                  </span>
                </div>

                {/* 模块内容 */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {module.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {module.description}
                  </p>

                  {/* 技能标签 */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {module.skills.map(skill => (
                      <span key={skill} className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
                        {skill === 'factualDetection' ? '事实检测' :
                         skill === 'logicalReasoning' ? '逻辑推理' :
                         skill === 'consistencyCheck' ? '一致性检验' :
                         skill === 'attentionAnalysis' ? '注意力分析' :
                         skill === 'decisionPath' ? '决策路径' : skill}
                      </span>
                    ))}
                  </div>

                  {/* 预期提升 */}
                  {Object.keys(module.estimatedImprovement).length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs text-gray-500 mb-1">预期提升:</div>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(module.estimatedImprovement).map(([skill, improvement]) => (
                          <span key={skill} className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded">
                            +{improvement}%
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 模块底部 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {module.duration}
                  </div>
                  <button className="flex items-center px-3 py-1 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded transition-colors">
                    开始学习
                    <ChevronRightIcon className="h-4 w-4 ml-1" />
                  </button>
                </div>

                {/* 进度条 */}
                {module.progress > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">完成进度</span>
                      <span className="text-xs font-medium text-gray-700">{module.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${module.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredModules.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>没有找到匹配的学习模块，请尝试调整过滤条件</p>
          </div>
        )}
      </div>

      {/* 底部建议 */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-b-lg border-t">
        <div className="flex items-start space-x-3">
          <LightBulbIcon className="h-6 w-6 text-blue-600 mt-1" />
          <div>
            <h4 className="font-medium text-gray-900 mb-2">学习建议</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• 建议按照推荐顺序进行学习，确保循序渐进</p>
              <p>• 重点关注你薄弱的技能领域，优先完成高优先级模块</p>
              <p>• 理论学习后及时进行实践练习，巩固所学知识</p>
              <p>• 定期进行评估，跟踪自己的学习进度</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}