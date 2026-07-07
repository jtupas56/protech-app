'use client'

import { useState, useEffect, useRef } from 'react'
import { updateNote } from '@/app/actions/notes'

interface Note {
  id: string
  content: string
  updatedAt: Date
  createdAt: Date
}

interface EditorProps {
  note: Note | null
  onContentChange: (content: string) => void
}

export function Editor({ note, onContentChange }: EditorProps) {
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

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-neutral-400 text-sm">Select or create a note</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto flex justify-center">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full max-w-7xl h-full min-h-full resize-none border-0 focus:outline-none px-6 pb-6 pt-20 text-base leading-relaxed bg-transparent text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-300 dark:placeholder:text-neutral-700"
          placeholder="Start writing..."
          style={{ fontFamily: 'inherit' }}
        />
      </div>
    </div>
  )
}