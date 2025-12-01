
'use client'

import { useState } from "react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { type BlogPost } from "@/types";
import { format } from 'date-fns';
import { deleteBlogPost } from "@/lib/blog-actions";

function DeleteAction({ id, onDeleted }: { id: string, onDeleted: () => void }) {
  const { toast } = useToast();

  const handleDelete = async () => {
    const result = await deleteBlogPost(id);
    if (result.message.includes("Failed")) {
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: result.message,
      });
    } else {
       toast({
        title: "Success",
        description: result.message,
      });
      onDeleted();
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="w-full text-left relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-red-600">
          Delete
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the blog post.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default function BlogAdminPage() {
  const firestore = useFirestore();
  const blogsCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, "blogs") : null),
    [firestore]
  );
  const { data: posts, isLoading, setData } = useCollection<BlogPost>(blogsCollection);

  const handlePostDeleted = (deletedId: string) => {
    if (posts) {
      setData(posts.filter(p => p.id !== deletedId));
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Blog</h1>
          <p className="text-muted-foreground">Manage your blog posts.</p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Post
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Post List</CardTitle>
          <CardDescription>A list of all blog posts.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && <TableRow><TableCell colSpan={4}>Loading posts...</TableCell></TableRow>}
              {!isLoading && posts?.length === 0 && <TableRow><TableCell colSpan={4}>No posts found.</TableCell></TableRow>}
              {posts?.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(new Date(post.date), 'MMMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/blog/edit/${post.id}`}>Edit</Link>
                        </DropdownMenuItem>
                         <DeleteAction id={post.id} onDeleted={() => handlePostDeleted(post.id)} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
