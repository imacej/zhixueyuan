'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';

interface UserSkills {
  factualDetection: number;
  logicalReasoning: number;
  consistencyCheck: number;
  attentionAnalysis: number;
  decisionPath: number;
  overallLevel: number;
}

interface AssessmentQuestion {
  id: string;
  category: 'factual' | 'logical' | 'consistency' | 'attention' | 'decision';
  question: string;
  text: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  difficulty: number; // 1-5
}

interface LearningAssessmentProps {
  onComplete: (skills: UserSkills) => void;
  existingSkills?: UserSkills | null;
}

const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: '1',
    category: 'factual',
    question: '以下陈述中包含事实错误的是？',
    text: '北京是中国的首都，也是中国人口最多的城市，拥有超过3000万居民。',
    options: [
      { id: 'a', text: '北京确实是首都且人口数据准确', isCorrect: false },
      { id: 'b', text: '北京是首都，但不是人口最多的城市', isCorrect: true },
      { id: 'c', text: '北京不是首都', isCorrect: false },
      { id: 'd', text: '陈述完全正确', isCorrect: false },
    ],
    explanation: '北京虽然是中国首都，但上海、重庆等城市的人口更多。北京人口约2200万。',
    difficulty: 2,
  },
  {
    id: '2',
    category: 'logical',
    question: '以下推理过程存在逻辑错误的是？',
    text: '所有程序员都会写代码。小明会写代码，所以小明是程序员。',
    options: [
      { id: 'a', text: '逻辑完全正确', isCorrect: false },
      { id: 'b', text: '存在肯定后件的逻辑谬误', isCorrect: true },
      { id: 'c', text: '大前提错误', isCorrect: false },
      { id: 'd', text: '结论不成立', isCorrect: false },
    ],
    explanation: '这是典型的肯定后件谬误。会写代码不只有程序员，还有其他职业的人也会。',
    difficulty: 3,
  },
  {
    id: '3',
    category: 'consistency',
    question: '以下文本存在前后不一致问题的是？',
    text: '人工智能将完全取代人类工作。同时，人工智能永远无法替代人类的创造力和情感。',
    options: [
      { id: 'a', text: '表述一致', isCorrect: false },
      { id: 'b', text: '存在矛盾，不能既完全取代又无法替代', isCorrect: true },
      { id: 'c', text: '只是强调不同方面', isCorrect: false },
      { id: 'd', text: '没有问题', isCorrect: false },
    ],
    explanation: '前句说"完全取代"，后句说"永远无法替代"，存在明显的逻辑矛盾。',
    difficulty: 2,
  },
  {
    id: '4',
    category: 'attention',
    question: '在注意力机制中，哪个说法是正确的？',
    text: '',
    options: [
      { id: 'a', text: '注意力权重总和必须等于1', isCorrect: true },
      { id: 'b', text: '注意力只关注相邻的token', isCorrect: false },
      { id: 'c', text: '所有token获得相同的注意力', isCorrect: false },
      { id: 'd', text: '注意力权重可以是负数', isCorrect: false },
    ],
    explanation: '注意力权重经过softmax归一化，总和等于1。这确保了权重分布的概率性质。',
    difficulty: 3,
  },
  {
    id: '5',
    category: 'decision',
    question: '模型决策路径分析中，哪个阶段最重要？',
    text: '',
    options: [
      { id: 'a', text: '输入预处理阶段', isCorrect: false },
      { id: 'b', text: '注意力计算阶段', isCorrect: true },
      { id: 'c', text: '输出生成阶段', isCorrect: false },
      { id: 'd', text: '每个阶段同等重要', isCorrect: false },
    ],
    explanation: '注意力计算阶段决定了模型如何关联不同信息，是理解决策过程的关键环节。',
    difficulty: 4,
  },
];

