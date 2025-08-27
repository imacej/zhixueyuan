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

  // 调用API生成注意力数据
  useEffect(() => {
    if (!text || isLoading) return;

    const fetchAttentionData = async () => {
      try {
        const response = await fetch('/api/ai/attention', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            options: {
              includeLayers: selectedLayer !== undefined ? [selectedLayer] : undefined,
              includeHeads: selectedHead !== undefined ? [selectedHead] : undefined,
            },
          }),
        });

        if (!response.ok) {
          throw new Error('API request failed');
        }

        const apiData = await response.json();
        
        // 转换API数据格式为组件需要的格式
        const layerIndex = 0; // 使用第一层数据
        const headIndex = 0;  // 使用第一个头数据
        
        setAttentionData({
          tokens: apiData.tokens,
          attention: apiData.attention[layerIndex] ? apiData.attention[layerIndex][headIndex] : [],
          layers: apiData.layers,
          heads: apiData.heads,
        });
      } catch (error) {
        console.error('Failed to fetch attention data:', error);
        
        // 回退到模拟数据
        const tokens = text.split('').filter(char => char.trim()).slice(0, 24);
        const tokenCount = tokens.length;
        
        // 生成模拟注意力矩阵（简化版）
        const attention: number[][] = [];
        for (let i = 0; i < tokenCount; i++) {
          attention[i] = [];
          for (let j = 0; j < tokenCount; j++) {
            let weight = 0;
            if (i === j) {
              weight = 0.8 + Math.random() * 0.2;
            } else {
              const distance = Math.abs(i - j);
              const decay = Math.exp(-distance / 4);
              weight = decay * (0.2 + Math.random() * 0.3);
            }
            
            // 为不同的层和头添加变化
            const layerVariation = Math.sin(selectedLayer * 0.5) * 0.2;
            const headVariation = Math.cos(selectedHead * 0.3) * 0.15;
            weight = Math.max(0, Math.min(1, weight + layerVariation + headVariation));
            
            attention[i][j] = weight;
          }
          
          // 归一化
          const sum = attention[i].reduce((a, b) => a + b, 0);
          for (let j = 0; j < tokenCount; j++) {
            attention[i][j] = attention[i][j] / sum;
          }
        }

        setAttentionData({
          tokens,
          attention,
          layers: 12,
          heads: 12,
        });
      }
    };

    fetchAttentionData();
  }, [text, isLoading, selectedLayer, selectedHead]);

  // 绘制热力图
  useEffect(() => {
    if (!attentionData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { tokens, attention } = attentionData;
    const size = tokens.length;
    const cellSize = Math.min(500 / size, 25);
    
    canvas.width = cellSize * size;
    canvas.height = cellSize * size;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制热力图
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const value = attention[i][j];
        
        // 改进的颜色映射 - 使用更直观的蓝白红渐变
        let red, green, blue;
        if (value < 0.5) {
          // 低注意力：蓝色到白色
          const t = value * 2; // 0-1
          red = Math.floor(220 + (255 - 220) * t);
          green = Math.floor(240 + (255 - 240) * t);
          blue = 255;
        } else {
          // 高注意力：白色到红色
          const t = (value - 0.5) * 2; // 0-1
          red = 255;
          green = Math.floor(255 * (1 - t * 0.8));
          blue = Math.floor(255 * (1 - t * 0.8));
        }
        
        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
        ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
        
        // 绘制网格线
        ctx.strokeStyle = value > 0.7 ? '#ffffff40' : '#00000020';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
        
        // 在适当大小的单元格中显示数值
        if (cellSize > 18) {
          ctx.fillStyle = value > 0.6 ? '#ffffff' : '#333333';
          ctx.font = `${Math.max(8, Math.floor(cellSize * 0.35))}px Arial`;
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

    // 添加鼠标交互
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const col = Math.floor(x / cellSize);
      const row = Math.floor(y / cellSize);
      
      if (row >= 0 && row < size && col >= 0 && col < size) {
        const value = attention[row][col];
        canvas.title = `从 "${tokens[row]}" 到 "${tokens[col]}": ${(value * 100).toFixed(1)}%`;
        canvas.style.cursor = 'pointer';
      } else {
        canvas.title = '';
        canvas.style.cursor = 'default';
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    return () => canvas.removeEventListener('mousemove', handleMouseMove);
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
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-lg border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🏗️ 层数 (Layer)
            </label>
            <select
              value={selectedLayer}
              onChange={(e) => setSelectedLayer(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              {Array.from({ length: attentionData.layers }, (_, i) => (
                <option key={i} value={i}>
                  Layer {i + 1} {i < 3 ? '(浅层)' : i > 9 ? '(深层)' : '(中层)'}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🎯 注意力头 (Head)
            </label>
            <select
              value={selectedHead}
              onChange={(e) => setSelectedHead(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              {Array.from({ length: attentionData.heads }, (_, i) => (
                <option key={i} value={i}>
                  Head {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-1 md:col-span-2">
            <div className="bg-white p-4 rounded-md border">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">当前配置:</span>
                  <div className="font-medium text-primary-600">
                    Layer {selectedLayer + 1}, Head {selectedHead + 1}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Token数量:</span>
                  <div className="font-medium">{attentionData.tokens.length}</div>
                </div>
                <div>
                  <span className="text-gray-600">最大注意力:</span>
                  <div className="font-medium text-red-600">
                    {(Math.max(...attentionData.attention.flat()) * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">平均注意力:</span>
                  <div className="font-medium text-blue-600">
                    {(attentionData.attention.flat().reduce((a, b) => a + b, 0) / attentionData.attention.flat().length * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 快速切换按钮 */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 mr-2">快速切换:</span>
          {[0, 3, 6, 11].map(layer => (
            <button
              key={layer}
              onClick={() => setSelectedLayer(layer)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                selectedLayer === layer 
                  ? 'bg-primary-500 text-white border-primary-500' 
                  : 'bg-white text-gray-600 border-gray-300 hover:border-primary-300'
              }`}
            >
              L{layer + 1}
            </button>
          ))}
          <span className="mx-2 text-gray-300">|</span>
          {[0, 3, 6, 11].map(head => (
            <button
              key={head}
              onClick={() => setSelectedHead(head)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                selectedHead === head 
                  ? 'bg-green-500 text-white border-green-500' 
                  : 'bg-white text-gray-600 border-gray-300 hover:border-green-300'
              }`}
            >
              H{head + 1}
            </button>
          ))}
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

        {/* 图例和统计信息 */}
        <div className="lg:order-4">
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-sm font-medium text-gray-700 mb-3">注意力强度图例</div>
              <div className="space-y-2">
                {[
                  { label: '极高', color: 'bg-red-600', value: '0.8-1.0', desc: '强烈关注' },
                  { label: '高', color: 'bg-red-400', value: '0.6-0.8', desc: '重要关系' },
                  { label: '中', color: 'bg-yellow-400', value: '0.4-0.6', desc: '一般关注' },
                  { label: '低', color: 'bg-blue-400', value: '0.2-0.4', desc: '弱关系' },
                  { label: '极低', color: 'bg-blue-600', value: '0.0-0.2', desc: '几乎忽略' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center text-xs">
                    <div className={`w-4 h-4 ${item.color} rounded mr-3`}></div>
                    <div className="flex-1">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-gray-500 ml-1">({item.value})</span>
                      <div className="text-gray-400 text-xs">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg border">
              <div className="text-sm font-medium text-gray-700 mb-3">💡 解读指南</div>
              <div className="text-xs text-gray-600 space-y-2">
                <div className="flex items-start">
                  <span className="text-blue-500 mr-2">📊</span>
                  <span>热力图显示Token之间的注意力关系强度</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-2">🎯</span>
                  <span>对角线通常注意力较高(自注意力)</span>
                </div>
                <div className="flex items-start">
                  <span className="text-purple-500 mr-2">🔄</span>
                  <span>不同层捕获不同语义关系</span>
                </div>
                <div className="flex items-start">
                  <span className="text-orange-500 mr-2">🧠</span>
                  <span>浅层关注句法，深层关注语义</span>
                </div>
                <div className="flex items-start">
                  <span className="text-red-500 mr-2">🎪</span>
                  <span>鼠标悬停查看具体数值</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <div className="text-sm font-medium text-gray-700 mb-3">📈 统计信息</div>
              {attentionData && (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">最强注意力:</span>
                    <span className="font-mono font-medium">
                      {(Math.max(...attentionData.attention.flat()) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">最弱注意力:</span>
                    <span className="font-mono font-medium">
                      {(Math.min(...attentionData.attention.flat()) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">注意力分布标准差:</span>
                    <span className="font-mono font-medium">
                      {(() => {
                        const values = attentionData.attention.flat();
                        const mean = values.reduce((a, b) => a + b, 0) / values.length;
                        const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
                        return Math.sqrt(variance).toFixed(3);
                      })()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">高注意力Token对:</span>
                    <span className="font-mono font-medium">
                      {attentionData.attention.flat().filter(v => v > 0.7).length}
                    </span>
                  </div>
                </div>
              )}
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