'use client'

import { useState, useEffect } from 'react'
import { useAuth, SignInButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Sidebar } from '@/components/sidebar'
import { Editor } from '@/components/editor'
import { DecryptPanel } from '@/components/decrypt-panel'
import { getNotes, createNote, deleteNote, updateNote } from '@/app/actions/notes'
import { encrypt, downloadEncryptedNote } from '@/lib/crypto'
import { ArrowLeft, PanelLeft, PanelLeftClose } from 'lucide-react'

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
  const [editorKey, setEditorKey] = useState(0)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || null

  useEffect(() => {
    if (userId) {
      getNotes().then((loadedNotes) => {
        setNotes(loadedNotes)
        if (loadedNotes.length > 0 && !selectedNoteId) {
          setSelectedNoteId(loadedNotes[0].id)
        }
      })
    }
  }, [userId, selectedNoteId])

  const handleNewNote = async () => {
    // Check if there's already an empty note
    const emptyNote = notes.find((n) => n.content === '')
    if (emptyNote) {
      setSelectedNoteId(emptyNote.id)
      setDecryptMode(false)
      return
    }
    const newNote = await createNote('')
    setNotes([newNote, ...notes])
    setSelectedNoteId(newNote.id)
    setDecryptMode(false)
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
    await deleteNote(id)
    const remaining = notes.filter((n) => n.id !== id)
    setNotes(remaining)
    if (selectedNoteId === id) {
      setSelectedNoteId(remaining[0]?.id || null)
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
      setEditorKey((prev) => prev + 1)
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

  const handleRenameNote = async (id: string) => {
    const note = notes.find((n) => n.id === id)
    if (!note) return
    const currentTitle = note.content.split('\n')[0] || 'Untitled'
    const newTitle = prompt('Rename note:', currentTitle)
    if (newTitle !== null && newTitle.trim() !== '') {
      const lines = note.content.split('\n')
      lines[0] = newTitle
      const newContent = lines.join('\n')
      await updateNote(id, newContent)
      setNotes(notes.map((n) => (n.id === id ? { ...n, content: newContent } : n)))
    }
  }

  const handleEncryptNote = async (id: string) => {
    const note = notes.find((n) => n.id === id)
    if (!note) return
    const payload = await encrypt(note.content)
    downloadEncryptedNote(payload, note.createdAt)
    await deleteNote(id)
    const remaining = notes.filter((n) => n.id !== id)
    setNotes(remaining)
    if (selectedNoteId === id) {
      setSelectedNoteId(remaining[0]?.id || null)
    }
  }

  if (!isLoaded) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  if (!userId) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <Link
          href="/"
          className="absolute top-4 left-4 p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="text-center max-w-sm">
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Protech Notes
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">
            Sign in to access your encrypted notes.
          </p>
          <SignInButton mode="modal">
            <button className="px-4 py-2 text-sm rounded-md bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors">
              Sign In
            </button>
          </SignInButton>
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

      {isSidebarOpen && (
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
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {decryptMode ? (
          <DecryptPanel onSuccess={handleDecryptSuccess} />
        ) : (
          <Editor
            key={editorKey}
            note={selectedNote}
            onContentChange={handleContentChange}
          />
        )}
      </div>
    </div>
  )
}