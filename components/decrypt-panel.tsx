'use client'

import { useState, useRef } from 'react'
import { Upload, LockOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { decrypt, type EncryptedNote } from '@/lib/crypto'
import { addDecryptedNote } from '@/app/actions/notes'

interface DecryptPanelProps {
  onSuccess: (noteId: string, content: string) => void
}

export function DecryptPanel({ onSuccess }: DecryptPanelProps) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string>('')
  const [isDecrypting, setIsDecrypting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.json')) {
      setError('Please select a .json file')
      setFile(null)
      return
    }
    setError('')
    setFile(selectedFile)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }

  const handleDecrypt = async () => {
    if (!file) return

    setIsDecrypting(true)
    setError('')

    try {
      const text = await file.text()
      const payload: EncryptedNote = JSON.parse(text)
      const content = await decrypt(payload)
      const newNote = await addDecryptedNote(content)
      onSuccess(newNote.id, content)
    } catch {
      setError('Failed to decrypt file. Make sure it\'s a valid encrypted note.')
    } finally {
      setIsDecrypting(false)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-muted/20 p-8">
      <div className="w-full max-w-md">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            error ? 'border-destructive' : 'border-muted-foreground/25 hover:border-primary'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            className="hidden"
          />
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <div className="text-lg font-medium mb-2">
            {file ? file.name : 'Drop your file here'}
          </div>
          <div className="text-sm text-muted-foreground">
            or click to browse · .json only
          </div>
        </div>

        {error && (
          <div className="mt-4 text-sm text-destructive text-center">{error}</div>
        )}

        <Button
          onClick={handleDecrypt}
          disabled={!file || isDecrypting}
          className="w-full mt-4"
        >
          <LockOpen className="w-4 h-4 mr-2" />
          {isDecrypting ? 'Decrypting...' : 'Decrypt'}
        </Button>

        <div className="mt-4 text-xs text-muted-foreground text-center">
          The file stays on your device. Nothing is sent anywhere.
        </div>
      </div>
    </div>
  )
}
