
'use client';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs, limit, doc } from 'firebase/firestore';
import { type BlogPost } from '@/types';
import { useEffect, useState } from 'react';


export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const firestore = useFirestore();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!firestore || !slug) return;

    const fetchPost = async () => {
      try {
        const blogsCollection = collection(firestore, "blogs");
        const q = query(blogsCollection, where("slug", "==", slug), limit(1));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError("Post not found");
        } else {
          const doc = querySnapshot.docs[0];
          setPost({ id: doc.id, ...doc.data() } as BlogPost);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load post.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [firestore, slug]);


  if (isLoading) {
      return (
          <div className="container mx-auto py-12 md:py-20 max-w-4xl bg-background animate-pulse">
            <div className="mb-8 h-10 w-32 bg-muted rounded-md"></div>
            <header className="mb-8 space-y-3">
                <div className="h-6 w-24 bg-muted rounded-md"></div>
                <div className="h-10 w-3/4 bg-muted rounded-md"></div>
                <div className="h-5 w-1/2 bg-muted rounded-md"></div>
            </header>
            <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8 shadow-lg bg-muted"></div>
            <div className="space-y-4">
                <div className="h-4 bg-muted rounded-md"></div>
                <div className="h-4 bg-muted rounded-md w-5/6"></div>
                <div className="h-4 bg-muted rounded-md w-3/4"></div>
            </div>
          </div>
      );
  }

  if (error) {
    return <div className="text-center py-20">{error}</div>;
  }
  
  if (!post) {
      notFound();
  }


  return (
    <div className="container mx-auto py-12 md:py-20 bg-background">
       <div className="mb-8">
        <Button asChild variant="ghost">
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>
      </div>

      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <Badge variant="outline" className="border-primary/50 text-primary">{post.category}</Badge>
          <h1 className="text-3xl md:text-5xl font-headline font-bold my-3 leading-tight text-primary">{post.title}</h1>
          <div className="text-muted-foreground text-sm">
            Posted by {post.author} on {format(new Date(post.date), "MMMM d, yyyy")}
          </div>
        </header>

        {post.imageUrl && (
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8 shadow-lg shadow-accent/10 bg-muted">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover blur-lg scale-110"
            />
             <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-contain"
            />
          </div>
        )}

        <div
          className="prose lg:prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}
