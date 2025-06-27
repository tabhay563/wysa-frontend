'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (apiService.isAuthenticated()) {
      if (apiService.isOnboardingComplete()) {
        router.push('/dashboard');
      } else {
        router.push('/onboarding/screen1');
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">🌙</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Wysa</h1>
          <p className="text-gray-600">
            Your personalized sleep companion. Improve your sleep quality through guided onboarding and insights.
          </p>
        </div>

        <div className="space-y-3">
          <Link href="/auth/signup" className="block">
            <Button size="lg" className="w-full">
              Get Started
            </Button>
          </Link>
          
          <Link href="/auth/login" className="block">
            <Button variant="outline" size="lg" className="w-full">
              Sign In
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Take the first step towards better sleep</p>
        </div>
      </Card>
    </div>
  );
}
