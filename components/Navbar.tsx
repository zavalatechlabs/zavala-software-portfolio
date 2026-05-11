'use client'

import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { ThemeToggle } from './ThemeToggle'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsMenuOpen(false)
    }
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscapeKey)
      return () => document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isMenuOpen, handleEscapeKey])

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Resume', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Contact', href: '/contact' },
  ]

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zavala-bg-primary/80 backdrop-blur-lg border-b border-zavala-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-zavala-text-primary hover:text-zavala-accent-primary transition-colors focus-visible:ring-2 focus-visible:ring-zavala-accent-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zavala-bg-primary focus-visible:rounded-sm focus-visible:outline-none"
          >
            MZ
          </Link>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-zavala-text-secondary hover:text-zavala-text-primary transition-colors focus-visible:ring-2 focus-visible:ring-zavala-accent-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zavala-bg-primary focus-visible:rounded-sm focus-visible:outline-none"
              >
                {link.name}
              </Link>
            ))}
            {/* Desktop Theme Toggle */}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-zavala-text-secondary hover:text-zavala-text-primary focus-visible:ring-2 focus-visible:ring-zavala-accent-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zavala-bg-primary focus-visible:rounded-sm focus-visible:outline-none"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav-menu"
            >
              {isMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            id="mobile-nav-menu"
            className="md:hidden mt-4 pb-4 border-t border-zavala-border pt-4"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="text-zavala-text-secondary hover:text-zavala-text-primary transition-colors py-2 focus-visible:ring-2 focus-visible:ring-zavala-accent-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zavala-bg-primary focus-visible:rounded-sm focus-visible:outline-none"
                >
                  {link.name}
                </Link>
              ))}
              {/* Mobile Theme Toggle */}
              <div className="flex items-center justify-between py-2">
                <span className="text-zavala-text-secondary">Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
