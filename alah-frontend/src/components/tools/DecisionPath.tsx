'use client';

import { useEffect, useState } from 'react';
import { 
  ChevronRightIcon, 
  CheckCircleIcon, 
  ClockIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline';

interface DecisionPathProps {
  text: string;
  isLoading: boolean;
}

interface DecisionStep {
  id: number;
  step_type: 'input' | 'processing' | 'attention' | 'decision' | 'output';
  title: string;
  description: string;
  details: string[];
  confidence: number;
  processing_time: number;
  layer_info?: {
    layer: number;
    operation: string;
    input_shape: string;
    output_shape: string;
  };
  attention_weights?: {
    source: string;
    target: string;
    weight: number;
  }[];
  alternatives?: {
    option: string;
    probability: number;
    reason: string;
  }[];
}

const stepTypeConfig = {
  input: {
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    icon: InformationCircleIcon,
    label: '输入处理'
  },
  processing: {
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    icon: ClockIcon,
    label: '模型处理'
  },
  attention: {
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    icon: CheckCircleIcon,
    label: '注意力计算'
  },
  decision: {
    color: 'bg-yellow-500',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    icon: ExclamationTriangleIcon,
    label: '决策推理'
  },
  output: {
    color: 'bg-red-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    icon: CheckCircleIcon,
    label: '输出生成'
  }
};

export function DecisionPath({ text, isLoading }: DecisionPathProps) {
  const [decisionSteps, setDecisionSteps] = useState<DecisionStep[]>([]);
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayStep, setCurrentPlayStep] = useState(0);

  // 模拟生成决策路径数据
  useEffect(() => {
    if (!text || isLoading) return;

    const steps: DecisionStep[] = [
      {
        id: 1,
        step_type: 'input',
        title: '文本输入与预处理',
        description: '接收输入文本并进行初始化处理',
        details: [
          '文本长度校验与截断',
          '特殊字符过滤',
          '编码转换为模型可接受格式',
          '添加特殊标记 [CLS], [SEP]'
        ],
        confidence: 1.0,
        processing_time: 5,
        layer_info: {
          layer: 0,
          operation: 'Tokenization',
          input_shape: `[1, ${text.length}]`,
          output_shape: `[1, ${Math.min(text.length, 512)}]`
        }
      },
      {
        id: 2,
        step_type: 'processing',
        title: 'Embedding层处理',
        description: '将Token转换为高维向量表示',
        details: [
          '词嵌入查找 (Word Embedding)',
          '位置编码添加 (Position Encoding)',
          '向量维度规范化',
          'Dropout随机失活'
        ],
        confidence: 0.95,
        processing_time: 12,
        layer_info: {
          layer: 1,
          operation: 'Embedding + Position',
          input_shape: `[1, ${Math.min(text.length, 512)}]`,
          output_shape: `[1, ${Math.min(text.length, 512)}, 768]`
        }
      },
      {
        id: 3,
        step_type: 'attention',
        title: '多头自注意力计算',
        description: '计算Token间的注意力关系',
        details: [
          '生成Query, Key, Value矩阵',
          '计算注意力分数',
          '应用Softmax归一化',
          '加权求和得到上下文表示'
        ],
        confidence: 0.88,
        processing_time: 25,
        layer_info: {
          layer: 2,
          operation: 'Multi-Head Attention',
          input_shape: `[1, ${Math.min(text.length, 512)}, 768]`,
          output_shape: `[1, ${Math.min(text.length, 512)}, 768]`
        },
        attention_weights: text.split('').slice(0, 5).map((char, i) => ({
          source: char,
          target: text.split('')[Math.min(i + 1, text.length - 1)] || char,
          weight: 0.3 + Math.random() * 0.7
        }))
      },
      {
        id: 4,
        step_type: 'processing',
        title: 'Feed-Forward网络',
        description: '通过前馈网络进行特征变换',
        details: [
          '第一个线性变换 (768 → 3072)',
          'GELU激活函数',
          '第二个线性变换 (3072 → 768)',
          'Residual连接与Layer Norm'
        ],
        confidence: 0.92,
        processing_time: 18,
        layer_info: {
          layer: 3,
          operation: 'Feed Forward Network',
          input_shape: `[1, ${Math.min(text.length, 512)}, 768]`,
          output_shape: `[1, ${Math.min(text.length, 512)}, 768]`
        }
      },
      {
        id: 5,
        step_type: 'decision',
        title: '语义理解与推理',
        description: '基于上下文进行语义推理和决策',
        details: [
          '上下文语义融合',
          '关键信息提取',
          '逻辑推理链构建',
          '答案候选生成'
        ],
        confidence: 0.76,
        processing_time: 35,
        alternatives: [
          {
            option: '直接回答问题',
            probability: 0.76,
            reason: '问题明确，上下文充分'
          },
          {
            option: '请求更多信息',
            probability: 0.18,
            reason: '问题存在歧义'
          },
          {
            option: '拒绝回答',
            probability: 0.06,
            reason: '超出知识范围'
          }
        ]
      },
      {
        id: 6,
        step_type: 'output',
        title: '结果生成与输出',
        description: '生成最终的回答文本',
        details: [
          '选择最优回答策略',
          '文本生成与润色',
          '格式化输出',
          '置信度评估'
        ],
        confidence: 0.84,
        processing_time: 22,
        layer_info: {
          layer: -1,
          operation: 'Output Generation',
          input_shape: '[1, 768]',
          output_shape: '[1, vocab_size]'
        }
      }
    ];

    setDecisionSteps(steps);
  }, [text, isLoading]);

  // 自动播放功能
  useEffect(() => {
    if (!isPlaying || currentPlayStep >= decisionSteps.length) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentPlayStep(currentPlayStep + 1);
    }, 2000 / playbackSpeed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentPlayStep, decisionSteps.length, playbackSpeed]);

  const startPlayback = () => {
    setCurrentPlayStep(0);
    setIsPlaying(true);
    setSelectedStep(null);
  };

  const stopPlayback = () => {
    setIsPlaying(false);
  };

  const getStepStatus = (stepIndex: number) => {
    if (isPlaying) {
      if (stepIndex < currentPlayStep) return 'completed';
      if (stepIndex === currentPlayStep) return 'current';
      return 'pending';
    }
    return selectedStep === stepIndex ? 'selected' : 'default';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">正在追踪模型决策路径...</p>
        </div>
      </div>
    );
  }

  if (decisionSteps.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">请输入文本并点击"开始分析"以查看决策路径</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 控制面板 */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-lg border">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={isPlaying ? stopPlayback : startPlayback}
              className={`px-6 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
                isPlaying
                  ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg'
                  : 'bg-gradient-to-r from-primary-500 to-blue-600 text-white hover:from-primary-600 hover:to-blue-700 shadow-lg'
              }`}
            >
              {isPlaying ? '⏹️ 停止播放' : '▶️ 开始播放'}
            </button>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">⚡ 播放速度:</span>
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-primary-500 focus:border-primary-500"
                disabled={isPlaying}
              >
                <option value={0.5}>🐌 0.5x (慢速)</option>
                <option value={1}>🚶 1x (正常)</option>
                <option value={1.5}>🏃 1.5x (快速)</option>
                <option value={2}>🚀 2x (极速)</option>
              </select>
            </div>

            {isPlaying && (
              <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-700 font-medium">播放中...</span>
              </div>
            )}
          </div>

          <div className="bg-white px-4 py-2 rounded-lg">
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div className="text-center">
                <div className="font-bold text-lg text-blue-600">
                  {decisionSteps.reduce((sum, step) => sum + step.processing_time, 0)}ms
                </div>
                <div className="text-gray-600">总处理时间</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-purple-600">
                  {decisionSteps.length}
                </div>
                <div className="text-gray-600">处理步骤</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 步骤预览 */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 mr-2">步骤预览:</span>
          {decisionSteps.map((step, index) => {
            const config = stepTypeConfig[step.step_type];
            const status = getStepStatus(index);
            return (
              <button
                key={step.id}
                onClick={() => {
                  setSelectedStep(selectedStep === index ? null : index);
                  setIsPlaying(false);
                }}
                className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                  status === 'completed' ? 'bg-green-500 text-white border-green-500' :
                  status === 'current' ? 'bg-yellow-500 text-white border-yellow-500' :
                  status === 'selected' ? 'bg-primary-500 text-white border-primary-500' :
                  'bg-white text-gray-600 border-gray-300 hover:border-primary-300'
                }`}
                title={step.title}
              >
                {index + 1}. {config.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 决策步骤时间线 */}
      <div className="relative">
        {/* 时间线 */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>

        <div className="space-y-6">
          {decisionSteps.map((step, index) => {
            const config = stepTypeConfig[step.step_type];
            const IconComponent = config.icon;
            const status = getStepStatus(index);

            return (
              <div
                key={step.id}
                className={`relative flex items-start transition-all duration-300 ${
                  status === 'selected' ? 'transform scale-105' : ''
                }`}
              >
                {/* 步骤图标 */}
                <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 ${
                  status === 'completed' ? 'bg-green-500 border-green-500' :
                  status === 'current' ? 'bg-yellow-500 border-yellow-500 animate-pulse' :
                  status === 'selected' ? 'bg-primary-500 border-primary-500' :
                  'bg-white border-gray-300'
                }`}>
                  <IconComponent className={`h-8 w-8 ${
                    status === 'completed' || status === 'current' || status === 'selected'
                      ? 'text-white'
                      : 'text-gray-400'
                  }`} />
                </div>

                {/* 步骤内容 */}
                <div className="flex-1 ml-6">
                  <button
                    onClick={() => setSelectedStep(selectedStep === index ? null : index)}
                    className={`w-full text-left p-6 rounded-lg border transition-all duration-200 ${
                      status === 'selected'
                        ? 'border-primary-300 bg-primary-50 shadow-md'
                        : status === 'current'
                        ? 'border-yellow-300 bg-yellow-50 shadow-md'
                        : status === 'completed'
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center mb-1">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${config.bgColor} ${config.textColor} mr-3`}>
                            {config.label}
                          </span>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">
                            {(step.confidence * 100).toFixed(0)}%
                          </div>
                          <div className="text-gray-500">置信度</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">
                            {step.processing_time}ms
                          </div>
                          <div className="text-gray-500">处理时间</div>
                        </div>
                        <ChevronRightIcon className={`h-5 w-5 text-gray-400 transition-transform ${
                          selectedStep === index ? 'rotate-90' : ''
                        }`} />
                      </div>
                    </div>

                    {/* 置信度进度条 */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          step.confidence > 0.8 ? 'bg-green-500' :
                          step.confidence > 0.6 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${step.confidence * 100}%` }}
                      ></div>
                    </div>
                  </button>

                  {/* 详细信息展开 */}
                  {selectedStep === index && (
                    <div className="mt-4 p-6 bg-white border rounded-lg shadow-sm">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* 处理详情 */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">处理详情</h4>
                          <ul className="space-y-2">
                            {step.details.map((detail, i) => (
                              <li key={i} className="flex items-start text-sm">
                                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* 技术信息 */}
                        <div>
                          {step.layer_info && (
                            <div className="mb-4">
                              <h4 className="font-medium text-gray-900 mb-3">层级信息</h4>
                              <div className="bg-gray-50 rounded p-3 text-sm space-y-1">
                                <div><strong>层级:</strong> {step.layer_info.layer}</div>
                                <div><strong>操作:</strong> {step.layer_info.operation}</div>
                                <div><strong>输入维度:</strong> {step.layer_info.input_shape}</div>
                                <div><strong>输出维度:</strong> {step.layer_info.output_shape}</div>
                              </div>
                            </div>
                          )}

                          {step.attention_weights && (
                            <div className="mb-4">
                              <h4 className="font-medium text-gray-900 mb-3">注意力权重</h4>
                              <div className="space-y-2">
                                {step.attention_weights.map((att, i) => (
                                  <div key={i} className="flex items-center text-sm">
                                    <span className="w-8">{att.source}</span>
                                    <ChevronRightIcon className="h-4 w-4 mx-2 text-gray-400" />
                                    <span className="w-8">{att.target}</span>
                                    <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                                      <div
                                        className="bg-primary-500 h-2 rounded-full"
                                        style={{ width: `${att.weight * 100}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-xs">{(att.weight * 100).toFixed(0)}%</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {step.alternatives && (
                            <div>
                              <h4 className="font-medium text-gray-900 mb-3">决策选项</h4>
                              <div className="space-y-2">
                                {step.alternatives.map((alt, i) => (
                                  <div key={i} className="bg-gray-50 rounded p-3">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="font-medium text-sm">{alt.option}</span>
                                      <span className="text-sm font-bold text-primary-600">
                                        {(alt.probability * 100).toFixed(1)}%
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-600">{alt.reason}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 播放进度指示器 */}
      {isPlaying && (
        <div className="fixed bottom-4 right-4 bg-white border shadow-lg rounded-lg p-4">
          <div className="text-sm font-medium text-gray-900 mb-2">
            决策播放进度
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentPlayStep / decisionSteps.length) * 100}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-600">
              {currentPlayStep}/{decisionSteps.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}