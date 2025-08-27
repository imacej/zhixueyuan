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
} from '@heroicons/react/24/outline';

interface HallucinationCase {
  id: string;
  type: 'factual' | 'logical' | 'consistency';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  aiResponse: string;
  correctAnswer: boolean;
  explanation: string;
  hints: string[];
  category: string;
}

interface GameState {
  score: number;
  lives: number;
  streak: number;
  timeLeft: number;
  isActive: boolean;
  currentCase: HallucinationCase | null;
  showExplanation: boolean;
  userAnswer: boolean | null;
  totalQuestions: number;
  correctAnswers: number;
}

const hallucinationCases: HallucinationCase[] = [
  {
    id: '1',
    type: 'factual',
    difficulty: 'easy',
    question: '以下AI回答是否包含事实性错误？',
    aiResponse: '中国的首都是上海，这座城市有着悠久的历史和现代化的发展。',
    correctAnswer: false, // 有错误
    explanation: '中国的首都是北京，不是上海。这是一个明显的事实性错误。',
    hints: ['思考中国的政治中心在哪里', '首都通常是国家政府所在地'],
    category: '地理知识'
  },
  {
    id: '2',
    type: 'logical',
    difficulty: 'medium',
    question: '这个AI推理过程是否存在逻辑错误？',
    aiResponse: '因为所有鸟类都会飞，而企鹅是鸟类，所以企鹅会飞。',
    correctAnswer: false, // 有错误
    explanation: '前提"所有鸟类都会飞"本身就是错误的。企鹅、鸵鸟等都是不会飞的鸟类。',
    hints: ['考虑是否真的所有鸟类都会飞', '想想有哪些鸟类不会飞'],
    category: '逻辑推理'
  },
  {
    id: '3',
    type: 'consistency',
    difficulty: 'medium',
    question: '这段AI回答是否存在前后不一致的问题？',
    aiResponse: '太阳是我们太阳系的中心，地球围绕太阳转动。同时，太阳也围绕着地球运转，这形成了昼夜更替。',
    correctAnswer: false, // 有错误
    explanation: '前半句正确说明了日心说，但后半句又说太阳围绕地球转，这与前面的表述矛盾。',
    hints: ['注意前后两句话的描述是否一致', '日心说和地心说哪个是正确的？'],
    category: '天文学'
  },
  {
    id: '4',
    type: 'factual',
    difficulty: 'easy',
    question: '这个关于历史的AI回答是否准确？',
    aiResponse: '第二次世界大战结束于1945年，标志着长达6年战争的结束。',
    correctAnswer: true, // 正确
    explanation: '这个回答是准确的。第二次世界大战确实结束于1945年，从1939年开始，持续了约6年。',
    hints: ['回忆二战的具体时间', '1939-1945年确实约为6年'],
    category: '世界历史'
  },
  {
    id: '5',
    type: 'factual',
    difficulty: 'hard',
    question: '这个关于科学的AI回答有错误吗？',
    aiResponse: '水的沸点在海平面标准大气压下是100摄氏度，而在高海拔地区由于气压降低，沸点会升高。',
    correctAnswer: false, // 有错误
    explanation: '前半句正确，但后半句错误。在高海拔地区气压降低时，水的沸点实际上会降低，不是升高。',
    hints: ['气压与沸点的关系是什么？', '高原上煮饭为什么更困难？'],
    category: '物理科学'
  }
];

