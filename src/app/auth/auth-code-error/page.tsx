import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-red-600">Authentication Error</CardTitle>
          <CardDescription className="text-center">
            There was an error with your authentication. This could be due to:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• The verification link has expired</li>
            <li>• The link has already been used</li>
            <li>• There was a network error</li>
            <li>• The authentication provider returned an error</li>
          </ul>
          
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/auth/signin">
                Try signing in again
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/auth/signup">
                Create a new account
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
