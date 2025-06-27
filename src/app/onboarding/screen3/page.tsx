'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { apiService, Screen3Data } from '@/lib/api';

export default function Screen3Page() {
  const router = useRouter();
  const [wakeUpTime, setWakeUpTime] = useState('');
  const [sleepHours, setSleepHours] = useState<number | ''>('');
  const [calculatedHours, setCalculatedHours] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = () => {
    apiService.logout();
    router.push('/auth/login');
  };

  useEffect(() => {
    if (wakeUpTime) {
      const [wakeHours, wakeMinutes] = wakeUpTime.split(':').map(Number);
      const bedHours = 22;
      const bedMinutes = 30;
      
      let totalMinutes = (wakeHours * 60 + wakeMinutes) - (bedHours * 60 + bedMinutes);
      if (totalMinutes < 0) {
        totalMinutes += 24 * 60;
      }
      
      const hours = Math.round(totalMinutes / 60 * 10) / 10;
      setCalculatedHours(hours);
    }
  }, [wakeUpTime]);

  const validateForm = () => {
    if (!wakeUpTime) {
      return 'Please select your wake up time';
    }
    
    const [hours, minutes] = wakeUpTime.split(':').map(Number);
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return 'Please enter a valid time';
    }

    if (sleepHours !== '' && (sleepHours < 1 || sleepHours > 12)) {
      return 'Sleep hours must be between 1 and 12';
    }
    
    return '';
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data: Screen3Data = {
        wakeUpTime: wakeUpTime,
        ...(sleepHours !== '' && { sleepHours: Number(sleepHours) })
      };
      
      await apiService.submitScreen3(data);
      router.push('/onboarding/screen4');
    } catch (error: any) {
      setError(error.message || 'Failed to save your wake up time');
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
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            What time do you usually wake up?
          </h1>
          <p className="text-gray-600">
            Let's understand your complete sleep schedule
          </p>
        </div>

        <div className="mb-8 space-y-6">
          <div className="text-center">
            <div className="inline-block p-6 bg-yellow-50 rounded-full mb-4">
              <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>

          <div className="max-w-xs mx-auto space-y-4">
            <Input
              type="time"
              label="Wake up time"
              value={wakeUpTime}
              onChange={(e) => {
                setWakeUpTime(e.target.value);
                setError('');
              }}
              className="text-center text-lg"
            />
            
            {wakeUpTime && (
              <div className="text-center text-gray-600">
                You usually wake up at {formatTimeDisplay(wakeUpTime)}
              </div>
            )}

            <Input
              type="number"
              label="Sleep hours (optional)"
              value={sleepHours}
              onChange={(e) => {
                const value = e.target.value === '' ? '' : Number(e.target.value);
                setSleepHours(value);
                setError('');
              }}
              min={1}
              max={12}
              step={0.5}
              placeholder="Enter hours of sleep"
              helperText="If left blank, we'll calculate based on your bedtime"
            />

            {calculatedHours && sleepHours === '' && (
              <div className="text-center text-sm text-blue-600 bg-blue-50 p-3 rounded-md">
                Based on your schedule, you get approximately {calculatedHours} hours of sleep
              </div>
            )}
          </div>
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
            disabled={!wakeUpTime}
          >
            Continue
          </Button>
        </div>
        </Card>
      </div>
    </div>
  );
} 