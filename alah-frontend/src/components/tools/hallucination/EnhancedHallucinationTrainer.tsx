'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  CheckCircleIcon,
  XCircleIcon,
  LightBulbIcon,
  ClockIcon,
  TrophyIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { HallucinationDetectionResponse } from '@/types/api';

interface EnhancedCase {
  id: string;
  text: string;
  context?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  expectedResult: boolean;
  hints: string[];
}

interface GameState {
  score: number;
  lives: number;
  streak: number;
  timeLeft: number;
  isActive: boolean;
  currentCase: EnhancedCase | null;
  aiAnalysis: HallucinationDetectionResponse | null;
  showExplanation: boolean;
  userAnswer: boolean | null;
  totalQuestions: number;
  correctAnswers: number;
  isAnalyzing: boolean;
}

const enhancedCases: EnhancedCase[] = [
  {
    id: '1',
    text: '中国的首都是上海，这座城市以其现代化的摩天大楼和繁华的商业区而闻名世界。',
    difficulty: 'easy',
    category: '地理知识',
    expectedResult: false,
    hints: ['考虑中国的政治和行政中心', '上海虽然重要，但它的主要角色是什么？'],
  },
  {
    id: '2',
    text: '所有鸟类都会飞行，企鹅是鸟类，因此企鹅能够在天空中飞翔。',
    difficulty: 'medium',
    category: '逻辑推理',
    expectedResult: false,
    hints: ['三段论的大前提是否正确？', '想想有哪些鸟类不会飞'],
  },
  {
    id: '3',
    text: '太阳系有八大行星，包括水星、金星、地球、火星、木星、土星、天王星和海王星。',
    difficulty: 'easy',
    category: '天文学',
    expectedResult: true,
    hints: ['数一数行星的数量', '2006年后冥王星的地位发生了什么变化？'],
  },
  {
    id: '4',
    text: '地球围绕太阳运转，这是日心说的核心观点。同时，太阳每天围绕地球转动一圈，形成了昼夜交替现象。',
    difficulty: 'hard',
    category: '天文学',
    expectedResult: false,
    hints: ['注意前后两句话的矛盾', '昼夜交替的真正原因是什么？'],
  },
];

