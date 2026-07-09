'use client'

import { useState } from 'react'
import { Plus, LockOpen, MoreVertical, Home, Search, Pencil, Download, Lock, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { UserButton, useUser } from '@clerk/nextjs'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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
  onDownloadNote: (id: string) => void
  onRenameNote: (id: string, newTitle: string) => Promise<void>
  onEncryptNote: (id: string) => void
}

export function Sidebar({
  notes,
  selectedNoteId,
  onSelectNote,
  onNewNote,
  onDecrypt,
  onDeleteNote,
  decryptMode,
  onDownloadNote,
  onRenameNote,
  onEncryptNote,
}: SidebarProps) {
  const { user } = useUser()
  const [searchQuery, setSearchQuery] = useState('')
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [renameNoteId, setRenameNoteId] = useState<string | null>(null)
  const [renameTitle, setRenameTitle] = useState('')
  const [isRenaming, setIsRenaming] = useState(false)

  const displayName =
    user?.fullName ||
    user?.emailAddresses?.[0]?.emailAddress ||
    'Account'

  const getTitle = (content: string) => {
    const firstLine = content.split('\n')[0]
    return firstLine || 'Untitled'
  }

  const filteredNotes = searchQuery.trim() === ''
    ? notes
    : notes.filter((n) =>
        n.content.toLowerCase().includes(searchQuery.toLowerCase())
      )

  const openRenameDialog = (note: Note) => {
    setRenameNoteId(note.id)
    setRenameTitle(getTitle(note.content))
    setRenameDialogOpen(true)
  }

  const handleRenameConfirm = async () => {
    if (!renameNoteId) return
    const trimmed = renameTitle.trim()
    if (trimmed === '') {
      setRenameDialogOpen(false)
      return
    }
    setIsRenaming(true)
    try {
      await onRenameNote(renameNoteId, trimmed)
      setRenameDialogOpen(false)
    } catch (error) {
      console.error('Rename failed:', error)
    } finally {
      setIsRenaming(false)
      setRenameNoteId(null)
    }
  }

  return (
    <div className="w-72 flex-shrink-0 bg-neutral-50 dark:bg-neutral-950 flex flex-col h-full border-r border-neutral-200 dark:border-neutral-800">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-neutral-200 dark:border-neutral-800 relative">
        <div className="w-12" />
        <span className="text-sm text-neutral-400 absolute left-1/2 -translate-x-1/2">
          Protech Notes
        </span>
        <div className="flex items-center gap-0.5">
          <Link
            href="/"
            className="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            <Home className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 pt-2 pb-1">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-8 pr-3 py-1.5 text-sm rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none"
          />
        </div>
      </div>

      {/* New Note + Decrypt */}
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
        {filteredNotes.length === 0 ? (
          <div className="text-center text-sm text-neutral-400 py-4">
            {searchQuery.trim() !== '' ? 'No matching notes' : 'No notes yet'}
          </div>
        ) : (
          filteredNotes.map((note) => (
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
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="h-6 w-6 shrink-0 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => openRenameDialog(note)}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDownloadNote(note.id)}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEncryptNote(note.id)}>
                    <Lock className="w-4 h-4 mr-2" />
                    Encrypt
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDeleteNote(note.id)}
                    className="text-red-500 focus:text-red-500 dark:text-red-400 dark:focus:text-red-400"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))
        )}
      </div>

      {/* User Profile */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserButton />
          <span className="text-sm text-neutral-700 dark:text-neutral-300 truncate">
            {displayName}
          </span>
        </div>
        <ThemeToggle />
      </div>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Note</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={renameTitle}
              onChange={(e) => setRenameTitle(e.target.value)}
              placeholder="Enter new title"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleRenameConfirm()
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRenameDialogOpen(false)}
              disabled={isRenaming}
            >
              Cancel
            </Button>
            <Button onClick={handleRenameConfirm} disabled={isRenaming}>
              {isRenaming ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}