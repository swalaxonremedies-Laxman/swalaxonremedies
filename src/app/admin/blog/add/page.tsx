
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BlogForm } from '@/components/admin/blog-form';
import { Button } from '@/components/ui/button';
import { useFirestore } from '@/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { z } from 'zod';
import { revalidateBlogPaths } from '@/lib/blog-actions';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';
import { slugify } from '@/lib/utils';

const blogPostSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters."),
    author: z.string().min(2, "Author name is too short."),
    category: z.string().min(2, "Category is too short."),
    summary: z.string().min(10, "Summary must be at least 10 characters."),
    content: z.string().min(20, "Content is too short."),
    imageUrl: z.string().optional(),
});


export default function AddBlogPostPage() {
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (formData: Record<string, any>) => {
    setErrors({});
    
    const validatedFields = blogPostSchema.safeParse(formData);

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
    const blogsCollection = collection(firestore, 'blogs');

    const dataToSave = {
        ...validatedFields.data,
        slug: slugify(validatedFields.data.title),
        date: new Date().toISOString(),
    };

    addDoc(blogsCollection, dataToSave)
        .then(async () => {
            await revalidateBlogPaths(dataToSave.slug);
            toast({
                title: "Success!",
                description: "Blog post has been added.",
            });
            router.push("/admin/blog");
        })
        .catch(err => {
            console.error("Add failed:", err);
            const permissionError = new FirestorePermissionError({
                path: blogsCollection.path,
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
    <div className="space-y-8 max-w-4xl mx-auto">
       <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
            <Link href="/admin/blog">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
        <div>
            <h1 className="text-2xl font-bold font-headline">Add New Post</h1>
            <p className="text-muted-foreground">Fill out the form to create a new blog post.</p>
        </div>
      </div>

      <BlogForm 
        onSave={handleSave}
        isSaving={isSaving}
        errors={errors}
      />
    </div>
  );
}
