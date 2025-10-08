/**
 * Backend API Route: OAuth Sign In
 * POST /api/auth/oauth
 */

import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/backend/services/auth.service'
import type { OAuthSignInRequest } from '@/shared/types/api.types'

export async function POST(request: NextRequest) {
  try {
    const body: OAuthSignInRequest = await request.json()

    // Validate request body
    if (!body.provider) {
      return NextResponse.json(
        {
          success: false,
          message: 'Provider is required',
        },
        { status: 400 }
      )
    }

    // Call backend service
    const result = await authService.signInWithOAuth(body)

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    })
  } catch (error) {
    console.error('OAuth sign in API error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    )
  }
}

