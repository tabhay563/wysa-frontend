'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { apiService, Screen4Data } from '@/lib/api';

const sleepHourOptions = [
  { value: 4, label: '4 hours', description: 'Very short sleep' },
  { value: 5, label: '5 hours', description: 'Short sleep' },
  { value: 6, label: '6 hours', description: 'Below average' },
  { value: 7, label: '7 hours', description: 'Recommended minimum' },
  { value: 8, label: '8 hours', description: 'Ideal for most adults' },
  { value: 9, label: '9 hours', description: 'Extended sleep' },
  { value: 10, label: '10 hours', description: 'Long sleep' },
];

export default function Screen4Page() {
  const router = useRouter();
  const [selectedHours, setSelectedHours] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = () => {
    apiService.logout();
    router.push('/auth/login');
  };

  const handleSubmit = async () => {
    if (!selectedHours) {
      setError('Please select your desired sleep hours');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data: Screen4Data = {
        sleepHours: selectedHours
      };
      
      await apiService.submitScreen4(data);
      router.push('/onboarding/complete');
    } catch (error: any) {
      setError(error.message || 'Failed to save your sleep hours');
    } finally {
      setLoading(false);
    }
  };

  const getQualityColor = (hours: number) => {
    if (hours < 6) return 'text-red-600 bg-red-50 border-red-200';
    if (hours >= 7 && hours <= 9) return 'text-green-600 bg-green-50 border-green-200';
    return 'text-yellow-600 bg-yellow-50 border-yellow-200';
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
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }}></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            How many hours of sleep would you like to get?
          </h1>
          <p className="text-gray-600">
            Let's set a realistic sleep goal for you
          </p>
        </div>

        <div className="mb-8">
          <div className="text-center mb-6">
            <div className="inline-block p-6 bg-purple-50 rounded-full">
              <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {sleepHourOptions.map((option) => (
              <div
                key={option.value}
                className={`
                  p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                  ${selectedHours === option.value
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
                onClick={() => {
                  setSelectedHours(option.value);
                  setError('');
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`
                      w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center
                      ${selectedHours === option.value ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}
                    `}>
                      {selectedHours === option.value && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{option.label}</h3>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                  </div>
                  <div className={`
                    px-2 py-1 rounded-full text-xs font-medium border
                    ${getQualityColor(option.value)}
                  `}>
                    {option.value < 6 ? 'Too Short' : 
                     option.value >= 7 && option.value <= 9 ? 'Optimal' : 
                     'Extended'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedHours && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-center">
                <h4 className="font-medium text-blue-900 mb-1">Your Goal</h4>
                <p className="text-blue-700">
                  {selectedHours} hours of sleep per night
                </p>
                {selectedHours >= 7 && selectedHours <= 9 && (
                  <p className="text-sm text-blue-600 mt-1">
                    ✓ This aligns with expert recommendations for healthy adults
                  </p>
                )}
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
            disabled={!selectedHours}
          >
            Continue
          </Button>
        </div>
        </Card>
      </div>
    </div>
  );
} 