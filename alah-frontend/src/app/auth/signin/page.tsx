'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱地址';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }

    if (!formData.password) {
      newErrors.password = '请输入密码';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 这里应该调用实际的登录API
      console.log('登录数据:', formData);
      
      // 登录成功后的处理
      alert('登录成功！欢迎回到ALAH！');
      
    } catch (error) {
      console.error('登录失败:', error);
      setErrors({ general: '邮箱或密码错误，请重试' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // 这里可以添加忘记密码的逻辑
    alert('重置密码邮件已发送到您的邮箱');
  };

  const socialLogins = [
    {
      name: 'Google',
      icon: '🔵',
      color: 'border-blue-500 text-blue-600 hover:bg-blue-50',
      action: () => alert('Google登录功能开发中')
    },
    {
      name: 'GitHub',
      icon: '⚫',
      color: 'border-gray-800 text-gray-800 hover:bg-gray-50',
      action: () => alert('GitHub登录功能开发中')
    },
    {
      name: '微信',
      icon: '🟢',
      color: 'border-green-500 text-green-600 hover:bg-green-50',
      action: () => alert('微信登录功能开发中')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <AcademicCapIcon className="h-12 w-12 text-primary-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          欢迎回到 ALAH
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          登录您的账户，继续学习之旅
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <div className="px-6 py-8">
            {/* 通用错误信息 */}
            {errors.general && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* 邮箱 */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  邮箱地址
                </label>
                <div className="mt-1 relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`appearance-none block w-full px-3 py-2 pl-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="your@email.com"
                  />
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* 密码 */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  密码
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`appearance-none block w-full px-3 py-2 pl-10 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="输入您的密码"
                  />
                  <LockClosedIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              {/* 记住我 & 忘记密码 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                    记住我
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  忘记密码？
                </button>
              </div>

              {/* 登录按钮 */}
              <div>
                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  isLoading={isLoading}
                >
                  {isLoading ? '正在登录...' : '登录'}
                </Button>
              </div>
            </form>

            {/* 分隔线 */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">或者</span>
                </div>
              </div>
            </div>

            {/* 第三方登录 */}
            <div className="mt-6">
              <div className="space-y-3">
                {socialLogins.map((social) => (
                  <button
                    key={social.name}
                    type="button"
                    onClick={social.action}
                    className={`w-full flex justify-center items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium transition-colors ${social.color}`}
                  >
                    <span className="mr-2 text-lg">{social.icon}</span>
                    使用 {social.name} 登录
                  </button>
                ))}
              </div>
            </div>

            {/* 注册链接 */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                还没有账户？{' '}
                <Link
                  href="/auth/signup"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  立即注册
                </Link>
              </p>
            </div>

            {/* 快速体验 */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">
                  想先体验一下？
                </p>
                <Link href="/tools/visualization">
                  <Button variant="outline" size="sm" fullWidth>
                    免登录体验可视化工具
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>

        {/* 功能特性预览 */}
        <div className="mt-8">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              加入ALAH，享受专业AI学习体验
            </h3>
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div className="flex items-center justify-center text-gray-600">
                <span className="mr-2">🔬</span>
                <span>深度模型可视化分析</span>
              </div>
              <div className="flex items-center justify-center text-gray-600">
                <span className="mr-2">⚠️</span>
                <span>智能幻觉检测训练</span>
              </div>
              <div className="flex items-center justify-center text-gray-600">
                <span className="mr-2">🎯</span>
                <span>个性化学习路径规划</span>
              </div>
              <div className="flex items-center justify-center text-gray-600">
                <span className="mr-2">📊</span>
                <span>实时技术趋势追踪</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}