
'use client';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCollection, useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { Product } from "@/types";
import { Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';


interface ProductsPageContent {
  title: string;
  description: string;
}

const ITEMS_PER_PAGE = 12;

function ProductImage({ product }: { product: Product }) {
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
          className="object-cover blur-md scale-110"
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
          className="object-contain p-4" // Padding to let solid background show
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


export default function ProductsPage() {
  const firestore = useFirestore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const productsCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, "products") : null),
    [firestore]
  );
  const { data: products, isLoading: isLoadingProducts } = useCollection<Product>(productsCollection);

  const contentRef = useMemoFirebase(
    () => (firestore ? doc(firestore, "/pages/products") : null),
    [firestore]
  );
  const { data: productsPageContent, isLoading: isLoadingContent } = useDoc<ProductsPageContent>(contentRef);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const isLoading = isLoadingProducts || isLoadingContent;

  return (
    <>
      <section className="w-full py-12 bg-background">
        <div className="container mx-auto text-center">
           {isLoading && <div className="animate-pulse"><div className="h-10 bg-muted rounded-md w-1/2 mx-auto"></div><div className="h-6 mt-4 bg-muted rounded-md w-3/4 mx-auto"></div></div>}
          {!isLoading && productsPageContent && (
            <>
              <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">{productsPageContent.title}</h1>
              <p className="text-lg md:text-xl mt-4 text-muted-foreground max-w-3xl mx-auto">
                {productsPageContent.description}
              </p>
            </>
          )}
           {!isLoading && !productsPageContent && <p className="text-muted-foreground">Page content could not be loaded.</p>}
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto">
          <div className="mb-12 max-w-md mx-auto">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search products by name or category..."
                    className="w-full pl-10"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1); // Reset to first page on new search
                    }}
                />
            </div>
          </div>
          {isLoadingProducts && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="relative w-full aspect-square bg-muted"></div>
                    <CardContent className="p-6 space-y-3">
                      <div className="h-4 bg-muted w-1/4 rounded"></div>
                      <div className="h-6 bg-muted w-3/4 rounded"></div>
                      <div className="h-12 bg-muted w-full rounded"></div>
                    </CardContent>
                  </Card>
                ))}
             </div>
          )}
          {!isLoadingProducts && (
            <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedProducts.map((product) => {
                const href = product.slug ? `/products/${product.slug}` : `/products/${product.id}`;
                return (
                  <Card key={product.id} className={cn("h-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10 hover:-translate-y-1 bg-background/80 backdrop-blur-sm border-border/50 flex flex-col", "hover:border-accent")}>
                    <CardHeader className="p-0">
                      <Link href={href} className="group">
                        <div className="relative w-full aspect-square bg-muted">
                          <ProductImage product={product} />
                        </div>
                      </Link>
                    </CardHeader>
                    <CardContent className="p-6 flex-grow flex flex-col">
                      <div className="flex-grow">
                        <Badge variant="outline" className="mb-2 border-primary/50 text-primary">{product.category}</Badge>
                        <CardTitle className="text-xl font-headline mb-2">
                           <Link href={href} className="hover:text-primary transition-colors">{product.name}</Link>
                        </CardTitle>
                        <p className="text-muted-foreground text-sm line-clamp-3">
                          {product.description}
                        </p>
                      </div>
                       <div className="mt-4 pt-4 border-t border-border/50">
                          <Button asChild variant="link" size="sm" className="text-primary hover:text-primary/80 p-0">
                              <Link href={href}>
                              Read More <ArrowRight className="ml-1 h-4 w-4" />
                              </Link>
                          </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredProducts.length === 0 && !isLoadingProducts && (
                <div className="text-center py-16">
                    <p className="text-muted-foreground">No products found matching your search.</p>
                </div>
            )}

            {totalPages > 1 && (
                <div className="mt-16">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
