"use client";

import { Button } from "@/components/ui/button";
import { useEditPath } from "@/hooks/use-edit-path";
import { Pen } from "lucide-react";

export function EditPageButton({ onClick }: { onClick: () => void }) {
  const editPath = useEditPath();
  
  if (!editPath) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        size="lg" 
        className="rounded-full shadow-lg"
        onClick={onClick}
      >
        <Pen className="mr-2 h-4 w-4" />
        Edit Page
      </Button>
    </div>
  );
}
