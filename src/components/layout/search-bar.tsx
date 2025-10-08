'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

interface SearchBarProps {
  className?: string
  size?: 'default' | 'large'
}

export const SearchBar = ({ className, size = 'default' }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const inputHeight = size === 'large' ? 'h-12' : 'h-11'
  const buttonHeight = size === 'large' ? 'h-12' : 'h-11'

  return (
    <form onSubmit={handleSearch} className={className}>
      <div className="relative w-full">
        <Input
          type="search"
          placeholder="Buscar aceros, vigas, perfiles, varillas..."
          className={`pr-12 ${inputHeight}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          type="submit"
          className={`absolute right-0 top-0 ${buttonHeight} px-6 bg-brand-600 hover:bg-brand-700`}
          size="sm"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </form>
  )
}

