import type { DeckEntry } from './parser';

export interface ScryfallCard {
  id: string;
  name: string;
  scryfall_uri: string;
  type_line: string;
  image_uris?: {
    small: string;
    normal: string;
    large: string;
  };
  card_faces?: Array<{
    image_uris?: {
      small: string;
      normal: string;
      large: string;
    };
  }>;
}

export interface CardWithQuantity {
  card: ScryfallCard;
  quantity: number;
  section: 'mainboard' | 'sideboard';
}

export type CardType =
  | 'Creature'
  | 'Planeswalker'
  | 'Instant'
  | 'Sorcery'
  | 'Enchantment'
  | 'Artifact'
  | 'Land'
  | 'Other';

export const CARD_TYPE_ORDER: CardType[] = [
  'Creature',
  'Planeswalker',
  'Instant',
  'Sorcery',
  'Enchantment',
  'Artifact',
  'Land',
  'Other',
];

export function getCardType(typeLine: string): CardType {
  if (typeLine.includes('Creature')) return 'Creature';
  if (typeLine.includes('Planeswalker')) return 'Planeswalker';
  if (typeLine.includes('Instant')) return 'Instant';
  if (typeLine.includes('Sorcery')) return 'Sorcery';
  if (typeLine.includes('Enchantment')) return 'Enchantment';
  if (typeLine.includes('Artifact')) return 'Artifact';
  if (typeLine.includes('Land')) return 'Land';
  return 'Other';
}

export function getCardImages(card: ScryfallCard) {
  if (card.image_uris) return card.image_uris;
  if (card.card_faces?.[0]?.image_uris) return card.card_faces[0].image_uris;
  return null;
}

const BATCH_SIZE = 75;

export async function fetchCards(entries: DeckEntry[]): Promise<CardWithQuantity[]> {
  const results: CardWithQuantity[] = [];

  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);
    const identifiers = batch.map((e) => ({ name: e.name }));

    const response = await fetch('https://api.scryfall.com/cards/collection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifiers }),
    });

    if (!response.ok) throw new Error(`Scryfall API error: ${response.status}`);

    const data = await response.json();

    for (const card of data.data as ScryfallCard[]) {
      const entry = batch.find(
        (e) => e.name.toLowerCase() === card.name.toLowerCase()
      );
      if (entry) {
        results.push({ card, quantity: entry.quantity, section: entry.section });
      }
    }
  }

  return results;
}
