'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    experience: 'beginner',
    interests: [] as string[],
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const experienceOptions = [
    { value: 'beginner', label: '初学者', description: '刚开始接触AI和大语言模型' },
    { value: 'intermediate', label: '中级', description: '有一定的机器学习基础' },
    { value: 'advanced', label: '高级', description: '有丰富的AI研究或开发经验' },
    { value: 'expert', label: '专家', description: 'AI领域的专业研究者或资深工程师' },
  ];

  const interestOptions = [
    { value: 'nlp', label: '自然语言处理', icon: '📝' },
    { value: 'computer-vision', label: '计算机视觉', icon: '👁️' },
    { value: 'ml-theory', label: '机器学习理论', icon: '🧠' },
    { value: 'deep-learning', label: '深度学习', icon: '🔬' },
    { value: 'ai-ethics', label: 'AI伦理', icon: '⚖️' },
    { value: 'robotics', label: '机器人学', icon: '🤖' },
    { value: 'data-science', label: '数据科学', icon: '📊' },
    { value: 'ai-applications', label: 'AI应用', icon: '🚀' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '请输入姓名';
    }

    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱地址';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }

    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 8) {
      newErrors.password = '密码长度至少8个字符';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '请确认密码';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = '请同意用户协议和隐私政策';
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
      
      // 这里应该调用实际的注册API
      console.log('注册数据:', formData);
      
      // 注册成功后的处理
      alert('注册成功！欢迎加入ALAH学习社区！');
      
    } catch (error) {
      console.error('注册失败:', error);
      alert('注册失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <AcademicCapIcon className="h-12 w-12 text-primary-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          加入 ALAH 学习社区
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          开启您的AI学习之旅
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <Card>
          <div className="px-6 py-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* 基本信息 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">基本信息</h3>
                
                <div className="space-y-4">
                  {/* 姓名 */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      姓名 *
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`appearance-none block w-full px-3 py-2 pl-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                          errors.name ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="请输入您的姓名"
                      />
                      <UserIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  {/* 邮箱 */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      邮箱地址 *
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
                      密码 *
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`appearance-none block w-full px-3 py-2 pl-10 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                          errors.password ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="至少8个字符"
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

                  {/* 确认密码 */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      确认密码 *
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`appearance-none block w-full px-3 py-2 pl-10 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                          errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="再次输入密码"
                      />
                      <LockClosedIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>

              {/* 学习背景 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">学习背景</h3>
                
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                    AI/ML 经验水平
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    {experienceOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label} - {option.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 兴趣领域 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  感兴趣的AI领域 (可多选)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {interestOptions.map(interest => (
                    <button
                      key={interest.value}
                      type="button"
                      onClick={() => handleInterestToggle(interest.value)}
                      className={`p-3 text-left border rounded-md transition-colors ${
                        formData.interests.includes(interest.value)
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{interest.icon}</span>
                        <span className="text-sm font-medium">{interest.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 用户协议 */}
              <div>
                <div className="flex items-start">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className={`mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded ${
                      errors.agreeTerms ? 'border-red-300' : ''
                    }`}
                  />
                  <label htmlFor="agreeTerms" className="ml-3 text-sm text-gray-700">
                    我已阅读并同意{' '}
                    <Link href="/terms" className="text-primary-600 hover:text-primary-500">
                      用户协议
                    </Link>{' '}
                    和{' '}
                    <Link href="/privacy" className="text-primary-600 hover:text-primary-500">
                      隐私政策
                    </Link>
                  </label>
                </div>
                {errors.agreeTerms && <p className="mt-1 text-sm text-red-600">{errors.agreeTerms}</p>}
              </div>

              {/* 提交按钮 */}
              <div>
                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  isLoading={isLoading}
                >
                  {isLoading ? '正在创建账户...' : '创建账户'}
                </Button>
              </div>
            </form>

            {/* 登录链接 */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                已有账户？{' '}
                <Link
                  href="/auth/signin"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  立即登录
                </Link>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}