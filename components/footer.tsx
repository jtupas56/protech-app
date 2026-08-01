'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Footer() {
  const pathname = usePathname()
  if (pathname === '/encrypted-note') return null

  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 text-sm text-slate-600 dark:text-slate-400">
        <p>© {new Date().getFullYear()} Protech Notes. All rights reserved.</p>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white">Home</Link>
          <Link href="/encrypted-note" className="hover:text-slate-900 dark:hover:text-white">Encrypted Notes</Link>
          <Link href="/file-verification" className="hover:text-slate-900 dark:hover:text-white">File Verification</Link>
          <Link href="/contact" className="hover:text-slate-900 dark:hover:text-white">Contact</Link>
        </div>
      </div>
    </footer>
  )
}
