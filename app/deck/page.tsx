import { Suspense } from 'react';
import { DeckView } from './DeckView';

export default function DeckPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground animate-pulse">Loading deck...</p>
        </main>
      }
    >
      <DeckView />
    </Suspense>
  );
}
