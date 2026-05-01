'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const PLACEHOLDER = `4 Lightning Bolt
2 Goblin Guide
4 Monastery Swiftspear
4 Eidolon of the Great Revel

Sideboard:
2 Smash to Smithereens
3 Searing Blood`;

export default function HomePage() {
  const [decklist, setDecklist] = useState('');
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!decklist.trim()) return;
    router.push(`/deck?list=${encodeURIComponent(decklist.trim())}`);
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-background">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">MTG Deck Viewer</CardTitle>
          <CardDescription>
            Paste your deck list below and click View Deck to see all your cards visually.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder={PLACEHOLDER}
              value={decklist}
              onChange={(e) => setDecklist(e.target.value)}
              rows={16}
              className="font-mono text-sm resize-none"
            />
            <Button type="submit" className="w-full" disabled={!decklist.trim()}>
              View Deck
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
