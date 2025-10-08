/**
 * Backend API Route: Sign In
 * POST /api/auth/signin
 */

import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/backend/services/auth.service'
import type { SignInRequest } from '@/shared/types/api.types'

export async function POST(request: NextRequest) {
  try {
    const body: SignInRequest = await request.json()

    // Validate request body
    if (!body.email || !body.password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email and password are required',
        },
        { status: 400 }
      )
    }

    // Call backend service
    const result = await authService.signIn(body)

    // Set session cookies if successful
    if (result.success && result.session) {
      const response = NextResponse.json(result, {
        status: 200,
      })

      // Set HTTP-only cookies for security
      response.cookies.set('access_token', result.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })

      response.cookies.set('refresh_token', result.session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      })

      return response
    }

    return NextResponse.json(result, {
      status: result.success ? 200 : 401,
    })
  } catch (error) {
    console.error('Sign in API error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    )
  }
}

