import { render, screen } from '@testing-library/react'
import Navbar from '../Navbar'

describe('Navbar', () => {
  it('renders the brand name', () => {
    render(<Navbar />)
    const brandElement = screen.getByText('MZ')
    expect(brandElement).toBeInTheDocument()
  })

  it('renders all navigation links', () => {
    render(<Navbar />)

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Resume')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('navigation links have correct href attributes', () => {
    render(<Navbar />)

    const homeLink = screen.getByText('Home').closest('a')
    const resumeLink = screen.getByText('Resume').closest('a')
    const projectsLink = screen.getByText('Projects').closest('a')
    const contactLink = screen.getByText('Contact').closest('a')

    expect(homeLink).toHaveAttribute('href', '/')
    expect(resumeLink).toHaveAttribute('href', '/about')
    expect(projectsLink).toHaveAttribute('href', '/projects')
    expect(contactLink).toHaveAttribute('href', '/contact')
  })

  it('has a mobile menu button', () => {
    render(<Navbar />)

    const menuButton = screen.getByLabelText('Open menu')
    expect(menuButton).toBeInTheDocument()
  })
})
