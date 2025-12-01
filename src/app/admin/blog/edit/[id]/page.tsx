
'use client';

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { z } from 'zod';
import { type BlogPost } from "@/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogForm } from "@/components/admin/blog-form";
import { useToast } from "@/hooks/use-toast";
import { revalidateBlogPaths } from "@/lib/blog-actions";
import { useState } from "react";
import { FirestorePermissionError } from "@/firebase/errors";
import { errorEmitter } from "@/firebase/error-emitter";
import { slugify } from "@/lib/utils";

const blogPostSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters."),
    author: z.string().min(2, "Author name is too short."),
    category: z.string().min(2, "Category is too short."),
    summary: z.string().min(10, "Summary must be at least 10 characters."),
    content: z.string().min(20, "Content is too short."),
    imageUrl: z.string().optional(),
});


function EditBlogPostPageSkeleton() {
    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Skeleton className="h-7 w-7 rounded-md" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
            </div>
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
    );
}

export default function EditBlogPostPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const { toast } = useToast();
    const firestore = useFirestore();
    const [errors, setErrors] = useState<Record<string, string | undefined>>({});
    const [isSaving, setIsSaving] = useState(false);
    
    const postRef = useMemoFirebase(
        () => (firestore && id ? doc(firestore, "blogs", id) : null),
        [firestore, id]
    );
    const { data: post, isLoading } = useDoc<BlogPost>(postRef);

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

        if (!postRef) return;

        setIsSaving(true);
        const dataToSave = {
            ...validatedFields.data,
            slug: slugify(validatedFields.data.title),
        };

        updateDoc(postRef, dataToSave)
            .then(async () => {
                await revalidateBlogPaths(dataToSave.slug);
                toast({
                    title: "Success!",
                    description: "Blog post has been updated.",
                });
                router.push("/admin/blog");
            })
            .catch(err => {
                console.error("Update failed:", err);
                const permissionError = new FirestorePermissionError({
                    path: postRef.path,
                    operation: 'update',
                    requestResourceData: dataToSave,
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

    if (isLoading) {
        return <EditBlogPostPageSkeleton />;
    }

    if (!post) {
        return (
            <div className="text-center py-10">
                <p>Blog post not found.</p>
                <Button variant="outline" asChild className="mt-4">
                    <Link href="/admin/blog">Go Back</Link>
                </Button>
            </div>
        )
    }

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
                    <h1 className="text-2xl font-bold font-headline">Edit Post</h1>
                    <p className="text-muted-foreground">Editing "{post.title}".</p>
                </div>
            </div>

            <BlogForm 
                onSave={handleSave} 
                post={post} 
                isSaving={isSaving}
                errors={errors}
            />
        </div>
    );
}
