'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import {
  TrophyIcon,
  ChartBarIcon,
  ClockIcon,
  FireIcon,
  StarIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

// 模拟用户进度数据
const mockUserData = {
  totalQuestions: 156,
  correctAnswers: 123,
  currentStreak: 8,
  bestStreak: 15,
  totalPlayTime: 2840, // 分钟
  level: 7,
  experience: 2850,
  nextLevelExp: 3200,
  achievements: [
    { id: '1', name: '初出茅庐', description: '完成首次训练', icon: '🌱', unlocked: true },
    { id: '2', name: '连胜高手', description: '获得10连胜', icon: '🔥', unlocked: true },
    { id: '3', name: '事实检查员', description: '识别50个事实性错误', icon: '📚', unlocked: true },
    { id: '4', name: '逻辑大师', description: '识别30个逻辑错误', icon: '🧠', unlocked: true },
    { id: '5', name: '一致性守护者', description: '识别20个一致性错误', icon: '🔄', unlocked: false },
    { id: '6', name: '完美主义者', description: '单次训练100%正确率', icon: '💎', unlocked: false },
  ],
  skillLevels: {
    factual: { level: 8, experience: 850, maxExp: 1000 },
    logical: { level: 6, experience: 600, maxExp: 800 },
    consistency: { level: 5, experience: 300, maxExp: 600 },
  },
  recentActivity: [
    { date: '2024-08-27', score: 1250, accuracy: 87, questionsAnswered: 15 },
    { date: '2024-08-26', score: 980, accuracy: 82, questionsAnswered: 12 },
    { date: '2024-08-25', score: 1100, accuracy: 91, questionsAnswered: 11 },
    { date: '2024-08-24', score: 750, accuracy: 75, questionsAnswered: 8 },
    { date: '2024-08-23', score: 1350, accuracy: 95, questionsAnswered: 14 },
    { date: '2024-08-22', score: 890, accuracy: 80, questionsAnswered: 10 },
    { date: '2024-08-21', score: 1020, accuracy: 85, questionsAnswered: 12 },
  ]
};

export function ProgressDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');

  const getAccuracy = () => {
    return Math.round((mockUserData.correctAnswers / mockUserData.totalQuestions) * 100);
  };

  const getExpProgress = () => {
    return Math.round((mockUserData.experience / mockUserData.nextLevelExp) * 100);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getSkillColor = (skillType: string) => {
    switch (skillType) {
      case 'factual': return 'text-blue-600 bg-blue-100';
      case 'logical': return 'text-purple-600 bg-purple-100';
      case 'consistency': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSkillName = (skillType: string) => {
    switch (skillType) {
      case 'factual': return '事实检查';
      case 'logical': return '逻辑推理';
      case 'consistency': return '一致性检验';
      default: return '未知技能';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* 概览统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="p-6 text-center">
            <TrophyIcon className="h-10 w-10 text-blue-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-blue-600">{mockUserData.level}</div>
            <div className="text-sm text-blue-600">当前等级</div>
            <div className="mt-2">
              <div className="bg-white rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getExpProgress()}%` }}
                ></div>
              </div>
              <div className="text-xs text-blue-600 mt-1">
                {mockUserData.experience}/{mockUserData.nextLevelExp} EXP
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <div className="p-6 text-center">
            <CheckCircleIcon className="h-10 w-10 text-green-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-green-600">{getAccuracy()}%</div>
            <div className="text-sm text-green-600">总体准确率</div>
            <div className="text-xs text-green-500 mt-2">
              {mockUserData.correctAnswers}/{mockUserData.totalQuestions} 题正确
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100">
          <div className="p-6 text-center">
            <FireIcon className="h-10 w-10 text-red-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-red-600">{mockUserData.currentStreak}</div>
            <div className="text-sm text-red-600">当前连胜</div>
            <div className="text-xs text-red-500 mt-2">
              最高记录: {mockUserData.bestStreak}
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="p-6 text-center">
            <ClockIcon className="h-10 w-10 text-purple-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-purple-600">
              {formatTime(mockUserData.totalPlayTime)}
            </div>
            <div className="text-sm text-purple-600">总训练时长</div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 技能等级 */}
        <div className="lg:col-span-1">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AcademicCapIcon className="h-5 w-5 mr-2" />
                技能等级
              </h3>
              <div className="space-y-4">
                {Object.entries(mockUserData.skillLevels).map(([skill, data]) => (
                  <div key={skill}>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`px-2 py-1 rounded text-sm font-medium ${getSkillColor(skill)}`}>
                        {getSkillName(skill)}
                      </span>
                      <span className="text-sm font-medium">LV {data.level}</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(data.experience / data.maxExp) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {data.experience}/{data.maxExp} EXP
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* 最近活动 */}
        <div className="lg:col-span-2">
          <Card>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <ChartBarIcon className="h-5 w-5 mr-2" />
                  训练记录
                </h3>
                <div className="flex space-x-2">
                  {['week', 'month', 'all'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period as any)}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        selectedPeriod === period
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {period === 'week' ? '本周' : period === 'month' ? '本月' : '全部'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {mockUserData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(activity.date).toLocaleDateString('zh-CN', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center space-x-2">
                        <ArrowTrendingUpIcon className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-gray-600">{activity.questionsAnswered} 题</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{activity.score}</div>
                        <div className="text-xs text-gray-500">分数</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          activity.accuracy >= 90 ? 'text-green-600' :
                          activity.accuracy >= 80 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {activity.accuracy}%
                        </div>
                        <div className="text-xs text-gray-500">准确率</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 成就系统 */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <StarIcon className="h-5 w-5 mr-2" />
            成就徽章
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockUserData.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  achievement.unlocked
                    ? 'border-yellow-300 bg-yellow-50 hover:shadow-md'
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                <div className="text-center">
                  <div className={`text-3xl mb-2 ${achievement.unlocked ? '' : 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  <h4 className={`font-medium mb-1 ${
                    achievement.unlocked ? 'text-yellow-800' : 'text-gray-500'
                  }`}>
                    {achievement.name}
                  </h4>
                  <p className={`text-sm ${
                    achievement.unlocked ? 'text-yellow-700' : 'text-gray-400'
                  }`}>
                    {achievement.description}
                  </p>
                  {achievement.unlocked && (
                    <div className="mt-2">
                      <CheckCircleIcon className="h-5 w-5 text-yellow-600 mx-auto" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* 学习建议 */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 个性化建议</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">📈 提升重点</h4>
              <p className="text-sm text-gray-600">
                你的一致性检验技能相对较弱，建议多练习相关题型来提升这方面的能力。
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">🕒 最佳训练时间</h4>
              <p className="text-sm text-gray-600">
                根据你的活跃时间分析，下午2-4点是你表现最佳的时间段。
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">🎖️ 下一个目标</h4>
              <p className="text-sm text-gray-600">
                继续保持当前连胜记录，再答对7题就能刷新个人最佳记录！
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}