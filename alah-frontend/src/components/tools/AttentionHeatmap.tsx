'use client';

import { useEffect, useRef, useState } from 'react';

interface AttentionHeatmapProps {
  text: string;
  isLoading: boolean;
}

interface AttentionData {
  tokens: string[];
  attention: number[][];
  layers: number;
  heads: number;
}

export function AttentionHeatmap({ text, isLoading }: AttentionHeatmapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedLayer, setSelectedLayer] = useState(0);
  const [selectedHead, setSelectedHead] = useState(0);
  const [attentionData, setAttentionData] = useState<AttentionData | null>(null);

  // 模拟生成注意力数据
  useEffect(() => {
    if (!text || isLoading) return;

    // 简单的分词处理
    const tokens = text.split('').filter(char => char.trim());
    const tokenCount = Math.min(tokens.length, 20); // 限制显示的token数量
    const displayTokens = tokens.slice(0, tokenCount);
    
    // 生成模拟的注意力矩阵
    const attention: number[][] = [];
    for (let i = 0; i < tokenCount; i++) {
      attention[i] = [];
      for (let j = 0; j < tokenCount; j++) {
        // 生成基于位置关系的注意力权重
        const distance = Math.abs(i - j);
        const baseAttention = Math.exp(-distance / 3);
        const noise = (Math.random() - 0.5) * 0.3;
        attention[i][j] = Math.max(0, Math.min(1, baseAttention + noise));
      }
    }

    setAttentionData({
      tokens: displayTokens,
      attention,
      layers: 12, // 模拟12层
      heads: 8,   // 每层8个头
    });
  }, [text, isLoading]);

  // 绘制热力图
  useEffect(() => {
    if (!attentionData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { tokens, attention } = attentionData;
    const size = tokens.length;
    const cellSize = Math.min(400 / size, 30);
    
    canvas.width = cellSize * size;
    canvas.height = cellSize * size;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制热力图
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const value = attention[i][j];
        const intensity = Math.floor(value * 255);
        
        // 使用蓝色到红色的渐变
        const red = intensity;
        const blue = 255 - intensity;
        const green = Math.floor(intensity * 0.5);
        
        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
        ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
        
        // 绘制边框
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
        
        // 在较大的单元格中显示数值
        if (cellSize > 20) {
          ctx.fillStyle = value > 0.5 ? '#ffffff' : '#000000';
          ctx.font = `${Math.floor(cellSize * 0.3)}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(
            value.toFixed(2),
            j * cellSize + cellSize / 2,
            i * cellSize + cellSize / 2
          );
        }
      }
    }
  }, [attentionData, selectedLayer, selectedHead]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">正在生成注意力热力图...</p>
        </div>
      </div>
    );
  }

  if (!attentionData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">请输入文本并点击"开始分析"以查看注意力热力图</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 控制面板 */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            层数 (Layer)
          </label>
          <select
            value={selectedLayer}
            onChange={(e) => setSelectedLayer(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
          >
            {Array.from({ length: attentionData.layers }, (_, i) => (
              <option key={i} value={i}>
                Layer {i + 1}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            注意力头 (Head)
          </label>
          <select
            value={selectedHead}
            onChange={(e) => setSelectedHead(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
          >
            {Array.from({ length: attentionData.heads }, (_, i) => (
              <option key={i} value={i}>
                Head {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <div className="text-sm text-gray-600">
            <div>当前配置: Layer {selectedLayer + 1}, Head {selectedHead + 1}</div>
            <div>Token数量: {attentionData.tokens.length}</div>
          </div>
        </div>
      </div>

      {/* 热力图和Token标签 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Y轴标签 (源Token) */}
        <div className="lg:order-2">
          <div className="space-y-1">
            <div className="text-sm font-medium text-gray-700 mb-2">源 Token</div>
            {attentionData.tokens.map((token, i) => (
              <div
                key={i}
                className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded text-center"
                style={{ height: `${Math.min(400 / attentionData.tokens.length, 30)}px` }}
              >
                {token}
              </div>
            ))}
          </div>
        </div>

        {/* 热力图 */}
        <div className="lg:order-3 lg:col-span-2">
          <div className="text-sm font-medium text-gray-700 mb-2 text-center">
            注意力权重热力图
          </div>
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              className="border border-gray-300 rounded"
              style={{ maxWidth: '400px', maxHeight: '400px' }}
            />
          </div>
        </div>

        {/* 图例 */}
        <div className="lg:order-4">
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">注意力强度</div>
              <div className="space-y-1">
                {[
                  { label: '高', color: 'bg-red-500', value: '0.8-1.0' },
                  { label: '中', color: 'bg-yellow-500', value: '0.4-0.8' },
                  { label: '低', color: 'bg-blue-500', value: '0.0-0.4' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center text-xs">
                    <div className={`w-4 h-4 ${item.color} rounded mr-2`}></div>
                    <span>{item.label} ({item.value})</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="text-sm text-gray-600">
                <p className="mb-1">💡 <strong>使用提示:</strong></p>
                <ul className="text-xs space-y-1">
                  <li>• 颜色越红表示注意力权重越高</li>
                  <li>• 对角线通常注意力较高</li>
                  <li>• 不同层和头关注不同模式</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* X轴标签 (目标Token) */}
        <div className="lg:order-1 lg:col-span-4">
          <div className="text-sm font-medium text-gray-700 mb-2">目标 Token</div>
          <div className="flex justify-center">
            <div className="flex space-x-1" style={{ maxWidth: '400px' }}>
              {attentionData.tokens.map((token, i) => (
                <div
                  key={i}
                  className="px-1 py-1 text-xs bg-green-100 text-green-800 rounded text-center transform rotate-45 origin-bottom-left"
                  style={{ 
                    width: `${Math.min(400 / attentionData.tokens.length, 30)}px`,
                    fontSize: '10px'
                  }}
                >
                  {token}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}