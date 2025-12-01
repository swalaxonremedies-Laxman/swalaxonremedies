
'use server';

import { z } from "zod";
import { addDoc, collection } from 'firebase/firestore';
import { initializeFirebase } from "@/firebase";
import { revalidatePath } from "next/cache";
import { promises as fs } from 'fs';
import path from 'path';

// Schema for product data, used for both create and update.
const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Name must be at least 3 characters."),
  category: z.string().min(1, "Please select a category."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  specifications: z.string().min(10, "Specifications must be at least 10 characters."),
  applications: z.string().min(10, "Applications must be at least 10 characters."),
  imageUrl: z.string().optional(),
});

export type ActionState = {
  errors?: Record<string, string[] | undefined>;
  message: string;
  success: boolean;
};

export async function revalidateProductPaths(id?: string, slug?: string) {
    revalidatePath('/admin/products');
    revalidatePath('/products');
    if (id) {
        revalidatePath(`/products/${id}`);
    }
    if (slug) {
        revalidatePath(`/products/${slug}`);
    }
}

export async function getProductImages() {
  const imageDirectory = path.join(process.cwd(), 'public', 'products');
  try {
    const files = await fs.readdir(imageDirectory);
    // Filter for common image extensions to avoid including system files like .DS_Store
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|webp|svg|gif)$/i.test(file));
    return imageFiles.map(file => `/products/${file}`);
  } catch (error) {
    console.error("Could not read product images directory:", error);
    return [];
  }
}

// This server action is no longer used by the 'add' page, but kept for potential future use or other integrations.
export async function saveProduct(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const validatedFields = productSchema.safeParse(Object.fromEntries(formData));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Please check the fields.",
      success: false,
    };
  }

  try {
    const { firestore } = initializeFirebase();
    const { id, ...productData } = validatedFields.data;

    await addDoc(collection(firestore, 'products'), productData);
    
    revalidateProductPaths();

    return { message: "Product added successfully.", success: true, errors: {} };

  } catch (error) {
    console.error("Save product error:", error);
    return {
      errors: {},
      message: "Failed to add product. An unexpected error occurred.",
      success: false,
    };
  }
}
