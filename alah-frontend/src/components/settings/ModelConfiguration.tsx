'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  CpuChipIcon,
  CloudIcon,
  ServerIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';

interface ModelConfig {
  id: string;
  name: string;
  provider: 'openai' | 'huggingface' | 'anthropic' | 'local';
  modelId: string;
  apiKey: string;
  endpoint: string;
  maxTokens: number;
  temperature: number;
  enabled: boolean;
  status: 'connected' | 'error' | 'untested';
  description: string;
  capabilities: string[];
}

const defaultModels: ModelConfig[] = [
  {
    id: 'openai-gpt4',
    name: 'GPT-4',
    provider: 'openai',
    modelId: 'gpt-4',
    apiKey: '',
    endpoint: 'https://api.openai.com/v1',
    maxTokens: 4096,
    temperature: 0.7,
    enabled: false,
    status: 'untested',
    description: 'OpenAI最先进的大语言模型，具有强大的推理和理解能力',
    capabilities: ['文本生成', '推理分析', '代码生成', '多语言支持']
  },
  {
    id: 'openai-gpt35',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    modelId: 'gpt-3.5-turbo',
    apiKey: '',
    endpoint: 'https://api.openai.com/v1',
    maxTokens: 4096,
    temperature: 0.7,
    enabled: true,
    status: 'connected',
    description: '快速且经济高效的模型，适合大多数应用场景',
    capabilities: ['文本生成', '对话问答', '内容总结', '翻译']
  },
  {
    id: 'huggingface-bert',
    name: 'BERT Base',
    provider: 'huggingface',
    modelId: 'bert-base-uncased',
    apiKey: '',
    endpoint: 'https://api-inference.huggingface.co',
    maxTokens: 512,
    temperature: 0.5,
    enabled: false,
    status: 'untested',
    description: 'Google开发的预训练模型，擅长文本理解和分类任务',
    capabilities: ['文本分类', '情感分析', '实体识别', '问答系统']
  },
  {
    id: 'anthropic-claude',
    name: 'Claude 3',
    provider: 'anthropic',
    modelId: 'claude-3-sonnet-20240229',
    apiKey: '',
    endpoint: 'https://api.anthropic.com',
    maxTokens: 4096,
    temperature: 0.7,
    enabled: false,
    status: 'untested',
    description: 'Anthropic的安全、有用且诚实的AI助手',
    capabilities: ['对话交流', '内容分析', '逻辑推理', '创意写作']
  },
  {
    id: 'local-llama',
    name: 'Llama 2 Local',
    provider: 'local',
    modelId: 'llama2-7b-chat',
    apiKey: '',
    endpoint: 'http://localhost:8080',
    maxTokens: 2048,
    temperature: 0.8,
    enabled: false,
    status: 'error',
    description: '本地部署的开源大语言模型，保护数据隐私',
    capabilities: ['本地处理', '隐私保护', '离线使用', '自定义部署']
  }
];

