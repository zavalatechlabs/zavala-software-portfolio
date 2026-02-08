import { render, screen } from '@testing-library/react'
import Navbar from '../Navbar'

describe('Navbar', () => {
  it('renders the brand name', () => {
    render(<Navbar />)
    const brandElement = screen.getByText(/Zavala/i)
    expect(brandElement).toBeInTheDocument()
  })

  it('renders all navigation links', () => {
    render(<Navbar />)
    
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('navigation links have correct href attributes', () => {
    render(<Navbar />)
    
    const homeLink = screen.getByText('Home').closest('a')
    const aboutLink = screen.getByText('About').closest('a')
    const projectsLink = screen.getByText('Projects').closest('a')
    const contactLink = screen.getByText('Contact').closest('a')

    expect(homeLink).toHaveAttribute('href', '/')
    expect(aboutLink).toHaveAttribute('href', '/about')
    expect(projectsLink).toHaveAttribute('href', '/projects')
    expect(contactLink).toHaveAttribute('href', '/contact')
  })

  it('has a mobile menu button', () => {
    render(<Navbar />)
    
    const menuButton = screen.getByLabelText('Open menu')
    expect(menuButton).toBeInTheDocument()
  })
})
