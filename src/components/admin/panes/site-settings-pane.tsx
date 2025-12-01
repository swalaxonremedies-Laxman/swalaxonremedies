

'use client';
import { useState, useEffect } from 'react';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';
import Image from 'next/image';
import { Upload, PlusCircle, Trash2 } from 'lucide-react';
import { ImagePickerModal } from '../image-picker-modal';
import { ImageUploadModal } from '../image-upload-modal';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const defaultValues = {
  hero: {
    titleLine1: 'Trusted API & Excipients Sourcing',
    titleLine2: 'Worldwide — Fast, Compliant, Reliable',
    subtitle: 'Swalaxon Remedies sources high-quality APIs and excipients from verified manufacturers, with batch documentation and on-time delivery.',
    cta1: 'Get Quote',
    cta2: 'Download Brochure',
    headerImageUrl: 'https://storage.googleapis.com/gweb-aip-dev.appspot.com/workplace-assets/v1/projects/studio-app-user-project/files/hero-product.webp'
  },
  portfolio: {
    title: 'Our Product Portfolio',
    subtitle: 'Source Development | Export | Pharma Raw Materials | Packaging & Machinery',
    cards: [
       {
          icon: "Pill",
          category: "APIs (Active Pharmaceutical Ingredients)",
          items: ["Aceclofenac (Na/K)", "Albendazole", "Amlodipine Besylate"]
      },
      {
          icon: "FlaskConical",
          category: "Excipients & Polymers",
          items: ["Microcrystalline Cellulose", "HPMC", "Cross-Carmellose Sodium"]
      },
       {
          icon: "Gem",
          category: "Minerals & Salts",
          items: ["Ferric Carboxymaltose", "Iron Polymaltose", "Ferrous Ascorbate"]
      },
       {
          icon: "ShieldCheck",
          category: "Antacids & GI Ingredients",
          items: ["Simethicone", "Magnesium Hydroxide", "Aluminium Hydroxide"]
      },
       {
          icon: "Droplets",
          category: "Coatings, Stearates & Citrates",
          items: ["Magnesium Stearate", "Stearic Acid", "Sodium Citrate"]
      },
      {
          icon: "Building",
          category: "Pharma Packaging & Machinery",
          items: ["Pharma process equipment", "Filling & blister packing units", "HDPE / PET bottles"]
      }
    ]
  },
  whyChooseUs: {
    title: 'Why Choose Swalaxon?',
    subtitle: 'We are committed to excellence, reliability, and customer satisfaction.',
    features: [
      {
        icon: "ShieldCheck",
        title: "WHO-GMP Compliant Sourcing",
        description: "Adherence to the highest industry standards for product purity and safety."
      },
      {
        icon: "Recycle",
        title: "Transparent & Ethical Supply Chain",
        description: "A robust network of suppliers to ensure a consistent and reliable supply chain."
      },
      {
        icon: "Truck",
        title: "PAN-India Delivery + Export Support",
        description: "Efficient logistics to get you the materials you need, when you need them."
      },
      {
        icon: "BookCopy",
        title: "Strong Technical & Documentation Support",
        description: "Dedicated support to help you find the perfect solutions for your needs."
      }
    ]
  }
};


