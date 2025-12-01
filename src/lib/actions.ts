
"use server";

import { revalidatePath } from "next/cache";
import { getFirestore, doc, deleteDoc, Firestore } from 'firebase/admin/firestore';
import { initializeServerApp } from "@/firebase/server-config";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";


// This is now a CLIENT-SIDE function. We are no longer using the server-action for this.
export async function deleteProduct(db: Firestore, id: string): Promise<{ success: boolean, message: string }> {
    if (!id) {
        return { success: false, message: "Product ID is missing." };
    }
    try {
        const productRef = doc(db, 'products', id);
        await deleteDoc(productRef);
        
        // Revalidation must happen via a separate server action if needed,
        // but for client-side optimistic UI updates this is often sufficient.
        // For this app, we will rely on the optimistic UI update.

        return { success: true, message: "Successfully deleted product." };
    } catch (error) {
        console.error("Error deleting product:", error);
        
        const productRef = doc(db, 'products', id);
        const permissionError = new FirestorePermissionError({
            path: productRef.path,
            operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);

        if ((error as any).code === 'permission-denied') {
             return { success: false, message: "Failed to delete product. You do not have the required permissions." };
        }
        return { success: false, message: "An unexpected error occurred while deleting the product." };
    }
}
