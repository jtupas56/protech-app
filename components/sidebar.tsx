'use client'

import { Plus, LockOpen, Trash2, PanelLeftClose, Home } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import { UserButton, useUser } from '@clerk/nextjs'
import { ThemeToggle } from '@/components/theme-toggle'

interface Note {
  id: string
  content: string
  updatedAt: Date
  createdAt: Date
}

interface SidebarProps {
  notes: Note[]
  selectedNoteId: string | null
  onSelectNote: (id: string) => void
  onNewNote: () => void
  onDecrypt: () => void
  onDeleteNote: (id: string) => void
  decryptMode: boolean
  onToggleSidebar: () => void
}

export function Sidebar({
  notes,
  selectedNoteId,
  onSelectNote,
  onNewNote,
  onDecrypt,
  onDeleteNote,
  decryptMode,
  onToggleSidebar,
}: SidebarProps) {
  const { user } = useUser()
  const displayName =
    user?.fullName ||
    user?.emailAddresses?.[0]?.emailAddress ||
    'Account'

  const getTitle = (content: string) => {
    const firstLine = content.split('\n')[0]
    return firstLine || 'Untitled'
  }

  return (
    <div className="w-72 flex-shrink-0 bg-neutral-50 dark:bg-neutral-950 flex flex-col h-full border-r border-neutral-200 dark:border-neutral-800">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-3 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
            aria-label="Toggle sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
          <span className="text-sm text-neutral-400 ml-1">Protech Notes</span>
        </div>
        <div className="flex items-center gap-0.5">
          <Link
            href="/"
            className="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            <Home className="w-4 h-4" />
          </Link>
          <ThemeToggle />
        </div>
      </div>

      {/* 🔥 New Note + Decrypt - STACKED VERTICALLY */}
      <div className="p-3 space-y-1.5 border-b border-neutral-200 dark:border-neutral-800">
        <button
          onClick={onNewNote}
          className={`w-full flex items-center justify-center gap-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
            decryptMode
              ? 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              : 'text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          New note
        </button>
        <button
          onClick={onDecrypt}
          className={`w-full flex items-center justify-center gap-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
            decryptMode
              ? 'text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800'
              : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <LockOpen className="w-3.5 h-3.5" />
          Decrypt
        </button>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-2">
        {notes.map((note) => (
          <div
            key={note.id}
            className={`group flex items-center gap-1 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
              selectedNoteId === note.id
                ? 'bg-neutral-100 dark:bg-neutral-800'
                : 'hover:bg-neutral-100 dark:hover:bg-neutral-800/50'
            }`}
          >
            <button
              onClick={() => onSelectNote(note.id)}
              className="flex-1 min-w-0 text-left"
            >
              <div className="text-sm truncate text-neutral-900 dark:text-neutral-100">
                {getTitle(note.content)}
              </div>
              <div className="text-xs text-neutral-400">
                {format(new Date(note.updatedAt), 'd MMM yyyy')}
              </div>
            </button>

            <button
              className="h-6 w-6 shrink-0 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              onClick={(e) => {
                e.stopPropagation()
                onDeleteNote(note.id)
              }}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* User Profile */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 p-3 flex items-center gap-3">
        <UserButton />
        <span className="text-sm text-neutral-700 dark:text-neutral-300 truncate">
          {displayName}
        </span>
      </div>
    </div>
  )
}