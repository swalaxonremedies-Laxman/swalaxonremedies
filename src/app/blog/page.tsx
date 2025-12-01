
'use client';
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, orderBy, query } from "firebase/firestore";
import { type BlogPost } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function BlogPage() {
    const firestore = useFirestore();
    const postsCollection = useMemoFirebase(
        () => (firestore ? query(collection(firestore, "blogs"), orderBy("date", "desc")) : null),
        [firestore]
    );
    const { data: blogPosts, isLoading } = useCollection<BlogPost>(postsCollection);


  return (
    <>
      <section className="w-full py-12 bg-background">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Our Blog</h1>
          <p className="text-lg md:text-xl mt-2 text-muted-foreground max-w-3xl mx-auto">
            Insights and updates from the pharmaceutical and chemical industry.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto">
           {isLoading && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="relative w-full h-48 bg-muted"></div>
                    <CardContent className="p-6 space-y-3">
                      <div className="h-4 bg-muted w-1/4 rounded"></div>
                      <div className="h-6 bg-muted w-3/4 rounded"></div>
                      <div className="h-12 bg-muted w-full rounded"></div>
                    </CardContent>
                  </Card>
                ))}
             </div>
          )}
          {!isLoading && blogPosts?.length === 0 && (
              <div className="text-center text-muted-foreground py-20">
                  <p>No blog posts have been published yet.</p>
              </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts?.map((post) => {
              return (
                  <Card key={post.slug} className={cn("h-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10 hover:-translate-y-1 bg-background/80 backdrop-blur-sm border-border/50 flex flex-col", "hover:border-accent")}>
                    <CardHeader className="p-0">
                      <Link href={`/blog/${post.slug}`} className="group">
                        <div className="relative w-full h-48 bg-muted">
                          {post.imageUrl && (
                            <>
                              <Image
                                src={post.imageUrl}
                                alt={post.title}
                                fill
                                className="object-cover blur-md scale-110"
                              />
                              <Image
                                src={post.imageUrl}
                                alt={post.title}
                                fill
                                className="object-contain"
                              />
                            </>
                          )}
                        </div>
                      </Link>
                    </CardHeader>
                    <CardContent className="p-6 flex flex-col flex-grow">
                        <div className="flex-grow">
                            <Badge variant="outline" className="mb-2 border-primary/50 text-primary">{post.category}</Badge>
                            <CardTitle className="text-xl font-headline mb-2">
                                <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">{post.title}</Link>
                            </CardTitle>
                            <p className="text-muted-foreground text-sm line-clamp-3">
                                {post.summary}
                            </p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-border/50 flex justify-between items-center">
                            <div className="text-xs text-muted-foreground">
                                <span>{format(new Date(post.date), "MMMM d, yyyy")}</span>
                            </div>
                            <Button asChild variant="link" size="sm" className="text-primary hover:text-primary/80">
                                <Link href={`/blog/${post.slug}`}>
                                Read More <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                  </Card>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
