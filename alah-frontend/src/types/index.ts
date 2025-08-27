// 用户类型
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin' | 'premium';
  createdAt: Date;
  updatedAt: Date;
  subscription?: Subscription;
  learningProfile?: LearningProfile;
}

// 订阅类型
export interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  createdAt: Date;
}

// 学习档案
export interface LearningProfile {
  id: string;
  userId: string;
  skillLevels: SkillAssessment;
  learningGoals: string[];
  preferredLearningStyle: 'visual' | 'hands-on' | 'reading' | 'mixed';
  weeklyTimeCommitment: number; // hours
  completedLessons: string[];
  currentStreak: number;
  totalPoints: number;
  achievements: Achievement[];
  createdAt: Date;
  updatedAt: Date;
}

// 技能评估
export interface SkillAssessment {
  programming: number; // 0-100
  machineLearning: number;
  deepLearning: number;
  transformers: number;
  promptEngineering: number;
  modelEvaluation: number;
}

// 成就系统
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'practice' | 'social' | 'milestone';
  points: number;
  unlockedAt: Date;
}

// 模型可视化相关
export interface AttentionVisualization {
  id: string;
  userId: string;
  modelName: string;
  inputText: string;
  outputData: {
    tokens: string[];
    attentionWeights: number[][][]; // [layer][head][token][token]
    hiddenStates?: number[][][]; // [layer][token][hidden_dim]
  };
  createdAt: Date;
}

// 幻觉检测相关
export interface HallucinationCase {
  id: string;
  category: 'factual' | 'logical' | 'consistency' | 'source';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  content: string;
  correctAnswer: boolean;
  explanation: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface HallucinationAttempt {
  id: string;
  userId: string;
  caseId: string;
  userAnswer: boolean;
  isCorrect: boolean;
  responseTime: number; // milliseconds
  confidenceLevel: number; // 1-5
  createdAt: Date;
}

// 学习路径相关
export interface LearningPath {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // hours
  prerequisites: string[];
  modules: LearningModule[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LearningModule {
  id: string;
  pathId: string;
  name: string;
  description: string;
  type: 'theory' | 'practice' | 'quiz' | 'project';
  content: string;
  resources: Resource[];
  estimatedTime: number; // minutes
  order: number;
}

export interface Resource {
  id: string;
  type: 'article' | 'video' | 'paper' | 'tool' | 'dataset';
  title: string;
  url: string;
  description?: string;
  author?: string;
  publishedAt?: Date;
}

// 技术追踪相关
export interface TechNews {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  category: 'research' | 'industry' | 'tools' | 'datasets';
  importance: number; // 1-10
  tags: string[];
  publishedAt: Date;
  createdAt: Date;
}

export interface TrendAnalysis {
  id: string;
  topic: string;
  period: string; // e.g., '2024-Q1'
  metrics: {
    paperCount: number;
    githubStars: number;
    jobPostings: number;
    searchVolume: number;
  };
  trend: 'rising' | 'stable' | 'declining';
  createdAt: Date;
}

// API相关类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 组件通用类型
export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
  options?: SelectOption[]; // for select fields
}

// 状态管理
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
  language: 'zh-CN' | 'en-US';
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  autoClose?: boolean;
  duration?: number;
  createdAt: Date;
}