export function EnhancedHallucinationTrainer() {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: 3,
    streak: 0,
    timeLeft: 0,
    isActive: false,
    currentCase: null,
    aiAnalysis: null,
    showExplanation: false,
    userAnswer: null,
    totalQuestions: 0,
    correctAnswers: 0,
    isAnalyzing: false,
  });

  const [showHints, setShowHints] = useState(false);

  // 游戏计时器
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState.isActive && gameState.timeLeft > 0 && !gameState.isAnalyzing) {
      timer = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (gameState.timeLeft === 0 && gameState.isActive && !gameState.showExplanation) {
      handleAnswer(null);
    }
    return () => clearTimeout(timer);
  }, [gameState.timeLeft, gameState.isActive, gameState.isAnalyzing]);

  const startGame = () => {
    const randomCase = enhancedCases[Math.floor(Math.random() * enhancedCases.length)];
    setGameState({
      score: 0,
      lives: 3,
      streak: 0,
      timeLeft: 60,
      isActive: true,
      currentCase: randomCase,
      aiAnalysis: null,
      showExplanation: false,
      userAnswer: null,
      totalQuestions: 1,
      correctAnswers: 0,
      isAnalyzing: false,
    });
    setShowHints(false);
  };

  const nextQuestion = () => {
    const randomCase = enhancedCases[Math.floor(Math.random() * enhancedCases.length)];
    setGameState(prev => ({
      ...prev,
      timeLeft: Math.max(30, 60 - prev.totalQuestions * 3),
      currentCase: randomCase,
      aiAnalysis: null,
      showExplanation: false,
      userAnswer: null,
      totalQuestions: prev.totalQuestions + 1,
      isAnalyzing: false,
    }));
    setShowHints(false);
  };

  const analyzeWithAI = async (text: string) => {
    setGameState(prev => ({ ...prev, isAnalyzing: true }));
    
    try {
      const response = await fetch('/api/ai/hallucination', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          detection_types: ['factual', 'logical', 'consistency'],
        }),
      });

      if (response.ok) {
        const analysis: HallucinationDetectionResponse = await response.json();
        setGameState(prev => ({ ...prev, aiAnalysis: analysis }));
        return analysis;
      } else {
        throw new Error('API request failed');
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
      // 使用fallback分析
      const mockAnalysis: HallucinationDetectionResponse = {
        text,
        has_hallucination: !gameState.currentCase?.expectedResult,
        confidence: 0.8,
        detected_issues: [],
        explanation: 'AI分析服务暂不可用，使用本地分析结果。',
        processing_time: 100,
      };
      setGameState(prev => ({ ...prev, aiAnalysis: mockAnalysis }));
      return mockAnalysis;
    } finally {
      setGameState(prev => ({ ...prev, isAnalyzing: false }));
    }
  };

  const handleAnswer = async (answer: boolean | null) => {
    if (!gameState.currentCase || gameState.showExplanation) return;

    // 先进行AI分析
    let analysis = gameState.aiAnalysis;
    if (!analysis) {
      analysis = await analyzeWithAI(gameState.currentCase.text);
    }

    const isCorrect = answer === !gameState.currentCase.expectedResult;
    const timeBonus = Math.floor(gameState.timeLeft / 10);
    const streakBonus = gameState.streak * 15;

    setGameState(prev => ({
      ...prev,
      userAnswer: answer,
      showExplanation: true,
      score: isCorrect ? prev.score + 150 + timeBonus + streakBonus : prev.score,
      lives: isCorrect || answer === null ? prev.lives : Math.max(0, prev.lives - 1),
      streak: isCorrect ? prev.streak + 1 : 0,
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
      isActive: isCorrect || answer === null ? prev.lives > 0 : prev.lives > 1,
    }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!gameState.isActive && gameState.totalQuestions === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-8 rounded-2xl mb-8">
            <SparklesIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">AI增强幻觉检测训练</h2>
            <p className="text-gray-600 mb-6">
              使用真实的AI模型来分析文本中的幻觉问题。
              你的答案将与AI的分析结果进行对比，帮助你提升检测能力。
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg">
                <SparklesIcon className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                <div className="text-sm text-gray-600">AI分析</div>
                <div className="font-bold">实时检测</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <TrophyIcon className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                <div className="text-sm text-gray-600">智能评分</div>
                <div className="font-bold">精确反馈</div>
              </div>
            </div>
            <Button
              onClick={startGame}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
            >
              开始AI增强训练
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!gameState.isActive) {
    return (
      <div className="text-center py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-8 rounded-2xl mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">训练完成</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{gameState.score}</div>
                <div className="text-sm text-gray-600">最终得分</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100)}%
                </div>
                <div className="text-sm text-gray-600">准确率</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{gameState.streak}</div>
                <div className="text-sm text-gray-600">最高连胜</div>
              </div>
            </div>
            <Button
              onClick={startGame}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
            >
              重新开始
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* 游戏状态栏 */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-600">得分</div>
            <div className="text-2xl font-bold text-blue-600">{gameState.score}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">生命值</div>
            <div className="flex justify-center space-x-1">
              {Array.from({ length: 3 }, (_, i) => (
                <HeartIcon
                  key={i}
                  className={`h-6 w-6 ${
                    i < gameState.lives ? 'text-red-500' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">连胜</div>
            <div className="text-2xl font-bold text-green-600">{gameState.streak}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">时间</div>
            <div className={`text-2xl font-bold ${
              gameState.timeLeft <= 10 ? 'text-red-600' : 'text-orange-600'
            }`}>
              {gameState.timeLeft}s
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">题目</div>
            <div className="text-2xl font-bold text-purple-600">{gameState.totalQuestions}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">准确率</div>
            <div className="text-2xl font-bold text-indigo-600">
              {Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* 问题卡片 */}
      {gameState.currentCase && (
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
                <div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(gameState.currentCase.difficulty)}`}>
                    {gameState.currentCase.difficulty.toUpperCase()}
                  </span>
                  <div className="text-sm text-gray-500 mt-1">{gameState.currentCase.category}</div>
                </div>
              </div>
              {gameState.isAnalyzing && (
                <div className="flex items-center text-sm text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                  AI分析中...
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-600 mb-2">待检测文本：</div>
              <div className="text-gray-900 leading-relaxed">
                {gameState.currentCase.text}
              </div>
            </div>

            {!gameState.showExplanation && !gameState.isAnalyzing && (
              <>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <Button
                    onClick={() => handleAnswer(false)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    leftIcon={<XCircleIcon className="h-5 w-5" />}
                  >
                    有幻觉问题
                  </Button>
                  <Button
                    onClick={() => handleAnswer(true)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    leftIcon={<CheckCircleIcon className="h-5 w-5" />}
                  >
                    没有问题
                  </Button>
                </div>

                <Button
                  onClick={() => setShowHints(!showHints)}
                  variant="outline"
                  size="sm"
                  leftIcon={<LightBulbIcon className="h-4 w-4" />}
                >
                  查看提示
                </Button>

                {showHints && (
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="text-sm text-yellow-800">
                      <strong>提示：</strong>
                      <ul className="mt-2 space-y-1">
                        {gameState.currentCase.hints.map((hint, index) => (
                          <li key={index}>• {hint}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </>
            )}

            {gameState.showExplanation && gameState.aiAnalysis && (
              <div className="space-y-4">
                {/* AI分析结果 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <SparklesIcon className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-medium text-blue-800">AI分析结果</span>
                  </div>
                  <div className="text-sm text-blue-700 mb-2">
                    <strong>检测结果：</strong>
                    {gameState.aiAnalysis.has_hallucination ? (
                      <span className="text-red-600 ml-2">发现幻觉问题</span>
                    ) : (
                      <span className="text-green-600 ml-2">未发现明显问题</span>
                    )}
                  </div>
                  <div className="text-sm text-blue-700 mb-2">
                    <strong>置信度：</strong>
                    <span className="ml-2">{(gameState.aiAnalysis.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="text-sm text-blue-700">
                    <strong>分析说明：</strong>
                    <div className="mt-1">{gameState.aiAnalysis.explanation}</div>
                  </div>
                  
                  {gameState.aiAnalysis.detected_issues.length > 0 && (
                    <div className="mt-3">
                      <strong className="text-blue-800">发现的问题：</strong>
                      <ul className="mt-1 space-y-1">
                        {gameState.aiAnalysis.detected_issues.map((issue, index) => (
                          <li key={index} className="text-sm">
                            • <span className="font-medium">{issue.type}</span>: {issue.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* 用户答题结果 */}
                <div className={`rounded-lg p-4 ${
                  gameState.userAnswer === !gameState.currentCase.expectedResult
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center mb-2">
                    {gameState.userAnswer === !gameState.currentCase.expectedResult ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                    ) : (
                      <XCircleIcon className="h-5 w-5 text-red-600 mr-2" />
                    )}
                    <span className={`font-medium ${
                      gameState.userAnswer === !gameState.currentCase.expectedResult
                        ? 'text-green-800'
                        : 'text-red-800'
                    }`}>
                      {gameState.userAnswer === !gameState.currentCase.expectedResult ? '回答正确！' : '回答错误'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700">
                    你的判断与AI分析{gameState.userAnswer === gameState.aiAnalysis.has_hallucination ? '一致' : '不一致'}。
                  </div>
                </div>

                {gameState.lives > 0 && (
                  <Button onClick={nextQuestion} className="w-full sm:w-auto">
                    下一题
                  </Button>
                )}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}