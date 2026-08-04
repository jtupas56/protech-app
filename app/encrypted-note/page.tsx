'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth, SignInButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Sidebar } from '@/components/sidebar'
import { Editor } from '@/components/editor'
import { DecryptPanel } from '@/components/decrypt-panel'
import { getNotes, createNote, deleteNote, updateNote } from '@/app/actions/notes'
import { encrypt, downloadEncryptedNote } from '@/lib/crypto'
import { ArrowLeft, PanelLeft, PanelLeftClose, Lock, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface Note {
  id: string
  content: string
  updatedAt: Date
  createdAt: Date
}

export default function NotesPage() {
  const { isLoaded, userId } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [decryptMode, setDecryptMode] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const initialLoadDone = useRef(false)

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || null

  useEffect(() => {
    if (userId && !initialLoadDone.current) {
      initialLoadDone.current = true
      getNotes().then((loadedNotes) => {
        setNotes(loadedNotes)
        if (loadedNotes.length > 0 && !selectedNoteId) {
          setSelectedNoteId(loadedNotes[0].id)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]) // Only load once

  const handleNewNote = async () => {
    const emptyNote = notes.find((n) => n.content === '')
    if (emptyNote) {
      setSelectedNoteId(emptyNote.id)
      setDecryptMode(false)
      return
    }

    try {
      const newNote = await createNote('')
      setNotes([newNote, ...notes])
      setSelectedNoteId(newNote.id)
      setDecryptMode(false)
    } catch {
      setErrorMessage('Failed to create note.')
      setShowErrorDialog(true)
    }
  }

  const handleSelectNote = (id: string) => {
    setSelectedNoteId(id)
    setDecryptMode(false)
  }

  const handleDecrypt = () => {
    setDecryptMode(true)
    setSelectedNoteId(null)
  }

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id)
      const remaining = notes.filter((n) => n.id !== id)
      setNotes(remaining)
      if (selectedNoteId === id) {
        setSelectedNoteId(remaining[0]?.id || null)
      }
    } catch {
      setErrorMessage('Failed to delete note.')
      setShowErrorDialog(true)
    }
  }

  const handleContentChange = (newContent: string) => {
    setNotes(
      notes.map((n) => (n.id === selectedNoteId ? { ...n, content: newContent } : n))
    )
  }

  const handleDecryptSuccess = (noteId: string) => {
    getNotes().then((loadedNotes) => {
      setNotes(loadedNotes)
      setSelectedNoteId(noteId)
      setDecryptMode(false)
    })
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleDownloadNote = (id: string) => {
    const note = notes.find((n) => n.id === id)
    if (!note) return
    const blob = new Blob([note.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `note-${new Date(note.updatedAt).toISOString().slice(0, 10)}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleRenameNote = async (id: string, newTitle: string) => {
    const note = notes.find((n) => n.id === id)
    if (!note) return

    const lines = note.content.split('\n')
    lines[0] = newTitle
    const newContent = lines.join('\n')

    try {
      await updateNote(id, newContent)
      setNotes(notes.map((n) => (n.id === id ? { ...n, content: newContent } : n)))
    } catch {
      setErrorMessage('Failed to rename note.')
      setShowErrorDialog(true)
    }
  }

  const handleEncryptNote = async (id: string) => {
    const note = notes.find((n) => n.id === id)
    if (!note) return

    try {
      const payload = await encrypt(note.content)
      downloadEncryptedNote(payload, note.createdAt)
      await deleteNote(id)
      const remaining = notes.filter((n) => n.id !== id)
      setNotes(remaining)
      if (selectedNoteId === id) {
        setSelectedNoteId(remaining[0]?.id || null)
      }
    } catch {
      setErrorMessage('Failed to encrypt note.')
      setShowErrorDialog(true)
    }
  }

  if (!isLoaded) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  if (!userId) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <Link
          href="/"
          className="absolute top-4 left-4 p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="w-full max-w-md px-4">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Protech Notes</h1>
            <p className="text-muted-foreground">
              Sign in to access your encrypted notes
            </p>
          </div>
          
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">Authentication Required</CardTitle>
              <CardDescription>
                Create and manage your secure, encrypted notes with client-side encryption
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Lock className="w-3 h-3 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    AES-256 encryption for your notes
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Lock className="w-3 h-3 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your encryption key never leaves your device
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileText className="w-3 h-3 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Download encrypted notes as JSON files
                  </p>
                </div>
              </div>
              
              <SignInButton mode="modal">
                <Button className="w-full" size="lg">
                  Sign In to Continue
                </Button>
              </SignInButton>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-950 overflow-hidden">
      <button
        onClick={toggleSidebar}
        className="fixed top-3 left-3 z-50 p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
        aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isSidebarOpen ? (
          <PanelLeftClose className="w-4 h-4" />
        ) : (
          <PanelLeft className="w-4 h-4" />
        )}
      </button>

      <div
        className="overflow-hidden transition-all duration-300 ease-in-out flex-shrink-0"
        style={{ width: isSidebarOpen ? '288px' : '0px' }}
      >
        <Sidebar
          notes={notes}
          selectedNoteId={selectedNoteId}
          onSelectNote={handleSelectNote}
          onNewNote={handleNewNote}
          onDecrypt={handleDecrypt}
          onDeleteNote={handleDeleteNote}
          decryptMode={decryptMode}
          onDownloadNote={handleDownloadNote}
          onRenameNote={handleRenameNote}
          onEncryptNote={handleEncryptNote}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {decryptMode ? (
          <DecryptPanel onSuccess={handleDecryptSuccess} />
        ) : (
          <Editor
            key={selectedNote ? `${selectedNote.id}-${selectedNote.content}` : 'empty'}
            note={selectedNote}
            onContentChange={handleContentChange}
          />
        )}
      </div>

      {/* Error Dialog */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>
              {errorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}