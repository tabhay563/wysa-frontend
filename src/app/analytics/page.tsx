 'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { apiService, AnalyticsResponse } from '@/lib/api';

export default function AnalyticsPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!apiService.isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    if (!apiService.isOnboardingComplete()) {
      router.push('/onboarding/screen1');
      return;
    }

    fetchAnalytics();
  }, [router]);

  const fetchAnalytics = async () => {
    try {
      const response = await apiService.getAnalytics();
      const data = (response as any).data?.data || (response as any).data || response;
      
      const normalizedData = {
        summary: {
          totalUsers: data.summary?.totalUsersRegistered || 0,
          completedUsers: data.summary?.totalUsersCompletedOnboarding || 0,
          dropOffUsers: (data.summary?.totalUsersRegistered || 0) - (data.summary?.totalUsersCompletedOnboarding || 0),
          completionRate: data.summary?.overallCompletionRate || 0
        },
        completedUsers: data.completedUsers || [],
        droppedOffUsers: data.droppedOffUsers || [],
        screenAnalytics: data.screenAnalytics || [],
        funnelData: data.funnel || []
      };
      
      setAnalytics(normalizedData);
    } catch (error: any) {
      setError(error.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    apiService.logout();
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{error}</p>
          </div>
          <div className="space-x-2">
            <Button onClick={fetchAnalytics} variant="outline">
              Retry
            </Button>
            <Button onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Wysa Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Comprehensive insights into user onboarding and sleep patterns</p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={() => router.push('/dashboard')} variant="outline">
              Back to Dashboard
            </Button>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>

        {analytics && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {analytics.summary?.totalUsers ?? 0}
                </div>
                <p className="text-gray-600">Total Users</p>
              </Card>
              
              <Card className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {analytics.summary?.completedUsers ?? 0}
                </div>
                <p className="text-gray-600">Completed Users</p>
              </Card>
              
              <Card className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-1">
                  {analytics.summary?.dropOffUsers ?? 0}
                </div>
                <p className="text-gray-600">Dropped Off</p>
              </Card>
              
              <Card className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {analytics.summary?.completionRate?.toFixed(1) ?? '0.0'}%
                </div>
                <p className="text-gray-600">Completion Rate</p>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Completed Users" subtitle="Users who finished the onboarding process">
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {analytics.completedUsers && analytics.completedUsers.length > 0 ? (
                    analytics.completedUsers.map((user: any, index: number) => (
                      <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium text-green-900">
                                {user.nickname || `User ${index + 1}`}
                              </p>
                              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                Completed
                              </span>
                            </div>
                            {user.onboardingData?.sleepStruggleDuration && (
                              <p className="text-sm text-green-700">
                                Sleep issue: {user.onboardingData.sleepStruggleDuration.replace(/_/g, ' ').toLowerCase()}
                              </p>
                            )}
                            {user.onboardingData?.bedTime && user.onboardingData?.wakeUpTime && (
                              <p className="text-sm text-green-700">
                                Schedule: {user.onboardingData.bedTime} - {user.onboardingData.wakeUpTime}
                              </p>
                            )}
                            {user.onboardingData?.desiredChanges && user.onboardingData.desiredChanges.length > 0 && (
                              <p className="text-sm text-green-700">
                                Goals: {user.onboardingData.desiredChanges.length} selected
                              </p>
                            )}
                            {user.completedAt && (
                              <p className="text-xs text-green-600 mt-1">
                                Completed: {new Date(user.completedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No completed users yet</p>
                  )}
                </div>
              </Card>

              <Card title="Dropped Off Users" subtitle="Users who started but didn't complete onboarding">
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {analytics.droppedOffUsers && analytics.droppedOffUsers.length > 0 ? (
                    analytics.droppedOffUsers.map((user: any, index: number) => (
                      <div key={index} className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium text-red-900">
                                {user.nickname || `User ${index + 1}`}
                              </p>
                              <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                                Dropped Off
                              </span>
                            </div>
                            {user.journey && user.journey.length > 0 ? (
                              <p className="text-sm text-red-700">
                                Last screen: {user.journey[user.journey.length - 1].screen}
                              </p>
                            ) : (
                              <p className="text-sm text-red-700">
                                Never started onboarding
                              </p>
                            )}
                            {user.partialData?.sleepStruggleDuration && (
                              <p className="text-sm text-red-700">
                                Sleep issue: {user.partialData.sleepStruggleDuration.replace(/_/g, ' ').toLowerCase()}
                              </p>
                            )}
                            {user.lastActiveAt && (
                              <p className="text-xs text-red-600 mt-1">
                                Last active: {new Date(user.lastActiveAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No dropoffs tracked yet</p>
                  )}
                </div>
              </Card>
            </div>

            {analytics.screenAnalytics && analytics.screenAnalytics.length > 0 && (
              <Card title="Screen Analytics" subtitle="Performance metrics for each onboarding screen">
                <div className="space-y-4">
                  {analytics.screenAnalytics.map((screen: any, index: number) => {
                    const visited = screen.usersWhoVisited?.length || 0;
                    const completed = screen.usersWhoCompleted?.length || 0;
                    const droppedOff = screen.usersWhoDroppedOff?.length || 0;
                    const completionRate = visited > 0 ? ((completed / visited) * 100).toFixed(1) : 0;
                    const dropOffRate = visited > 0 ? ((droppedOff / visited) * 100).toFixed(1) : 0;
                    
                    return (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-gray-900 capitalize">
                            {screen.screen || `Screen ${index + 1}`}
                          </h4>
                          <div className="flex space-x-4 text-sm">
                            <span className="text-blue-600">
                              Visits: {visited}
                            </span>
                            <span className="text-green-600">
                              Completed: {completed}
                            </span>
                            <span className="text-red-600">
                              Dropped: {droppedOff}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2 mb-2">
                          <div className="flex-1">
                            <div className="text-xs text-gray-600 mb-1">Completion Rate: {completionRate}%</div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${completionRate}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-gray-600 mb-1">Drop Rate: {dropOffRate}%</div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-red-600 h-2 rounded-full" 
                                style={{ width: `${dropOffRate}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        {screen.usersWhoVisited && screen.usersWhoVisited.length > 0 && (
                          <p className="text-xs text-gray-600 mt-2">
                            Users: {screen.usersWhoVisited.map((u: any) => u.nickname).slice(0, 5).join(', ')}
                            {screen.usersWhoVisited.length > 5 && ` +${screen.usersWhoVisited.length - 5} more`}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {analytics.funnelData && analytics.funnelData.length > 0 && (
              <Card title="Conversion Funnel" subtitle="User flow through the onboarding process">
                <div className="space-y-2">
                  {analytics.funnelData.map((step: any, index: number) => {
                    const visits = step.visits || 0;
                    const completions = step.completions || 0;
                    const dropOffs = step.dropOffs || 0;
                    const maxVisits = Math.max(...analytics.funnelData.map((s: any) => s.visits || 0));
                    const completionRate = visits > 0 ? ((completions / visits) * 100).toFixed(1) : 0;
                    const dropOffRate = visits > 0 ? ((dropOffs / visits) * 100).toFixed(1) : 0;
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex-1">
                          <span className="font-medium capitalize">{step.screen || `Step ${index + 1}`}</span>
                          <div className="text-xs text-gray-500 mt-1">
                            Visits: {visits} | Completions: {completions} | Drop-offs: {dropOffs}
                          </div>
                          <div className="text-xs text-gray-500">
                            Completion Rate: {completionRate}% | Drop Rate: {dropOffRate}%
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600">{visits} visits</span>
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ 
                                width: `${maxVisits > 0 ? (visits / maxVisits) * 100 : 0}%` 
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">
                            {((visits / (analytics.summary?.totalUsers || 1)) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 