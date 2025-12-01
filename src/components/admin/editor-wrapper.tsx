'use client';
import { useState } from 'react';
import { EditPageButton } from './edit-page-button';
import { EditorPanel } from './editor-panel';
import { useUser } from '@/firebase';

export function EditorWrapper() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <>
      <EditPageButton onClick={() => setIsPanelOpen(true)} />
      <EditorPanel open={isPanelOpen} onOpenChange={setIsPanelOpen} />
    </>
  );
}
