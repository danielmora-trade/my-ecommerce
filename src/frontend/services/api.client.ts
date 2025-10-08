/**
 * Frontend API Client
 * This is the ONLY way the frontend communicates with the backend
 * NO direct Supabase calls should be made from the frontend
 */

import type {
  SignUpRequest,
  SignUpResponse,
  SignInRequest,
  SignInResponse,
  SignInWithOTPRequest,
  SignInWithOTPResponse,
  SignOutResponse,
  GetUserResponse,
  OAuthSignInRequest,
  OAuthSignInResponse,
} from '@/shared/types/api.types'

class APIClient {
  private baseURL: string

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || '/api'
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        credentials: 'include', // Important for cookies
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred')
      }

      return data
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error)
      throw error
    }
  }

  // ==================== AUTH METHODS ====================

  async signUp(data: SignUpRequest): Promise<SignUpResponse> {
    return this.request<SignUpResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async signIn(data: SignInRequest): Promise<SignInResponse> {
    return this.request<SignInResponse>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async signInWithOTP(data: SignInWithOTPRequest): Promise<SignInWithOTPResponse> {
    return this.request<SignInWithOTPResponse>('/auth/signin-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async signInWithOAuth(data: OAuthSignInRequest): Promise<OAuthSignInResponse> {
    return this.request<OAuthSignInResponse>('/auth/oauth', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async signOut(): Promise<SignOutResponse> {
    return this.request<SignOutResponse>('/auth/signout', {
      method: 'POST',
    })
  }

  async getUser(): Promise<GetUserResponse> {
    return this.request<GetUserResponse>('/auth/user', {
      method: 'GET',
    })
  }

  // ==================== PRODUCT METHODS ====================
  // TODO: Implement when product service is created

  // ==================== CART METHODS ====================
  // TODO: Implement when cart service is created

  // ==================== ORDER METHODS ====================
  // TODO: Implement when order service is created

  // ==================== PROFILE METHODS ====================
  // TODO: Implement when profile service is created
}

// Export singleton instance
export const apiClient = new APIClient()

// Also export class for testing
export { APIClient }

