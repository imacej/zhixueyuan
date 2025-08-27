'use client';

import { useState, useEffect } from 'react';
import {
  TrophyIcon,
  CalendarIcon,
  ClockIcon,
  FireIcon,
  ChartBarIcon,
  StarIcon,
  CheckCircleIcon,
  PlayCircleIcon,
  LockClosedIcon,
  GiftIcon,
  ArrowTrendingUpIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { 
  TrophyIcon as TrophySolidIcon,
  StarIcon as StarSolidIcon,
  FireIcon as FireSolidIcon
} from '@heroicons/react/24/solid';

interface UserSkills {
  factualDetection: number;
  logicalReasoning: number;
  consistencyCheck: number;
  attentionAnalysis: number;
  decisionPath: number;
  overallLevel: number;
}

interface LearningActivity {
  id: string;
  type: 'assessment' | 'module' | 'achievement' | 'milestone';
  title: string;
  description: string;
  timestamp: Date;
  skillsImproved?: string[];
  pointsEarned?: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  rewardPoints: number;
}

interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date | null;
}

interface LearningProgressProps {
  skills: UserSkills | null;
}

export function LearningProgress({ skills }: LearningProgressProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');
  const [totalPoints, setTotalPoints] = useState(1250);
  const [currentLevel, setCurrentLevel] = useState(7);
  const [pointsToNextLevel, setPointsToNextLevel] = useState(250);
  const [streak, setStreak] = useState<StreakInfo>({
    currentStreak: 5,
    longestStreak: 12,
    lastActivityDate: new Date()
  });

  // 模拟学习活动数据
  const [recentActivities, setRecentActivities] = useState<LearningActivity[]>([
    {
      id: '1',
      type: 'assessment',
      title: '完成技能评估',
      description: '成功完成了全面的AI幻觉检测技能评估',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小时前
      skillsImproved: ['factualDetection', 'logicalReasoning'],
      pointsEarned: 100
    },
    {
      id: '2',
      type: 'module',
      title: '事实检测基础',
      description: '学习了如何识别和验证AI生成内容中的事实性错误',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1天前
      skillsImproved: ['factualDetection'],
      pointsEarned: 80
    },
    {
      id: '3',
      type: 'achievement',
      title: '连续学习达人',
      description: '连续学习5天，获得学习连击成就',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2天前
      pointsEarned: 150
    },
    {
      id: '4',
      type: 'module',
      title: '逻辑谬误识别',
      description: '掌握了识别和分类常见逻辑谬误的方法',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3天前
      skillsImproved: ['logicalReasoning'],
      pointsEarned: 90
    },
    {
      id: '5',
      type: 'milestone',
      title: '初级学习者',
      description: '成功达到初级学习者水平',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5天前
      pointsEarned: 200
    }
  ]);

  // 成就系统
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first_assessment',
      title: '初来乍到',
      description: '完成你的第一次技能评估',
      icon: '🎯',
      requirement: '完成1次技能评估',
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      rarity: 'common',
      rewardPoints: 50
    },
    {
      id: 'streak_5',
      title: '连续学习达人',
      description: '连续学习5天',
      icon: '🔥',
      requirement: '连续学习5天',
      progress: 5,
      maxProgress: 5,
      unlocked: true,
      rarity: 'rare',
      rewardPoints: 150
    },
    {
      id: 'modules_10',
      title: '学习专家',
      description: '完成10个学习模块',
      icon: '📚',
      requirement: '完成10个学习模块',
      progress: 6,
      maxProgress: 10,
      unlocked: false,
      rarity: 'epic',
      rewardPoints: 300
    },
    {
      id: 'perfect_score',
      title: '完美主义者',
      description: '在任意技能测试中获得100分',
      icon: '⭐',
      requirement: '单项技能测试得100分',
      progress: 0,
      maxProgress: 1,
      unlocked: false,
      rarity: 'epic',
      rewardPoints: 250
    },
    {
      id: 'all_skills_80',
      title: '全能大师',
      description: '所有技能都达到80分以上',
      icon: '👑',
      requirement: '所有技能达到80+',
      progress: skills ? Object.values(skills).filter((s, i) => i < 5 && s >= 80).length : 0,
      maxProgress: 5,
      unlocked: false,
      rarity: 'legendary',
      rewardPoints: 500
    },
    {
      id: 'streak_30',
      title: '学习狂人',
      description: '连续学习30天',
      icon: '🚀',
      requirement: '连续学习30天',
      progress: 5,
      maxProgress: 30,
      unlocked: false,
      rarity: 'legendary',
      rewardPoints: 1000
    }
  ]);

  // 技能进步历史（模拟数据）
  const skillProgressHistory = {
    factualDetection: [30, 35, 42, 48, 55, 62, 68, skills?.factualDetection || 65],
    logicalReasoning: [25, 32, 38, 45, 52, 58, 65, skills?.logicalReasoning || 60],
    consistencyCheck: [20, 28, 35, 42, 48, 55, 61, skills?.consistencyCheck || 58],
    attentionAnalysis: [15, 22, 30, 38, 45, 52, 58, skills?.attentionAnalysis || 55],
    decisionPath: [18, 25, 32, 40, 47, 54, 60, skills?.decisionPath || 57]
  };

  const getLevelInfo = (level: number) => {
    const levelData = {
      title: level < 5 ? '新手学员' : 
             level < 10 ? '进阶学习者' :
             level < 15 ? '熟练分析师' :
             level < 20 ? '专业检测师' : '大师级专家',
      nextLevelPoints: Math.floor(level * 300 + level * level * 10),
      color: level < 5 ? 'text-green-600' :
             level < 10 ? 'text-blue-600' :
             level < 15 ? 'text-purple-600' :
             level < 20 ? 'text-orange-600' : 'text-red-600'
    };
    return levelData;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'assessment': return ChartBarIcon;
      case 'module': return AcademicCapIcon;
      case 'achievement': return TrophySolidIcon;
      case 'milestone': return StarSolidIcon;
      default: return CheckCircleIcon;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}分钟前`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}小时前`;
    return `${Math.floor(diffInMinutes / 1440)}天前`;
  };

  const levelInfo = getLevelInfo(currentLevel);
  const levelProgress = ((totalPoints % levelInfo.nextLevelPoints) / levelInfo.nextLevelPoints) * 100;

  return (
    <div className="space-y-6">
      {/* 用户统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 等级信息 */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
              <TrophySolidIcon className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${levelInfo.color}`}>Lv.{currentLevel}</div>
              <div className="text-sm text-gray-500">{levelInfo.title}</div>
            </div>
          </div>
          <div className="mb-2">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>升级进度</span>
              <span>{pointsToNextLevel}点升级</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${levelProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 总积分 */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full">
              <StarSolidIcon className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-600">{totalPoints.toLocaleString()}</div>
              <div className="text-sm text-gray-500">学习积分</div>
            </div>
          </div>
          <div className="flex items-center text-green-600 text-sm">
            <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
            本周 +320 积分
          </div>
        </div>

        {/* 学习连击 */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-full">
              <FireSolidIcon className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-600">{streak.currentStreak}</div>
              <div className="text-sm text-gray-500">连续学习天数</div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            最长记录: {streak.longestStreak} 天
          </div>
        </div>

        {/* 成就进度 */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-teal-600 rounded-full">
              <GiftIcon className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {achievements.filter(a => a.unlocked).length}
              </div>
              <div className="text-sm text-gray-500">已获得成就</div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            总计: {achievements.length} 个成就
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近活动 */}
        <div className="bg-white rounded-lg border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">最近活动</h3>
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                className="text-sm border rounded px-3 py-1"
              >
                <option value="week">本周</option>
                <option value="month">本月</option>
                <option value="all">全部</option>
              </select>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => {
                const ActivityIcon = getActivityIcon(activity.type);
                
                return (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'assessment' ? 'bg-blue-100' :
                      activity.type === 'module' ? 'bg-green-100' :
                      activity.type === 'achievement' ? 'bg-yellow-100' :
                      'bg-purple-100'
                    }`}>
                      <ActivityIcon className={`h-4 w-4 ${
                        activity.type === 'assessment' ? 'text-blue-600' :
                        activity.type === 'module' ? 'text-green-600' :
                        activity.type === 'achievement' ? 'text-yellow-600' :
                        'text-purple-600'
                      }`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {activity.title}
                        </h4>
                        {activity.pointsEarned && (
                          <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                            +{activity.pointsEarned}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{activity.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatTimeAgo(activity.timestamp)}</span>
                        {activity.skillsImproved && (
                          <div className="flex space-x-1">
                            {activity.skillsImproved.map(skill => (
                              <span key={skill} className="px-1 py-0.5 bg-gray-100 rounded text-xs">
                                {skill === 'factualDetection' ? '事实检测' :
                                 skill === 'logicalReasoning' ? '逻辑推理' :
                                 skill === 'consistencyCheck' ? '一致性检验' :
                                 skill === 'attentionAnalysis' ? '注意力分析' :
                                 skill === 'decisionPath' ? '决策路径' : skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 成就系统 */}
        <div className="bg-white rounded-lg border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">成就收集</h3>
            <p className="text-sm text-gray-600 mt-1">
              完成特定任务来解锁成就和奖励
            </p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                    achievement.unlocked 
                      ? `${getRarityColor(achievement.rarity)} transform hover:scale-105`
                      : 'border-gray-200 bg-gray-50 opacity-75'
                  }`}
                >
                  {!achievement.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg">
                      <LockClosedIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="text-center">
                    <div className="text-2xl mb-2">{achievement.icon}</div>
                    <h4 className={`font-medium text-sm mb-1 ${
                      achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {achievement.title}
                    </h4>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {achievement.description}
                    </p>
                    
                    {/* 进度条 */}
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>进度</span>
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            achievement.unlocked ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-yellow-600 font-medium">
                      {achievement.rewardPoints} 积分
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 技能进步图表 */}
      {skills && (
        <div className="bg-white rounded-lg border p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">技能进步趋势</h3>
            <p className="text-sm text-gray-600">
              查看你在各个技能领域的学习进步轨迹
            </p>
          </div>

          <div className="space-y-6">
            {Object.entries(skillProgressHistory).map(([skill, history]) => {
              const skillName = skill === 'factualDetection' ? '事实检测' :
                               skill === 'logicalReasoning' ? '逻辑推理' :
                               skill === 'consistencyCheck' ? '一致性检验' :
                               skill === 'attentionAnalysis' ? '注意力分析' :
                               skill === 'decisionPath' ? '决策路径' : skill;
              
              const currentScore = history[history.length - 1];
              const previousScore = history[history.length - 2] || 0;
              const improvement = currentScore - previousScore;

              return (
                <div key={skill} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900">{skillName}</h4>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-gray-600">当前分数: {currentScore}</span>
                        {improvement > 0 && (
                          <span className="text-green-600 font-medium">
                            +{improvement} 📈
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-primary-600">
                      {currentScore}
                    </div>
                  </div>
                  
                  {/* 简单的进度条图表 */}
                  <div className="relative h-16 bg-gray-50 rounded-lg p-3">
                    <div className="flex items-end h-full space-x-1">
                      {history.map((score, index) => (
                        <div 
                          key={index}
                          className="flex-1 bg-primary-500 rounded-t transition-all duration-300 hover:bg-primary-600"
                          style={{ height: `${(score / 100) * 100}%`, minHeight: '4px' }}
                          title={`第${index + 1}次: ${score}分`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 激励卡片 */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">继续加油！ 🚀</h3>
            <p className="text-indigo-100 mb-4">
              你已经在学习路径上取得了很大进步。继续保持，达成更多成就！
            </p>
            <div className="space-y-2 text-sm text-indigo-100">
              <div>• 连续学习 {streak.currentStreak} 天，离下一个里程碑还有 {Math.max(0, 7 - streak.currentStreak)} 天</div>
              <div>• 再获得 {pointsToNextLevel} 积分就能升级到 Lv.{currentLevel + 1}</div>
              <div>• 还有 {achievements.filter(a => !a.unlocked).length} 个成就等待解锁</div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <TrophySolidIcon className="h-16 w-16 text-yellow-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}