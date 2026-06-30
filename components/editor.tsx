'use client'

import { useState, useEffect, useRef } from 'react'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { formatDistanceToNow } from 'date-fns'
import { encrypt, downloadEncryptedNote } from '@/lib/crypto'
import { updateNote, deleteNote } from '@/app/actions/notes'

interface Note {
  id: string
  content: string
  updatedAt: Date
  createdAt: Date
}

interface EditorProps {
  note: Note | null
  onNoteChange: (note: Note | null) => void
  onNoteDeleted: () => void
  onContentChange: (content: string) => void
}

export function Editor({ note, onNoteChange, onNoteDeleted, onContentChange }: EditorProps) {
  const [content, setContent] = useState(note?.content || '')
  const [isSaving, setIsSaving] = useState(false)
  const [showRestoredMessage, setShowRestoredMessage] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    setContent(note?.content || '')
    if (note && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [note])

  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    if (content !== note?.content && note) {
      setIsSaving(true)
      saveTimeoutRef.current = setTimeout(async () => {
        await updateNote(note.id, content)
        setIsSaving(false)
        onContentChange(content)
      }, 600)
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [content, note, onContentChange])

  const handleEncrypt = async () => {
    if (!note) return

    const payload = await encrypt(content)
    downloadEncryptedNote(payload, note.createdAt)
    await deleteNote(note.id)
    onNoteDeleted()
  }

  const showRestored = () => {
    setShowRestoredMessage(true)
    setTimeout(() => setShowRestoredMessage(false), 3000)
  }

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-muted-foreground">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              className="w-full h-full"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div className="text-lg font-medium text-muted-foreground">
            No note selected
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Create a new note or decrypt one from a file.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-900">
      <div className="h-12 border-b bg-white dark:bg-gray-800 flex items-center justify-between px-4">
        <div className="text-sm text-muted-foreground">
          {showRestoredMessage ? (
            <span className="text-green-600 dark:text-green-400">Note restored</span>
          ) : (
            <>
              {isSaving ? 'Saving...' : `Edited ${formatDistanceToNow(new Date(note.updatedAt))} ago`}
            </>
          )}
        </div>
        <Button onClick={handleEncrypt} size="sm" variant="outline">
          <Lock className="w-4 h-4 mr-2" />
          Encrypt
        </Button>
      </div>

      <div className="flex-1 p-6 flex justify-center overflow-auto">
        <div className="w-full max-w-[210mm] min-h-[297mm] bg-white dark:bg-gray-800 shadow-lg rounded-sm p-12">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[273mm] resize-none border-0 focus-visible:ring-0 text-base leading-relaxed"
            placeholder="Start writing..."
            style={{
              fontFamily: 'inherit',
            }}
          />
        </div>
      </div>
    </div>
  )
}
