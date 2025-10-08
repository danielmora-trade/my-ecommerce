/**
 * Backend API Route: Sign Out
 * POST /api/auth/signout
 */

import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/backend/services/auth.service'

export async function POST(request: NextRequest) {
  try {
    // Call backend service
    const result = await authService.signOut()

    // Clear session cookies
    const response = NextResponse.json(result, {
      status: 200,
    })

    response.cookies.delete('access_token')
    response.cookies.delete('refresh_token')

    return response
  } catch (error) {
    console.error('Sign out API error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    )
  }
}

