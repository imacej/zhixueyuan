'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  UserCircleIcon,
  PaintBrushIcon,
  BellIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  EyeIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface UserPreferences {
  // 个人信息
  username: string;
  email: string;
  avatar: string;
  
  // 界面设置
  theme: 'light' | 'dark' | 'system';
  language: 'zh-CN' | 'en-US' | 'ja-JP';
  fontSize: 'small' | 'medium' | 'large';
  
  // 学习偏好
  difficultyPreference: 'adaptive' | 'easy' | 'medium' | 'hard';
  learningGoal: 'casual' | 'professional' | 'expert';
  dailyGoal: number; // 每日学习题目数
  
  // 通知设置
  enableNotifications: boolean;
  notificationTypes: {
    learningReminder: boolean;
    achievementUnlock: boolean;
    weeklyReport: boolean;
    systemUpdate: boolean;
  };
  notificationTime: string;
  
  // 隐私设置
  dataCollection: boolean;
  analyticsSharing: boolean;
  publicProfile: boolean;
  
  // 高级设置
  autoSave: boolean;
  animationEnabled: boolean;
  soundEnabled: boolean;
  keyboardShortcuts: boolean;
}

const defaultPreferences: UserPreferences = {
  username: '用户',
  email: '',
  avatar: '',
  theme: 'system',
  language: 'zh-CN',
  fontSize: 'medium',
  difficultyPreference: 'adaptive',
  learningGoal: 'professional',
  dailyGoal: 20,
  enableNotifications: true,
  notificationTypes: {
    learningReminder: true,
    achievementUnlock: true,
    weeklyReport: true,
    systemUpdate: false,
  },
  notificationTime: '19:00',
  dataCollection: true,
  analyticsSharing: false,
  publicProfile: false,
  autoSave: true,
  animationEnabled: true,
  soundEnabled: true,
  keyboardShortcuts: true,
};

