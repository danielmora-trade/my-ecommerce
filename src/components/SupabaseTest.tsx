'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function SupabaseTest() {
  const [connected, setConnected] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function testConnection() {
      try {
        const supabase = createClient()
        const { error } = await supabase.auth.getSession()
        
        // If we can call the API without errors, connection is working
        setConnected(error === null)
      } catch {
        setConnected(false)
      } finally {
        setLoading(false)
      }
    }

    testConnection()
  }, [])

  if (loading) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <p className="text-yellow-800 dark:text-yellow-200 text-sm">
          ⏳ Testing Supabase connection...
        </p>
      </div>
    )
  }

  if (connected === false) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">
          ❌ Supabase Not Configured
        </h3>
        <p className="text-red-700 dark:text-red-300 text-sm mb-2">
          Please set up your environment variables:
        </p>
        <ol className="text-red-700 dark:text-red-300 text-sm list-decimal list-inside space-y-1">
          <li>Create a <code className="bg-red-100 dark:bg-red-900 px-1 rounded">.env.local</code> file</li>
          <li>Add your Supabase URL and anon key</li>
          <li>Restart the development server</li>
        </ol>
        <p className="text-red-700 dark:text-red-300 text-sm mt-2">
          Check <code className="bg-red-100 dark:bg-red-900 px-1 rounded">ENV_TEMPLATE.md</code> for details.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
      <h3 className="text-green-800 dark:text-green-200 font-semibold mb-2">
        ✅ Supabase Connected
      </h3>
      <p className="text-green-700 dark:text-green-300 text-sm">
        Your Supabase client is configured correctly and ready to use!
      </p>
    </div>
  )
}

