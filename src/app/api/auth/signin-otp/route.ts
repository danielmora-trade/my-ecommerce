/**
 * Backend API Route: Sign In with OTP
 * POST /api/auth/signin-otp
 */

import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/backend/services/auth.service'
import type { SignInWithOTPRequest } from '@/shared/types/api.types'

export async function POST(request: NextRequest) {
  try {
    const body: SignInWithOTPRequest = await request.json()

    // Validate request body
    if (!body.email) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email is required',
        },
        { status: 400 }
      )
    }

    // Call backend service
    const result = await authService.signInWithOTP(body)

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    })
  } catch (error) {
    console.error('OTP sign in API error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    )
  }
}

