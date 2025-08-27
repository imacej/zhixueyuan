'use client';

import { useState } from 'react';
import { ModelConfiguration } from '@/components/settings/ModelConfiguration';
import { UserSettings } from '@/components/settings/UserSettings';
import { DataManagement } from '@/components/settings/DataManagement';
import {
  CpuChipIcon,
  UserIcon,
  CircleStackIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

type SettingsTab = 'models' | 'user' | 'data';

const tabs = [
  {
    id: 'models' as const,
    name: 'AI模型配置',
    description: '配置和管理AI模型设置',
    icon: CpuChipIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'user' as const,
    name: '用户设置',
    description: '个人偏好和界面设置',
    icon: UserIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    id: 'data' as const,
    name: '数据管理',
    description: '学习数据导入导出和备份',
    icon: CircleStackIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
];

export default function SettingsPage() {
  const [currentTab, setCurrentTab] = useState<SettingsTab>('models');

  const renderContent = () => {
    switch (currentTab) {
      case 'models':
        return <ModelConfiguration />;
      case 'user':
        return <UserSettings />;
      case 'data':
        return <DataManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面头部 */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-gray-600 to-blue-600 rounded-full">
              <Cog6ToothIcon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            系统设置
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            管理AI模型配置、用户偏好设置和学习数据。
            自定义您的ALAH学习体验。
          </p>
        </div>

        {/* 标签导航 */}
        <div className="mb-6 sm:mb-8">
          {/* Mobile Dropdown */}
          <div className="block sm:hidden">
            <select
              value={currentTab}
              onChange={(e) => setCurrentTab(e.target.value as SettingsTab)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.name} - {tab.description}
                </option>
              ))}
            </select>
          </div>
          
          {/* Desktop Tabs */}
          <div className="hidden sm:flex justify-center">
            <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1 bg-white p-1 rounded-lg border shadow-sm">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = currentTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    className={`flex items-center px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-md font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-500 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    <div className="text-left">
                      <div className="text-xs sm:text-sm font-medium">{tab.name}</div>
                      <div className="text-xs opacity-75 hidden lg:block">{tab.description}</div>
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

        {/* 帮助信息 */}
        <div className="mt-8 sm:mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 text-center">设置帮助</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CpuChipIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">模型配置</h4>
              <p className="text-xs sm:text-sm">配置OpenAI、HuggingFace等AI模型的API密钥和参数</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <UserIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">个性化设置</h4>
              <p className="text-xs sm:text-sm">调整界面主题、语言偏好和学习提醒设置</p>
            </div>
            <div className="text-center sm:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CircleStackIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">数据管理</h4>
              <p className="text-xs sm:text-sm">导出学习数据、重置进度或从备份文件恢复数据</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}