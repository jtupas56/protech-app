'use client'

import { useState, useEffect, useRef } from 'react'
import { Lock, PanelLeft } from 'lucide-react'
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
  onNoteDeleted: () => void
  onContentChange: (content: string) => void
  isSidebarOpen: boolean
  onToggleSidebar: () => void
}

export function Editor({ note, onNoteDeleted, onContentChange, isSidebarOpen, onToggleSidebar }: EditorProps) {
  const [content, setContent] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const prevNoteIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (note?.id !== prevNoteIdRef.current) {
      setContent(note?.content || '')
      prevNoteIdRef.current = note?.id || null
      if (note && textareaRef.current) {
        textareaRef.current.focus()
      }
    }
  }, [note])

  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    if (content !== note?.content && note) {
      saveTimeoutRef.current = setTimeout(async () => {
        await updateNote(note.id, content)
        onContentChange(content)
      }, 600)
    }
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    }
  }, [content, note, onContentChange])

  const handleEncrypt = async () => {
    if (!note) return
    const payload = await encrypt(content)
    downloadEncryptedNote(payload, note.createdAt)
    await deleteNote(note.id)
    onNoteDeleted()
  }

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-neutral-400 text-sm">Select or create a note</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Editor header */}
      <div className="flex items-center justify-between px-4 py-2 flex-shrink-0 border-b border-neutral-200 dark:border-neutral-800">
        {/* Show toggle button only when sidebar is closed */}
        {!isSidebarOpen && (
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
            aria-label="Open sidebar"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        )}
        <div className={!isSidebarOpen ? 'ml-auto' : 'ml-auto'}>
          <button
            onClick={handleEncrypt}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-neutral-400 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-100 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            Encrypt
          </button>
        </div>
      </div>

      {/* Writing area */}
      <div className="flex-1 overflow-auto">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-full min-h-full resize-none border-0 focus:outline-none p-6 text-base leading-relaxed bg-transparent text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-300 dark:placeholder:text-neutral-700"
          placeholder="Start writing..."
          style={{ fontFamily: 'inherit' }}
        />
      </div>
    </div>
  )
}