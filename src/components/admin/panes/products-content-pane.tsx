'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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

export default function ProductsContentPane() {
  const { toast } = useToast();
  const firestore = useFirestore();

  const productsContentRef = useMemoFirebase(
    () => (firestore ? doc(firestore, "/pages/products") : null),
    [firestore]
  );
  const { data: productsPageContent, isLoading } = useDoc<ProductsPageContent>(productsContentRef);
  
  const [content, setContent] = useState<Partial<ProductsPageContent>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (productsPageContent) {
      setContent(productsPageContent);
    }
  }, [productsPageContent]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContent(prev => ({ ...prev, [name]: value }));
  };
  
  const handleReset = () => {
    if (productsPageContent) {
      setContent(productsPageContent);
      toast({
        title: "Form Reset",
        description: "Your changes have been discarded.",
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !productsContentRef) return;

    setIsSaving(true);
    
    setDoc(productsContentRef, content, { merge: true })
        .then(() => {
            toast({
                title: "Update Successful",
                description: "Products page content has been saved. The page will now reload.",
            });
            setTimeout(() => window.location.reload(), 1500);
        })
        .catch((err: any) => {
            const permissionError = new FirestorePermissionError({
                path: productsContentRef.path,
                operation: 'write',
                requestResourceData: content,
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
    <div className="space-y-6">
       <div>
        <h3 className="text-lg font-medium">Products Page Content</h3>
        <p className="text-sm text-muted-foreground">Edit the headline and introduction for the main products page.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6" key={JSON.stringify(productsPageContent)}>
        <div className="space-y-2">
            <Label htmlFor="title">Headline</Label>
            <Input 
              id="title" 
              name="title" 
              value={content?.title || ''}
              onChange={handleInputChange}
            />
        </div>
        <div className="space-y-2">
            <Label htmlFor="description">Introductory Paragraph</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={content?.description || ''}
              onChange={handleInputChange}
              rows={6}
            />
        </div>
        
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleReset} disabled={isSaving}>
                Reset
            </Button>
            <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
        </div>
      </form>
    </div>
  );
}
