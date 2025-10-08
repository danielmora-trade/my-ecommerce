/**
 * Backend API Route: Sign Up
 * POST /api/auth/signup
 */

import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/backend/services/auth.service'
import type { SignUpRequest } from '@/shared/types/api.types'

export async function POST(request: NextRequest) {
  try {
    const body: SignUpRequest = await request.json()

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
    const result = await authService.signUp(body)

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    })
  } catch (error) {
    console.error('Sign up API error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    )
  }
}

