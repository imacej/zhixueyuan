'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { 
  ExclamationTriangleIcon, 
  ArrowPathIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BugAntIcon
} from '@heroicons/react/24/outline';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // 调用错误回调
    this.props.onError?.(error, errorInfo);

    // 发送错误报告到监控服务
    this.reportError(error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetOnPropsChange, resetKeys } = this.props;
    const { hasError } = this.state;

    if (hasError && prevProps.resetKeys !== resetKeys) {
      if (resetOnPropsChange) {
        this.resetErrorBoundary();
      }
    }
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // 这里可以集成错误监控服务，如 Sentry
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }

    // 发送到分析服务
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false,
      });
    }
  };

  private resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      window.clearTimeout(this.resetTimeoutId);
    }
    this.resetTimeoutId = window.setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        showDetails: false,
      });
    }, 100);
  };

  private toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails,
    }));
  };

  private getErrorMessage(error: Error): string {
    if (error.name === 'NetworkError') {
      return '网络连接异常，请检查您的网络设置';
    }
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return '服务器连接失败，请稍后重试';
    }
    if (error.message.includes('ChunkLoadError')) {
      return '资源加载失败，请刷新页面重试';
    }
    return error.message || '发生了未知错误';
  }

  render() {
    const { hasError, error, errorInfo, showDetails } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
              {/* 错误图标 */}
              <div className="flex justify-center mb-6">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
                  <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
                </div>
              </div>

              {/* 错误标题 */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  哎呀，出现了一些问题
                </h2>
                <p className="text-gray-600">
                  {error ? this.getErrorMessage(error) : '应用程序遇到了错误'}
                </p>
              </div>

              {/* 操作按钮 */}
              <div className="space-y-4 mb-6">
                <button
                  onClick={this.resetErrorBoundary}
                  className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  重新加载
                </button>

                <button
                  onClick={() => window.location.reload()}
                  className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  刷新页面
                </button>

                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  返回首页
                </button>
              </div>

              {/* 错误详情切换 */}
              {process.env.NODE_ENV === 'development' && error && (
                <div className="border-t border-gray-200 pt-6">
                  <button
                    onClick={this.toggleDetails}
                    className="w-full flex items-center justify-between text-sm text-gray-500 hover:text-gray-700"
                  >
                    <span className="flex items-center">
                      <BugAntIcon className="h-4 w-4 mr-2" />
                      技术详情
                    </span>
                    {showDetails ? (
                      <ChevronUpIcon className="h-4 w-4" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4" />
                    )}
                  </button>

                  {showDetails && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-md">
                      <div className="text-xs font-mono text-gray-800 space-y-2">
                        <div>
                          <strong>错误类型:</strong> {error.name}
                        </div>
                        <div>
                          <strong>错误信息:</strong> {error.message}
                        </div>
                        {error.stack && (
                          <div>
                            <strong>调用栈:</strong>
                            <pre className="mt-1 whitespace-pre-wrap text-xs text-gray-600">
                              {error.stack}
                            </pre>
                          </div>
                        )}
                        {errorInfo?.componentStack && (
                          <div>
                            <strong>组件栈:</strong>
                            <pre className="mt-1 whitespace-pre-wrap text-xs text-gray-600">
                              {errorInfo.componentStack}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 帮助信息 */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  如果问题持续存在，请联系技术支持
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

// 函数式组件包装器
interface ErrorBoundaryWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>
) {
  return function WrappedComponent(props: P & ErrorBoundaryWrapperProps) {
    const { fallback, onError, ...componentProps } = props;
    
    return (
      <ErrorBoundary fallback={fallback} onError={onError}>
        <Component {...(componentProps as P)} />
      </ErrorBoundary>
    );
  };
}

// Hook for error boundary reset
export function useErrorBoundaryReset() {
  const [resetKey, setResetKey] = React.useState(0);
  
  const reset = React.useCallback(() => {
    setResetKey(prev => prev + 1);
  }, []);
  
  return { resetKey, reset };
}

// 简化的错误边界组件用于局部错误处理
interface SimpleErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  message?: string;
}

export function SimpleErrorBoundary({ 
  children, 
  fallback, 
  message = '加载失败' 
}: SimpleErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={
        fallback || (
          <div className="flex flex-col items-center justify-center p-8 text-gray-500">
            <ExclamationTriangleIcon className="h-8 w-8 mb-2" />
            <p className="text-sm">{message}</p>
          </div>
        )
      }
    >
      {children}
    </ErrorBoundary>
  );
}