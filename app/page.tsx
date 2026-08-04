import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, Shield, FileText, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Hero Section */}
        <div className="text-center space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-4">
            <Lock className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            End-to-End Encrypted
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Protech Notes
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            Secure, encrypted note-taking application. Your notes are encrypted client-side 
            and stored as JSON files that only you can access.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4 px-4">
            <Link href="/encrypted-note" className="w-full sm:w-auto">
              <Button size="lg" className="group text-base px-6 sm:px-8 w-full sm:w-auto">
                Get Started
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="text-base px-6 sm:px-8 w-full sm:w-auto">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-16 sm:mt-24">
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg sm:text-xl">Client-Side Encryption</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm sm:text-base">
                Your notes are encrypted using AES-256 CBC encryption before leaving your browser.
                The encryption key is never stored on our servers.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg sm:text-xl">Secure Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm sm:text-base">
                Encrypted notes are downloaded as JSON files and removed from the database.
                Only you have the key to decrypt your notes.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg sm:text-xl">Easy to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm sm:text-base">
                Simple, clean interface for creating and managing your encrypted notes.
                Decrypt your notes anytime by uploading the JSON file.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* How it Works Section */}
        <div className="mt-16 sm:mt-32">
          <div className="text-center mb-8 sm:mb-16 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Get started with secure note-taking in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 px-4">
            <div className="relative">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">Create Your Note</h3>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    Sign in and start writing your note in our clean, distraction-free editor.
                  </p>
                </div>
              </div>
              <div className="hidden md:block absolute top-5 left-[calc(50%+2rem)] w-full h-0.5 bg-border/50 -translate-x-1/2" />
            </div>

            <div className="relative">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">Encrypt & Download</h3>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    Your note is encrypted client-side with your password, then downloaded as a secure JSON file.
                  </p>
                </div>
              </div>
              <div className="hidden md:block absolute top-5 left-[calc(50%+2rem)] w-full h-0.5 bg-border/50 -translate-x-1/2" />
            </div>

            <div className="relative">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">Decrypt Anytime</h3>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    Upload your encrypted JSON file anytime with your password to decrypt and access your notes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 sm:mt-32 text-center px-4">
          <Card className="max-w-3xl mx-auto bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Ready to Secure Your Notes?</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Join thousands of users who trust Protech Notes for their secure note-taking needs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/encrypted-note" className="w-full sm:w-auto inline-block">
                <Button size="lg" className="group w-full sm:w-auto">
                  Start Encrypting Now
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
