import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')
  const next = searchParams.get('next') ?? '/'

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, errorDescription)
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${error}`)
  }

  // Create Supabase client with cookie access
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )

  // Handle magic link (OTP) flow
  if (tokenHash && type) {
    console.log('Processing magic link callback:', { type })
    
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as 'email' | 'magiclink' | 'recovery' | 'invite' | 'signup' | 'email_change',
    })

    if (!verifyError && data?.session) {
      console.log('Magic link verified successfully')
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

      return NextResponse.redirect(redirectUrl)
    } else {
      console.error('Magic link verification error:', verifyError)
      const errorMessage = verifyError ? String(verifyError.message || verifyError) : 'Invalid or expired link'
      return NextResponse.redirect(`${origin}/auth/auth-code-error?error=magic_link_failed&details=${encodeURIComponent(errorMessage)}`)
    }
  }

  // Handle OAuth PKCE flow - exchange code for session
  if (code) {
    console.log('Processing OAuth callback with code')
    
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!exchangeError && data?.session) {
      console.log('OAuth code exchanged successfully')
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

      return NextResponse.redirect(redirectUrl)
    } else {
      console.error('Exchange code error:', exchangeError)
      const errorMessage = exchangeError ? String(exchangeError.message || exchangeError) : 'Unknown error'
      return NextResponse.redirect(`${origin}/auth/auth-code-error?error=exchange_failed&details=${encodeURIComponent(errorMessage)}`)
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
