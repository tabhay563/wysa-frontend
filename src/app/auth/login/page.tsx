'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { apiService } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nickname: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (apiService.isAuthenticated()) {
      if (apiService.isOnboardingComplete()) {
        router.push('/dashboard');
      } else {
        router.push('/onboarding/screen1');
      }
    }
  }, [router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nickname.trim()) {
      newErrors.nickname = 'Nickname is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await apiService.login({
        nickname: formData.nickname,
        password: formData.password,
      });
      
      if (response.user?.isOnboardingComplete) {
        router.push('/dashboard');
      } else {
        const currentScreen = response.user?.currentScreen;
        const progressPercentage = response.user?.progressPercentage || 0;
        
        if (progressPercentage === 0 && (!currentScreen || currentScreen === 'screen1')) {
          router.push('/onboarding/welcome');
        } else if (currentScreen && currentScreen !== 'completed') {
          router.push(`/onboarding/${currentScreen}`);
        } else {
          router.push('/onboarding/screen1');
        }
      }
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to sign in' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your Wysa account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="nickname"
            type="text"
            label="Nickname"
            value={formData.nickname}
            onChange={handleChange}
            error={errors.nickname}
            placeholder="Enter your nickname"
            required
          />

          <Input
            name="password"
            type="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Enter your password"
            required
          />

          {errors.submit && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {errors.submit}
            </div>
          )}

          <Button
            type="submit"
            loading={loading}
            className="w-full"
            size="lg"
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
} 