export default function SiteSettingsPane() {
  const { toast } = useToast();
  const firestore = useFirestore();

  const homeContentRef = useMemoFirebase(
    () => (firestore ? doc(firestore, "/pages/home") : null),
    [firestore]
  );
  const { data: homePageContent, isLoading } = useDoc(homeContentRef);
  
  const methods = useForm({
      defaultValues: defaultValues,
  });
  
  const { control, register, handleSubmit, reset, watch, setValue } = methods;

  const { fields: portfolioCards, append: appendPortfolio, remove: removePortfolio } = useFieldArray({
      control, name: 'portfolio.cards'
  });
  const { fields: whyChooseUsFeatures, append: appendFeature, remove: removeFeature } = useFieldArray({
      control, name: 'whyChooseUs.features'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  
  const headerImageUrl = watch('hero.headerImageUrl');

  useEffect(() => {
    if (homePageContent) {
      reset(homePageContent);
    }
  }, [homePageContent, reset]);

  const handleImageSelect = (selectedImageUrl: string) => {
    setValue('hero.headerImageUrl', selectedImageUrl);
    setIsPickerOpen(false);
  };
  
  const handleUploadComplete = (newImageUrl: string) => {
    setValue('hero.headerImageUrl', newImageUrl);
    setIsUploaderOpen(false);
  };

  const onSubmit = (formData: typeof defaultValues) => {
    if (!firestore || !homeContentRef) return;
    setIsSaving(true);
    
    setDoc(homeContentRef, formData, { merge: true })
        .then(() => {
            toast({
                title: "Update Successful",
                description: "Homepage content has been saved. The page will now reload.",
            });
            setTimeout(() => window.location.reload(), 1500);
        })
        .catch((err: any) => {
            const permissionError = new FirestorePermissionError({
                path: homeContentRef.path,
                operation: 'write',
                requestResourceData: formData,
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
    <FormProvider {...methods}>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Homepage Content</h3>
          <p className="text-sm text-muted-foreground">Manage your website's homepage content.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" key={homePageContent?.id || 'new-home-content'}>
           <Accordion type="multiple" defaultValue={['item-1']} className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Hero Section</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Header Image</Label>
                    {headerImageUrl && (
                        <div className="mt-2 w-full max-w-sm">
                            <Image 
                                src={headerImageUrl} 
                                alt="Header image preview" 
                                width={320}
                                height={180}
                                className="rounded-md object-contain border"
                            />
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsPickerOpen(true)}>
                            {headerImageUrl ? 'Change Image' : 'Select Image'}
                        </Button>
                        <Button type="button" variant="secondary" onClick={() => setIsUploaderOpen(true)}>
                            <Upload className="mr-2 h-4 w-4" /> Upload New
                        </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero.titleLine1">Headline 1</Label>
                    <Input {...register('hero.titleLine1')} />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="hero.titleLine2">Headline 2 (in accent color)</Label>
                    <Input {...register('hero.titleLine2')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero.subtitle">Subtitle</Label>
                    <Textarea {...register('hero.subtitle')} />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="hero.cta1">CTA Button 1 Text</Label>
                    <Input {...register('hero.cta1')} />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="hero.cta2">CTA Button 2 Text</Label>
                    <Input {...register('hero.cta2')} />
                  </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>Product Portfolio</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                 <div className="space-y-2">
                    <Label htmlFor="portfolio.title">Section Title</Label>
                    <Input {...register('portfolio.title')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="portfolio.subtitle">Section Subtitle</Label>
                    <Textarea {...register('portfolio.subtitle')} />
                  </div>
                  <div className="space-y-4">
                    <Label>Portfolio Cards</Label>
                    {portfolioCards.map((field, index) => (
                      <div key={field.id} className="p-3 border rounded-md space-y-2 relative">
                        <div className="space-y-2">
                          <Label>Icon Name</Label>
                          <Input {...register(`portfolio.cards.${index}.icon`)} placeholder="e.g. Pill, FlaskConical"/>
                          <p className="text-xs text-muted-foreground">From Lucide icon set.</p>
                        </div>
                        <div className="space-y-2">
                          <Label>Category Title</Label>
                          <Input {...register(`portfolio.cards.${index}.category`)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Items (one per line)</Label>
                          <Textarea {...register(`portfolio.cards.${index}.items`, { setValueAs: v => typeof v === 'string' ? v.split('\n') : v, getValue: v => Array.isArray(v) ? v.join('\n') : '' })} rows={5} />
                        </div>
                         <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1" onClick={() => removePortfolio(index)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => appendPortfolio({icon: 'Package', category: 'New Category', items: []})}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Card
                    </Button>
                  </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>"Why Choose Us" Section</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="whyChooseUs.title">Section Title</Label>
                    <Input {...register('whyChooseUs.title')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whyChooseUs.subtitle">Section Subtitle</Label>
                    <Textarea {...register('whyChooseUs.subtitle')} />
                  </div>
                  <div className="space-y-4">
                    <Label>Feature Blocks</Label>
                    {whyChooseUsFeatures.map((field, index) => (
                      <div key={field.id} className="p-3 border rounded-md space-y-2 relative">
                         <div className="space-y-2">
                          <Label>Icon Name</Label>
                          <Input {...register(`whyChooseUs.features.${index}.icon`)} placeholder="e.g. ShieldCheck, Globe" />
                           <p className="text-xs text-muted-foreground">From Lucide icon set.</p>
                        </div>
                        <div className="space-y-2">
                          <Label>Feature Title</Label>
                          <Input {...register(`whyChooseUs.features.${index}.title`)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea {...register(`whyChooseUs.features.${index}.description`)} rows={3} />
                        </div>
                         <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1" onClick={() => removeFeature(index)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                     <Button type="button" variant="outline" size="sm" onClick={() => appendFeature({icon: 'CheckCircle', title: 'New Feature', description: ''})}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Feature
                    </Button>
                  </div>
              </AccordionContent>
            </AccordionItem>
           </Accordion>

          <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => reset(homePageContent || defaultValues)} disabled={isSaving}>
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
    </FormProvider>
  );
}

    