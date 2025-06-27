'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { apiService } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!apiService.isAuthenticated()) {
        router.push('/auth/login');
        return;
      }

      try {
        const freshUserInfo = await apiService.refreshUserInfo();
        
        if (!freshUserInfo) {
          router.push('/auth/login');
          return;
        }

        if (!freshUserInfo.isOnboardingComplete) {
          router.push('/onboarding/screen1');
          return;
        }

        setUserInfo(freshUserInfo);
        setLoading(false);
      } catch (error) {
        const localUserInfo = apiService.getUserInfo();
        if (localUserInfo?.isOnboardingComplete) {
          setUserInfo(localUserInfo);
          setLoading(false);
        } else {
          router.push('/onboarding/screen1');
        }
      }
    };

    loadDashboard();
  }, [router]);

  const handleLogout = () => {
    apiService.logout();
    router.push('/auth/login');
  };

  const handleViewAnalytics = () => {
    router.push('/analytics');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {userInfo?.nickname}! 🌙
            </h1>
            <p className="text-gray-600 mt-1">Your personalized sleep journey continues</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <div className="text-center">
              <div className="text-4xl mb-4">✅</div>
              <h2 className="text-xl font-semibold text-green-900 mb-2">
                Onboarding Complete!
              </h2>
              <p className="text-green-700 mb-4">
                You've successfully completed your sleep assessment
              </p>
              <div className="bg-green-100 rounded-full h-3 mb-2">
                <div 
                  className="bg-green-600 h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${userInfo?.progressPercentage || 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-green-600 font-medium">
                {userInfo?.progressPercentage || 100}% Complete
              </p>
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <h2 className="text-xl font-semibold text-purple-900 mb-2">
                Sleep Analytics
              </h2>
              <p className="text-purple-700 mb-4">
                View comprehensive insights and patterns from user data
              </p>
              <Button 
                onClick={handleViewAnalytics}
                className="bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
              >
                Go to Analytics
              </Button>
            </div>
          </Card>
        </div>

        <Card title="Your Sleep Journey" subtitle="A summary of your onboarding experience">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl mb-2">🛏️</div>
              <h3 className="font-medium text-blue-900">Sleep Assessment</h3>
              <p className="text-sm text-blue-700 mt-1">Completed your personalized sleep evaluation</p>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl mb-2">⏰</div>
              <h3 className="font-medium text-yellow-900">Schedule Setup</h3>
              <p className="text-sm text-yellow-700 mt-1">Configured your ideal sleep schedule</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-medium text-green-900">Goals Set</h3>
              <p className="text-sm text-green-700 mt-1">Defined your sleep improvement targets</p>
            </div>
          </div>
        </Card>

        <Card title="Quick Actions" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              onClick={handleViewAnalytics}
              className="h-16 flex flex-col justify-center"
            >
              <span className="text-lg mb-1">📈</span>
              View Analytics
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => router.push('/onboarding/screen1')}
              className="h-16 flex flex-col justify-center"
            >
              <span className="text-lg mb-1">🔄</span>
              Retake Assessment
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="h-16 flex flex-col justify-center"
            >
              <span className="text-lg mb-1">👋</span>
              Logout
            </Button>
          </div>
        </Card>

        <div className="text-center mt-8 text-gray-500">
          <p className="text-sm">
            Continue your journey to better sleep with Wysa 🌙
          </p>
        </div>
      </div>
    </div>
  );
} 