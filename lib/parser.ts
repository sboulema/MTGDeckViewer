export interface DeckEntry {
  quantity: number;
  name: string;
  section: 'mainboard' | 'sideboard';
}

export function parseDeckList(text: string): DeckEntry[] {
  const entries: DeckEntry[] = [];
  let section: 'mainboard' | 'sideboard' = 'mainboard';

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;

    if (/^(sideboard:?|side\s*board:?|sb:?)\s*$/i.test(line)) {
      section = 'sideboard';
      continue;
    }

    // Matches: "4 Lightning Bolt" or "4x Lightning Bolt", optionally followed by set code "(M10) 147"
    const match = line.match(/^(\d+)x?\s+(.+?)(?:\s+\([A-Z0-9_]+\)\s+\d+)?$/);
    if (!match) continue;

    const quantity = parseInt(match[1], 10);
    const name = match[2].trim();
    if (name) entries.push({ quantity, name, section });
  }

  return entries;
}
