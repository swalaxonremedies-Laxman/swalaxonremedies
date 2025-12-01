
'use client';

import { useState } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProductForm } from "@/components/admin/product-form";
import { Button } from "@/components/ui/button";
import { useFirestore } from '@/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { z } from 'zod';
import { revalidateProductPaths } from '@/lib/product-actions';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';
import { slugify } from '@/lib/utils';

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  category: z.string().min(1, "Please select a category."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  specifications: z.string().min(10, "Specifications must be at least 10 characters."),
  applications: z.string().min(10, "Applications must be at least 10 characters."),
  imageUrl: z.string().optional(),
  imageEffect: z.string().optional(),
});

export default function AddProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (formData: Record<string, any>) => {
    setErrors({});
    
    const validatedFields = productSchema.safeParse(formData);

    if (!validatedFields.success) {
      const fieldErrors: Record<string, string> = {};
      for (const [key, value] of Object.entries(validatedFields.error.flatten().fieldErrors)) {
        fieldErrors[key] = value[0];
      }
      setErrors(fieldErrors);
      toast({
        variant: "destructive",
        title: "Validation Failed",
        description: "Please check the highlighted fields.",
      });
      return;
    }

    setIsSaving(true);
    const productsCollection = collection(firestore, 'products');

    const dataToSave = {
      ...validatedFields.data,
      slug: slugify(validatedFields.data.name),
    };

    addDoc(productsCollection, dataToSave)
        .then(async (docRef) => {
            await revalidateProductPaths(docRef.id, dataToSave.slug);
            toast({
                title: "Success!",
                description: "Product has been added.",
            });
            router.push("/admin/products");
        })
        .catch(err => {
            console.error("Add failed:", err);
            const permissionError = new FirestorePermissionError({
                path: productsCollection.path,
                operation: 'create',
                requestResourceData: dataToSave,
            });
            errorEmitter.emit('permission-error', permissionError);

            toast({
                variant: "destructive",
                title: "Add Failed",
                description: "You do not have permission or an error occurred.",
            });
        })
        .finally(() => {
            setIsSaving(false);
        });
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
       <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
        <div>
            <h1 className="text-2xl font-bold font-headline">Add New Product</h1>
            <p className="text-muted-foreground">Fill out the form to add a new product to the catalog.</p>
        </div>
      </div>
      <ProductForm 
        onSave={handleSave}
        isSaving={isSaving}
        errors={errors}
      />
    </div>
  );
}
