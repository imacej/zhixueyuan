'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

interface LoadingContextType {
  loadingStates: Record<string, LoadingState>;
  setLoading: (key: string, state: LoadingState) => void;
  clearLoading: (key: string) => void;
  clearAllLoading: () => void;
  isAnyLoading: () => boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
}

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loadingStates, setLoadingStates] = useState<Record<string, LoadingState>>({});

  const setLoading = (key: string, state: LoadingState) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: state
    }));
  };

  const clearLoading = (key: string) => {
    setLoadingStates(prev => {
      const newStates = { ...prev };
      delete newStates[key];
      return newStates;
    });
  };

  const clearAllLoading = () => {
    setLoadingStates({});
  };

  const isAnyLoading = () => {
    return Object.values(loadingStates).some(state => state.isLoading);
  };

  return (
    <LoadingContext.Provider value={{
      loadingStates,
      setLoading,
      clearLoading,
      clearAllLoading,
      isAnyLoading
    }}>
      {children}
      <LoadingOverlay />
    </LoadingContext.Provider>
  );
}

function LoadingOverlay() {
  const { loadingStates, isAnyLoading } = useLoading();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isAnyLoading()) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isAnyLoading]);

  if (!isVisible) return null;

  const loadingEntries = Object.entries(loadingStates).filter(([_, state]) => state.isLoading);
  const primaryLoading = loadingEntries[0]?.[1];

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
      isAnyLoading() ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
      
      {/* 加载内容 */}
      <div className="relative bg-white rounded-lg shadow-xl p-8 max-w-sm w-full mx-4">
        <div className="text-center">
          {/* 加载动画 */}
          <div className="relative mb-6">
            <LoadingSpinner size="large" />
          </div>
          
          {/* 加载消息 */}
          {primaryLoading?.message && (
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {primaryLoading.message}
            </h3>
          )}
          
          {/* 进度条 */}
          {primaryLoading?.progress !== undefined && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>进度</span>
                <span>{Math.round(primaryLoading.progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${primaryLoading.progress}%` }}
                />
              </div>
            </div>
          )}
          
          {/* 多个加载状态 */}
          {loadingEntries.length > 1 && (
            <div className="mt-4">
              <div className="text-sm text-gray-500">
                正在处理 {loadingEntries.length} 个任务...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function LoadingSpinner({ size = 'medium', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className={`inline-block animate-spin ${sizeClasses[size]} ${className}`}>
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}

// 便捷的hook
export function useLoadingState(key: string) {
  const { loadingStates, setLoading, clearLoading } = useLoading();
  
  const startLoading = (message?: string, progress?: number) => {
    setLoading(key, { isLoading: true, message, progress });
  };
  
  const updateProgress = (progress: number, message?: string) => {
    const currentState = loadingStates[key];
    if (currentState) {
      setLoading(key, { 
        ...currentState, 
        progress,
        ...(message && { message })
      });
    }
  };
  
  const stopLoading = () => {
    clearLoading(key);
  };
  
  const isLoading = loadingStates[key]?.isLoading ?? false;
  
  return {
    isLoading,
    startLoading,
    updateProgress,
    stopLoading,
    currentState: loadingStates[key]
  };
}

// 异步操作包装器
export function useAsyncOperation() {
  const { startLoading, stopLoading, updateProgress } = useLoadingState('async-operation');
  
  const execute = async <T>(
    operation: () => Promise<T>,
    options?: {
      message?: string;
      onProgress?: (progress: number) => void;
    }
  ): Promise<T> => {
    try {
      startLoading(options?.message);
      
      if (options?.onProgress) {
        const originalOperation = operation;
        // 这里可以扩展支持进度回调的操作
      }
      
      const result = await operation();
      return result;
    } finally {
      stopLoading();
    }
  };
  
  return { execute };
}