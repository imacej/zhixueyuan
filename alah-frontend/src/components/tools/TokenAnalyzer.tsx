'use client';

import { useEffect, useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface TokenAnalyzerProps {
  text: string;
  isLoading: boolean;
}

interface TokenData {
  token: string;
  probability: number;
  logProbability: number;
  rank: number;
  alternatives: {
    token: string;
    probability: number;
  }[];
  position: number;
  layer_activations: number[];
}

export function TokenAnalyzer({ text, isLoading }: TokenAnalyzerProps) {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [selectedToken, setSelectedToken] = useState<number | null>(null);
  const [showAlternatives, setShowAlternatives] = useState<Set<number>>(new Set());

  // 模拟生成Token分析数据
  useEffect(() => {
    if (!text || isLoading) return;

    const chars = text.split('').filter(char => char.trim());
    const tokenData: TokenData[] = chars.map((char, index) => {
      // 生成模拟的概率数据
      const probability = 0.3 + Math.random() * 0.7; // 0.3-1.0
      const logProbability = Math.log(probability);
      
      // 生成替代选项
      const alternatives = [
        { token: char, probability },
        ...Array.from({ length: 4 }, (_, i) => ({
          token: String.fromCharCode(char.charCodeAt(0) + i + 1),
          probability: Math.random() * (1 - probability) * 0.7
        }))
      ].sort((a, b) => b.probability - a.probability).slice(0, 5);

      // 生成每层的激活值
      const layer_activations = Array.from({ length: 12 }, () => Math.random());

      return {
        token: char,
        probability,
        logProbability,
        rank: 1, // 在实际应用中，这应该是在所有可能token中的排名
        alternatives,
        position: index,
        layer_activations,
      };
    });

    setTokens(tokenData);
  }, [text, isLoading]);

  const toggleAlternatives = (index: number) => {
    const newSet = new Set(showAlternatives);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setShowAlternatives(newSet);
  };

  const getProbabilityColor = (prob: number) => {
    if (prob > 0.8) return 'text-green-600 bg-green-50';
    if (prob > 0.5) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getConfidenceLabel = (prob: number) => {
    if (prob > 0.8) return '高置信度';
    if (prob > 0.5) return '中等置信度';
    return '低置信度';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">正在分析Token概率分布...</p>
        </div>
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">请输入文本并点击"开始分析"以查看Token分析结果</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 总体统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{tokens.length}</div>
          <div className="text-sm text-blue-600">总Token数</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {(tokens.reduce((sum, t) => sum + t.probability, 0) / tokens.length * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-green-600">平均置信度</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">
            {tokens.filter(t => t.probability > 0.8).length}
          </div>
          <div className="text-sm text-yellow-600">高置信度Token</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {tokens.filter(t => t.probability < 0.5).length}
          </div>
          <div className="text-sm text-red-600">低置信度Token</div>
        </div>
      </div>

      {/* Token序列可视化 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Token序列分析</h3>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {tokens.map((token, index) => (
              <button
                key={index}
                onClick={() => setSelectedToken(selectedToken === index ? null : index)}
                className={`px-3 py-2 rounded-md border transition-all duration-200 ${
                  selectedToken === index
                    ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                    : 'border-gray-300 hover:border-gray-400 hover:shadow-sm'
                } ${getProbabilityColor(token.probability)}`}
              >
                <div className="text-center">
                  <div className="font-mono text-lg">{token.token}</div>
                  <div className="text-xs">
                    {(token.probability * 100).toFixed(1)}%
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="text-sm text-gray-600">
            💡 点击任意Token查看详细分析，颜色表示置信度：
            <span className="ml-2">
              <span className="inline-block w-3 h-3 bg-green-100 rounded mr-1"></span>高
              <span className="inline-block w-3 h-3 bg-yellow-100 rounded mx-1"></span>中
              <span className="inline-block w-3 h-3 bg-red-100 rounded ml-1"></span>低
            </span>
          </div>
        </div>
      </div>

      {/* 详细Token分析 */}
      {selectedToken !== null && (
        <div className="bg-white border rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Token 详细分析: "{tokens[selectedToken].token}"
          </h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 基本信息 */}
            <div>
              <h5 className="font-medium text-gray-900 mb-3">基本信息</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">位置:</span>
                  <span className="font-mono">{tokens[selectedToken].position + 1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">概率:</span>
                  <span className="font-mono">{(tokens[selectedToken].probability * 100).toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">对数概率:</span>
                  <span className="font-mono">{tokens[selectedToken].logProbability.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">置信度:</span>
                  <span className={getProbabilityColor(tokens[selectedToken].probability).split(' ')[0]}>
                    {getConfidenceLabel(tokens[selectedToken].probability)}
                  </span>
                </div>
              </div>
            </div>

            {/* 层激活可视化 */}
            <div>
              <h5 className="font-medium text-gray-900 mb-3">各层激活强度</h5>
              <div className="space-y-1">
                {tokens[selectedToken].layer_activations.map((activation, layerIndex) => (
                  <div key={layerIndex} className="flex items-center text-sm">
                    <span className="w-16 text-gray-600">Layer {layerIndex + 1}:</span>
                    <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${activation * 100}%` }}
                      ></div>
                    </div>
                    <span className="w-12 text-xs font-mono">{(activation * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 替代选项 */}
          <div className="mt-6">
            <button
              onClick={() => toggleAlternatives(selectedToken)}
              className="flex items-center text-sm font-medium text-gray-900 mb-3 hover:text-primary-600"
            >
              {showAlternatives.has(selectedToken) ? (
                <ChevronDownIcon className="h-4 w-4 mr-1" />
              ) : (
                <ChevronRightIcon className="h-4 w-4 mr-1" />
              )}
              查看替代选项 ({tokens[selectedToken].alternatives.length})
            </button>
            
            {showAlternatives.has(selectedToken) && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {tokens[selectedToken].alternatives.map((alt, altIndex) => (
                    <div
                      key={altIndex}
                      className={`p-3 rounded border ${
                        altIndex === 0 
                          ? 'border-primary-300 bg-primary-50' 
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-lg">{alt.token}</span>
                        <span className="text-sm font-medium">
                          {(alt.probability * 100).toFixed(1)}%
                        </span>
                      </div>
                      {altIndex === 0 && (
                        <div className="text-xs text-primary-600 mt-1">当前选择</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 概率分布图表 */}
      <div className="bg-white border rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Token概率分布趋势</h4>
        <div className="h-40 flex items-end justify-center space-x-1">
          {tokens.map((token, index) => (
            <div
              key={index}
              className="flex flex-col items-center"
              style={{ height: '100%' }}
            >
              <div
                className={`w-6 transition-all duration-300 ${
                  selectedToken === index ? 'bg-primary-600' : 'bg-primary-300'
                } hover:bg-primary-500 cursor-pointer rounded-t`}
                style={{ height: `${token.probability * 100}%` }}
                onClick={() => setSelectedToken(selectedToken === index ? null : index)}
                title={`${token.token}: ${(token.probability * 100).toFixed(1)}%`}
              ></div>
              <div className="text-xs mt-1 font-mono">{token.token}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center text-sm text-gray-600">
          Token序列 → (鼠标悬停查看详细信息)
        </div>
      </div>
    </div>
  );
}