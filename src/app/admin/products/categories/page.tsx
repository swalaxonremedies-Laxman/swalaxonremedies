
'use client';

import { useState, useEffect } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { type ProductCategory } from '@/types';
import { PlusCircle, Trash, Edit, Check, X } from 'lucide-react';
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
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


function CategoryRow({ category, onUpdate, onDelete }: { category: ProductCategory, onUpdate: (id: string, name: string) => Promise<void>, onDelete: (id: string) => Promise<void> }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(category.name);

  const handleSave = async () => {
    await onUpdate(category.id, name);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(category.name);
    setIsEditing(false);
  };

  return (
    <TableRow>
      <TableCell>
        {isEditing ? (
          <Input value={name} onChange={(e) => setName(e.target.value)} className="h-8" />
        ) : (
          <span>{category.name}</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        {isEditing ? (
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="icon" onClick={handleSave} className="text-green-600 hover:text-green-700">
              <Check className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80">
                  <Trash className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the category. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(category.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
}


export default function CategoriesPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [newCategoryName, setNewCategoryName] = useState('');

  const categoriesCollectionRef = useMemoFirebase(
    () => (firestore ? query(collection(firestore, "productCategories"), orderBy("name")) : null),
    [firestore]
  );
  const { data: categories, isLoading, setData } = useCollection<ProductCategory>(categoriesCollectionRef);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({ variant: 'destructive', title: 'Category name cannot be empty.' });
      return;
    }

    if (!firestore) return;
    const dataToSave = { name: newCategoryName };
    const collectionRef = collection(firestore, 'productCategories');

    addDoc(collectionRef, dataToSave)
      .then(docRef => {
        toast({ title: "Success", description: "Category added." });
        setNewCategoryName('');
        // Optimistic update
        if (categories) {
            const newCategories = [...categories, { id: docRef.id, ...dataToSave }].sort((a,b) => a.name.localeCompare(b.name));
            setData(newCategories);
        }
      })
      .catch(err => {
        const permissionError = new FirestorePermissionError({
            path: collectionRef.path,
            operation: 'create',
            requestResourceData: dataToSave,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({ variant: "destructive", title: "Add Failed", description: "Could not add category." });
      });
  };

  const handleUpdateCategory = async (id: string, name: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'productCategories', id);
    const dataToSave = { name };

    updateDoc(docRef, dataToSave)
      .then(() => {
        toast({ title: "Success", description: "Category updated." });
        // Optimistic update
        if (categories) {
            const newCategories = categories.map(c => c.id === id ? { ...c, name } : c).sort((a,b) => a.name.localeCompare(b.name));
            setData(newCategories);
        }
      })
      .catch(err => {
         const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'update',
            requestResourceData: dataToSave,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({ variant: "destructive", title: "Update Failed", description: "Could not update category." });
      });
  };

  const handleDeleteCategory = async (id: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'productCategories', id);

    deleteDoc(docRef)
      .then(() => {
        toast({ title: "Success", description: "Category deleted." });
        // Optimistic update
        if (categories) {
            setData(categories.filter(c => c.id !== id));
        }
      })
      .catch(err => {
        const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({ variant: "destructive", title: "Delete Failed", description: "Could not delete category." });
      });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Manage Categories</CardTitle>
          <CardDescription>Add, edit, or delete your product categories.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="New category name..."
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <Button onClick={handleAddCategory}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && <TableRow><TableCell colSpan={2}>Loading categories...</TableCell></TableRow>}
              {!isLoading && categories?.length === 0 && <TableRow><TableCell colSpan={2}>No categories found.</TableCell></TableRow>}
              {categories?.map((cat) => (
                <CategoryRow key={cat.id} category={cat} onUpdate={handleUpdateCategory} onDelete={handleDeleteCategory} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
