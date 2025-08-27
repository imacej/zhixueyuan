import {
  AIModelConfig,
  AttentionAnalysisRequest,
  AttentionAnalysisResponse,
  HallucinationDetectionRequest,
  HallucinationDetectionResponse,
  TextGenerationRequest,
  TextGenerationResponse,
  DecisionPathRequest,
  DecisionPathResponse,
  APIError,
} from '@/types/api';

class AIService {
  private defaultConfig: AIModelConfig = {
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    modelId: 'gpt-3.5-turbo',
    maxTokens: 1000,
    temperature: 0.7,
  };

  private async makeRequest<T>(
    endpoint: string,
    data: any,
    config?: AIModelConfig
  ): Promise<T> {
    const modelConfig = config || this.defaultConfig;
    
    try {
      const response = await fetch(`/api/ai/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          modelConfig,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new APIError(error.code || 'API_ERROR', error.message || '请求失败');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError('NETWORK_ERROR', '网络请求失败');
    }
  }

  // 注意力分析
  async analyzeAttention(request: AttentionAnalysisRequest): Promise<AttentionAnalysisResponse> {
    return this.makeRequest<AttentionAnalysisResponse>('attention', request, request.modelConfig);
  }

  // 幻觉检测
  async detectHallucination(request: HallucinationDetectionRequest): Promise<HallucinationDetectionResponse> {
    return this.makeRequest<HallucinationDetectionResponse>('hallucination', request, request.modelConfig);
  }

  // 文本生成
  async generateText(request: TextGenerationRequest): Promise<TextGenerationResponse> {
    return this.makeRequest<TextGenerationResponse>('generate', request, request.modelConfig);
  }

  // 决策路径分析
  async analyzeDecisionPath(request: DecisionPathRequest): Promise<DecisionPathResponse> {
    return this.makeRequest<DecisionPathResponse>('decision-path', request, request.modelConfig);
  }

  // 模型健康检查
  async healthCheck(): Promise<{ status: string; models: string[] }> {
    try {
      const response = await fetch('/api/ai/health');
      return await response.json();
    } catch (error) {
      throw new APIError('HEALTH_CHECK_FAILED', '无法连接到AI服务');
    }
  }

  // 获取可用模型列表
  async getAvailableModels(): Promise<AIModelConfig[]> {
    try {
      const response = await fetch('/api/ai/models');
      return await response.json();
    } catch (error) {
      throw new APIError('MODELS_FETCH_FAILED', '无法获取模型列表');
    }
  }
}

// 单例实例
export const aiService = new AIService();

// 工具函数：生成模拟数据（当API不可用时的后备方案）
export const generateMockAttentionData = (text: string): AttentionAnalysisResponse => {
  const tokens = text.split('').filter(char => char.trim()).slice(0, 20);
  const layers = 12;
  const heads = 12;
  
  // 生成模拟注意力权重
  const attention = Array.from({ length: layers }, () =>
    Array.from({ length: heads }, () => {
      const matrix: number[][] = [];
      for (let i = 0; i < tokens.length; i++) {
        matrix[i] = [];
        for (let j = 0; j < tokens.length; j++) {
          const distance = Math.abs(i - j);
          const baseAttention = Math.exp(-distance / 4);
          const noise = (Math.random() - 0.5) * 0.3;
          matrix[i][j] = Math.max(0, Math.min(1, baseAttention + noise));
        }
        // 归一化
        const sum = matrix[i].reduce((a, b) => a + b, 0);
        for (let j = 0; j < tokens.length; j++) {
          matrix[i][j] = matrix[i][j] / sum;
        }
      }
      return matrix;
    })
  );

  return {
    tokens,
    attention,
    layers,
    heads,
    tokenizer_info: {
      vocab_size: 50257,
      model_max_length: 1024,
    },
    processing_time: 150 + Math.random() * 100,
  };
};

export const generateMockHallucinationDetection = (text: string): HallucinationDetectionResponse => {
  // 简单的规则检测一些常见的幻觉模式
  const issues: HallucinationDetectionResponse['detected_issues'] = [];
  
  // 检测明显的事实错误
  if (text.includes('中国首都是上海') || text.includes('北京是上海')) {
    issues.push({
      type: 'factual',
      severity: 'high',
      description: '地理事实错误：混淆了中国的首都和经济中心',
      location: { start: 0, end: text.length },
      suggestion: '中国的首都是北京，上海是经济中心',
    });
  }

  // 检测逻辑矛盾
  if (text.includes('所有') && text.includes('但是')) {
    issues.push({
      type: 'logical',
      severity: 'medium',
      description: '逻辑矛盾：存在绝对化表述后的例外情况',
      location: { start: 0, end: text.length },
      suggestion: '避免使用绝对化的表述，或者明确例外情况',
    });
  }

  // 检测前后不一致
  const sentences = text.split(/[。！？.!?]/);
  if (sentences.length > 1) {
    for (let i = 0; i < sentences.length - 1; i++) {
      if (sentences[i].includes('围绕') && sentences[i + 1].includes('围绕')) {
        if ((sentences[i].includes('太阳围绕地球') && sentences[i + 1].includes('地球围绕太阳')) ||
            (sentences[i].includes('地球围绕太阳') && sentences[i + 1].includes('太阳围绕地球'))) {
          issues.push({
            type: 'consistency',
            severity: 'high',
            description: '前后不一致：关于天体运动的描述相互矛盾',
            location: { start: 0, end: text.length },
            suggestion: '确保整段文本中对同一概念的描述保持一致',
          });
        }
      }
    }
  }

  const hasHallucination = issues.length > 0;
  const confidence = hasHallucination ? 0.85 + Math.random() * 0.1 : 0.15 + Math.random() * 0.2;

  return {
    text,
    has_hallucination: hasHallucination,
    confidence,
    detected_issues: issues,
    explanation: hasHallucination 
      ? `检测到 ${issues.length} 个潜在问题。${issues.map(i => i.description).join('；')}。`
      : '文本看起来没有明显的事实错误、逻辑矛盾或前后不一致的问题。',
    processing_time: 200 + Math.random() * 150,
  };
};