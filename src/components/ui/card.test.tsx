import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card'

describe('Card Components', () => {
  it('should render Card with children', () => {
    render(
      <Card>
        <p>Card content</p>
      </Card>
    )
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('should render complete card structure', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card content</p>
        </CardContent>
        <CardFooter>
          <button>Footer Action</button>
        </CardFooter>
      </Card>
    )

    expect(screen.getByText('Card Title')).toBeInTheDocument()
    expect(screen.getByText('Card description')).toBeInTheDocument()
    expect(screen.getByText('Card content')).toBeInTheDocument()
    expect(screen.getByText('Footer Action')).toBeInTheDocument()
  })

  it('should apply custom className to Card', () => {
    render(
      <Card className="custom-class">
        <p>Content</p>
      </Card>
    )
    const card = screen.getByText('Content').parentElement
    expect(card).toHaveClass('custom-class')
  })
})
