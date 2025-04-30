'use client';

import { Editor } from '@/components/editor';
import { useEffect } from 'react';

export default function Home() {
  // Set body to overflow hidden to prevent scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <main className="w-full h-screen flex flex-col overflow-hidden bg-background">
      <Editor />
    </main>
  );
}