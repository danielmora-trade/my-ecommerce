import React from 'react'
import { render, screen } from '@testing-library/react'
import { Pagination } from '@/components/products/pagination'

// Mock useSearchParams
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(() => '1'),
  }),
  usePathname: () => '/productos',
}))

describe('Pagination', () => {
  const defaultProps = {
    baseUrl: '/productos',
    totalPages: 5,
    currentPage: 1,
  }

  it('should render page numbers correctly', () => {
    render(<Pagination {...defaultProps} />)

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('should disable previous button on first page', () => {
    render(<Pagination {...defaultProps} />)

    const previousButton = screen.getByText(/anterior/i)
    expect(previousButton).toBeDisabled()
  })

  it('should disable next button on last page', () => {
    render(<Pagination {...defaultProps} totalPages={5} currentPage={5} />)

    const nextButton = screen.getByText(/siguiente/i)
    expect(nextButton).toBeDisabled()
  })

  it('should enable both buttons on middle page', () => {
    render(<Pagination {...defaultProps} currentPage={3} />)

    const previousButton = screen.getByText(/anterior/i)
    const nextButton = screen.getByText(/siguiente/i)

    expect(previousButton).not.toBeDisabled()
    expect(nextButton).not.toBeDisabled()
  })

  it('should highlight current page', () => {
    render(<Pagination {...defaultProps} currentPage={3} />)

    const currentPageButton = screen.getByText('3')
    expect(currentPageButton).toHaveClass('bg-brand-600')
  })

  it('should not render if only one page', () => {
    const { container } = render(<Pagination {...defaultProps} totalPages={1} />)

    expect(container.querySelector('nav')).not.toBeInTheDocument()
  })

  it('should show limited page numbers for many pages', () => {
    render(<Pagination {...defaultProps} totalPages={20} currentPage={10} />)

    // Should show current page
    expect(screen.getByText('10')).toBeInTheDocument()
    
    // Should not show all 20 pages
    expect(screen.queryByText('1')).not.toBeInTheDocument()
    expect(screen.queryByText('20')).not.toBeInTheDocument()
  })
})

