

'use client'

import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc, deleteDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { revalidateProductPaths } from "@/lib/product-actions";
import { type Product } from "@/types";
import { useActionState } from "react";

function DeleteAction({ id, onDeleted }: { id: string, onDeleted: () => void }) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const handleDelete = async () => {
    const productRef = doc(firestore, 'products', id);
    try {
        await deleteDoc(productRef);
        await revalidateProductPaths(id);
        toast({
            title: "Success",
            description: "Product has been deleted.",
        });
        onDeleted();
    } catch (err) {
        console.error("Delete failed:", err);
        const permissionError = new FirestorePermissionError({
            path: productRef.path,
            operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);

        toast({
            variant: "destructive",
            title: "Delete Failed",
            description: "You do not have permission or an error occurred.",
        });
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
            This action cannot be undone. This will permanently delete the product.
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

export default function ProductsAdminPage() {
  const firestore = useFirestore();
  const productsCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, "products") : null),
    [firestore]
  );
  const { data: products, isLoading, setData } = useCollection<Product>(productsCollection);

  const handleProductDeleted = (deletedId: string) => {
    if (products) {
      setData(products.filter(p => p.id !== deletedId));
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div />
        <Button asChild>
          <Link href="/admin/products/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <CardDescription>A list of all products in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && <TableRow><TableCell colSpan={4}>Loading products...</TableCell></TableRow>}
              {!isLoading && products?.length === 0 && <TableRow><TableCell colSpan={4}>No products found.</TableCell></TableRow>}
              {products?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell line-clamp-2">
                    {product.description}
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
                          <Link href={`/admin/products/edit/${product.id}`}>Edit</Link>
                        </DropdownMenuItem>
                         <DeleteAction id={product.id} onDeleted={() => handleProductDeleted(product.id)} />
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
