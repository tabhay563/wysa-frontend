'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { apiService } from '@/lib/api';

export default function WelcomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    apiService.logout();
    router.push('/auth/login');
  };

  const handleGetStarted = async () => {
    setLoading(true);
    try {
      router.push('/onboarding/screen1');
    } catch (error) {
      setLoading(false);
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
          <div className="text-center p-12">
            <div className="mb-8 flex justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-6xl">
                🦉
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Hey! I'm Wysa
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              I'm here to help you sleep better
            </p>

            <p className="text-gray-500 mb-12 max-w-md mx-auto">
              Let's start by understanding your sleep patterns and challenges. 
              This will help me provide personalized recommendations just for you.
            </p>

            <Button 
              onClick={handleGetStarted}
              disabled={loading}
              className="px-8 py-3 text-lg"
            >
              {loading ? 'Getting Started...' : 'Let\'s Get Started'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
} 