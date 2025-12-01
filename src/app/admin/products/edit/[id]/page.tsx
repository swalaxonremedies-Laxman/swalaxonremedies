
'use client';

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { doc } from "firebase/firestore";

import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { type Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EditProductForm } from "@/components/admin/edit-product-form";

function EditProductPageSkeleton() {
    return (
        <div className="space-y-8 max-w-2xl mx-auto">
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
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
    );
}

export default function EditProductPage() {
    const params = useParams();
    const id = params.id as string;
    const firestore = useFirestore();
    
    const productRef = useMemoFirebase(
        () => (firestore && id ? doc(firestore, "products", id) : null),
        [firestore, id]
    );
    const { data: product, isLoading } = useDoc<Product>(productRef);

    if (isLoading) {
        return <EditProductPageSkeleton />;
    }

    if (!product) {
        return (
            <div className="text-center py-10">
                <p>Product not found.</p>
                <Button variant="outline" asChild className="mt-4">
                    <Link href="/admin/products">Go Back</Link>
                </Button>
            </div>
        )
    }

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
                    <h1 className="text-2xl font-bold font-headline">Edit Product</h1>
                    <p className="text-muted-foreground">Update the details for "{product.name}".</p>
                </div>
            </div>
             <EditProductForm product={product} />
        </div>
    );
}
