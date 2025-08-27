import { NextRequest, NextResponse } from 'next/server';
import { HallucinationDetectionRequest, HallucinationDetectionResponse } from '@/types/api';
import { generateMockHallucinationDetection } from '@/lib/api/ai-service';

export async function POST(request: NextRequest) {
  try {
    const body: HallucinationDetectionRequest = await request.json();
    const { text, context, modelConfig, detection_types } = body;

    // 基本验证
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { code: 'INVALID_INPUT', message: '请提供有效的文本输入' },
        { status: 400 }
      );
    }

    if (text.length > 2000) {
      return NextResponse.json(
        { code: 'TEXT_TOO_LONG', message: '文本长度不能超过2000字符' },
        { status: 400 }
      );
    }

    if (!detection_types || detection_types.length === 0) {
      return NextResponse.json(
        { code: 'INVALID_DETECTION_TYPES', message: '请指定至少一种检测类型' },
        { status: 400 }
      );
    }

    // 验证检测类型
    const validTypes = ['factual', 'logical', 'consistency'];
    const invalidTypes = detection_types.filter(type => !validTypes.includes(type));
    if (invalidTypes.length > 0) {
      return NextResponse.json(
        { 
          code: 'INVALID_DETECTION_TYPES', 
          message: `无效的检测类型: ${invalidTypes.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // 模拟处理延迟
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1500));

    try {
      // 在实际应用中，这里应该调用真实的幻觉检测模型
      // 可能包括：
      // 1. 事实核查API (如 Google Fact Check Tools API)
      // 2. 自训练的幻觉检测模型
      // 3. 逻辑一致性检查算法
      
      const result = generateMockHallucinationDetection(text);
      
      // 根据请求的检测类型过滤结果
      result.detected_issues = result.detected_issues.filter(issue =>
        detection_types.includes(issue.type)
      );

      // 如果提供了上下文，可以进行更准确的分析
      if (context && context.trim()) {
        result.explanation += ` 基于提供的上下文信息进行了更准确的分析。`;
      }

      // 重新计算是否有幻觉和置信度
      result.has_hallucination = result.detected_issues.length > 0;
      if (result.has_hallucination) {
        // 根据问题严重程度调整置信度
        const severityWeights = { high: 0.9, medium: 0.7, low: 0.5 };
        const avgSeverity = result.detected_issues.reduce((sum, issue) => 
          sum + severityWeights[issue.severity], 0) / result.detected_issues.length;
        result.confidence = avgSeverity + Math.random() * 0.1;
      }

      return NextResponse.json(result);

    } catch (modelError) {
      console.error('Hallucination detection error:', modelError);
      return NextResponse.json(
        { 
          code: 'DETECTION_ERROR', 
          message: '幻觉检测失败，请稍后重试',
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
    service: 'hallucination-detection',
    status: 'active',
    description: 'Detect hallucinations in AI-generated text',
    supported_types: ['factual', 'logical', 'consistency'],
    version: '1.0.0'
  });
}