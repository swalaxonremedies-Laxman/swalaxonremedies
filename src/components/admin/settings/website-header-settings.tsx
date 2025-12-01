
'use client';
import { useForm, useFieldArray, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, PlusCircle, GripVertical, Upload } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { ImagePickerModal } from '../image-picker-modal';
import { ImageUploadModal } from '../image-upload-modal';

const navLinkSchema = z.object({
  href: z.string().min(1, 'Href is required'),
  label: z.string().min(1, 'Label is required'),
});

const websiteSettingsSchema = z.object({
  brandName: z.string().min(1, 'Brand name is required'),
  logoType: z.enum(['svg', 'url']).default('svg'),
  logoSvg: z.string().optional(),
  logoUrl: z.string().optional(),
  navLinks: z.array(navLinkSchema),
});

type WebsiteSettings = z.infer<typeof websiteSettingsSchema>;

const defaultValues: WebsiteSettings = {
    brandName: "Swalaxon Remedies",
    logoType: 'svg',
    logoSvg: `<svg width="200" height="50" viewBox="0 0 200 50" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24.73 38.23l-7.2-12.27L10.53 38.23H2.5l11-18.47L2.73 1.5h8.2l6.97 11.97L24.87 1.5h7.83l-10.8 18.27L33.1 38.23h-8.37zM42.4 38.23V1.5h20.1v7.1h-12v6.2h11.2v6.9h-11.2v9.43h12.5v7.1H42.4zM73.56 1.5h8.6l10.5 24.5-1.1 2.8c-1.3 3.3-3.6 5.8-6.9 7.4-3.3 1.6-7.2 2.4-11.6 2.4-4.2 0-7.7-.7-10.5-2.2l2.3-6.9c2.3 1.2 5.1 1.8 8.4 1.8 2.6 0 4.8-.4 6.6-1.2 1.8-.8 3-2 3.6-3.6l1.3-3.4L73.56 1.5zm11.7 18.9l-3.8-9.4-4.2 9.4h8zM108.5 38.23V1.5h8.1v36.73h-8.1zM119.54 38.23V1.5h20.1v7.1h-12v6.2h11.2v6.9h--11.2v9.43h12.5v7.1h-20.6zM153.25 1.5l-13.8 36.73h-8.5l13.8-36.73h8.5zM161.4 38.23l-7.2-12.27-7.03 12.27h-8.0l11-18.47-10.77-18.23h8.2l6.97 11.97L168.67 1.5h7.83l-10.8 18.27L176.9 38.23h-8.37l-7.13-12.1-7.1 12.1h-8.1l11.1-18.3-11.1-18.4h8.1l7.1 12.1 7.13-12.1h8.1l-11.1 18.4 11.1 18.3h-8.1zM176.6 38.23V1.5h8.1v36.73h-8.1z" fill="hsl(var(--primary))"/></svg>`,
    logoUrl: '/default-logo.svg',
    navLinks: [
      { href: "/", label: "Home" },
      { href: "/about", label: "About Us" },
      { href: "/products", label: "Products" },
      { href: "/services", label: "Services" },
      { href: "/quality", label: "Quality" },
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
    ]
};


