'use client';

import { useState, useEffect } from 'react';
import { useAuth, SignInButton } from '@clerk/nextjs';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { hashFile } from '@/lib/crypto';
import { FileBox, Fingerprint, Database, Search, Shield, CheckCircle } from 'lucide-react';

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
  const [hash, setHash] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [records, setRecords] = useState<Record[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [duplicateMessage, setDuplicateMessage] = useState('');

  useEffect(() => {
    if (!userId) return;
    const stored = localStorage.getItem(`verifications_${userId}`);
    if (stored) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRecords(JSON.parse(stored));
      } catch { }
    }
  }, [userId]);

  const saveRecords = (newRecords: Record[]) => {
    setRecords(newRecords);
    if (userId) {
      localStorage.setItem(`verifications_${userId}`, JSON.stringify(newRecords));
    }
  };

  const handleVerify = async () => {
    if (!file) {
      setErrorMessage('Please select a file first.');
      setShowErrorDialog(true);
      return;
    }

    setIsProcessing(true);
    try {
      const hashResult = await hashFile(file);
      setHash(hashResult);

      // Check if hash already exists
      const existingRecord = records.find(r => r.hash === hashResult);
      if (existingRecord) {
        setDuplicateMessage(`This file's hash already exists in your records (from ${new Date(existingRecord.timestamp).toLocaleString()}). Duplicate hashes are not allowed for integrity purposes.`);
        setShowDuplicateDialog(true);
        setFile(null);
        (document.getElementById('file-upload') as HTMLInputElement).value = '';
        setIsProcessing(false);
        return;
      }

      const newRecord: Record = {
        id: Date.now().toString(),
        filename: file.name,
        hash: hashResult,
        size: file.size,
        timestamp: Date.now(),
      };
      saveRecords([newRecord, ...records]);

      setFile(null);
      (document.getElementById('file-upload') as HTMLInputElement).value = '';
    } catch {
      setErrorMessage('Failed to verify file.');
      setShowErrorDialog(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      saveRecords(records.filter((r) => r.id !== deleteId));
      setDeleteId(null);
    }
    setShowDeleteDialog(false);
  };

  const filteredRecords = searchQuery.trim() === ''
    ? records
    : records.filter((r) =>
      r.filename.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (!isLoaded) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!userId) return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/20">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Fingerprint className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">File Verification</h1>
          <p className="text-muted-foreground">
            Sign in to access file hash verification
          </p>
        </div>
        
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-xl">Authentication Required</CardTitle>
            <CardDescription>
            Verify file integrity with SHA-256 hashing and track your verification history
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Fingerprint className="w-3 h-3 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  SHA-256 hashing for file integrity
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Shield className="w-3 h-3 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Track your verification history
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-3 h-3 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Duplicate hash detection for integrity
                </p>
              </div>
            </div>
            
            <SignInButton mode="modal">
              <Button className="w-full" size="lg">
                Sign In to Continue
              </Button>
            </SignInButton>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8">File Verification</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="overflow-hidden shadow-md">
            <div className="bg-blue-50/50 dark:bg-blue-950/20 p-4 border-b">
              <CardHeader className="p-0 flex flex-row items-center gap-3">
                <FileBox className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <CardTitle className="text-base font-semibold">Choose File</CardTitle>
                  <p className="text-sm text-muted-foreground">Select a file to verify</p>
                </div>
              </CardHeader>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select file</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    Choose File
                  </Button>
                  <span className="text-sm text-muted-foreground truncate max-w-[180px]">
                    {file ? file.name : 'No file chosen'}
                  </span>
                </div>
                <Input
                  id="file-upload"
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </div>
              <Button
                onClick={handleVerify}
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isProcessing ? 'Processing...' : 'Hash & Save (SHA-256)'}
              </Button>
            </CardContent>
          </Card>

          <Card className="overflow-hidden shadow-md">
            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-4 border-b">
              <CardHeader className="p-0 flex flex-row items-center gap-3">
                <Fingerprint className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <CardTitle className="text-base font-semibold">Hash Value</CardTitle>
                  <p className="text-sm text-muted-foreground">SHA-256 hash of the selected file</p>
                </div>
              </CardHeader>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Hash Value</label>
                <Input
                  value={hash}
                  readOnly
                  placeholder="Hash will appear here..."
                  className="font-mono text-xs"
                />
              </div>
              <div className="text-xs text-muted-foreground text-center bg-muted/50 p-2 rounded-md">
                Generated after hashing a file
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden shadow-md">
          <div className="bg-purple-50/50 dark:bg-purple-950/20 p-4 border-b">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardHeader className="p-0 flex flex-row items-center gap-3">
                <Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <div>
                  <CardTitle className="text-base font-semibold">Hash Records</CardTitle>
                </div>
              </CardHeader>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search File Name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>File</TableHead>
                  <TableHead>Hash</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No records yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="whitespace-nowrap text-xs">
                        {new Date(r.timestamp).toLocaleString('en-GB')}
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate">{r.filename}</TableCell>
                      <TableCell className="font-mono text-xs max-w-[200px] truncate">
                        {r.hash}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(r.hash);
                              setShowCopySuccess(true);
                              setTimeout(() => setShowCopySuccess(false), 2000);
                            }}
                          >
                            {showCopySuccess ? 'Copied!' : 'Copy'}
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

      {/* Error Dialog */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>
              {errorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Duplicate Hash Dialog */}
      <AlertDialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Duplicate Hash Detected</AlertDialogTitle>
            <AlertDialogDescription>
              {duplicateMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this record? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
