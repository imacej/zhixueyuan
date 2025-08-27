import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 在实际应用中，这里会检查各种AI服务的健康状态
    // 例如：OpenAI API连接、本地模型状态、数据库连接等
    
    const services = [
      {
        name: 'attention-analysis',
        status: 'healthy',
        latency: Math.floor(Math.random() * 100) + 50,
      },
      {
        name: 'hallucination-detection',
        status: 'healthy',
        latency: Math.floor(Math.random() * 150) + 100,
      },
      {
        name: 'text-generation',
        status: 'healthy',
        latency: Math.floor(Math.random() * 200) + 150,
      },
      {
        name: 'decision-path',
        status: 'healthy',
        latency: Math.floor(Math.random() * 120) + 80,
      },
    ];

    const overallStatus = services.every(service => service.status === 'healthy') 
      ? 'healthy' 
      : 'degraded';

    return NextResponse.json({
      status: overallStatus,
      timestamp: new Date().toISOString(),
      services,
      version: '1.0.0',
      uptime: process.uptime(),
      models: [
        'gpt-3.5-turbo',
        'gpt-4',
        'claude-3-sonnet',
        'llama-2-7b',
        'bert-base-uncased',
      ],
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: 'Health check failed',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}