
'use server';

import { revalidatePath } from 'next/cache';
import { writeFile } from 'fs/promises';
import { join } from 'path';

// This file is no longer used for the modal upload,
// but the action is kept in case it's used by the dedicated media page.
// The new upload logic is in /api/upload/route.ts

type FormState = {
  imageUrl: string | null;
  error: string | null;
  message?: string | null;
};

export async function uploadImageAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const image = formData.get('image') as File | null;

  if (!image || image.size === 0) {
    return {
      imageUrl: null,
      error: 'Please select a file to upload.',
    };
  }

  if (!image.type.startsWith('image/')) {
    return {
      imageUrl: null,
      error: 'Invalid file type. Please upload an image.',
    };
  }

  try {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename to avoid overwrites
    const filename = `${Date.now()}-${image.name.toLowerCase().replace(/\s+/g, '-')}`;
    const directory = join(process.cwd(), 'public', 'uploads');
    const path = join(directory, filename);

    // In a production environment, you might need to ensure the directory exists.
    // For this prototype, we assume `public/uploads` exists.
    await writeFile(path, buffer);
    console.log(`File uploaded to ${path}`);

    const relativeUrl = `/uploads/${filename}`;
    
    // Revalidate the product image list so it shows up in the picker
    revalidatePath('/admin/products/add');
    revalidatePath('/admin/products/edit/.*');

    return {
      imageUrl: relativeUrl,
      error: null,
      message: 'Image uploaded successfully!',
    };
  } catch (error) {
    console.error('Image Upload Error:', error);
    return {
      imageUrl: null,
      error: 'An unexpected error occurred while uploading the image.',
    };
  }
}
