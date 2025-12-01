
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { revalidateProductPaths } from '@/lib/product-actions';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { type Product } from '@/types';
import { ProductForm } from './product-form';
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

type ProductFormProps = {
  product: Product;
};

export function EditProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  
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
    const productRef = doc(firestore, 'products', product.id);

    const dataToUpdate = {
        ...validatedFields.data,
        slug: slugify(validatedFields.data.name),
    };

    updateDoc(productRef, dataToUpdate)
        .then(async () => {
            await revalidateProductPaths(product.id, dataToUpdate.slug);
            toast({
                title: "Success!",
                description: "Product has been updated.",
            });
            router.push("/admin/products");
        })
        .catch(err => {
            console.error("Update failed:", err);
             const permissionError = new FirestorePermissionError({
                path: productRef.path,
                operation: 'update',
                requestResourceData: dataToUpdate,
            });
            errorEmitter.emit('permission-error', permissionError);

            toast({
                variant: "destructive",
                title: "Update Failed",
                description: "You do not have permission or an error occurred.",
            });
        })
        .finally(() => {
            setIsSaving(false);
        });
  };

  return (
    <ProductForm
        product={product}
        onSave={handleSave}
        isSaving={isSaving}
        errors={errors}
    />
  );
}
