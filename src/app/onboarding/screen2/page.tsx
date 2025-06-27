'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { apiService, Screen2Data } from '@/lib/api';

export default function Screen2Page() {
  const router = useRouter();
  const [bedTime, setBedTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = () => {
    apiService.logout();
    router.push('/auth/login');
  };

  const validateTime = (time: string) => {
    if (!time) {
      return 'Please select your bedtime';
    }
    
    const [hours, minutes] = time.split(':').map(Number);
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return 'Please enter a valid time';
    }
    
    return '';
  };

  const handleSubmit = async () => {
    const validationError = validateTime(bedTime);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data: Screen2Data = {
        bedTime: bedTime
      };
      
      await apiService.submitScreen2(data);
      router.push('/onboarding/screen3');
    } catch (error: any) {
      setError(error.message || 'Failed to save your bedtime');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeDisplay = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour12 = parseInt(hours) % 12 || 12;
    const ampm = parseInt(hours) < 12 ? 'AM' : 'PM';
    return `${hour12}:${minutes} ${ampm}`;
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
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '40%' }}></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            What time do you usually go to bed?
          </h1>
          <p className="text-gray-600">
            Help us understand your current sleep schedule
          </p>
        </div>

        <div className="mb-8 space-y-6">
          <div className="text-center">
            <div className="inline-block p-6 bg-blue-50 rounded-full mb-4">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
          </div>

          <div className="max-w-xs mx-auto">
            <Input
              type="time"
              label="Bedtime"
              value={bedTime}
              onChange={(e) => {
                setBedTime(e.target.value);
                setError('');
              }}
              error={error}
              className="text-center text-lg"
            />
            
            {bedTime && (
              <div className="text-center mt-2 text-gray-600">
                You usually go to bed at {formatTimeDisplay(bedTime)}
              </div>
            )}
          </div>

          <div className="text-center text-sm text-gray-500">
            Select the time you typically get into bed, not necessarily when you fall asleep
          </div>
        </div>

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
            disabled={!bedTime}
          >
            Continue
          </Button>
        </div>
        </Card>
      </div>
    </div>
  );
} 