import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from './badge'

describe('Badge Component', () => {
  it('should render default badge', () => {
    render(<Badge>Test Badge</Badge>)
    expect(screen.getByText('Test Badge')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    render(<Badge className="custom-class">Test</Badge>)
    const badge = screen.getByText('Test')
    expect(badge).toHaveClass('custom-class')
  })

  it('should render with different variants', () => {
    const { rerender } = render(<Badge variant="default">Default</Badge>)
    expect(screen.getByText('Default')).toBeInTheDocument()

    rerender(<Badge variant="secondary">Secondary</Badge>)
    expect(screen.getByText('Secondary')).toBeInTheDocument()

    rerender(<Badge variant="destructive">Destructive</Badge>)
    expect(screen.getByText('Destructive')).toBeInTheDocument()

    rerender(<Badge variant="outline">Outline</Badge>)
    expect(screen.getByText('Outline')).toBeInTheDocument()
  })
})