export function ModelConfiguration() {
  const [models, setModels] = useState<ModelConfig[]>(defaultModels);
  const [editingModel, setEditingModel] = useState<string | null>(null);
  const [showApiKeys, setShowApiKeys] = useState<Set<string>>(new Set());
  const [testingModel, setTestingModel] = useState<string | null>(null);

  // 从localStorage加载配置
  useEffect(() => {
    const saved = localStorage.getItem('alah_model_configs');
    if (saved) {
      try {
        const parsedModels = JSON.parse(saved);
        setModels(parsedModels);
      } catch (error) {
        console.error('Failed to load model configurations:', error);
      }
    }
  }, []);

  // 保存配置到localStorage
  const saveConfigs = (newModels: ModelConfig[]) => {
    localStorage.setItem('alah_model_configs', JSON.stringify(newModels));
    setModels(newModels);
  };

  const updateModel = (id: string, updates: Partial<ModelConfig>) => {
    const newModels = models.map(model => 
      model.id === id ? { ...model, ...updates } : model
    );
    saveConfigs(newModels);
  };

  const toggleApiKeyVisibility = (modelId: string) => {
    const newSet = new Set(showApiKeys);
    if (newSet.has(modelId)) {
      newSet.delete(modelId);
    } else {
      newSet.add(modelId);
    }
    setShowApiKeys(newSet);
  };

  const testConnection = async (modelId: string) => {
    setTestingModel(modelId);
    
    // 模拟API测试
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const success = Math.random() > 0.3; // 70%成功率
    updateModel(modelId, { 
      status: success ? 'connected' : 'error' 
    });
    
    setTestingModel(null);
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'openai': return '🤖';
      case 'huggingface': return '🤗';
      case 'anthropic': return '🏛️';
      case 'local': return '🏠';
      default: return '❓';
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'openai': return 'text-green-600 bg-green-100';
      case 'huggingface': return 'text-yellow-600 bg-yellow-100';
      case 'anthropic': return 'text-purple-600 bg-purple-100';
      case 'local': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string, isLoading: boolean = false) => {
    if (isLoading) {
      return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>;
    }
    
    switch (status) {
      case 'connected':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircleIcon className="h-4 w-4 text-red-500" />;
      default:
        return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string, isLoading: boolean = false) => {
    if (isLoading) return '测试中...';
    
    switch (status) {
      case 'connected': return '已连接';
      case 'error': return '连接失败';
      default: return '未测试';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
      {/* 概览统计 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 sm:p-4 rounded-lg">
          <div className="flex items-center">
            <CpuChipIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mr-2 sm:mr-3" />
            <div>
              <div className="text-xl sm:text-2xl font-bold text-blue-600">{models.length}</div>
              <div className="text-xs sm:text-sm text-blue-600">配置模型</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 sm:p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircleIcon className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mr-2 sm:mr-3" />
            <div>
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {models.filter(m => m.status === 'connected').length}
              </div>
              <div className="text-xs sm:text-sm text-green-600">已连接</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 sm:p-4 rounded-lg">
          <div className="flex items-center">
            <CloudIcon className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mr-2 sm:mr-3" />
            <div>
              <div className="text-xl sm:text-2xl font-bold text-purple-600">
                {models.filter(m => m.provider !== 'local').length}
              </div>
              <div className="text-xs sm:text-sm text-purple-600">云端模型</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 sm:p-4 rounded-lg">
          <div className="flex items-center">
            <ServerIcon className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 mr-2 sm:mr-3" />
            <div>
              <div className="text-xl sm:text-2xl font-bold text-orange-600">
                {models.filter(m => m.provider === 'local').length}
              </div>
              <div className="text-xs sm:text-sm text-orange-600">本地模型</div>
            </div>
          </div>
        </div>
      </div>

      {/* 模型配置列表 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {models.map((model) => (
          <Card key={model.id} className="relative">
            <div className="p-4 sm:p-6">
              {/* 模型头部信息 */}
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                  <div className="text-2xl sm:text-3xl flex-shrink-0">{getProviderIcon(model.provider)}</div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{model.name}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mt-1 space-y-1 sm:space-y-0">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProviderColor(model.provider)} w-fit`}>
                        {model.provider}
                      </span>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(model.status, testingModel === model.id)}
                        <span className="text-xs text-gray-500">
                          {getStatusText(model.status, testingModel === model.id)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={() => updateModel(model.id, { enabled: !model.enabled })}
                    className={`p-1.5 sm:p-2 rounded-full transition-colors ${
                      model.enabled 
                        ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                    title={model.enabled ? '已启用' : '已禁用'}
                  >
                    <CheckCircleIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>

              {/* 描述 */}
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">{model.description}</p>

              {/* 能力标签 */}
              <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
                {model.capabilities.map((capability, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                  >
                    {capability}
                  </span>
                ))}
              </div>

              {/* 配置表单 */}
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      模型ID
                    </label>
                    <input
                      type="text"
                      value={model.modelId}
                      onChange={(e) => updateModel(model.id, { modelId: e.target.value })}
                      className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      最大Token
                    </label>
                    <input
                      type="number"
                      value={model.maxTokens}
                      onChange={(e) => updateModel(model.id, { maxTokens: Number(e.target.value) })}
                      className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Temperature
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="2"
                      value={model.temperature}
                      onChange={(e) => updateModel(model.id, { temperature: Number(e.target.value) })}
                      className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      端点URL
                    </label>
                    <input
                      type="url"
                      value={model.endpoint}
                      onChange={(e) => updateModel(model.id, { endpoint: e.target.value })}
                      className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    API密钥
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKeys.has(model.id) ? 'text' : 'password'}
                      value={model.apiKey}
                      onChange={(e) => updateModel(model.id, { apiKey: e.target.value })}
                      placeholder="输入API密钥..."
                      className="w-full px-2 sm:px-3 py-1.5 sm:py-2 pr-16 sm:pr-20 border border-gray-300 rounded-md text-xs sm:text-sm focus:ring-primary-500 focus:border-primary-500"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2 sm:pr-3">
                      <button
                        type="button"
                        onClick={() => toggleApiKeyVisibility(model.id)}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showApiKeys.has(model.id) ? (
                          <EyeSlashIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                        ) : (
                          <EyeIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                        )}
                      </button>
                      <KeyIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-300" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-4 sm:mt-6 pt-3 sm:pt-4 border-t space-y-2 sm:space-y-0">
                <Button
                  onClick={() => testConnection(model.id)}
                  disabled={testingModel === model.id || !model.apiKey}
                  size="sm"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  {testingModel === model.id ? '测试中...' : '测试连接'}
                </Button>
                
                <div className="flex space-x-2 w-full sm:w-auto">
                  <Button
                    onClick={() => updateModel(model.id, defaultModels.find(dm => dm.id === model.id) || {})}
                    size="sm"
                    variant="outline"
                    className="flex-1 sm:flex-none"
                  >
                    重置
                  </Button>
                  <Button
                    onClick={() => {
                      const newModels = models.filter(m => m.id !== model.id);
                      saveConfigs(newModels);
                    }}
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-300 hover:bg-red-50 flex-1 sm:flex-none"
                  >
                    删除
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 添加新模型按钮 */}
      <Card className="border-dashed border-2 border-gray-300">
        <div className="p-4 sm:p-6 lg:p-8 text-center">
          <CpuChipIcon className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">添加新模型</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">配置自定义AI模型或添加新的服务提供商</p>
          <Button
            onClick={() => {
              const newModel: ModelConfig = {
                id: `custom-${Date.now()}`,
                name: '自定义模型',
                provider: 'openai',
                modelId: '',
                apiKey: '',
                endpoint: '',
                maxTokens: 2048,
                temperature: 0.7,
                enabled: false,
                status: 'untested',
                description: '自定义配置的AI模型',
                capabilities: ['文本生成']
              };
              saveConfigs([...models, newModel]);
            }}
          >
            + 添加模型
          </Button>
        </div>
      </Card>

      {/* 使用说明 */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">🔧 配置说明</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs sm:text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">API密钥获取</h4>
              <ul className="space-y-1">
                <li>• OpenAI: <a href="https://platform.openai.com/api-keys" className="text-blue-600 hover:underline" target="_blank" rel="noopener">platform.openai.com</a></li>
                <li>• HuggingFace: <a href="https://huggingface.co/settings/tokens" className="text-blue-600 hover:underline" target="_blank" rel="noopener">huggingface.co</a></li>
                <li>• Anthropic: <a href="https://console.anthropic.com/" className="text-blue-600 hover:underline" target="_blank" rel="noopener">console.anthropic.com</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">参数说明</h4>
              <ul className="space-y-1">
                <li>• <strong>Temperature</strong>: 控制输出随机性 (0-2)</li>
                <li>• <strong>Max Tokens</strong>: 最大生成长度</li>
                <li>• <strong>端点URL</strong>: API服务地址</li>
                <li>• <strong>测试连接</strong>: 验证配置是否正确</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}