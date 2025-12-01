
'use client';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
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
import { Switch } from '@/components/ui/switch';
import { Trash2, Upload, PlusCircle, GripVertical } from 'lucide-react';
import Image from 'next/image';
import { ImagePickerModal } from '@/components/admin/image-picker-modal';
import { ImageUploadModal } from '@/components/admin/image-upload-modal';
import { iconMap } from '@/components/admin/icon-map';

const navLinkSchema = z.object({
  href: z.string().min(1, 'Href is required'),
  label: z.string().min(1, 'Label is required'),
  icon: z.string().min(1, 'Icon is required'),
  visible: z.boolean(),
});

const adminSettingsSchema = z.object({
  brandName: z.string().min(1, 'Brand name is required'),
  logoUrl: z.string().optional(),
  navLinks: z.array(navLinkSchema),
});

type AdminSettings = z.infer<typeof adminSettingsSchema>;

const defaultValues: AdminSettings = {
    brandName: "Swalaxon Admin",
    logoUrl: "/uploads/default-logo.svg",
    navLinks: [
      { href: "/admin/dashboard", label: "Dashboard", icon: "LayoutDashboard", visible: true },
      { href: "/admin/products", label: "Products", icon: "Package", visible: true },
      { href: "/admin/blog", label: "Blog", icon: "Newspaper", visible: true },
      { href: "/admin/products-content", label: "Products Page Content", icon: "FilePenLine", visible: false },
      { href: "/admin/ai-sourcing", label: "AI Sourcing", icon: "Bot", visible: true },
      { href: "/admin/media", label: "Media", icon: "Upload", visible: false },
      { href: "/admin/settings", label: "Site Settings", icon: "Settings", visible: true },
    ]
};


export function AdminPanelSettings() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const allIcons = Object.keys(iconMap);

  const settingsRef = useMemoFirebase(
    () => (firestore ? doc(firestore, '/settings/admin') : null),
    [firestore]
  );
  const { data: initialSettings, isLoading } = useDoc<AdminSettings>(settingsRef);

  const methods = useForm<AdminSettings>({
    resolver: zodResolver(adminSettingsSchema),
    defaultValues,
  });
  const { control, register, handleSubmit, reset, setValue, watch, formState: { errors } } = methods;
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'navLinks',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  useEffect(() => {
    if (initialSettings) {
      reset(initialSettings);
    }
  }, [initialSettings, reset]);

  const watchedLogoUrl = watch('logoUrl');

  const handleImageSelect = (url: string) => {
    setValue('logoUrl', url);
    setIsPickerOpen(false);
  };
  const handleUploadComplete = (url: string) => {
    setValue('logoUrl', url);
    setIsUploaderOpen(false);
  };

  const onSubmit = (formData: AdminSettings) => {
    if (!settingsRef) return;
    setIsSaving(true);
    
    setDoc(settingsRef, formData, { merge: true })
      .then(() => {
        toast({ title: 'Success', description: 'Admin settings have been updated.' });
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
  
  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  return (
    <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader><CardTitle>Admin Branding</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="brandName">Brand Name</Label>
                <Input id="brandName" {...register('brandName')} />
                {errors.brandName && <p className="text-sm font-medium text-destructive">{errors.brandName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Logo</Label>
                {watchedLogoUrl && <Image src={watchedLogoUrl} alt="Logo preview" width={40} height={40} className="rounded-md" />}
                <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsPickerOpen(true)}>{watchedLogoUrl ? 'Change' : 'Select'} Image</Button>
                    <Button type="button" variant="secondary" onClick={() => setIsUploaderOpen(true)}><Upload className="mr-2 h-4 w-4" /> Upload New</Button>
                </div>
                 {errors.logoUrl && <p className="text-sm font-medium text-destructive">{errors.logoUrl.message}</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
                <CardTitle>Admin Navigation</CardTitle>
                <CardDescription>Manage the links in the admin sidebar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2 p-3 border rounded-lg">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                      <div className="space-y-1">
                          <Label>Label</Label>
                          <Input {...register(`navLinks.${index}.label`)} placeholder="e.g. Dashboard" />
                          {errors.navLinks?.[index]?.label && <p className="text-sm font-medium text-destructive">{errors.navLinks[index]?.label?.message}</p>}
                      </div>
                       <div className="space-y-1">
                          <Label>URL</Label>
                          <Input {...register(`navLinks.${index}.href`)} placeholder="e.g. /admin/dashboard" />
                          {errors.navLinks?.[index]?.href && <p className="text-sm font-medium text-destructive">{errors.navLinks[index]?.href?.message}</p>}
                      </div>
                      <div className="space-y-1">
                           <Label>Icon</Label>
                           <select {...register(`navLinks.${index}.icon`)} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
                                {allIcons.map(iconName => <option key={iconName} value={iconName}>{iconName}</option>)}
                           </select>
                           {errors.navLinks?.[index]?.icon && <p className="text-sm font-medium text-destructive">{errors.navLinks[index]?.icon?.message}</p>}
                      </div>
                  </div>
                  <div className="flex flex-col items-center gap-2 ml-4">
                    <Label>Visible</Label>
                    <Switch
                        checked={field.visible}
                        onCheckedChange={(checked) => setValue(`navLinks.${index}.visible`, checked)}
                    />
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => append({ href: '', label: '', icon: 'Link', visible: true })}>
                <PlusCircle className="h-4 w-4 mr-2" /> Add Link
              </Button>
            </CardContent>
          </Card>

          <div className="mt-8 flex justify-end">
            <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Admin Settings'}</Button>
          </div>
        </form>

       <ImagePickerModal isOpen={isPickerOpen} onClose={() => setIsPickerOpen(false)} onImageSelect={handleImageSelect} />
       <ImageUploadModal isOpen={isUploaderOpen} onClose={() => setIsUploaderOpen(false)} onUploadComplete={handleUploadComplete} />
    </FormProvider>
  );
}
