import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Lock, Shield, FileText } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6">Protech Notes</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Secure, encrypted note-taking application. Your notes are encrypted client-side 
            and stored as JSON files that only you can access.
          </p>
          <Link href="/encrypted-note">
            <Button size="lg" className="mr-4">
              Get Started
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline">
              Contact Us
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <Lock className="w-12 h-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Client-Side Encryption</h3>
            <p className="text-muted-foreground">
              Your notes are encrypted using AES-256 CBC encryption before leaving your browser.
              The encryption key is never stored on our servers.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <Shield className="w-12 h-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Secure Storage</h3>
            <p className="text-muted-foreground">
              Encrypted notes are downloaded as JSON files and removed from the database.
              Only you have the key to decrypt your notes.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <FileText className="w-12 h-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
            <p className="text-muted-foreground">
              Simple, clean interface for creating and managing your encrypted notes.
              Decrypt your notes anytime by uploading the JSON file.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