export function HallucinationTrainer() {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: 3,
    streak: 0,
    timeLeft: 0,
    isActive: false,
    currentCase: null,
    showExplanation: false,
    userAnswer: null,
    totalQuestions: 0,
    correctAnswers: 0,
  });

  const [showHints, setShowHints] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);

  // 游戏计时器
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState.isActive && gameState.timeLeft > 0) {
      timer = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (gameState.timeLeft === 0 && gameState.isActive) {
      // 时间到，自动处理为错误
      handleAnswer(null);
    }
    return () => clearTimeout(timer);
  }, [gameState.timeLeft, gameState.isActive]);

  const startGame = () => {
    const randomCase = hallucinationCases[Math.floor(Math.random() * hallucinationCases.length)];
    setGameState({
      score: 0,
      lives: 3,
      streak: 0,
      timeLeft: 45,
      isActive: true,
      currentCase: randomCase,
      showExplanation: false,
      userAnswer: null,
      totalQuestions: 1,
      correctAnswers: 0,
    });
    setShowHints(false);
    setHintsUsed(0);
  };

  const nextQuestion = () => {
    const randomCase = hallucinationCases[Math.floor(Math.random() * hallucinationCases.length)];
    setGameState(prev => ({
      ...prev,
      timeLeft: Math.max(20, 45 - prev.totalQuestions * 2), // 时间逐渐减少
      currentCase: randomCase,
      showExplanation: false,
      userAnswer: null,
      totalQuestions: prev.totalQuestions + 1,
    }));
    setShowHints(false);
    setHintsUsed(0);
  };

  const handleAnswer = (answer: boolean | null) => {
    if (!gameState.currentCase || gameState.showExplanation) return;

    const isCorrect = answer === gameState.currentCase.correctAnswer;
    const timeBonus = Math.floor(gameState.timeLeft / 5);
    const streakBonus = gameState.streak * 10;
    const hintPenalty = hintsUsed * 5;

    setGameState(prev => ({
      ...prev,
      userAnswer: answer,
      showExplanation: true,
      score: isCorrect ? prev.score + 100 + timeBonus + streakBonus - hintPenalty : prev.score,
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'factual': return '📚';
      case 'logical': return '🧠';
      case 'consistency': return '🔄';
      default: return '❓';
    }
  };

  const getAccuracyRate = () => {
    if (gameState.totalQuestions === 0) return 0;
    return Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100);
  };

  if (!gameState.isActive && gameState.totalQuestions === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-8 rounded-2xl mb-8">
            <TrophyIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">准备开始训练</h2>
            <p className="text-gray-600 mb-6">
              在这个训练中，你将学会识别AI生成内容中的各种错误。
              每个问题都有时间限制，准确率和速度都会影响你的得分。
            </p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg">
                <HeartIcon className="h-6 w-6 text-red-500 mx-auto mb-2" />
                <div className="text-sm text-gray-600">生命值</div>
                <div className="font-bold">3 次机会</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <ClockIcon className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <div className="text-sm text-gray-600">时间限制</div>
                <div className="font-bold">45 秒/题</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <TrophyIcon className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                <div className="text-sm text-gray-600">评分标准</div>
                <div className="font-bold">速度+准确</div>
              </div>
            </div>
            <Button
              onClick={startGame}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              开始训练
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
          <div className="bg-gradient-to-br from-red-100 to-pink-100 p-8 rounded-2xl mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">训练结束</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{gameState.score}</div>
                <div className="text-sm text-gray-600">最终得分</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{getAccuracyRate()}%</div>
                <div className="text-sm text-gray-600">准确率</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-6">
              总共回答了 {gameState.totalQuestions} 题，正确 {gameState.correctAnswers} 题
            </div>
            <Button
              onClick={startGame}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
            >
              再来一次
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
            <div className="text-sm text-gray-600">准确率</div>
            <div className="text-2xl font-bold text-purple-600">{getAccuracyRate()}%</div>
          </div>
        </div>
      </div>

      {/* 问题卡片 */}
      {gameState.currentCase && (
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getTypeIcon(gameState.currentCase.type)}</span>
                <div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(gameState.currentCase.difficulty)}`}>
                    {gameState.currentCase.difficulty.toUpperCase()}
                  </span>
                  <div className="text-sm text-gray-500 mt-1">{gameState.currentCase.category}</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                题目 {gameState.totalQuestions}
              </div>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {gameState.currentCase.question}
            </h3>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-600 mb-2">AI回答：</div>
              <div className="text-gray-900 leading-relaxed">
                {gameState.currentCase.aiResponse}
              </div>
            </div>

            {!gameState.showExplanation && (
              <>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <Button
                    onClick={() => handleAnswer(true)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    leftIcon={<CheckCircleIcon className="h-5 w-5" />}
                  >
                    正确 - 没有错误
                  </Button>
                  <Button
                    onClick={() => handleAnswer(false)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    leftIcon={<XCircleIcon className="h-5 w-5" />}
                  >
                    错误 - 有幻觉问题
                  </Button>
                </div>

                <Button
                  onClick={() => {
                    setShowHints(!showHints);
                    if (!showHints) setHintsUsed(hintsUsed + 1);
                  }}
                  variant="outline"
                  size="sm"
                  leftIcon={<LightBulbIcon className="h-4 w-4" />}
                >
                  提示 {hintsUsed > 0 && `(已用${hintsUsed}次)`}
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

            {gameState.showExplanation && (
              <div className={`rounded-lg p-4 ${
                gameState.userAnswer === gameState.currentCase.correctAnswer
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center mb-2">
                  {gameState.userAnswer === gameState.currentCase.correctAnswer ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                  ) : (
                    <XCircleIcon className="h-5 w-5 text-red-600 mr-2" />
                  )}
                  <span className={`font-medium ${
                    gameState.userAnswer === gameState.currentCase.correctAnswer
                      ? 'text-green-800'
                      : 'text-red-800'
                  }`}>
                    {gameState.userAnswer === gameState.currentCase.correctAnswer ? '回答正确！' : '回答错误'}
                  </span>
                </div>
                <div className="text-sm text-gray-700 mb-4">
                  <strong>解释：</strong> {gameState.currentCase.explanation}
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