
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

interface QualityPageContent {
    title: string;
    subtitle: string;
    lead: string;
    frameworkTitle: string;
    frameworkDescription: string;
    closing: string;
    points: { title: string; description: string }[];
    imageUrl?: string;
}


export default function QualityContentPane() {
  const { toast } = useToast();
  const firestore = useFirestore();

  const qualityContentRef = useMemoFirebase(
    () => (firestore ? doc(firestore, "/pages/quality") : null),
    [firestore]
  );
  const { data: qualityPageContent, isLoading } = useDoc<QualityPageContent>(qualityContentRef);

  const [content, setContent] = useState<Partial<QualityPageContent>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  useEffect(() => {
    if (qualityPageContent) {
      setContent(qualityPageContent);
    }
  }, [qualityPageContent]);

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
    if (qualityPageContent) {
      setContent(qualityPageContent);
      toast({
        title: "Form Reset",
        description: "Your changes have been discarded.",
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !qualityContentRef) return;

    setIsSaving(true);
    
    const dataToSave = {
        ...content,
        points: content.points || [
            { "title": "Supplier Vetting", "description": "We partner exclusively with manufacturers who meet stringent global quality standards, including WHO-GMP, EU-GMP, and USFDA approvals." },
            { "title": "Rigorous Testing", "description": "Every product is accompanied by a Certificate of Analysis (COA) and is subject to our independent verification testing to guarantee purity and potency." },
            { "title": "Regulatory Compliance", "description": "Our team stays ahead of evolving regulatory landscapes, providing comprehensive documentation to support your filings and ensure a smooth path to market." }
        ]
    };
    
    setDoc(qualityContentRef, dataToSave, { merge: true })
        .then(() => {
            toast({
                title: "Update Successful",
                description: "Quality page content has been saved. The page will now reload.",
            });
            setTimeout(() => window.location.reload(), 1500);
        })
        .catch((err: any) => {
            const permissionError = new FirestorePermissionError({
                path: qualityContentRef.path,
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

  if(isLoading) {
    return <div>Loading editor...</div>
  }

  return (
    <>
    <div className="space-y-6">
       <div>
        <h3 className="text-lg font-medium">Quality Page Content</h3>
        <p className="text-sm text-muted-foreground">Edit the content for the "Quality" page.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6" key={JSON.stringify(qualityPageContent)}>
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
            <Label htmlFor="frameworkTitle">Framework Title</Label>
            <Input id="frameworkTitle" name="frameworkTitle" value={content?.frameworkTitle || ''} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="frameworkDescription">Framework Description</Label>
            <Textarea id="frameworkDescription" name="frameworkDescription" value={content?.frameworkDescription || ''} onChange={handleInputChange} rows={3} />
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
