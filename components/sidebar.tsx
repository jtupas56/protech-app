'use client'

import { Plus, LockOpen, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Note {
  id: string
  content: string
  updatedAt: Date
}

interface SidebarProps {
  notes: Note[]
  selectedNoteId: string | null
  onSelectNote: (id: string) => void
  onNewNote: () => void
  onDecrypt: () => void
  onDelete: () => void
  decryptMode: boolean
}

export function Sidebar({
  notes,
  selectedNoteId,
  onSelectNote,
  onNewNote,
  onDecrypt,
  onDelete,
  decryptMode,
}: SidebarProps) {
  const getTitle = (content: string) => {
    const firstLine = content.split('\n')[0]
    return firstLine || 'Untitled'
  }

  const getPreview = (content: string) => {
    const lines = content.split('\n')
    if (lines.length <= 1) return ''
    return lines.slice(1).join(' ').slice(0, 50) || ''
  }

  return (
    <div className="w-72 border-r bg-white dark:bg-gray-900 flex flex-col h-full">
      <div className="p-4 border-b flex gap-2">
        <Button
          onClick={onNewNote}
          className="flex-1"
          variant={decryptMode ? 'outline' : 'default'}
        >
          <Plus className="w-4 h-4 mr-2" />
          New note
        </Button>
        <Button
          onClick={onDecrypt}
          variant={decryptMode ? 'default' : 'outline'}
          size="icon"
        >
          <LockOpen className="w-4 h-4" />
        </Button>
        <Button onClick={onDelete} variant="outline" size="icon">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {notes.map((note) => (
          <button
            key={note.id}
            onClick={() => onSelectNote(note.id)}
            className={`w-full text-left p-3 rounded-lg mb-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
              selectedNoteId === note.id
                ? 'bg-gray-100 dark:bg-gray-800 font-medium'
                : ''
            }`}
          >
            <div className="text-sm truncate">{getTitle(note.content)}</div>
            {getPreview(note.content) && (
              <div className="text-xs text-muted-foreground mt-1 truncate">
                {getPreview(note.content)}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
