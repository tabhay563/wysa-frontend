const API_BASE_URL = 'https://api.tabhay.tech';

export interface AuthRequest {
  nickname: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  message?: string;
  user?: {
    userId: string;
    nickname: string;
    currentScreen: string;
    isOnboardingComplete: boolean;
    progressPercentage: number;
  };
}

export interface Screen1Data {
  sleepStruggleDuration: 'LESS_THAN_2_WEEKS' | 'TWO_TO_EIGHT_WEEKS' | 'MORE_THAN_8_WEEKS';
}

export interface Screen2Data {
  bedTime: string;
}

export interface Screen3Data {
  wakeUpTime: string;
  sleepHours?: number;
}

export interface Screen4Data {
  sleepHours: number;
}

export interface CompleteOnboardingData {
  desiredChanges: ('GO_TO_SLEEP_EASILY' | 'SLEEP_THROUGH_NIGHT' | 'WAKE_UP_REFRESHED')[];
}

export interface AnalyticsResponse {
  summary: {
    totalUsers: number;
    completedUsers: number;
    dropOffUsers: number;
    completionRate: number;
  };
  completedUsers: any[];
  droppedOffUsers: any[];
  screenAnalytics: any[];
  funnelData: any[];
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async signup(data: AuthRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await this.handleResponse<AuthResponse>(response);
    
    if (result.token) {
      localStorage.setItem('authToken', result.token);
    }
    
    return result;
  }

  async login(data: AuthRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await this.handleResponse<AuthResponse>(response);
    
    if (result.token) {
      localStorage.setItem('authToken', result.token);
    }
    if (result.user) {
      localStorage.setItem('userInfo', JSON.stringify(result.user));
    }
    
    return result;
  }
  async submitScreen1(data: Screen1Data): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/onboarding/screen1`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async submitScreen2(data: Screen2Data): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/onboarding/screen2`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async submitScreen3(data: Screen3Data): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/onboarding/screen3`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async submitScreen4(data: Screen4Data): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/onboarding/screen4`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async completeOnboarding(data: CompleteOnboardingData): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/onboarding/complete`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async getUserDetails(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/user/details`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getAnalytics(): Promise<AnalyticsResponse> {
    const response = await fetch(`${API_BASE_URL}/api/stats/analytics`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<AnalyticsResponse>(response);
  }

  async healthCheck(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/health`);
    return this.handleResponse(response);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUserInfo(): any {
    try {
      const userInfo = localStorage.getItem('userInfo');
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      return null;
    }
  }

  isOnboardingComplete(): boolean {
    const userInfo = this.getUserInfo();
    return userInfo?.isOnboardingComplete === true;
  }

  async refreshUserInfo(): Promise<any> {
    try {
      const userDetails = await this.getUserDetails();
      if (userDetails.user) {
        localStorage.setItem('userInfo', JSON.stringify(userDetails.user));
        return userDetails.user;
      }
      return userDetails;
    } catch (error) {
      return null;
    }
  }
}

export const apiService = new ApiService(); 