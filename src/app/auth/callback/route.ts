import { authService } from '@/backend/services/auth.service'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')
  const next = searchParams.get('next') ?? '/dashboard'

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, errorDescription)
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${error}`)
  }

  // PKCE flow - exchange code for session
  if (code) {
    const result = await authService.exchangeCodeForSession(code)
    
    if (result.success && result.session) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      let redirectUrl: string
      if (isLocalEnv) {
        redirectUrl = `${origin}${next}`
      } else if (forwardedHost) {
        redirectUrl = `https://${forwardedHost}${next}`
      } else {
        redirectUrl = `${origin}${next}`
      }

      const response = NextResponse.redirect(redirectUrl)

      // Set session cookies
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
  }

  // If no code, render HTML page that will handle hash fragment (implicit flow)
  // The hash fragment is not sent to the server, so we need client-side JS
  return new NextResponse(
    `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Completing sign in...</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(180deg, #ffffff 0%, #fef2f2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .container {
            background: white;
            border-radius: 1rem;
            padding: 3rem;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 400px;
            border: 1px solid #e5e7eb;
          }
          .spinner {
            width: 64px;
            height: 64px;
            border: 4px solid #fee2e2;
            border-top-color: #ef4444;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1.5rem;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          h2 {
            color: #1f2937;
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
          }
          p {
            color: #6b7280;
            font-size: 1rem;
          }
          .error {
            background: #fee2e2;
            color: #991b1b;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-top: 1rem;
          }
        </style>
        <script>
          (async function() {
            try {
              const hash = window.location.hash.substring(1);
              
              if (!hash) {
                // No hash params, might be an error or already handled
                console.log('No hash parameters found');
                window.location.href = '/auth/auth-code-error?error=no_hash_params';
                return;
              }

              const hashParams = new URLSearchParams(hash);
              const accessToken = hashParams.get('access_token');
              const refreshToken = hashParams.get('refresh_token');
              const expiresAt = hashParams.get('expires_at');
              const error = hashParams.get('error');
              const errorDescription = hashParams.get('error_description');

              // Check for errors in hash
              if (error) {
                console.error('OAuth error:', error, errorDescription);
                window.location.href = '/auth/auth-code-error?error=' + error;
                return;
              }

              if (accessToken && refreshToken) {
                console.log('Tokens found, sending to server...');
                
                // Send tokens to server to set cookies
                const response = await fetch('/api/auth/callback-tokens', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    expires_at: expiresAt,
                  }),
                  credentials: 'same-origin'
                });

                const data = await response.json();

                if (data.success) {
                  console.log('Session established successfully');
                  window.location.href = '${next}';
                } else {
                  console.error('Failed to set session:', data.message);
                  window.location.href = '/auth/auth-code-error?error=session_failed';
                }
              } else {
                console.error('No tokens found in hash');
                window.location.href = '/auth/auth-code-error?error=no_tokens';
              }
            } catch (error) {
              console.error('Callback error:', error);
              window.location.href = '/auth/auth-code-error?error=unexpected';
            }
          })();
        </script>
      </head>
      <body>
        <div class="container">
          <div class="spinner"></div>
          <h2>Signing you in...</h2>
          <p>Please wait while we complete your authentication.</p>
        </div>
      </body>
    </html>`,
    {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    }
  )
}
