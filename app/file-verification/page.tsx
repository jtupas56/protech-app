// app/file-verification/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { hashFile } from '@/lib/crypto';

interface Record {
  id: string;
  filename: string;
  hash: string;
  size: number;
  timestamp: number;
}

export default function FileVerification() {
  const { userId, isLoaded } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [records, setRecords] = useState<Record[]>([]);

  // Load records from localStorage on mount
  useEffect(() => {
    if (!userId) return;
    const stored = localStorage.getItem(`verifications_${userId}`);
    if (stored) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRecords(JSON.parse(stored));
      } catch {}
    }
  }, [userId]);

  const saveRecords = (newRecords: Record[]) => {
    setRecords(newRecords);
    if (userId) {
      localStorage.setItem(`verifications_${userId}`, JSON.stringify(newRecords));
    }
  };

  const handleVerify = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const hash = await hashFile(file);
      const newRecord: Record = {
        id: Date.now().toString(),
        filename: file.name,
        hash,
        size: file.size,
        timestamp: Date.now(),
      };
      saveRecords([newRecord, ...records]);
      setFile(null);
      (document.getElementById('file-upload') as HTMLInputElement).value = '';
    } catch {
      alert('Failed to verify file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this record?')) return;
    saveRecords(records.filter((r) => r.id !== id));
  };

  if (!isLoaded) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!userId) return <div className="flex h-screen items-center justify-center">Please sign in.</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">File Verification</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Verify File (SHA-256)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                id="file-upload"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                Choose File
              </Button>
              <span className="text-sm text-muted-foreground truncate">
                {file ? file.name : 'No file chosen'}
              </span>
            </div>
            <Button
              onClick={handleVerify}
              disabled={!file || isProcessing}
              className="w-full"
            >
              {isProcessing ? 'Processing...' : 'Verify & Save'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Verification Records</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>File</TableHead>
                  <TableHead>Hash</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No records yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  records.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="whitespace-nowrap text-xs">
                        {new Date(r.timestamp).toLocaleString('en-GB')}
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate">{r.filename}</TableCell>
                      <TableCell className="font-mono text-xs max-w-[200px] truncate">
                        {r.hash}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(r.hash);
                              alert('Copied!');
                            }}
                          >
                            Copy
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(r.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}