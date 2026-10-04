import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import Home from './Home'

describe('Home Component', () => {
  it('renders the welcome message with the user name', async () => {
    // Mock user
    const mockUser = { username: 'Professor', role: 'admin' }
    
    render(
      <BrowserRouter>
        <Home user={mockUser} />
      </BrowserRouter>
    )

    // Check if the username is rendered in the greeting
    const greeting = await screen.findByText(/Professor/i)
    expect(greeting).toBeInTheDocument()
  })

  it('renders the quick action cards', () => {
    const mockUser = { username: 'Staff User', role: 'staff' }
    
    render(
      <BrowserRouter>
        <Home user={mockUser} />
      </BrowserRouter>
    )

    // Check if key cards are rendered
    expect(screen.getByText('Start Billing')).toBeInTheDocument()
    expect(screen.getByText('Manage Stock')).toBeInTheDocument()
    expect(screen.getByText('Invoice History')).toBeInTheDocument()
  })
})
