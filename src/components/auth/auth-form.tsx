'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'

interface AuthFormProps {
  mode: 'signin' | 'signup'
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password')

  const handleEmailPasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const supabase = createClient()

      if (mode === 'signup') {
        if (password !== confirmPassword) {
          setMessage({ type: 'error', text: 'Passwords do not match' })
          setIsLoading(false)
          return
        }
        if (password.length < 6) {
          setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
          setIsLoading(false)
          return
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })

        if (error) {
          setMessage({ type: 'error', text: error.message })
        } else {
          setMessage({ 
            type: 'success', 
            text: 'Account created successfully. Please check your email for verification.' 
          })
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          setMessage({ type: 'error', text: error.message })
        } else {
          setMessage({ type: 'success', text: 'Successfully signed in! Redirecting...' })
          // Redirect to home page
          setTimeout(() => {
            router.push('/')
            router.refresh()
          }, 500)
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      setMessage({ type: 'error', text: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({ 
          type: 'success', 
          text: 'Magic link sent to your email' 
        })
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      setMessage({ type: 'error', text: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setIsLoading(true)
    setMessage(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        setMessage({ type: 'error', text: error.message || 'OAuth sign in failed' })
        setIsLoading(false)
      }
      // If successful, the user will be redirected, so we don't need to set isLoading to false
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      setMessage({ type: 'error', text: errorMessage })
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-border shadow-xl">
      <CardContent className="pt-6 pb-8 px-8">
        {/* Auth Method Toggle */}
        <div className="flex gap-2 p-1 bg-muted rounded-lg mb-6">
          <button
            type="button"
            onClick={() => setAuthMethod('password')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              authMethod === 'password'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => setAuthMethod('otp')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              authMethod === 'otp'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Magic Link
          </button>
        </div>

        {/* Messages */}
        {message && (
          <Alert 
            className={`mb-6 ${
              message.type === 'error' 
                ? 'border-destructive bg-destructive/10' 
                : 'border-brand-600 bg-brand-50'
            }`}
          >
            {message.type === 'error' ? (
              <AlertCircle className="h-4 w-4 text-destructive" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-brand-600" />
            )}
            <AlertDescription className={message.type === 'error' ? 'text-destructive' : 'text-brand-700'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {/* Email/Password Form */}
        {authMethod === 'password' && (
          <form onSubmit={handleEmailPasswordAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={isLoading}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-brand-600 hover:bg-brand-700 text-white font-medium shadow-lg shadow-brand-600/30"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                mode === 'signin' ? 'Sign In' : 'Create Account'
              )}
            </Button>
          </form>
        )}

        {/* OTP Form */}
        {authMethod === 'otp' && (
          <form onSubmit={handleOTPAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-otp" className="text-sm font-medium">
                Email address
              </Label>
              <Input
                id="email-otp"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={isLoading}
                className="h-11"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-brand-600 hover:bg-brand-700 text-white font-medium shadow-lg shadow-brand-600/30"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending magic link...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Magic Link
                </>
              )}
            </Button>
          </form>
        )}

        {/* Separator */}
        <div className="relative my-6">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            Or continue with
          </span>
        </div>

        {/* Google OAuth */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleAuth}
          disabled={isLoading}
          className="w-full h-11 border-border hover:bg-accent"
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button>

        {/* Terms */}
        <p className="mt-6 text-xs text-center text-muted-foreground leading-relaxed">
          By continuing, you agree to our{' '}
          <a href="#" className="text-brand-600 hover:text-brand-700 transition-colors">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-brand-600 hover:text-brand-700 transition-colors">
            Privacy Policy
          </a>
        </p>
      </CardContent>
    </Card>
  )
}
