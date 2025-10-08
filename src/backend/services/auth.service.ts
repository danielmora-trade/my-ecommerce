/**
 * Backend Authentication Service
 * Handles all Supabase authentication operations
 */

import { getSupabaseClient } from '@/backend/lib/supabase'
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

export class AuthService {
  private supabase = getSupabaseClient()

  /**
   * Sign up a new user with email and password
   */
  async signUp(data: SignUpRequest): Promise<SignUpResponse> {
    try {
      const { email, password } = data

      const { data: authData, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      })

      if (error) {
        return {
          success: false,
          message: error.message,
        }
      }

      return {
        success: true,
        message: 'Account created successfully. Please check your email for verification.',
        user: authData.user
          ? {
              id: authData.user.id,
              email: authData.user.email!,
            }
          : undefined,
      }
    } catch (error) {
      console.error('Sign up error:', error)
      return {
        success: false,
        message: 'An unexpected error occurred during sign up',
      }
    }
  }

  /**
   * Sign in a user with email and password
   */
  async signIn(data: SignInRequest): Promise<SignInResponse> {
    try {
      const { email, password } = data

      const { data: authData, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return {
          success: false,
          message: error.message,
        }
      }

      return {
        success: true,
        message: 'Signed in successfully',
        user: authData.user
          ? {
              id: authData.user.id,
              email: authData.user.email!,
              email_confirmed_at: authData.user.email_confirmed_at || null,
              created_at: authData.user.created_at,
              last_sign_in_at: authData.user.last_sign_in_at || null,
            }
          : undefined,
        session: authData.session
          ? {
              access_token: authData.session.access_token,
              refresh_token: authData.session.refresh_token,
            }
          : undefined,
      }
    } catch (error) {
      console.error('Sign in error:', error)
      return {
        success: false,
        message: 'An unexpected error occurred during sign in',
      }
    }
  }

  /**
   * Sign in with OTP (magic link)
   */
  async signInWithOTP(data: SignInWithOTPRequest): Promise<SignInWithOTPResponse> {
    try {
      const { email } = data

      const { error } = await this.supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      })

      if (error) {
        return {
          success: false,
          message: error.message,
        }
      }

      return {
        success: true,
        message: 'Magic link sent to your email',
      }
    } catch (error) {
      console.error('OTP sign in error:', error)
      return {
        success: false,
        message: 'An unexpected error occurred',
      }
    }
  }

  /**
   * Sign in with OAuth provider
   */
  async signInWithOAuth(data: OAuthSignInRequest): Promise<OAuthSignInResponse> {
    try {
      const { provider } = data

      const { data: authData, error } = await this.supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      })

      if (error) {
        return {
          success: false,
          message: error.message,
        }
      }

      return {
        success: true,
        url: authData.url,
      }
    } catch (error) {
      console.error('OAuth sign in error:', error)
      return {
        success: false,
        message: 'An unexpected error occurred',
      }
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<SignOutResponse> {
    try {
      const { error } = await this.supabase.auth.signOut()

      if (error) {
        return {
          success: false,
          message: error.message,
        }
      }

      return {
        success: true,
        message: 'Signed out successfully',
      }
    } catch (error) {
      console.error('Sign out error:', error)
      return {
        success: false,
        message: 'An unexpected error occurred during sign out',
      }
    }
  }

  /**
   * Get the current user
   */
  async getUser(accessToken?: string): Promise<GetUserResponse> {
    try {
      if (accessToken) {
        const { data: { user }, error } = await this.supabase.auth.getUser(accessToken)

        if (error) {
          return {
            success: false,
            message: error.message,
          }
        }

        return {
          success: true,
          user: user
            ? {
                id: user.id,
                email: user.email!,
                email_confirmed_at: user.email_confirmed_at || null,
                created_at: user.created_at,
                last_sign_in_at: user.last_sign_in_at || null,
              }
            : undefined,
        }
      }

      const { data: { user }, error } = await this.supabase.auth.getUser()

      if (error) {
        return {
          success: false,
          message: error.message,
        }
      }

      return {
        success: true,
        user: user
          ? {
              id: user.id,
              email: user.email!,
              email_confirmed_at: user.email_confirmed_at || null,
              created_at: user.created_at,
              last_sign_in_at: user.last_sign_in_at || null,
            }
          : undefined,
      }
    } catch (error) {
      console.error('Get user error:', error)
      return {
        success: false,
        message: 'An unexpected error occurred',
      }
    }
  }

  /**
   * Verify and exchange auth code for session
   */
  async exchangeCodeForSession(code: string) {
    try {
      const { data, error } = await this.supabase.auth.exchangeCodeForSession(code)

      if (error) {
        return {
          success: false,
          message: error.message,
        }
      }

      return {
        success: true,
        session: data.session,
        user: data.user,
      }
    } catch (error) {
      console.error('Exchange code error:', error)
      return {
        success: false,
        message: 'An unexpected error occurred',
      }
    }
  }
}

export const authService = new AuthService()

