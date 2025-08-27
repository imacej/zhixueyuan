'use client';

import { useState, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  CloudArrowDownIcon,
  CloudArrowUpIcon,
  TrashIcon,
  DocumentIcon,
  FolderIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface DataStats {
  totalQuestions: number;
  learningHours: number;
  achievements: number;
  lastBackup: string | null;
  dataSize: string;
}

interface BackupFile {
  filename: string;
  date: string;
  size: string;
  type: 'full' | 'progress' | 'settings';
}

export function DataManagement() {
  const [dataStats, setDataStats] = useState<DataStats>({
    totalQuestions: 1247,
    learningHours: 45.5,
    achievements: 12,
    lastBackup: '2024-08-20',
    dataSize: '2.3 MB'
  });

  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [exportType, setExportType] = useState<'all' | 'progress' | 'settings'>('all');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mockBackupFiles: BackupFile[] = [
    {
      filename: 'alah_backup_2024-08-27.json',
      date: '2024-08-27',
      size: '2.3 MB',
      type: 'full'
    },
    {
      filename: 'alah_progress_2024-08-25.json',
      date: '2024-08-25',
      size: '1.8 MB',
      type: 'progress'
    },
    {
      filename: 'alah_settings_2024-08-20.json',
      date: '2024-08-20',
      size: '0.1 MB',
      type: 'settings'
    }
  ];

  const exportData = async () => {
    setIsExporting(true);
    
    // 模拟数据导出
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const exportData = {
      type: exportType,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      data: {
        userSettings: JSON.parse(localStorage.getItem('alah_user_preferences') || '{}'),
        modelConfigs: JSON.parse(localStorage.getItem('alah_model_configs') || '[]'),
        learningProgress: {
          totalQuestions: dataStats.totalQuestions,
          learningHours: dataStats.learningHours,
          achievements: dataStats.achievements,
          // 这里会包含更多实际的学习数据
        }
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `alah_${exportType}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setIsExporting(false);
  };

  const importData = async (file: File) => {
    setIsImporting(true);
    
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // 模拟导入过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 验证数据格式
      if (!data.type || !data.data) {
        throw new Error('无效的备份文件格式');
      }
      
      // 根据数据类型进行导入
      if (data.type === 'all' || data.type === 'settings') {
        if (data.data.userSettings) {
          localStorage.setItem('alah_user_preferences', JSON.stringify(data.data.userSettings));
        }
        if (data.data.modelConfigs) {
          localStorage.setItem('alah_model_configs', JSON.stringify(data.data.modelConfigs));
        }
      }
      
      if (data.type === 'all' || data.type === 'progress') {
        // 这里会导入学习进度数据
        // 在实际应用中，这些数据可能存储在后端数据库中
      }
      
      alert('数据导入成功！页面将刷新以应用更改。');
      window.location.reload();
      
    } catch (error) {
      console.error('Import error:', error);
      alert('导入失败：' + (error instanceof Error ? error.message : '未知错误'));
    }
    
    setIsImporting(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importData(file);
    }
  };

  const resetAllData = async () => {
    setIsResetting(true);
    
    // 模拟重置过程
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 清除所有本地存储的数据
    const keysToRemove = [
      'alah_user_preferences',
      'alah_model_configs',
      'alah_learning_progress',
      'alah_achievements'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    setDataStats({
      totalQuestions: 0,
      learningHours: 0,
      achievements: 0,
      lastBackup: null,
      dataSize: '0 MB'
    });
    
    setIsResetting(false);
    setShowResetConfirm(false);
    
    alert('所有数据已重置！页面将刷新。');
    window.location.reload();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'full': return '📦';
      case 'progress': return '📊';
      case 'settings': return '⚙️';
      default: return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full': return 'text-blue-600 bg-blue-100';
      case 'progress': return 'text-green-600 bg-green-100';
      case 'settings': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
      {/* 数据统计 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 sm:p-4 rounded-lg">
          <div className="flex items-center">
            <DocumentIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mr-2 sm:mr-3" />
            <div className="min-w-0">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 truncate">{dataStats.totalQuestions.toLocaleString()}</div>
              <div className="text-xs sm:text-sm text-blue-600">已答题目</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 sm:p-4 rounded-lg">
          <div className="flex items-center">
            <ClockIcon className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mr-2 sm:mr-3" />
            <div className="min-w-0">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 truncate">{dataStats.learningHours}h</div>
              <div className="text-xs sm:text-sm text-green-600">学习时长</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 sm:p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircleIcon className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mr-2 sm:mr-3" />
            <div className="min-w-0">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600 truncate">{dataStats.achievements}</div>
              <div className="text-xs sm:text-sm text-purple-600">获得成就</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 sm:p-4 rounded-lg">
          <div className="flex items-center">
            <FolderIcon className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 mr-2 sm:mr-3" />
            <div className="min-w-0">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600 truncate">{dataStats.dataSize}</div>
              <div className="text-xs sm:text-sm text-orange-600">数据大小</div>
            </div>
          </div>
        </div>
      </div>

      {/* 数据导出 */}
      <Card>
        <div className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
            <CloudArrowDownIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            数据导出
          </h3>
          
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                导出类型
              </label>
              <select
                value={exportType}
                onChange={(e) => setExportType(e.target.value as any)}
                className="w-full sm:w-auto sm:min-w-64 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">完整备份（包含所有数据）</option>
                <option value="progress">学习进度数据</option>
                <option value="settings">设置配置</option>
              </select>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Button
                onClick={exportData}
                isLoading={isExporting}
                leftIcon={<CloudArrowDownIcon className="h-4 w-4" />}
                className="w-full sm:w-auto"
              >
                {isExporting ? '导出中...' : '导出数据'}
              </Button>
              
              <div className="text-xs sm:text-sm text-gray-500">
                数据将以JSON格式下载到您的设备
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 数据导入 */}
      <Card>
        <div className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
            <CloudArrowUpIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            数据导入
          </h3>
          
          <div className="space-y-3 sm:space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 lg:p-8 text-center">
              <CloudArrowUpIcon className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-2">选择备份文件</h4>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                支持从之前导出的JSON备份文件恢复数据
              </p>
              
              <div className="flex justify-center">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isImporting}
                  leftIcon={<FolderIcon className="h-4 w-4" />}
                  className="w-full sm:w-auto"
                >
                  {isImporting ? '导入中...' : '选择文件'}
                </Button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-xs sm:text-sm">
                  <div className="font-medium text-yellow-800 mb-1">导入须知</div>
                  <ul className="text-yellow-700 space-y-1">
                    <li>• 导入数据会覆盖当前的相应设置和进度</li>
                    <li>• 建议在导入前先导出当前数据作为备份</li>
                    <li>• 仅支持本系统导出的JSON格式文件</li>
                    <li>• 导入完成后页面将自动刷新</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 历史备份 */}
      <Card>
        <div className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
            历史备份文件
          </h3>
          
          <div className="space-y-2 sm:space-y-3">
            {mockBackupFiles.map((backup, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <div className="text-lg sm:text-xl lg:text-2xl flex-shrink-0">{getTypeIcon(backup.type)}</div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900 text-sm sm:text-base truncate">{backup.filename}</div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      {backup.date} • {backup.size}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(backup.type)} w-fit`}>
                    {backup.type === 'full' ? '完整备份' : 
                     backup.type === 'progress' ? '学习进度' : '设置配置'}
                  </span>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 sm:flex-none"
                      onClick={() => {
                        // 这里可以实现下载历史备份的功能
                        alert('历史备份下载功能开发中...');
                      }}
                    >
                      下载
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-300 hover:bg-red-50 flex-1 sm:flex-none"
                      onClick={() => {
                        if (confirm('确定要删除这个备份文件吗？此操作不可撤销。')) {
                          // 删除备份文件的逻辑
                          alert('删除功能开发中...');
                        }
                      }}
                    >
                      删除
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {mockBackupFiles.length === 0 && (
              <div className="text-center py-6 sm:py-8 text-gray-500">
                <FolderIcon className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm sm:text-base">暂无历史备份文件</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* 数据重置 */}
      <Card className="border-red-200">
        <div className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-red-600 mb-3 sm:mb-4 flex items-center">
            <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            危险操作
          </h3>
          
          <div className="space-y-3 sm:space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium text-red-800 mb-1 text-sm sm:text-base">重置所有数据</div>
                  <div className="text-xs sm:text-sm text-red-700 mb-3">
                    此操作将永久删除所有学习进度、设置配置和成就记录。此操作不可撤销！
                  </div>
                  
                  {!showResetConfirm ? (
                    <Button
                      onClick={() => setShowResetConfirm(true)}
                      variant="outline"
                      className="text-red-600 border-red-300 hover:bg-red-50 w-full sm:w-auto"
                      leftIcon={<TrashIcon className="h-4 w-4" />}
                    >
                      重置所有数据
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-xs sm:text-sm font-medium text-red-800">
                        请确认您要执行此操作：
                      </div>
                      <div className="flex space-x-2 sm:space-x-3">
                        <Button
                          onClick={resetAllData}
                          isLoading={isResetting}
                          className="bg-red-600 hover:bg-red-700 flex-1 sm:flex-none"
                          size="sm"
                        >
                          {isResetting ? '重置中...' : '确认重置'}
                        </Button>
                        <Button
                          onClick={() => setShowResetConfirm(false)}
                          variant="outline"
                          size="sm"
                          className="flex-1 sm:flex-none"
                        >
                          取消
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 帮助信息 */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">💡 数据管理建议</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs sm:text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">定期备份</h4>
              <ul className="space-y-1">
                <li>• 建议每周进行一次完整备份</li>
                <li>• 重要学习节点前备份进度数据</li>
                <li>• 调整设置前先导出当前配置</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">安全存储</h4>
              <ul className="space-y-1">
                <li>• 将备份文件保存在安全位置</li>
                <li>• 可以上传到云盘进行异地备份</li>
                <li>• 定期检查备份文件的完整性</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}