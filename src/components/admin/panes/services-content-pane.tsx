
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

interface ServicesPageContent {
    title: string;
    subtitle: string;
    lead: string;
    services: { title: string; description: string }[];
    imageUrl?: string;
}


export default function ServicesContentPane() {
  const { toast } = useToast();
  const firestore = useFirestore();

  const servicesContentRef = useMemoFirebase(
    () => (firestore ? doc(firestore, "/pages/services") : null),
    [firestore]
  );
  const { data: servicesPageContent, isLoading } = useDoc<ServicesPageContent>(servicesContentRef);

  const [content, setContent] = useState<Partial<ServicesPageContent>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  useEffect(() => {
    if (servicesPageContent) {
      setContent(servicesPageContent);
    }
  }, [servicesPageContent]);

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
    if (servicesPageContent) {
      setContent(servicesPageContent);
      toast({
        title: "Form Reset",
        description: "Your changes have been discarded.",
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !servicesContentRef) return;

    setIsSaving(true);
    
    const dataToSave = {
        ...content,
        services: content.services || [
            { "title": "Global Sourcing", "description": "Leveraging our extensive network, we source high-quality raw materials from verified manufacturers worldwide, ensuring you get the best value without compromising on quality." },
            { "title": "Logistics and Supply Chain Management", "description": "We provide end-to-end logistics solutions, including customs clearance and timely delivery, to ensure your materials arrive safely and on schedule, every time." },
            { "title": "Technical Support", "description": "Our team of experts provides comprehensive technical support, from product specifications to regulatory documentation, helping you navigate complex requirements with ease." },
            { "title": "Customized Solutions", "description": "We work closely with our clients to understand their unique needs, offering customized sourcing and packaging solutions to meet specific project requirements." }
        ]
    };
    
    setDoc(servicesContentRef, dataToSave, { merge: true })
        .then(() => {
            toast({
                title: "Update Successful",
                description: "Services page content has been saved. The page will now reload.",
            });
             setTimeout(() => window.location.reload(), 1500);
        })
        .catch((err: any) => {
            const permissionError = new FirestorePermissionError({
                path: servicesContentRef.path,
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
        <h3 className="text-lg font-medium">Services Page Content</h3>
        <p className="text-sm text-muted-foreground">Edit the content for the "Services" page.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6" key={JSON.stringify(servicesPageContent)}>
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
