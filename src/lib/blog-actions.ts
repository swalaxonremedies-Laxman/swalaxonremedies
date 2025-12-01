
'use server';

import { revalidatePath } from 'next/cache';
import { initializeServerApp } from '@/firebase/server-config';

export async function revalidateBlogPaths(slug?: string) {
    revalidatePath('/admin/blog');
    revalidatePath('/blog');
    if (slug) {
        revalidatePath(`/blog/${slug}`);
    }
}

export async function deleteBlogPost(id: string) {
    if (!id) {
        return { message: "Blog ID is missing." };
    }
    try {
        const { firestore } = initializeServerApp();
        await firestore.collection('blogs').doc(id).delete();
        revalidatePath("/admin/blog");
        revalidatePath("/blog");
        return { message: "Successfully deleted blog post." };
    } catch (error) {
        console.error("Error deleting blog post:", error);
        if ((error as any).code === 'permission-denied' || (error as any).code === 7) {
             return { message: "Failed to delete blog post. You may not have the required permissions." };
        }
        return { message: "An unexpected error occurred while deleting the blog post." };
    }
}
