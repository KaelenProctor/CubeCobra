
export const COLOR_CATEGORIES = ['White', 'Blue', 'Black', 'Red', 'Green', 'Colorless', 'Multicolored', 'Hybrid', 'Lands'] as const;
export type ColorCategory = typeof COLOR_CATEGORIES[number];

export default interface CardDetails {
  scryfall_id: string;
  oracle_id: string;
  name: string;
  set: string;
  collector_number: string;
  released_at: string;
  promo: boolean;
  reprint: boolean;
  digital: boolean;
  isToken: boolean;
  full_name: string;
  name_lower: string;
  artist: string;
  scryfall_uri: string;
  rarity: string;
  legalities: Record<string, 'legal' | 'not_legal' | 'banned' | 'restricted'>; // An empty object, could be more specific if needed
  oracle_text: string;
  image_small?: string;
  image_normal?: string;
  art_crop?: string;
  image_flip?: string;
  cmc: number;
  type: string;
  colors: string[];
  color_identity: string[];
  colorcategory: ColorCategory;
  loyalty?: string;
  power?: string;
  toughness?: string;
  parsed_cost: string[];
  finishes: string[];
  border_color: 'black' | 'white' | 'silver' | 'gold';
  language: string;
  tcgplayer_id?: string;
  mtgo_id: number;
  layout: string;
  full_art: boolean;
  error: boolean;
  prices: {
    usd?: number;
    eur?: number;
    usd_foil?: number;
    usd_etched?: number;
    tix?: number;
  };
  tokens: string[];
  set_name: string;

  // Computed values
  elo?: number;
  popularity?: string;
  cubeCount?: number;
  pickCount?: number;
}

export const allFields = [
  'name',
  'oracle',
  'mv',
  'mana',
  'type',
  'set',
  'tag',
  'status',
  'finish',
  'price',
  'priceFoil',
  'priceEur',
  'priceTix',
  'elo',
  'power',
  'toughness',
  'loyalty',
  'rarity',
  'legality',
  'artist',
  'is',
  'color',
  'colorIdentity',
] as const;

export type AllField = (typeof allFields)[number];

export const numFields = [
  'mv',
  'price',
  'priceFoil',
  'priceEur',
  'priceTix',
  'elo',
  'power',
  'toughness',
  'loyalty',
  'rarity',
  'legality',
] as const;

export type NumField = (typeof numFields)[number];

export function isNumField(field: string): field is NumField {
  return numFields.includes(field as NumField);
}

export const colorFields = ['color', 'colorIdentity'] as const;

export type ColorField = (typeof colorFields)[number];

export function isColorField(field: string): field is ColorField {
  return colorFields.includes(field as ColorField);
}

export type FilterValues = {
  [K in AllField]: K extends ColorField ? string[] : string;
} & {
  [K in `${AllField}Op`]: ':' | '=' | '!=' | '<>' | '<' | '<=' | '>' | '>=';
};
