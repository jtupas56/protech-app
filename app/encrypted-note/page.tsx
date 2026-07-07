'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Sidebar } from '@/components/sidebar'
import { Editor } from '@/components/editor'
import { DecryptPanel } from '@/components/decrypt-panel'
import { DeleteDialog } from '@/components/delete-dialog'
import { getNotes, createNote } from '@/app/actions/notes'

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editorKey, setEditorKey] = useState(0)

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

  const handleDelete = () => {
    if (selectedNote) {
      setDeleteDialogOpen(true)
    }
  }

  const handleConfirmDelete = async () => {
    if (selectedNoteId) {
      const { deleteNote } = await import('@/app/actions/notes')
      await deleteNote(selectedNoteId)
      setNotes(notes.filter((n) => n.id !== selectedNoteId))
      setSelectedNoteId(notes.find((n) => n.id !== selectedNoteId)?.id || null)
      setDeleteDialogOpen(false)
    }
  }

  const handleNoteDeleted = () => {
    setNotes(notes.filter((n) => n.id !== selectedNoteId))
    setSelectedNoteId(notes.find((n) => n.id !== selectedNoteId)?.id || null)
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

  const getTitle = (content: string) => {
    const firstLine = content.split('\n')[0]
    return firstLine || 'Untitled'
  }

  if (!isLoaded) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  if (!userId) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to access your notes</h1>
          <p className="text-muted-foreground">Use the sign-in button in the top right corner</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar
        notes={notes}
        selectedNoteId={selectedNoteId}
        onSelectNote={handleSelectNote}
        onNewNote={handleNewNote}
        onDecrypt={handleDecrypt}
        onDelete={handleDelete}
        decryptMode={decryptMode}
      />

      {decryptMode ? (
        <DecryptPanel onSuccess={handleDecryptSuccess} />
      ) : (
        <Editor
          key={editorKey}
          note={selectedNote}
          onNoteDeleted={handleNoteDeleted}
          onContentChange={handleContentChange}
        />
      )}

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        noteTitle={selectedNote ? getTitle(selectedNote.content) : ''}
      />
    </div>
  )
}
