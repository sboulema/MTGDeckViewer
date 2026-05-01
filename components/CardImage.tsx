'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { getCardImages, type ScryfallCard } from '@/lib/scryfall';

interface Props {
  card: ScryfallCard;
  quantity: number;
}

export function CardImage({ card, quantity }: Props) {
  const [hovered, setHovered] = useState(false);
  const images = getCardImages(card);
  if (!images) return null;

  return (
    <div
      className="relative cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => window.open(card.scryfall_uri, '_blank', 'noopener,noreferrer')}
    >
      <div className="relative w-[146px] h-[204px]">
        <Image
          src={images.small}
          alt={card.name}
          fill
          className="rounded-lg shadow-md hover:shadow-xl transition-shadow object-cover"
          sizes="146px"
        />
        {quantity > 1 && (
          <Badge className="absolute top-1 left-1 bg-black/70 text-white text-xs pointer-events-none">
            ×{quantity}
          </Badge>
        )}
      </div>

      {hovered && (
        <div className="absolute z-50 left-full top-0 ml-2 pointer-events-none w-[265px] h-[370px]">
          <Image
            src={images.normal}
            alt={card.name}
            fill
            className="rounded-lg shadow-2xl object-cover"
            sizes="265px"
          />
        </div>
      )}
    </div>
  );
}
