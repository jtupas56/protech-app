'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Lock, ExternalLink } from 'lucide-react'

export function Footer() {
  const pathname = usePathname()
  if (pathname === '/encrypted-note') return null

  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* About Section */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <span className="text-lg font-bold">Protech Notes</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              Secure, encrypted note-taking application. Your notes are encrypted client-side 
              and stored as JSON files that only you can access.
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Made with x23153920</span>
              
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/encrypted-note" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Encrypted Notes
                </Link>
              </li>
              <li>
                <Link href="/file-verification" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  File Verification
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Links */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center">
                  Privacy Policy
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center">
                  Terms of Service
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t">
          <p className="text-xs sm:text-sm text-muted-foreground text-center">
            © {currentYear} Protech Notes. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
