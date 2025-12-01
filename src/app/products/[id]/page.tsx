
'use client';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { Product } from '@/types';
import { useEffect, useState } from 'react';

function ProductDetailImage({ product }: { product: Product }) {
  if (!product.imageUrl) {
    return <div className="w-full h-full bg-muted" />;
  }
  
  const effect = product.imageEffect || 'center-fill';

  if (effect === 'blur-background') {
    return (
      <>
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover blur-lg scale-110"
        />
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-contain"
        />
      </>
    );
  }

  if (effect === 'solid-background') {
     return (
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-contain p-8"
        />
     );
  }

  // Default to center-fill (object-cover)
  return (
    <Image
      src={product.imageUrl}
      alt={product.name}
      fill
      className="object-cover"
    />
  );
}


export default function ProductDetailPage() {
  const params = useParams();
  // The param is named `id` from the directory structure `[id]`, but it can be an ID or a slug.
  const idOrSlug = params.id as string;
  const firestore = useFirestore();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!firestore || !idOrSlug) return;

    const fetchProduct = async () => {
      try {
        const productsCollection = collection(firestore, "products");
        // Check if idOrSlug could be a document ID. Simple check for length/format.
        const isLikelyId = idOrSlug.length >= 15 && !idOrSlug.includes(' ');

        let q;
        if (!isLikelyId) {
            // Assume it's a slug
            q = query(productsCollection, where("slug", "==", idOrSlug), limit(1));
        } else {
             // It might be an ID, try fetching directly first for performance.
            const docRef = doc(firestore, "products", idOrSlug);
            const docSnap = await getDocs(query(productsCollection, where("__name__", "==", idOrSlug), limit(1)));
            if (!docSnap.empty) {
                 const doc = docSnap.docs[0];
                 setProduct({ id: doc.id, ...doc.data() } as Product);
                 setIsLoading(false);
                 return;
            }
             // If not found by ID, fall back to querying by slug.
            q = query(productsCollection, where("slug", "==", idOrSlug), limit(1));
        }

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError("Product not found");
        } else {
          const doc = querySnapshot.docs[0];
          setProduct({ id: doc.id, ...doc.data() } as Product);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load product.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [firestore, idOrSlug]);


  if (isLoading) {
    return (
        <div className="container mx-auto py-12 md:py-20 max-w-4xl bg-background animate-pulse">
            <div className="mb-8 h-10 w-32 bg-muted rounded-md"></div>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted mb-8"></div>
            <div className="h-6 w-1/4 bg-muted rounded-md"></div>
            <div className="h-10 w-1/2 bg-muted rounded-md my-3"></div>
            <div className="space-y-2">
                <div className="h-4 bg-muted rounded-md"></div>
                <div className="h-4 bg-muted rounded-md w-5/6"></div>
            </div>
             <Separator className="my-8 bg-border/50" />
             <div className="space-y-6">
                <div>
                    <div className="h-6 w-1/3 bg-muted rounded-md mb-2"></div>
                    <div className="h-4 bg-muted rounded-md"></div>
                    <div className="h-4 bg-muted rounded-md w-5/6 mt-2"></div>
                </div>
                 <div>
                    <div className="h-6 w-1/3 bg-muted rounded-md mb-2"></div>
                    <div className="h-4 bg-muted rounded-md"></div>
                    <div className="h-4 bg-muted rounded-md w-5/6 mt-2"></div>
                </div>
            </div>
            <div className="mt-10 h-12 w-36 bg-muted rounded-md"></div>
        </div>
    );
  }

  if (error) {
    return <div className="text-center py-20">{error}</div>;
  }
  
  if (!product) {
      notFound();
  }

  return (
    <div className="container mx-auto py-12 md:py-20 max-w-4xl bg-background">
      <div className="mb-8">
        <Button asChild variant="ghost">
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
      </div>

      <div className="w-full">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-lg shadow-accent/10 mb-8 bg-muted">
              <ProductDetailImage product={product} />
        </div>

        <div>
          <Badge variant="outline" className="border-primary/50 text-primary">{product.category}</Badge>
          <h1 className="text-3xl md:text-4xl font-headline font-bold my-3 text-primary">{product.name}</h1>
          <p className="text-lg text-muted-foreground">
            {product.description}
          </p>

          <Separator className="my-8 bg-border/50" />

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-headline font-semibold mb-2">Specifications</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">{product.specifications}</p>
            </div>
            <div>
              <h2 className="text-xl font-headline font-semibold mb-2">Applications</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">{product.applications}</p>
            </div>
          </div>

          <div className="mt-10">
              <Button size="lg" className="w-full md:w-auto" asChild>
                <Link href="/contact">Request a Quote</Link>
              </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
