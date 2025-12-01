
'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import { getProductImages } from "@/lib/product-actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (imageUrl: string) => void;
}

export function ImagePickerModal({ isOpen, onClose, onImageSelect }: ImagePickerModalProps) {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      getProductImages().then(imageUrls => {
        setImages(imageUrls);
        setIsLoading(false);
      });
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select a Product Image</DialogTitle>
          <DialogDescription>
            Choose an image from the available product photos.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow">
            <div className="p-1">
                {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <Skeleton key={index} className="aspect-square rounded-md" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {images.map(imgSrc => (
                        <button
                        key={imgSrc}
                        onClick={() => onImageSelect(imgSrc)}
                        className="group aspect-square block w-full overflow-hidden rounded-md border-2 border-transparent focus:border-primary focus:outline-none hover:border-primary transition-all bg-muted"
                        >
                        <div className="relative w-full h-full">
                            <Image
                            src={imgSrc}
                            alt="Product Image"
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                            className="object-contain transition-transform group-hover:scale-105"
                            />
                        </div>
                        </button>
                    ))}
                    </div>
                )}
                 {!isLoading && images.length === 0 && (
                    <p className="text-muted-foreground text-center py-10">No images found in the 'public/products' directory.</p>
                )}
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
