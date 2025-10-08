import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingBag, User, Package, Settings, LogOut, CheckCircle2, Clock } from 'lucide-react'
import { authService } from '@/backend/services/auth.service'

export default async function Dashboard() {
  // Get access token from cookie
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value

  // Validate user session via backend service
  const result = await authService.getUser(accessToken)

  if (!result.success || !result.user) {
    redirect('/auth/signin')
  }

  const user = result.user

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ShoppingBag className="h-6 w-6 text-brand-600" />
              <span className="text-xl font-semibold text-foreground">My E-Commerce</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-brand-100 text-brand-700 rounded-full text-sm font-medium">
                <User className="h-4 w-4" />
                {user.email}
              </div>
              <form action="/api/auth/signout" method="post">
                <Button type="submit" variant="ghost" size="sm" className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-xl text-muted-foreground">
            Here&apos;s what&apos;s happening with your store today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-border shadow-sm hover:shadow-lg transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-brand-600" />
                </div>
                <span className="text-3xl font-bold text-foreground">0</span>
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Total Products</h3>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm hover:shadow-lg transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-3xl font-bold text-foreground">0</span>
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Pending Orders</h3>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm hover:shadow-lg transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-3xl font-bold text-foreground">0</span>
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Completed Orders</h3>
            </CardContent>
          </Card>
        </div>

        {/* Account Information */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* User Info Card */}
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-brand-600" />
                Account Information
              </CardTitle>
              <CardDescription>
                Your authentication details and account status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 py-3 border-b border-border">
                  <span className="text-sm font-medium text-muted-foreground">Email</span>
                  <span className="col-span-2 text-sm text-foreground">{user.email}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 py-3 border-b border-border">
                  <span className="text-sm font-medium text-muted-foreground">User ID</span>
                  <span className="col-span-2 text-sm font-mono text-foreground truncate">{user.id}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 py-3 border-b border-border">
                  <span className="text-sm font-medium text-muted-foreground">Status</span>
                  <span className="col-span-2">
                    {user.email_confirmed_at ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                        <Clock className="h-3 w-3" />
                        Pending
                      </span>
                    )}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 py-3 border-b border-border">
                  <span className="text-sm font-medium text-muted-foreground">Member Since</span>
                  <span className="col-span-2 text-sm text-foreground">
                    {new Date(user.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 py-3">
                  <span className="text-sm font-medium text-muted-foreground">Last Sign In</span>
                  <span className="col-span-2 text-sm text-foreground">
                    {user.last_sign_in_at 
                      ? new Date(user.last_sign_in_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })
                      : 'N/A'
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-brand-600" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Get started with your e-commerce store
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 bg-gradient-subtle rounded-lg border border-border">
                  <h4 className="font-semibold text-foreground mb-2">🎉 Welcome to My E-Commerce!</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    You&apos;re all set up and ready to go. Here&apos;s what you can do next:
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-brand-600 mt-0.5">•</span>
                      <span>Create your seller profile to start listing products</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-600 mt-0.5">•</span>
                      <span>Set up your shipping addresses and preferences</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-600 mt-0.5">•</span>
                      <span>Browse the product catalog and start shopping</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-600 mt-0.5">•</span>
                      <span>Configure payment methods for seamless checkout</span>
                    </li>
                  </ul>
                </div>
                
                <Button className="w-full bg-brand-600 hover:bg-brand-700 text-white" size="lg">
                  Complete Your Profile
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full">
                    View Products
                  </Button>
                  <Button variant="outline" className="w-full">
                    Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
