import Link from 'next/link'
import TerminalWindow from './TerminalWindow'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    navigation: [
      { name: 'Home', href: '/' },
      { name: 'About', href: '/about' },
      { name: 'Projects', href: '/projects' },
      { name: 'Contact', href: '/contact' },
    ],
    social: [
      { name: 'GitHub', href: 'https://github.com/zavalatechlabs' },
      { name: 'LinkedIn', href: '#' },
    ],
  }

  return (
    <footer className="bg-zavala-footer-bg text-zavala-footer-text">
      {/* Terminal Window Section */}
      <div className="bg-zavala-footer-terminal-section py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <TerminalWindow />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-zavala-footer-heading text-lg font-bold mb-4">
              Maximiliano Zavala
            </h3>
            <p className="text-sm text-zavala-footer-text-muted">
              Building modern web applications with cutting-edge technologies.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-zavala-footer-heading font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-zavala-accent-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-zavala-footer-heading font-semibold mb-4">Connect</h4>
            <ul className="space-y-2">
              {footerLinks.social.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:text-zavala-accent-primary transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-zavala-footer-border">
          <p className="text-center text-sm text-zavala-footer-text-muted">
            &copy; {currentYear} Maximiliano Zavala. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
