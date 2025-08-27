import { NextRequest, NextResponse } from 'next/server';
import { AttentionAnalysisRequest, AttentionAnalysisResponse } from '@/types/api';
import { generateMockAttentionData } from '@/lib/api/ai-service';

export async function POST(request: NextRequest) {
  try {
    const body: AttentionAnalysisRequest = await request.json();
    const { text, modelConfig, options } = body;

    // 基本验证
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { code: 'INVALID_INPUT', message: '请提供有效的文本输入' },
        { status: 400 }
      );
    }

    if (text.length > 1000) {
      return NextResponse.json(
        { code: 'TEXT_TOO_LONG', message: '文本长度不能超过1000字符' },
        { status: 400 }
      );
    }

    // 模拟处理延迟
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    try {
      // 在实际应用中，这里应该调用真实的AI模型API
      // 例如：OpenAI API, Hugging Face API 等
      
      // 目前使用模拟数据
      const result = generateMockAttentionData(text);
      
      // 如果提供了options，可以据此过滤结果
      if (options?.includeLayers && options.includeLayers.length > 0) {
        result.attention = result.attention.filter((_, index) => 
          options.includeLayers!.includes(index)
        );
        result.layers = options.includeLayers.length;
      }

      if (options?.includeHeads && options.includeHeads.length > 0) {
        result.attention = result.attention.map(layer => 
          layer.filter((_, index) => options.includeHeads!.includes(index))
        );
        result.heads = options.includeHeads.length;
      }

      return NextResponse.json(result);

    } catch (modelError) {
      console.error('Model API error:', modelError);
      return NextResponse.json(
        { 
          code: 'MODEL_ERROR', 
          message: '模型分析失败，请稍后重试',
          details: process.env.NODE_ENV === 'development' ? modelError : undefined
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: '服务器内部错误' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'attention-analysis',
    status: 'active',
    description: 'Analyze attention patterns in AI models',
    version: '1.0.0'
  });
}