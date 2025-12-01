
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
import { Trash2, PlusCircle, GripVertical } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const quickLinkSchema = z.object({
  href: z.string().min(1, 'Href is required'),
  label: z.string().min(1, 'Label is required'),
});

const footerSettingsSchema = z.object({
  brandName: z.string().min(1, 'Brand name is required'),
  description: z.string().min(1, 'Description is required'),
  ctaLabel: z.string().min(1, 'CTA label is required'),
  ctaHref: z.string().min(1, 'CTA href is required'),
  quickLinksTitle: z.string().min(1, 'Title is required'),
  quickLinks: z.array(quickLinkSchema),
  contactInfoTitle: z.string().min(1, 'Title is required'),
  address: z.string().min(1, 'Address is required'),
  email: z.string().email(),
  phone: z.string().min(1, 'Phone is required'),
  copyright: z.string().min(1, 'Copyright is required'),
});

type FooterSettingsData = z.infer<typeof footerSettingsSchema>;

const defaultValues: FooterSettingsData = {
    brandName: "Swalaxon Remedies",
    description: "Your trusted global partner for high-quality pharmaceutical and chemical raw materials, ensuring quality, compliance, and reliability.",
    ctaLabel: "Request a Quote",
    ctaHref: "/contact",
    quickLinksTitle: "Quick Links",
    quickLinks: [
      { href: "/products", label: "Products" },
      { href: "/about", label: "About Us" },
      { href: "/quality", label: "Quality" },
      { href: "/contact", label: "Contact" },
    ],
    contactInfoTitle: "Contact Info",
    address: "Nagpur, Maharashtra, India",
    email: "info.swalaxonremedies@gmail.com",
    phone: "+91-9766208402",
    copyright: `© ${new Date().getFullYear()} Swalaxon Remedies Pvt Ltd. All rights reserved.`,
};

export function FooterSettings() {
  const { toast } = useToast();
  const firestore = useFirestore();

  const settingsRef = useMemoFirebase(
    () => (firestore ? doc(firestore, '/settings/footer') : null),
    [firestore]
  );
  const { data: initialSettings, isLoading } = useDoc<FooterSettingsData>(settingsRef);

  const methods = useForm<FooterSettingsData>({
    resolver: zodResolver(footerSettingsSchema),
    defaultValues,
  });
  const { control, register, handleSubmit, reset, formState: { errors } } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'quickLinks',
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialSettings) {
      reset(initialSettings);
    }
  }, [initialSettings, reset]);

  const onSubmit = (formData: FooterSettingsData) => {
    if (!settingsRef) return;
    setIsSaving(true);
    
    setDoc(settingsRef, formData, { merge: true })
      .then(() => {
        toast({ title: 'Success', description: 'Footer settings have been updated.' });
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
            <CardHeader>
                <CardTitle>Footer Content</CardTitle>
                <CardDescription>Manage the content for the website footer.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="brandName">Brand Name</Label>
                    <Input id="brandName" {...register('brandName')} />
                    {errors.brandName && <p className="text-sm font-medium text-destructive">{errors.brandName.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" {...register('description')} />
                    {errors.description && <p className="text-sm font-medium text-destructive">{errors.description.message}</p>}
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="ctaLabel">CTA Button Label</Label>
                        <Input id="ctaLabel" {...register('ctaLabel')} />
                        {errors.ctaLabel && <p className="text-sm font-medium text-destructive">{errors.ctaLabel.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ctaHref">CTA Button Link</Label>
                        <Input id="ctaHref" {...register('ctaHref')} />
                        {errors.ctaHref && <p className="text-sm font-medium text-destructive">{errors.ctaHref.message}</p>}
                    </div>
                </div>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
                <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                  <Label>Section Title</Label>
                  <Input {...register('quickLinksTitle')} />
                  {errors.quickLinksTitle && <p className="text-sm font-medium text-destructive">{errors.quickLinksTitle.message}</p>}
                </div>
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2 p-3 border rounded-lg">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                      <div className="space-y-1">
                          <Label>Label</Label>
                          <Input {...register(`quickLinks.${index}.label`)} placeholder="e.g. Products" />
                          {errors.quickLinks?.[index]?.label && <p className="text-sm font-medium text-destructive">{errors.quickLinks[index]?.label?.message}</p>}
                      </div>
                       <div className="space-y-1">
                          <Label>URL</Label>
                          <Input {...register(`quickLinks.${index}.href`)} placeholder="e.g. /products" />
                          {errors.quickLinks?.[index]?.href && <p className="text-sm font-medium text-destructive">{errors.quickLinks[index]?.href?.message}</p>}
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

          <Card className="mt-8">
            <CardHeader>
                <CardTitle>Contact Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                  <Label>Section Title</Label>
                  <Input {...register('contactInfoTitle')} />
                  {errors.contactInfoTitle && <p className="text-sm font-medium text-destructive">{errors.contactInfoTitle.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input {...register('address')} />
                  {errors.address && <p className="text-sm font-medium text-destructive">{errors.address.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" {...register('email')} />
                  {errors.email && <p className="text-sm font-medium text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input {...register('phone')} />
                  {errors.phone && <p className="text-sm font-medium text-destructive">{errors.phone.message}</p>}
                </div>
            </CardContent>
          </Card>

           <Card className="mt-8">
            <CardHeader>
                <CardTitle>Copyright</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                  <Label>Copyright Text</Label>
                  <Input {...register('copyright')} />
                  {errors.copyright && <p className="text-sm font-medium text-destructive">{errors.copyright.message}</p>}
                </div>
            </CardContent>
          </Card>

          <div className="mt-8 flex justify-end">
            <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Footer Settings'}</Button>
          </div>
        </form>
    </FormProvider>
  );
}
