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
} from '@/types/api';

interface RequestOptions {
  timeout?: number;
  retries?: number;
  fallbackToMock?: boolean;
}

interface APIError {
  code: string;
  message: string;
  details?: any;
}

class EnhancedAIService {
  private defaultConfig: AIModelConfig = {
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    modelId: 'gpt-3.5-turbo',
    maxTokens: 1000,
    temperature: 0.7,
  };

  private requestQueue = new Map<string, Promise<any>>();
  private rateLimiter = new Map<string, number>();
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  // 获取用户配置的模型
  private getActiveModels(): AIModelConfig[] {
    try {
      const saved = localStorage.getItem('alah_model_configs');
      if (saved) {
        const models = JSON.parse(saved);
        return models.filter((m: any) => m.enabled && m.status === 'connected');
      }
    } catch (error) {
      console.warn('Failed to load model configurations:', error);
    }
    return [this.defaultConfig];
  }

  // 选择最佳模型
  private selectBestModel(capability?: string): AIModelConfig {
    const activeModels = this.getActiveModels();
    
    if (activeModels.length === 0) {
      return this.defaultConfig;
    }

    // 根据能力选择模型
    if (capability) {
      const capableModels = activeModels.filter(m => 
        m.capabilities?.includes(capability) || m.provider === 'openai'
      );
      if (capableModels.length > 0) {
        return capableModels[0];
      }
    }

    return activeModels[0];
  }

  // 速率限制检查
  private checkRateLimit(endpoint: string): boolean {
    const key = `rate_limit_${endpoint}`;
    const lastRequest = this.rateLimiter.get(key) || 0;
    const now = Date.now();
    
    if (now - lastRequest < 1000) { // 1秒限制
      return false;
    }
    
    this.rateLimiter.set(key, now);
    return true;
  }

