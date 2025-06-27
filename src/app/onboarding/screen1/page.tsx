'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { apiService, Screen1Data } from '@/lib/api';

type SleepStruggleDuration = 'LESS_THAN_2_WEEKS' | 'TWO_TO_EIGHT_WEEKS' | 'MORE_THAN_8_WEEKS';

const options = [
  {
    value: 'LESS_THAN_2_WEEKS' as SleepStruggleDuration,
    label: 'Less than 2 weeks',
    description: 'Recent sleep issues'
  },
  {
    value: 'TWO_TO_EIGHT_WEEKS' as SleepStruggleDuration,
    label: '2 to 8 weeks',
    description: 'Ongoing sleep challenges'
  },
  {
    value: 'MORE_THAN_8_WEEKS' as SleepStruggleDuration,
    label: 'More than 8 weeks',
    description: 'Long-term sleep difficulties'
  }
];

export default function Screen1Page() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<SleepStruggleDuration | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = () => {
    apiService.logout();
    router.push('/auth/login');
  };

  const handleSubmit = async () => {
    if (!selectedOption) {
      setError('Please select an option to continue');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data: Screen1Data = {
        sleepStruggleDuration: selectedOption
      };
      
      await apiService.submitScreen1(data);
      router.push('/onboarding/screen2');
    } catch (error: any) {
      setError(error.message || 'Failed to save your response');
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
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '20%' }}></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            How long have you been struggling with sleep?
          </h1>
          <p className="text-gray-600">
            Understanding your sleep timeline helps us personalize your experience
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {options.map((option) => (
            <div
              key={option.value}
              className={`
                p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                ${selectedOption === option.value
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
              onClick={() => {
                setSelectedOption(option.value);
                setError('');
              }}
            >
              <div className="flex items-center">
                <div className={`
                  w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center
                  ${selectedOption === option.value ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}
                `}>
                  {selectedOption === option.value && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{option.label}</h3>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              if (apiService.isAuthenticated() && apiService.isOnboardingComplete()) {
                router.push('/dashboard');
              } else {
                router.back();
              }
            }}
          >
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            loading={loading}
            disabled={!selectedOption}
          >
            Continue
          </Button>
        </div>
        </Card>
      </div>
    </div>
  );
} 