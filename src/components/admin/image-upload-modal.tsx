
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (imageUrl: string) => void;
}

export function ImageUploadModal({ isOpen, onClose, onUploadComplete }: ImageUploadModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const file = formData.get('file') as File;

    if (!file || file.size === 0) {
      setError('Please select a file to upload.');
      return;
    }
    
    setIsUploading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const result = await response.json();

      if (result.success) {
        onUploadComplete(result.imageUrl);
        onClose(); // Close modal on success
      } else {
        setError(result.error || 'An unknown error occurred.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to upload the image. Please check the console.');
    } finally {
      setIsUploading(false);
    }
  };

  // Reset state when modal is closed
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setError(null);
      setIsUploading(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload a New Image</DialogTitle>
          <DialogDescription>
            The image will be saved to the server and the URL will be added to the form.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="file">Image File</Label>
              <Input id="file" name="file" type="file" accept="image/*" required disabled={isUploading} />
              <p className="text-sm text-muted-foreground">
                Supported formats: PNG, JPG, WEBP, SVG, GIF etc.
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTitle>Upload Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isUploading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Upload Image'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
