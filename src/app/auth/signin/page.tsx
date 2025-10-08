import Link from 'next/link'
import AuthForm from '@/components/auth/auth-form'
import { ShoppingBag } from 'lucide-react'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity w-fit">
          <ShoppingBag className="h-6 w-6 text-brand-600" />
          <span className="text-xl font-semibold text-foreground">My E-Commerce</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back
            </h1>
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>
          
          <AuthForm mode="signin" />
          
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
