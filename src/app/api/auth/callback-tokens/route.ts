/**
 * Backend API Route: Handle OAuth Callback Tokens
 * POST /api/auth/callback-tokens
 * 
 * This route receives tokens from the OAuth implicit flow (hash fragment)
 * and sets them as HTTP-only cookies for security
 */

import { NextRequest, NextResponse } from 'next/server'

interface CallbackTokensRequest {
  access_token: string
  refresh_token: string
  expires_at?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: CallbackTokensRequest = await request.json()
    const { access_token, refresh_token } = body

    // Validate tokens
    if (!access_token || !refresh_token) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing access_token or refresh_token',
        },
        { status: 400 }
      )
    }

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Session cookies set successfully',
      },
      { status: 200 }
    )

    // Set session cookies
    response.cookies.set('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    response.cookies.set('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Callback tokens error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to set session cookies',
      },
      { status: 500 }
    )
  }
}

