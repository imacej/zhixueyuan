'use client';

import { useState } from 'react';
import Link from 'next/link';
// Placeholder for future auth implementation
import { Disclosure } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  BeakerIcon,
  AcademicCapIcon,
  ChartBarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';

const navigation = [
  { name: '首页', href: '/', current: true },
  { name: '模型可视化', href: '/tools/visualization', icon: BeakerIcon },
  { name: '幻觉检测', href: '/tools/hallucination', icon: AcademicCapIcon },
  { name: '学习路径', href: '/learning-path', icon: ChartBarIcon },
  { name: '技术追踪', href: '/tech-tracker', icon: ChartBarIcon },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function Navbar() {
  const session = null; // Placeholder for future auth implementation

  return (
    <Disclosure as="nav" className="bg-white shadow-sm border-b">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link href="/" className="flex items-center space-x-2">
                    <BeakerIcon className="h-8 w-8 text-primary-600" />
                    <span className="font-bold text-xl text-gray-900">ALAH</span>
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? 'border-primary-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                          'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                        )}
                      >
                        {Icon && <Icon className="h-4 w-4 mr-1.5" />}
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                {session ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-700">
                      欢迎, {session.user?.name}
                    </span>
                    <Link href="/profile">
                      <UserCircleIcon className="h-8 w-8 text-gray-400 hover:text-gray-600" />
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => console.log('logout')}
                    >
                      退出
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link href="/auth/signin">
                      <Button variant="outline" size="sm">
                        登录
                      </Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button size="sm">
                        注册
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                  <span className="sr-only">打开主菜单</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    href={item.href}
                    className={classNames(
                      item.current
                        ? 'bg-primary-50 border-primary-500 text-primary-700'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
                      'block pl-3 pr-4 py-2 border-l-4 text-base font-medium flex items-center'
                    )}
                  >
                    {Icon && <Icon className="h-5 w-5 mr-2" />}
                    {item.name}
                  </Disclosure.Button>
                );
              })}
            </div>
            {session ? (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <UserCircleIcon className="h-10 w-10 text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {session.user?.name}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {session.user?.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Disclosure.Button
                    as={Link}
                    href="/profile"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    个人资料
                  </Disclosure.Button>
                  <button
                    onClick={() => console.log('logout')}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    退出
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="space-y-1 px-4">
                  <Link
                    href="/auth/signin"
                    className="block text-base font-medium text-gray-500 hover:text-gray-800"
                  >
                    登录
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block text-base font-medium text-primary-600 hover:text-primary-800"
                  >
                    注册
                  </Link>
                </div>
              </div>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}