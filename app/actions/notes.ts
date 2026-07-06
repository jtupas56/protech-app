'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { notes } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function getNotes() {
  try {
    const { userId } = await auth()
    if (!userId) return []

    const userNotes = await db
      .select()
      .from(notes)
      .where(eq(notes.userId, userId))
      .orderBy(desc(notes.updatedAt))

    return userNotes
  } catch (error) { 
    console.error('Error in getNotes:', error)
    throw error
  }
}

export async function createNote(content: string = '') {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')

    const [newNote] = await db
      .insert(notes)
      .values({ userId, content })
      .returning()

    return newNote
  } catch (error) {
    console.error('Error in createNote:', error)
    throw error
  }
}

export async function updateNote(id: string, content: string) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')

    const [updated] = await db
      .update(notes)
      .set({ content, updatedAt: new Date() })
      .where(eq(notes.id, id))
      .returning()

    return updated
  } catch (error) {
    console.error('Error in updateNote:', error)
    throw error
  }
}

export async function deleteNote(id: string) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')

    await db.delete(notes).where(eq(notes.id, id))
  } catch (error) {
    console.error('Error in deleteNote:', error)
    throw error
  }
}

export async function addDecryptedNote(content: string) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')

    const [newNote] = await db
      .insert(notes)
      .values({ userId, content })
      .returning()

    return newNote
  } catch (error) {
    console.error('Error in addDecryptedNote:', error)
    throw error
  }
}
