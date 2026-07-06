'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton, SignInButton, SignUpButton, Show } from '@clerk/nextjs'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="border-b bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-xl font-bold">
              Protech Notes
            </Link>
            <div className="flex space-x-1">
              <Link href="/">
                <Button variant={isActive('/') ? 'default' : 'ghost'} size="sm">
                  Home
                </Button>
              </Link>
              <Link href="/encrypted-note">
                <Button variant={isActive('/encrypted-note') ? 'default' : 'ghost'} size="sm">
                  Encrypted Note
                </Button>
              </Link>
              <Link href="/file-verification">
                <Button variant={isActive('/file-verification') ? 'default' : 'ghost'} size="sm">
                  File Verification
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant={isActive('/contact') ? 'default' : 'ghost'} size="sm">
                  Contact
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm">Sign Up</Button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
        </div>
      </div>
    </nav>
  )
}
