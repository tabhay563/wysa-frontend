'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { apiService, CompleteOnboardingData } from '@/lib/api';

type DesiredChange = 'GO_TO_SLEEP_EASILY' | 'SLEEP_THROUGH_NIGHT' | 'WAKE_UP_REFRESHED';

const desiredChangeOptions = [
  {
    value: 'GO_TO_SLEEP_EASILY' as DesiredChange,
    label: 'Go to sleep easily',
    description: 'Fall asleep faster when you get into bed',
    icon: '🌙'
  },
  {
    value: 'SLEEP_THROUGH_NIGHT' as DesiredChange,
    label: 'Sleep through the night',
    description: 'Stay asleep without frequent wake-ups',
    icon: '💤'
  },
  {
    value: 'WAKE_UP_REFRESHED' as DesiredChange,
    label: 'Wake up refreshed',
    description: 'Feel energized and rested in the morning',
    icon: '☀️'
  }
];

export default function CompleteOnboardingPage() {
  const router = useRouter();
  const [selectedChanges, setSelectedChanges] = useState<DesiredChange[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = () => {
    apiService.logout();
    router.push('/auth/login');
  };

  const handleToggleChange = (change: DesiredChange) => {
    setSelectedChanges(prev => {
      if (prev.includes(change)) {
        return prev.filter(c => c !== change);
      } else {
        return [...prev, change];
      }
    });
    setError('');
  };

  const handleSubmit = async () => {
    if (selectedChanges.length === 0) {
      setError('Please select at least one desired change');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data: CompleteOnboardingData = {
        desiredChanges: selectedChanges
      };
      
      await apiService.completeOnboarding(data);
      
      try {
        const freshUserInfo = await apiService.refreshUserInfo();
        
        if (freshUserInfo && freshUserInfo.isOnboardingComplete) {
          router.push('/dashboard');
        } else {
          const userInfo = apiService.getUserInfo();
          const updatedUser = {
            ...(userInfo || {}),
            isOnboardingComplete: true,
            currentScreen: 'completed',
            progressPercentage: 100
          };
          localStorage.setItem('userInfo', JSON.stringify(updatedUser));
          
          setTimeout(() => {
            router.push('/dashboard');
          }, 200);
        }
      } catch (error) {
        const userInfo = apiService.getUserInfo();
        const updatedUser = {
          ...(userInfo || {}),
          isOnboardingComplete: true,
          currentScreen: 'completed',
          progressPercentage: 100
        };
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 200);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <div className="flex justify-end mb-4 max-w-2xl mx-auto">
        <Button onClick={handleLogout} variant="outline" size="sm">
          Logout
        </Button>
      </div>
      
      <div className="flex items-center justify-center">
        <Card className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            What would you like to improve about your sleep?
          </h1>
          <p className="text-gray-600">
            Select all areas where you'd like to see improvement (you can choose multiple)
          </p>
        </div>

        <div className="mb-8">
          <div className="text-center mb-6">
            <div className="inline-block p-6 bg-green-50 rounded-full">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div className="space-y-4">
            {desiredChangeOptions.map((option) => {
              const isSelected = selectedChanges.includes(option.value);
              return (
                <div
                  key={option.value}
                  className={`
                    p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                    ${isSelected
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                  onClick={() => handleToggleChange(option.value)}
                >
                  <div className="flex items-center">
                    <div className={`
                      w-6 h-6 rounded border-2 mr-3 flex items-center justify-center
                      ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}
                    `}>
                      {isSelected && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="text-2xl mr-3">{option.icon}</div>
                    <div>
                      <h3 className="font-medium text-gray-900">{option.label}</h3>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedChanges.length > 0 && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-center">
                <h4 className="font-medium text-green-900 mb-2">Your Sleep Goals</h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {selectedChanges.map((change) => {
                    const option = desiredChangeOptions.find(opt => opt.value === change);
                    return (
                      <span key={change} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {option?.icon} {option?.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => router.back()}
          >
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            loading={loading}
            disabled={selectedChanges.length === 0}
            className="bg-green-600 hover:bg-green-700 focus:ring-green-500"
          >
            Complete Setup
          </Button>
        </div>
        </Card>
      </div>
    </div>
  );
} 