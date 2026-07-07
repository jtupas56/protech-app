export interface EncryptedNote {
  encryptedData: string
  iv: number[]
  key: JsonWebKey
}

export async function encrypt(content: string): Promise<EncryptedNote> {
  const key = await crypto.subtle.generateKey(
    { name: 'AES-CBC', length: 256 },
    true,
    ['encrypt', 'decrypt']
  )

  const iv = crypto.getRandomValues(new Uint8Array(16))
  const encoded = new TextEncoder().encode(content)

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-CBC', iv },
    key,
    encoded
  )

  const exportedKey = await crypto.subtle.exportKey('jwk', key)

  const encryptedData = Array.from(new Uint8Array(ciphertext))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  return {
    encryptedData,
    iv: Array.from(iv),
    key: exportedKey,
  }
}

export async function decrypt(payload: EncryptedNote): Promise<string> {
  const { iv, encryptedData, key: jwk } = payload

  const key = await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'AES-CBC' },
    false,
    ['decrypt']
  )

  const ciphertext = new Uint8Array(
    encryptedData.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  )

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-CBC', iv: new Uint8Array(iv) },
    key,
    ciphertext
  )

  return new TextDecoder().decode(decrypted)
}

export function downloadEncryptedNote(payload: EncryptedNote, createdAt: Date) {
  const dateStr = createdAt.toISOString().slice(0, 10)
  const timeStr = createdAt.toTimeString().slice(0, 5).replace(':', '')
  const filename = `note-${dateStr}-${timeStr}.json`

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function hashFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}