export function WebsiteHeaderSettings() {
  const { toast } = useToast();
  const firestore = useFirestore();

  const settingsRef = useMemoFirebase(
    () => (firestore ? doc(firestore, '/settings/website') : null),
    [firestore]
  );
  const { data: initialSettings, isLoading } = useDoc<WebsiteSettings>(settingsRef);

  const methods = useForm<WebsiteSettings>({
    resolver: zodResolver(websiteSettingsSchema),
    defaultValues,
  });
  const { control, register, handleSubmit, reset, watch, setValue, formState: { errors } } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'navLinks',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  const watchedLogoType = watch('logoType');
  const watchedLogoUrl = watch('logoUrl');
  const watchedLogoSvg = watch('logoSvg');

  useEffect(() => {
    if (initialSettings) {
      reset(initialSettings);
    }
  }, [initialSettings, reset]);


  const onSubmit = (formData: WebsiteSettings) => {
    if (!settingsRef) return;
    setIsSaving(true);
    
    setDoc(settingsRef, formData, { merge: true })
      .then(() => {
        toast({ title: 'Success', description: 'Website settings have been updated.' });
        setTimeout(() => window.location.reload(), 1000);
      })
      .catch((err) => {
        const permissionError = new FirestorePermissionError({
          path: settingsRef.path,
          operation: 'write',
          requestResourceData: formData,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({ variant: 'destructive', title: 'Save Failed', description: 'You do not have permission to save.' });
      })
      .finally(() => setIsSaving(false));
  };

  const handleImageSelect = (url: string) => {
    setValue('logoUrl', url);
    setIsPickerOpen(false);
  };
  const handleUploadComplete = (url: string) => {
    setValue('logoUrl', url);
    setIsUploaderOpen(false);
  };
  
  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  return (
    <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader><CardTitle>Website Branding</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="brandName">Brand Name (fallback)</Label>
                <Input id="brandName" {...register('brandName')} />
                <p className="text-sm text-muted-foreground">Used if no logo is provided.</p>
                {errors.brandName && <p className="text-sm font-medium text-destructive">{errors.brandName.message}</p>}
              </div>

               <div className="space-y-4">
                    <Label>Logo</Label>
                    <Controller
                        control={control}
                        name="logoType"
                        render={({ field }) => (
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex space-x-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="svg" id="r2" />
                                    <Label htmlFor="r2">SVG Code</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="url" id="r1" />
                                    <Label htmlFor="r1">Image URL</Label>
                                </div>
                            </RadioGroup>
                        )}
                    />
                    
                    {watchedLogoType === 'url' && (
                        <div className="space-y-2">
                            {watchedLogoUrl && <Image src={watchedLogoUrl} alt="Logo preview" width={100} height={40} className="rounded-md border p-2 bg-white" />}
                            <div className="flex items-center gap-2">
                                <Button type="button" variant="outline" onClick={() => setIsPickerOpen(true)}>{watchedLogoUrl ? 'Change' : 'Select'} Image</Button>
                                <Button type="button" variant="secondary" onClick={() => setIsUploaderOpen(true)}><Upload className="mr-2 h-4 w-4" /> Upload New</Button>
                            </div>
                            {errors.logoUrl && <p className="text-sm font-medium text-destructive">{errors.logoUrl.message}</p>}
                        </div>
                    )}
                    
                    {watchedLogoType === 'svg' && (
                        <div className="space-y-2">
                             {watchedLogoSvg && <div className="rounded-md border p-2 bg-white w-fit"><div className="h-auto max-h-12 w-auto" dangerouslySetInnerHTML={{ __html: watchedLogoSvg }} /></div>}
                            <Textarea {...register('logoSvg')} placeholder='<svg>...</svg>' rows={6}/>
                             {errors.logoSvg && <p className="text-sm font-medium text-destructive">{errors.logoSvg.message}</p>}
                        </div>
                    )}
               </div>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
                <CardTitle>Website Navigation</CardTitle>
                <CardDescription>Manage the links in the main website header.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2 p-3 border rounded-lg">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                      <div className="space-y-1">
                          <Label>Label</Label>
                          <Input {...register(`navLinks.${index}.label`)} placeholder="e.g. Home" />
                          {errors.navLinks?.[index]?.label && <p className="text-sm font-medium text-destructive">{errors.navLinks[index]?.label?.message}</p>}
                      </div>
                       <div className="space-y-1">
                          <Label>URL Path</Label>
                          <Input {...register(`navLinks.${index}.href`)} placeholder="e.g. /" />
                          {errors.navLinks?.[index]?.href && <p className="text-sm font-medium text-destructive">{errors.navLinks[index]?.href?.message}</p>}
                      </div>
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => append({ href: '', label: '' })}>
                <PlusCircle className="h-4 w-4 mr-2" /> Add Link
              </Button>
            </CardContent>
          </Card>

          <div className="mt-8 flex justify-end">
            <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Website Settings'}</Button>
          </div>
        </form>
       <ImagePickerModal isOpen={isPickerOpen} onClose={() => setIsPickerOpen(false)} onImageSelect={handleImageSelect} />
       <ImageUploadModal isOpen={isUploaderOpen} onClose={() => setIsUploaderOpen(false)} onUploadComplete={handleUploadComplete} />
    </FormProvider>
  );
}
