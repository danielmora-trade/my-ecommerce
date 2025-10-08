import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Shield, Zap, Users, Star, CreditCard } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-brand-50/30 -z-10" />
        
        {/* Navigation */}
        <nav className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-8 w-8 text-brand-600" />
              <span className="text-2xl font-bold text-foreground">My E-Commerce</span>
            </div>
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button asChild className="bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-600/30">
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="container mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Build your dream
              <span className="text-gradient block">online store</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              A modern, secure e-commerce platform powered by Next.js and Supabase. 
              Start selling in minutes with our beautifully designed system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                asChild 
                size="lg" 
                className="bg-brand-600 hover:bg-brand-700 text-white text-lg px-8 py-6 shadow-xl shadow-brand-600/30 hover:shadow-2xl hover:shadow-brand-600/40 transition-all"
              >
                <Link href="/auth/signup">
                  Start Free Trial
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6">
                <Link href="/dashboard">
                  View Dashboard
                </Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              ✨ No credit card required · Free forever for personal use
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Everything you need to succeed
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built with modern technologies and best practices for a seamless experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-card rounded-xl p-8 border border-border shadow-sm hover:shadow-xl transition-all duration-300 card-hover">
            <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-brand-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-card-foreground">Secure Authentication</h3>
            <p className="text-muted-foreground leading-relaxed">
              Industry-standard security with Supabase Auth. Support for email, magic links, and OAuth providers.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-card rounded-xl p-8 border border-border shadow-sm hover:shadow-xl transition-all duration-300 card-hover">
            <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-brand-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-card-foreground">Lightning Fast</h3>
            <p className="text-muted-foreground leading-relaxed">
              Built on Next.js 15 with App Router and React Server Components for optimal performance.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-card rounded-xl p-8 border border-border shadow-sm hover:shadow-xl transition-all duration-300 card-hover">
            <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-brand-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-card-foreground">Multi-Vendor Support</h3>
            <p className="text-muted-foreground leading-relaxed">
              Enable multiple sellers with dedicated accounts, product management, and analytics.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-card rounded-xl p-8 border border-border shadow-sm hover:shadow-xl transition-all duration-300 card-hover">
            <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4">
              <ShoppingBag className="h-6 w-6 text-brand-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-card-foreground">Smart Shopping Cart</h3>
            <p className="text-muted-foreground leading-relaxed">
              Persistent cart with wishlist functionality, variant selection, and quantity management.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-card rounded-xl p-8 border border-border shadow-sm hover:shadow-xl transition-all duration-300 card-hover">
            <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4">
              <Star className="h-6 w-6 text-brand-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-card-foreground">Reviews & Ratings</h3>
            <p className="text-muted-foreground leading-relaxed">
              Customer reviews with media uploads, verified purchases, and seller responses.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-card rounded-xl p-8 border border-border shadow-sm hover:shadow-xl transition-all duration-300 card-hover">
            <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4">
              <CreditCard className="h-6 w-6 text-brand-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-card-foreground">Payment Processing</h3>
            <p className="text-muted-foreground leading-relaxed">
              Integrated payment processing with multiple payment methods and automatic refunds.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto bg-gradient-brand rounded-2xl p-12 text-center shadow-2xl shadow-brand-600/20">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-brand-50 mb-8 max-w-2xl mx-auto">
            Join thousands of sellers already using our platform to grow their business
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              className="bg-white hover:bg-gray-50 text-brand-700 text-lg px-8 py-6 shadow-xl"
            >
              <Link href="/auth/signup">
                Create Free Account
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 text-lg px-8 py-6"
            >
              <Link href="/auth/signin">
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-brand-600" />
              <span className="text-lg font-semibold text-foreground">My E-Commerce</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 My E-Commerce. Built with Next.js and Supabase.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}