'use client';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useEditPath } from '@/hooks/use-edit-path';
import SiteSettingsPane from './panes/site-settings-pane';
import ProductsContentPane from './panes/products-content-pane';
import AboutContentPane from './panes/about-content-pane';
import QualityContentPane from './panes/quality-content-pane';
import ServicesContentPane from './panes/services-content-pane';
import { Pen } from 'lucide-react';

function getEditorComponent(editPath: string | null) {
  if (!editPath) return () => <div>Select a page to edit.</div>;

  if (editPath.includes('settings')) return SiteSettingsPane;
  if (editPath.includes('products-content')) return ProductsContentPane;
  if (editPath.includes('about-content')) return AboutContentPane;
  if (editPath.includes('quality-content')) return QualityContentPane;
  if (editPath.includes('services-content')) return ServicesContentPane;
  if (editPath.includes('home')) return SiteSettingsPane;
  

  // Fallback
  return () => <div className="p-4">This page does not have a live editor.</div>;
}

export function EditorPanel({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const editPath = useEditPath();
  const EditorComponent = getEditorComponent(editPath);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Pen className="h-5 w-5" />
            Live Editor
          </SheetTitle>
        </SheetHeader>
        <div className="p-4 overflow-y-auto flex-1">
            <EditorComponent />
        </div>
      </SheetContent>
    </Sheet>
  );
}
