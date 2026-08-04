'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton, SignInButton, SignUpButton, Show } from '@clerk/nextjs'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Lock, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (pathname === '/encrypted-note') {
    return null
  }

  const isActive = (path: string) => pathname === path

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold hidden sm:block">Protech Notes</span>
              <span className="text-xl font-bold sm:hidden">Protech</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-center space-x-1">
            <Link href="/">
              <Button 
                variant={isActive('/') ? 'default' : 'ghost'} 
                size="sm"
                className="transition-all duration-200"
              >
                Home
              </Button>
            </Link>
            <Link href="/encrypted-note">
              <Button 
                variant={isActive('/encrypted-note') ? 'default' : 'ghost'} 
                size="sm"
                className="transition-all duration-200"
              >
                Encrypted Note
              </Button>
            </Link>
            <Link href="/file-verification">
              <Button 
                variant={isActive('/file-verification') ? 'default' : 'ghost'} 
                size="sm"
                className="transition-all duration-200"
              >
                File Verification
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                variant={isActive('/contact') ? 'default' : 'ghost'} 
                size="sm"
                className="transition-all duration-200"
              >
                Contact
              </Button>
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex flex-shrink-0 items-center space-x-3">
            <ThemeToggle />
            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button variant="outline" size="sm" className="transition-all duration-200">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm" className="transition-all duration-200">
                  Sign Up
                </Button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <div className="flex items-center space-x-3">
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9",
                    }
                  }}
                />
              </div>
            </Show>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden flex-1 justify-end items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t">
            <div className="flex flex-col space-y-2">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <Button 
                  variant={isActive('/') ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                >
                  Home
                </Button>
              </Link>
              <Link href="/encrypted-note" onClick={() => setMobileMenuOpen(false)}>
                <Button 
                  variant={isActive('/encrypted-note') ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                >
                  Encrypted Note
                </Button>
              </Link>
              <Link href="/file-verification" onClick={() => setMobileMenuOpen(false)}>
                <Button 
                  variant={isActive('/file-verification') ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                >
                  File Verification
                </Button>
              </Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                <Button 
                  variant={isActive('/contact') ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                >
                  Contact
                </Button>
              </Link>
            </div>
            <div className="flex flex-col space-y-2 pt-4 border-t">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="w-full">
                    Sign Up
                  </Button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <div className="flex items-center justify-center">
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-9 h-9",
                      }
                    }}
                  />
                </div>
              </Show>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}