
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { ImagePickerModal } from "./image-picker-modal";
import { ImageUploadModal } from "./image-upload-modal";
import { type Product, type ProductCategory } from "@/types";
import { Upload } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, orderBy, query } from "firebase/firestore";

type ProductFormProps = {
  product?: Product;
  onSave: (data: Record<string, any>) => void;
  isSaving: boolean;
  errors: Record<string, string | undefined>;
};

export function ProductForm({ product, onSave, isSaving, errors }: ProductFormProps) {
  const [formData, setFormData] = useState({
    id: product?.id || '',
    name: product?.name || '',
    category: product?.category || '',
    description: product?.description || '',
    specifications: product?.specifications || '',
    applications: product?.applications || '',
    imageUrl: product?.imageUrl || '',
    imageEffect: product?.imageEffect || 'center-fill',
  });

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  const firestore = useFirestore();
  const categoriesCollection = useMemoFirebase(
    () => (firestore ? query(collection(firestore, "productCategories"), orderBy("name")) : null),
    [firestore]
  );
  const { data: categories, isLoading: isLoadingCategories } = useCollection<ProductCategory>(categoriesCollection);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (selectedImageUrl: string) => {
    setFormData(prev => ({ ...prev, imageUrl: selectedImageUrl }));
    setIsPickerOpen(false);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  const handleUploadComplete = (newImageUrl: string) => {
    setFormData(prev => ({ ...prev, imageUrl: newImageUrl }));
    setIsUploaderOpen(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>Provide the necessary information for the product.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              {errors.name && <p className="text-sm font-medium text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-select">Category</Label>
              <Select onValueChange={handleSelectChange('category')} value={formData.category} required>
                  <SelectTrigger id="category-select" disabled={isLoadingCategories}>
                      <SelectValue placeholder={isLoadingCategories ? "Loading categories..." : "Select a category"} />
                  </SelectTrigger>
                  <SelectContent>
                      {categories?.map(cat => (
                          <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
              {errors.category && <p className="text-sm font-medium text-destructive">{errors.category}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                  <Label>Product Image</Label>
                  {formData.imageUrl && (
                      <div className="mt-2 w-full max-w-sm">
                          <Image 
                              src={formData.imageUrl} 
                              alt="Image preview" 
                              width={200}
                              height={200}
                              className="rounded-md object-contain border"
                          />
                      </div>
                  )}
                  <div className="flex items-center gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsPickerOpen(true)}>
                          {formData.imageUrl ? 'Change Image' : 'Select Image'}
                      </Button>
                       <Button type="button" variant="secondary" onClick={() => setIsUploaderOpen(true)}>
                             <Upload className="mr-2 h-4 w-4" /> Upload New
                      </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">Select an image or upload a new one. This is optional.</p>
                   {errors.imageUrl && <p className="text-sm font-medium text-destructive">{errors.imageUrl}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="image-effect-select">Image Effect</Label>
                 <Select onValueChange={handleSelectChange('imageEffect')} value={formData.imageEffect}>
                    <SelectTrigger id="image-effect-select">
                        <SelectValue placeholder="Select an effect" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="center-fill">Center Fill</SelectItem>
                        <SelectItem value="blur-background">Blur Background</SelectItem>
                        <SelectItem value="solid-background">Solid Background</SelectItem>
                    </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">How the image is displayed on the product card.</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required/>
              {errors.description && <p className="text-sm font-medium text-destructive">{errors.description}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specifications">Specifications</Label>
              <Textarea id="specifications" name="specifications" value={formData.specifications} onChange={handleInputChange} required />
              {errors.specifications && <p className="text-sm font-medium text-destructive">{errors.specifications}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="applications">Applications</Label>
              <Textarea id="applications" name="applications" value={formData.applications} onChange={handleInputChange} required />
              {errors.applications && <p className="text-sm font-medium text-destructive">{errors.applications}</p>}
            </div>
          </CardContent>
          <CardFooter>
             <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : (product ? "Save Changes" : "Add Product")}
            </Button>
          </CardFooter>
        </Card>
      </form>

      <ImagePickerModal 
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onImageSelect={handleImageSelect}
      />
      
      <ImageUploadModal
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        onUploadComplete={handleUploadComplete}
      />
    </>
  );
}
