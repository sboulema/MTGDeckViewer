'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { parseDeckList } from '@/lib/parser';
import {
  fetchCards,
  getCardType,
  CARD_TYPE_ORDER,
  type CardWithQuantity,
  type CardType,
} from '@/lib/scryfall';
import { CardImage } from '@/components/CardImage';
import { Button } from '@/components/ui/button';

function groupByType(cards: CardWithQuantity[]): Record<CardType, CardWithQuantity[]> {
  const groups = {} as Record<CardType, CardWithQuantity[]>;
  for (const entry of cards) {
    const type = getCardType(entry.card.type_line);
    if (!groups[type]) groups[type] = [];
    groups[type].push(entry);
  }
  return groups;
}

function totalCount(cards: CardWithQuantity[]) {
  return cards.reduce((sum, c) => sum + c.quantity, 0);
}

export function DeckView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mainboard, setMainboard] = useState<CardWithQuantity[]>([]);
  const [sideboard, setSideboard] = useState<CardWithQuantity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const list = searchParams.get('list');
    if (!list) {
      router.push('/');
      return;
    }

    async function load() {
      try {
        const entries = parseDeckList(decodeURIComponent(list!));
        const cards = await fetchCards(entries);
        setMainboard(cards.filter((c) => c.section === 'mainboard'));
        setSideboard(cards.filter((c) => c.section === 'sideboard'));
      } catch {
        setError('Failed to load deck. Please check your list and try again.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [searchParams, router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Loading deck...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive">{error}</p>
          <Button onClick={() => router.push('/')}>Back to Input</Button>
        </div>
      </main>
    );
  }

  const mainGroups = groupByType(mainboard);
  const sideGroups = groupByType(sideboard);

  return (
    <main className="min-h-screen p-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Deck ({totalCount(mainboard)} cards)</h1>
          <Button variant="outline" onClick={() => router.push('/')}>
            New Deck
          </Button>
        </div>

        {CARD_TYPE_ORDER.map((type) => {
          const cards = mainGroups[type];
          if (!cards?.length) return null;
          return (
            <section key={type}>
              <h2 className="text-lg font-semibold mb-3">
                {type} ({totalCount(cards)})
              </h2>
              <div className="flex flex-wrap gap-3">
                {cards.map((entry) => (
                  <CardImage key={entry.card.id} card={entry.card} quantity={entry.quantity} />
                ))}
              </div>
            </section>
          );
        })}

        {sideboard.length > 0 && (
          <>
            <hr className="border-border" />
            <h1 className="text-2xl font-bold">Sideboard ({totalCount(sideboard)} cards)</h1>
            {CARD_TYPE_ORDER.map((type) => {
              const cards = sideGroups[type];
              if (!cards?.length) return null;
              return (
                <section key={`side-${type}`}>
                  <h2 className="text-lg font-semibold mb-3">
                    {type} ({totalCount(cards)})
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {cards.map((entry) => (
                      <CardImage key={entry.card.id} card={entry.card} quantity={entry.quantity} />
                    ))}
                  </div>
                </section>
              );
            })}
          </>
        )}
      </div>
    </main>
  );
}
