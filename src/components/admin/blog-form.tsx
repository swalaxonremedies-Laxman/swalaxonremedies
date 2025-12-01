
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { ImagePickerModal } from './image-picker-modal';
import { ImageUploadModal } from './image-upload-modal';
import { type BlogPost } from '@/types';
import { Upload } from 'lucide-react';

type BlogFormProps = {
  post?: BlogPost;
  onSave: (data: Record<string, any>) => void;
  isSaving: boolean;
  errors: Record<string, string | undefined>;
};

export function BlogForm({ post, onSave, isSaving, errors }: BlogFormProps) {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    author: post?.author || 'Admin',
    category: post?.category || 'Industry News',
    summary: post?.summary || '',
    content: post?.content || '',
    imageUrl: post?.imageUrl || '',
  });

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        author: post.author,
        category: post.category,
        summary: post.summary,
        content: post.content,
        imageUrl: post.imageUrl || '',
      });
    }
  }, [post]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (selectedImageUrl: string) => {
    setFormData(prev => ({ ...prev, imageUrl: selectedImageUrl }));
    setIsPickerOpen(false);
  };
  
  const handleUploadComplete = (newImageUrl: string) => {
    setFormData(prev => ({ ...prev, imageUrl: newImageUrl }));
    setIsUploaderOpen(false);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
            <CardDescription>Provide the content and details for your blog post.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Post Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleInputChange} />
              {errors.title && <p className="text-sm font-medium text-destructive">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input id="author" name="author" value={formData.author} onChange={handleInputChange} />
                    {errors.author && <p className="text-sm font-medium text-destructive">{errors.author}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" name="category" value={formData.category} onChange={handleInputChange} />
                    {errors.category && <p className="text-sm font-medium text-destructive">{errors.category}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <Label>Featured Image</Label>
                {formData.imageUrl && (
                    <div className="mt-2 w-full max-w-sm">
                        <Image 
                            src={formData.imageUrl} 
                            alt="Image preview" 
                            width={200}
                            height={120}
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
                {errors.imageUrl && <p className="text-sm font-medium text-destructive">{errors.imageUrl}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Summary / Excerpt</Label>
              <Textarea id="summary" name="summary" value={formData.summary} onChange={handleInputChange} rows={3} />
              {errors.summary && <p className="text-sm font-medium text-destructive">{errors.summary}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Main Content</Label>
               <Textarea 
                 id="content"
                 name="content"
                 value={formData.content}
                 onChange={handleInputChange}
                 rows={10}
               />
              {errors.content && <p className="text-sm font-medium text-destructive">{errors.content}</p>}
            </div>
            
          </CardContent>
          <CardFooter>
             <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : (post ? "Save Changes" : "Publish Post")}
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