export function UserSettings() {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 从localStorage加载设置
  useEffect(() => {
    const saved = localStorage.getItem('alah_user_preferences');
    if (saved) {
      try {
        const parsedPrefs = JSON.parse(saved);
        setPreferences(parsedPrefs);
      } catch (error) {
        console.error('Failed to load user preferences:', error);
      }
    }
  }, []);

  // 保存设置
  const savePreferences = async () => {
    setIsSaving(true);
    
    // 模拟保存过程
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    localStorage.setItem('alah_user_preferences', JSON.stringify(preferences));
    setHasChanges(false);
    setIsSaving(false);
  };

  // 更新设置
  const updatePreference = (key: keyof UserPreferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  // 更新嵌套设置
  const updateNotificationType = (type: keyof UserPreferences['notificationTypes'], value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      notificationTypes: {
        ...prev.notificationTypes,
        [type]: value
      }
    }));
    setHasChanges(true);
  };

  // 重置设置
  const resetToDefaults = () => {
    setPreferences(defaultPreferences);
    setHasChanges(true);
  };

  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case 'light': return SunIcon;
      case 'dark': return MoonIcon;
      case 'system': return ComputerDesktopIcon;
      default: return SunIcon;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
      {/* 保存提示 */}
      {hasChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 mr-2 flex-shrink-0" />
              <span className="text-sm sm:text-base text-yellow-700">您有未保存的更改</span>
            </div>
            <div className="flex space-x-2 w-full sm:w-auto">
              <Button
                onClick={() => {
                  setPreferences(JSON.parse(localStorage.getItem('alah_user_preferences') || 'null') || defaultPreferences);
                  setHasChanges(false);
                }}
                size="sm"
                variant="outline"
                className="flex-1 sm:flex-none"
              >
                取消
              </Button>
              <Button
                onClick={savePreferences}
                size="sm"
                isLoading={isSaving}
                className="flex-1 sm:flex-none"
              >
                {isSaving ? '保存中...' : '保存设置'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 个人信息 */}
      <Card>
        <div className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
            <UserCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            个人信息
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                用户名
              </label>
              <input
                type="text"
                value={preferences.username}
                onChange={(e) => updatePreference('username', e.target.value)}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
                placeholder="输入用户名"
              />
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                邮箱地址
              </label>
              <input
                type="email"
                value={preferences.email}
                onChange={(e) => updatePreference('email', e.target.value)}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
                placeholder="输入邮箱地址"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* 界面设置 */}
      <Card>
        <div className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
            <PaintBrushIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            界面设置
          </h3>
          
          <div className="space-y-4 sm:space-y-6">
            {/* 主题设置 */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                主题模式
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { key: 'light', label: '浅色', icon: SunIcon },
                  { key: 'dark', label: '深色', icon: MoonIcon },
                  { key: 'system', label: '跟随系统', icon: ComputerDesktopIcon },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => updatePreference('theme', key)}
                    className={`p-2 sm:p-4 border rounded-lg text-center transition-colors ${
                      preferences.theme === key
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Icon className="h-4 w-4 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2" />
                    <div className="text-xs sm:text-sm">{label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* 语言设置 */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  界面语言
                </label>
                <select
                  value={preferences.language}
                  onChange={(e) => updatePreference('language', e.target.value)}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="zh-CN">中文（简体）</option>
                  <option value="en-US">English</option>
                  <option value="ja-JP">日本語</option>
                </select>
              </div>
              
              {/* 字体大小 */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  字体大小
                </label>
                <select
                  value={preferences.fontSize}
                  onChange={(e) => updatePreference('fontSize', e.target.value)}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="small">小号</option>
                  <option value="medium">中号</option>
                  <option value="large">大号</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 学习偏好 */}
      <Card>
        <div className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
            <GlobeAltIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            学习偏好
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                难度偏好
              </label>
              <select
                value={preferences.difficultyPreference}
                onChange={(e) => updatePreference('difficultyPreference', e.target.value)}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="adaptive">自适应</option>
                <option value="easy">简单</option>
                <option value="medium">中等</option>
                <option value="hard">困难</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                学习目标
              </label>
              <select
                value={preferences.learningGoal}
                onChange={(e) => updatePreference('learningGoal', e.target.value)}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="casual">休闲学习</option>
                <option value="professional">专业提升</option>
                <option value="expert">专家级</option>
              </select>
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                每日目标 ({preferences.dailyGoal} 题)
              </label>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={preferences.dailyGoal}
                onChange={(e) => updatePreference('dailyGoal', Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5题</span>
                <span>50题</span>
                <span>100题</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 通知设置 */}
      <Card>
        <div className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
            <BellIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            通知设置
          </h3>
          
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start sm:items-center justify-between">
              <div className="flex-1 min-w-0 mr-3">
                <div className="font-medium text-gray-900 text-sm sm:text-base">启用通知</div>
                <div className="text-xs sm:text-sm text-gray-500">允许接收学习提醒和系统通知</div>
              </div>
              <button
                onClick={() => updatePreference('enableNotifications', !preferences.enableNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.enableNotifications ? 'bg-primary-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.enableNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            {preferences.enableNotifications && (
              <div className="pl-3 sm:pl-4 border-l-2 border-gray-200 space-y-2 sm:space-y-3">
                {Object.entries({
                  learningReminder: '学习提醒',
                  achievementUnlock: '成就解锁',
                  weeklyReport: '周报',
                  systemUpdate: '系统更新',
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-gray-700">{label}</span>
                    <button
                      onClick={() => updateNotificationType(key as keyof UserPreferences['notificationTypes'], !preferences.notificationTypes[key as keyof UserPreferences['notificationTypes']])}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        preferences.notificationTypes[key as keyof UserPreferences['notificationTypes']] ? 'bg-primary-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          preferences.notificationTypes[key as keyof UserPreferences['notificationTypes']] ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
                
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-700">提醒时间</span>
                  <input
                    type="time"
                    value={preferences.notificationTime}
                    onChange={(e) => updatePreference('notificationTime', e.target.value)}
                    className="px-2 sm:px-3 py-1 border border-gray-300 rounded text-xs sm:text-sm focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* 隐私设置 */}
      <Card>
        <div className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
            <ShieldCheckIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            隐私设置
          </h3>
          
          <div className="space-y-3 sm:space-y-4">
            {[
              {
                key: 'dataCollection',
                title: '数据收集',
                description: '允许收集匿名使用数据以改进服务'
              },
              {
                key: 'analyticsSharing',
                title: '分析共享',
                description: '与第三方分析服务共享使用统计'
              },
              {
                key: 'publicProfile',
                title: '公开档案',
                description: '允许其他用户查看您的学习档案'
              }
            ].map(({ key, title, description }) => (
              <div key={key} className="flex items-start sm:items-center justify-between">
                <div className="flex-1 min-w-0 mr-3">
                  <div className="font-medium text-gray-900 text-sm sm:text-base">{title}</div>
                  <div className="text-xs sm:text-sm text-gray-500">{description}</div>
                </div>
                <button
                  onClick={() => updatePreference(key as keyof UserPreferences, !preferences[key as keyof UserPreferences])}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences[key as keyof UserPreferences] ? 'bg-primary-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences[key as keyof UserPreferences] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* 高级设置 */}
      <Card>
        <div className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
            <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            高级设置
          </h3>
          
          <div className="space-y-3 sm:space-y-4">
            {[
              {
                key: 'autoSave',
                title: '自动保存',
                description: '自动保存学习进度和答案'
              },
              {
                key: 'animationEnabled',
                title: '界面动画',
                description: '启用界面转场和交互动画'
              },
              {
                key: 'soundEnabled',
                title: '音效',
                description: '播放操作音效和提示音'
              },
              {
                key: 'keyboardShortcuts',
                title: '键盘快捷键',
                description: '启用键盘快捷键操作'
              }
            ].map(({ key, title, description }) => (
              <div key={key} className="flex items-start sm:items-center justify-between">
                <div className="flex-1 min-w-0 mr-3">
                  <div className="font-medium text-gray-900 text-sm sm:text-base">{title}</div>
                  <div className="text-xs sm:text-sm text-gray-500">{description}</div>
                </div>
                <button
                  onClick={() => updatePreference(key as keyof UserPreferences, !preferences[key as keyof UserPreferences])}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences[key as keyof UserPreferences] ? 'bg-primary-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences[key as keyof UserPreferences] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* 操作按钮 */}
      <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0">
        <Button
          onClick={resetToDefaults}
          variant="outline"
          className="text-red-600 border-red-300 hover:bg-red-50 w-full sm:w-auto"
        >
          重置为默认设置
        </Button>
        
        <div className="flex space-x-2 sm:space-x-3">
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="flex-1 sm:flex-none"
          >
            取消更改
          </Button>
          <Button
            onClick={savePreferences}
            isLoading={isSaving}
            disabled={!hasChanges}
            className="flex-1 sm:flex-none"
          >
            {isSaving ? '保存中...' : '保存设置'}
          </Button>
        </div>
      </div>
    </div>
  );
}