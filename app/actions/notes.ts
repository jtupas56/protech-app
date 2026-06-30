'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { notes } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function getNotes() {
  const { userId } = await auth()
  if (!userId) return []

  const userNotes = await db
    .select()
    .from(notes)
    .where(eq(notes.userId, userId))
    .orderBy(desc(notes.updatedAt))

  return userNotes
}

export async function createNote(content: string = '') {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const [newNote] = await db
    .insert(notes)
    .values({ userId, content })
    .returning()

  return newNote
}

export async function updateNote(id: string, content: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const [updated] = await db
    .update(notes)
    .set({ content, updatedAt: new Date() })
    .where(eq(notes.id, id))
    .returning()

  return updated
}

export async function deleteNote(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  await db.delete(notes).where(eq(notes.id, id))
}

export async function addDecryptedNote(content: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const [newNote] = await db
    .insert(notes)
    .values({ userId, content })
    .returning()

  return newNote
}