  // 缓存管理
  private getCacheKey(endpoint: string, data: any): string {
    return `cache_${endpoint}_${JSON.stringify(data)}`;
  }

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    if (cached) {
      this.cache.delete(key);
    }
    return null;
  }

  private setCache(key: string, data: any, ttl: number = 300000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  // 请求去重
  private getRequestKey(endpoint: string, data: any): string {
    return `${endpoint}_${JSON.stringify(data)}`;
  }

  private async makeRequest<T>(
    endpoint: string,
    data: any,
    config?: AIModelConfig,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      timeout = 30000,
      retries = 2,
      fallbackToMock = true
    } = options;

    const modelConfig = config || this.selectBestModel();
    const requestKey = this.getRequestKey(endpoint, data);
    const cacheKey = this.getCacheKey(endpoint, data);
    
    // 检查缓存
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    // 检查是否有相同的请求正在进行
    if (this.requestQueue.has(requestKey)) {
      return this.requestQueue.get(requestKey);
    }

    // 速率限制检查
    if (!this.checkRateLimit(endpoint)) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const requestPromise = this._executeRequest<T>(
      endpoint, 
      data, 
      modelConfig, 
      timeout, 
      retries, 
      fallbackToMock
    );

    this.requestQueue.set(requestKey, requestPromise);

    try {
      const result = await requestPromise;
      
      // 缓存成功的结果
      this.setCache(cacheKey, result);
      
      return result;
    } finally {
      this.requestQueue.delete(requestKey);
    }
  }

  private async _executeRequest<T>(
    endpoint: string,
    data: any,
    modelConfig: AIModelConfig,
    timeout: number,
    retries: number,
    fallbackToMock: boolean
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(`/api/ai/${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            modelConfig,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `HTTP ${response.status}: ${response.statusText}`
          );
        }

        return await response.json();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        // 记录错误
        console.warn(`AI API attempt ${attempt + 1} failed for ${endpoint}:`, lastError.message);
        
        // 如果是最后一次尝试且启用了mock fallback
        if (attempt === retries && fallbackToMock) {
          console.warn(`AI API failed after ${retries + 1} attempts, falling back to mock data for ${endpoint}`);
          return this.generateMockResponse<T>(endpoint, data);
        }
        
        // 如果不是最后一次尝试，等待后重试
        if (attempt < retries) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // 如果所有重试都失败了
    throw lastError || new Error('Request failed after all retries');
  }

  // 生成模拟数据的方法
  private generateMockResponse<T>(endpoint: string, data: any): T {
    switch (endpoint) {
      case 'attention':
        return this.generateMockAttentionData(data.text) as T;
      case 'hallucination':
        return this.generateMockHallucinationData(data.text) as T;
      case 'generate':
        return this.generateMockTextGeneration(data.prompt) as T;
      case 'decision-path':
        return this.generateMockDecisionPath(data.text) as T;
      default:
        throw new Error(`No mock data generator for endpoint: ${endpoint}`);
    }
  }

  private generateMockAttentionData(text: string): AttentionAnalysisResponse {
    const tokens = text.split('').filter(char => char.trim()).slice(0, 20);
    const tokenCount = tokens.length;
    const layers = 12;
    const heads = 12;
    
    // 生成3D注意力矩阵 [layer][head][token_i][token_j]
    const attention: number[][][] = [];
    
    for (let layer = 0; layer < layers; layer++) {
      attention[layer] = [];
      for (let head = 0; head < heads; head++) {
        attention[layer][head] = [];
        for (let i = 0; i < tokenCount; i++) {
          attention[layer][head][i] = [];
          for (let j = 0; j < tokenCount; j++) {
            let weight = 0;
            if (i === j) {
              weight = 0.7 + Math.random() * 0.3;
            } else {
              const distance = Math.abs(i - j);
              const decay = Math.exp(-distance / 3);
              weight = decay * (0.1 + Math.random() * 0.4);
            }
            
            // 添加层和头的变化
            const layerEffect = Math.sin(layer * 0.5) * 0.2;
            const headEffect = Math.cos(head * 0.3) * 0.15;
            weight = Math.max(0, Math.min(1, weight + layerEffect + headEffect));
            
            attention[layer][head][i][j] = weight;
          }
          
          // 归一化每行
          const sum = attention[layer][head][i].reduce((a, b) => a + b, 0);
          if (sum > 0) {
            for (let j = 0; j < tokenCount; j++) {
              attention[layer][head][i][j] /= sum;
            }
          }
        }
      }
    }

    return {
      tokens,
      attention,
      layers,
      heads,
      tokenizer_info: {
        vocab_size: 50257,
        model_max_length: 2048
      },
      processing_time: 150 + Math.random() * 100
    };
  }

  private generateMockHallucinationData(text: string): HallucinationDetectionResponse {
    const hasHallucination = Math.random() > 0.6;
    const confidence = 0.6 + Math.random() * 0.4;
    
    const issues = hasHallucination ? [
      {
        type: 'factual' as const,
        severity: 'medium' as const,
        description: '检测到可能的事实性错误',
        location: { start: Math.floor(text.length * 0.2), end: Math.floor(text.length * 0.4) },
        suggestion: '建议验证相关事实信息'
      }
    ] : [];

    return {
      text,
      has_hallucination: hasHallucination,
      confidence,
      detected_issues: issues,
      explanation: hasHallucination 
        ? '文本中包含一些需要进一步验证的信息'
        : '文本内容看起来是准确和一致的',
      processing_time: 200 + Math.random() * 150
    };
  }

  private generateMockTextGeneration(prompt: string): TextGenerationResponse {
    const responses = [
      '这是一个模拟的AI回复。在实际应用中，这里会是真实的AI模型生成的内容。',
      '基于您的问题，我可以提供以下信息和建议...',
      '这个问题很有趣。让我为您详细分析一下相关的方面。',
    ];
    
    return {
      text: responses[Math.floor(Math.random() * responses.length)],
      usage: {
        prompt_tokens: Math.floor(prompt.length / 4),
        completion_tokens: 50 + Math.floor(Math.random() * 100),
        total_tokens: Math.floor(prompt.length / 4) + 75
      },
      model: 'mock-gpt-3.5-turbo',
      processing_time: 300 + Math.random() * 200
    };
  }

  private generateMockDecisionPath(text: string): DecisionPathResponse {
    const steps = [
      {
        step_id: 1,
        step_type: 'input' as const,
        layer: 0,
        description: '输入处理和Token化',
        input_shape: [1, text.length],
        output_shape: [1, Math.min(text.length, 512)],
        processing_time: 5,
        confidence: 1.0
      },
      {
        step_id: 2,
        step_type: 'attention' as const,
        layer: 1,
        description: '自注意力计算',
        input_shape: [1, 512, 768],
        output_shape: [1, 512, 768],
        processing_time: 25,
        confidence: 0.95,
        attention_weights: [
          { source: 0, target: 1, weight: 0.8 },
          { source: 1, target: 2, weight: 0.6 }
        ]
      }
    ];

    return {
      steps,
      total_processing_time: steps.reduce((sum, step) => sum + step.processing_time, 0),
      final_output: '模拟的模型输出结果',
      model_info: {
        name: 'Mock Transformer',
        layers: 12,
        heads: 12,
        hidden_size: 768
      }
    };
  }

  // 公共API方法
  async analyzeAttention(request: AttentionAnalysisRequest, options?: RequestOptions): Promise<AttentionAnalysisResponse> {
    return this.makeRequest<AttentionAnalysisResponse>('attention', request, request.modelConfig, options);
  }

  async detectHallucination(request: HallucinationDetectionRequest, options?: RequestOptions): Promise<HallucinationDetectionResponse> {
    return this.makeRequest<HallucinationDetectionResponse>('hallucination', request, request.modelConfig, options);
  }

  async generateText(request: TextGenerationRequest, options?: RequestOptions): Promise<TextGenerationResponse> {
    return this.makeRequest<TextGenerationResponse>('generate', request, request.modelConfig, options);
  }

  async analyzeDecisionPath(request: DecisionPathRequest, options?: RequestOptions): Promise<DecisionPathResponse> {
    return this.makeRequest<DecisionPathResponse>('decision-path', request, request.modelConfig, options);
  }

  // 批量处理
  async batchProcess<T>(
    endpoint: string,
    requests: any[],
    config?: AIModelConfig,
    options?: RequestOptions
  ): Promise<T[]> {
    const batchSize = 5; // 限制并发数
    const results: T[] = [];

    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(request => this.makeRequest<T>(endpoint, request, config, options))
      );
      results.push(...batchResults);
    }

    return results;
  }

  // 健康检查
  async healthCheck(): Promise<{ status: string; models: string[]; latency: number }> {
    const start = Date.now();
    
    try {
      const response = await fetch('/api/ai/health', {
        method: 'GET',
        timeout: 5000
      } as any);
      
      const latency = Date.now() - start;
      
      if (!response.ok) {
        return {
          status: 'unhealthy',
          models: [],
          latency
        };
      }
      
      const data = await response.json();
      return {
        ...data,
        latency
      };
    } catch (error) {
      return {
        status: 'error',
        models: [],
        latency: Date.now() - start
      };
    }
  }

  // 清除缓存
  clearCache(): void {
    this.cache.clear();
  }

  // 获取统计信息
  getStats(): {
    cacheSize: number;
    activeRequests: number;
    rateLimitEntries: number;
  } {
    return {
      cacheSize: this.cache.size,
      activeRequests: this.requestQueue.size,
      rateLimitEntries: this.rateLimiter.size
    };
  }
}

// 导出单例实例
export const enhancedAIService = new EnhancedAIService();
export default enhancedAIService;