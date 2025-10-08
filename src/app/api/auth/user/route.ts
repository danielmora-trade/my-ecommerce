/**
 * Backend API Route: Get Current User
 * GET /api/auth/user
 */

import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/backend/services/auth.service'

export async function GET(request: NextRequest) {
  try {
    // Get access token from cookie
    const accessToken = request.cookies.get('access_token')?.value

    // Call backend service
    const result = await authService.getUser(accessToken)

    return NextResponse.json(result, {
      status: result.success ? 200 : 401,
    })
  } catch (error) {
    console.error('Get user API error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    )
  }
}