export function LearningAssessment({ onComplete, existingSkills }: LearningAssessmentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());

  const currentQuestion = assessmentQuestions[currentQuestionIndex];
  const totalQuestions = assessmentQuestions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleAnswerSelect = (optionId: string) => {
    if (showExplanation) return;
    setSelectedAnswer(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: selectedAnswer,
    }));
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      completeAssessment();
    }
  };

  const completeAssessment = () => {
    const totalTime = (Date.now() - startTime) / 1000 / 60; // 分钟
    setTimeSpent(totalTime);
    
    // 计算技能分数
    const skillScores: Record<string, number[]> = {
      factual: [],
      logical: [],
      consistency: [],
      attention: [],
      decision: [],
    };

    assessmentQuestions.forEach(question => {
      const userAnswer = answers[question.id];
      const correctOption = question.options.find(opt => opt.isCorrect);
      const isCorrect = userAnswer === correctOption?.id;
      
      // 基础分数根据正确性和难度
      let score = isCorrect ? (question.difficulty * 20) : (question.difficulty * 5);
      
      const categoryMap: Record<typeof question.category, keyof typeof skillScores> = {
        'factual': 'factual',
        'logical': 'logical', 
        'consistency': 'consistency',
        'attention': 'attention',
        'decision': 'decision'
      };
      
      skillScores[categoryMap[question.category]].push(score);
    });

    // 计算平均分数并标准化到0-100
    const calculateAverage = (scores: number[]) => {
      if (scores.length === 0) return 50;
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      return Math.min(100, Math.max(0, avg));
    };

    const skills: UserSkills = {
      factualDetection: calculateAverage(skillScores.factual),
      logicalReasoning: calculateAverage(skillScores.logical),
      consistencyCheck: calculateAverage(skillScores.consistency),
      attentionAnalysis: calculateAverage(skillScores.attention),
      decisionPath: calculateAverage(skillScores.decision),
      overallLevel: 0,
    };

    // 计算总体水平
    skills.overallLevel = (
      skills.factualDetection +
      skills.logicalReasoning +
      skills.consistencyCheck +
      skills.attentionAnalysis +
      skills.decisionPath
    ) / 5;

    setIsCompleted(true);
    onComplete(skills);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">评估完成！</h2>
          <p className="text-gray-600 mb-6">
            你已成功完成技能评估。系统正在为你生成个性化的学习路径...
          </p>
          <div className="flex justify-center space-x-8 text-sm">
            <div>
              <div className="font-bold text-2xl text-blue-600">{totalQuestions}</div>
              <div className="text-gray-500">题目完成</div>
            </div>
            <div>
              <div className="font-bold text-2xl text-purple-600">{Math.round(timeSpent)}</div>
              <div className="text-gray-500">分钟用时</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* 进度条 */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            评估进度 ({currentQuestionIndex + 1}/{totalQuestions})
          </span>
          <span className="text-sm text-gray-500">
            <ClockIcon className="h-4 w-4 inline mr-1" />
            约 {totalQuestions * 2} 分钟
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* 问题卡片 */}
      <Card className="mb-6">
        <div className="p-8">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-bold">
                {currentQuestionIndex + 1}
              </span>
            </div>
            <div className="ml-4 flex-1">
              <div className="text-sm text-gray-500 mb-1">
                {currentQuestion.category.toUpperCase()} • 难度: {'★'.repeat(currentQuestion.difficulty)}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {currentQuestion.question}
              </h3>
            </div>
          </div>

          {currentQuestion.text && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-gray-700 leading-relaxed">
                {currentQuestion.text}
              </div>
            </div>
          )}

          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option) => {
              let buttonClass = 'w-full text-left p-4 border rounded-lg transition-all ';
              
              if (showExplanation) {
                if (option.isCorrect) {
                  buttonClass += 'border-green-500 bg-green-50 text-green-800';
                } else if (selectedAnswer === option.id) {
                  buttonClass += 'border-red-500 bg-red-50 text-red-800';
                } else {
                  buttonClass += 'border-gray-200 bg-gray-50 text-gray-600';
                }
              } else {
                if (selectedAnswer === option.id) {
                  buttonClass += 'border-primary-500 bg-primary-50 text-primary-800';
                } else {
                  buttonClass += 'border-gray-200 hover:border-gray-300 hover:bg-gray-50';
                }
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleAnswerSelect(option.id)}
                  className={buttonClass}
                  disabled={showExplanation}
                >
                  <div className="flex items-center">
                    <span className="flex-shrink-0 w-8 h-8 border-2 rounded-full flex items-center justify-center mr-3">
                      {showExplanation && option.isCorrect && (
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      )}
                      {showExplanation && !option.isCorrect && selectedAnswer === option.id && (
                        <XCircleIcon className="h-5 w-5 text-red-600" />
                      )}
                      {!showExplanation && (
                        <span className="text-sm font-medium">
                          {String.fromCharCode(65 + currentQuestion.options.indexOf(option))}
                        </span>
                      )}
                    </span>
                    <span>{option.text}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <QuestionMarkCircleIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-800 mb-1">解析</div>
                  <div className="text-blue-700 text-sm">
                    {currentQuestion.explanation}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>类别: {currentQuestion.category}</span>
              <span>•</span>
              <span>难度: {currentQuestion.difficulty}/5</span>
            </div>
            
            <div className="space-x-3">
              {!showExplanation ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                >
                  提交答案
                </Button>
              ) : (
                <Button onClick={handleNextQuestion}>
                  {currentQuestionIndex < totalQuestions - 1 ? '下一题' : '完成评估'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* 评估说明 */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-2">📝 评估说明</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• 本评估包含5个不同技能领域的问题</p>
          <p>• 每题都有详细解析，帮助你理解正确答案</p>
          <p>• 评估结果将用于生成个性化的学习路径</p>
          <p>• 建议仔细思考每道题，诚实作答以获得最准确的评估</p>
        </div>
      </div>
    </div>
  );
}