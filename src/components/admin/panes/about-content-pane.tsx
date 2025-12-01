
'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';
import Image from 'next/image';
import { Upload } from 'lucide-react';
import { ImagePickerModal } from '../image-picker-modal';
import { ImageUploadModal } from '../image-upload-modal';


interface AboutPageContent {
  title: string;
  subtitle: string;
  lead: string;
  mission: string;
  vision: string;
  closing: string;
  values: { title: string; description: string }[];
  imageUrl?: string;
}

export default function AboutContentPane() {
  const { toast } = useToast();
  const firestore = useFirestore();

  const aboutContentRef = useMemoFirebase(
    () => (firestore ? doc(firestore, "/pages/about") : null),
    [firestore]
  );
  const { data: aboutPageContent, isLoading } = useDoc<AboutPageContent>(aboutContentRef);
  
  const [content, setContent] = useState<Partial<AboutPageContent>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  useEffect(() => {
    if (aboutPageContent) {
      setContent(aboutPageContent);
    }
  }, [aboutPageContent]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContent(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageSelect = (selectedImageUrl: string) => {
    setContent(prev => ({ ...prev, imageUrl: selectedImageUrl }));
    setIsPickerOpen(false);
  };
  
  const handleUploadComplete = (newImageUrl: string) => {
    setContent(prev => ({ ...prev, imageUrl: newImageUrl }));
    setIsUploaderOpen(false);
  };

  const handleReset = () => {
    if (aboutPageContent) {
      setContent(aboutPageContent);
      toast({
        title: "Form Reset",
        description: "Your changes have been discarded.",
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !aboutContentRef) return;

    setIsSaving(true);
    
    const dataToSave = {
      ...content,
      values: content.values || [
        { "title": "Integrity", "description": "We uphold the highest ethical standards, ensuring transparency and trust in all our partnerships." },
        { "title": "Innovation", "description": "We continuously seek out advanced solutions and novel materials to help our clients stay ahead of the curve." },
        { "title": "Reliability", "description": "We are committed to on-time delivery and a consistent supply chain, so you can count on us." }
      ]
    };

    setDoc(aboutContentRef, dataToSave, { merge: true })
        .then(() => {
            toast({
                title: "Update Successful",
                description: "About page content has been saved. The page will now reload.",
            });
            setTimeout(() => window.location.reload(), 1500);
        })
        .catch((err: any) => {
            const permissionError = new FirestorePermissionError({
                path: aboutContentRef.path,
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
    <>
    <div className="space-y-6">
       <div>
        <h3 className="text-lg font-medium">About Page Content</h3>
        <p className="text-sm text-muted-foreground">Edit the content for the "About Us" page.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6" key={JSON.stringify(aboutPageContent)}>
        <div className="space-y-2">
            <Label>Banner Image</Label>
            {content.imageUrl && (
                <div className="mt-2 w-full max-w-sm">
                    <Image 
                        src={content.imageUrl} 
                        alt="Image preview" 
                        width={200}
                        height={200}
                        className="rounded-md object-contain border"
                    />
                </div>
            )}
            <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={() => setIsPickerOpen(true)}>
                    {content.imageUrl ? 'Change Image' : 'Select Image'}
                </Button>
                    <Button type="button" variant="secondary" onClick={() => setIsUploaderOpen(true)}>
                        <Upload className="mr-2 h-4 w-4" /> Upload New
                </Button>
            </div>
            <p className="text-sm text-muted-foreground">This is the main banner image for the page.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Headline</Label>
          <Input id="title" name="title" value={content?.title || ''} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtitle">Sub-headline</Label>
          <Input id="subtitle" name="subtitle" value={content?.subtitle || ''} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lead">Lead Paragraph</Label>
          <Textarea id="lead" name="lead" value={content?.lead || ''} onChange={handleInputChange} rows={4} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mission">Mission Statement</Label>
          <Textarea id="mission" name="mission" value={content?.mission || ''} onChange={handleInputChange} rows={4} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vision">Vision Statement</Label>
          <Textarea id="vision" name="vision" value={content?.vision || ''} onChange={handleInputChange} rows={4} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="closing">Closing Paragraph</Label>
          <Textarea id="closing" name="closing" value={content?.closing || ''} onChange={handleInputChange} rows={4} />
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

    <ImagePickerModal 
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onImageSelect={handleImageSelect}
    />
    
    <ImageUploadModal
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        onUploadComplete={handleUploadComplete}
    />
    </>
  );
}
