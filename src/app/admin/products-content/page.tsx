
'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Upload } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

interface ProductsPageContent {
  title: string;
  description: string;
}

export default function ProductsContentPage() {
  const { toast } = useToast();
  const firestore = useFirestore();

  const contentRef = useMemoFirebase(
    () => (firestore ? doc(firestore, "/pages/products") : null),
    [firestore]
  );
  const { data: initialContent, isLoading } = useDoc<ProductsPageContent>(contentRef);

  const [content, setContent] = useState<Partial<ProductsPageContent>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    }
  }, [initialContent]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContent(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !contentRef) return;

    setIsSaving(true);
    const dataToSave = {
        title: content.title || '',
        description: content.description || ''
    };

    setDoc(contentRef, dataToSave, { merge: true })
        .then(() => {
            toast({
                title: "Update Successful",
                description: "Products page content has been saved.",
            });
        })
        .catch((err: any) => {
            const permissionError = new FirestorePermissionError({
                path: contentRef.path,
                operation: 'write',
                requestResourceData: dataToSave,
            });
            errorEmitter.emit('permission-error', permissionError);
            toast({
                variant: "destructive",
                title: "Save Failed",
                description: "You do not have permission to save these changes.",
            });
        })
        .finally(() => {
            setIsSaving(false);
        });
  };
  
  if (isLoading) {
    return <div>Loading editor...</div>
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-headline">Products Page Content</h1>
        <p className="text-muted-foreground">Edit the headline and introduction for the main products page.</p>
      </div>

      <form onSubmit={handleSave}>
        <Card>
          <CardHeader>
            <CardTitle>Page Content</CardTitle>
            <CardDescription>
              Update the text that appears at the top of the products listing page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Headline</Label>
              <Input
                id="title"
                name="title"
                value={content.title || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Introductory Paragraph</Label>
              <Textarea
                id="description"
                name="description"
                value={content.description || ''}
                onChange={handleInputChange}
                rows={6}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSaving || isLoading}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </Card>
      </form>

      <div className="text-sm text-muted-foreground">
        Note: Content edits are saved directly to the database.
      </div>
    </div>
  );
}
