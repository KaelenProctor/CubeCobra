//Ensure we use the real uuid rather than any mocked version if it is relevant to a test
const uuid = jest.requireActual('uuid');
const uuidv4 = uuid.v4;

import { BASIC_LAND_MANA_MAPPING } from '../../src/client/utils/cardutil';
import Article from '../../src/datatypes/Article';
import BlogPost from '../../src/datatypes/BlogPost';
import Card, {
  BasicLand,
  BoardChanges,
  CardDetails,
  Changes,
  CubeCardEdit,
  CubeCardRemove,
  CubeCardSwap,
} from '../../src/datatypes/Card';
import Content, { ContentStatus, ContentType } from '../../src/datatypes/Content';
import Cube, { CubeImage } from '../../src/datatypes/Cube';
import Episode from '../../src/datatypes/Episode';
import Image from '../../src/datatypes/Image';
import Podcast from '../../src/datatypes/Podcast';
import User from '../../src/datatypes/User';
import Video from '../../src/datatypes/Video';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const ALPHANUMERIC = `${LETTERS}${NUMBERS}`;

export const generateRandomString = (alphabet: string, minLength: number, maxLength?: number): string => {
  const length = maxLength ? Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength : minLength;

  return Array.from({ length }, () => alphabet.charAt(Math.floor(Math.random() * alphabet.length))).join('');
};

export const generateRandomNumber = (minLength: number, maxLength?: number): number => {
  return Number.parseInt(generateRandomString(NUMBERS, minLength, maxLength));
};

/**
 * Create a Card for testing by providing sane defaults but allow for overriding
 *
 * @param overrides
 */
export const createCard = (overrides?: Partial<Card>): Card => ({
  index: generateRandomNumber(1, 3),
  cardID: uuidv4(),
  details: createCardDetails(),
  ...overrides,
});

export const createCardWithoutDetails = (overrides?: Partial<Omit<Card, 'details'>>): Card => ({
  index: generateRandomNumber(1, 3),
  cardID: uuidv4(),
  ...overrides,
});

export const createCardFromDetails = (overrides?: Partial<CardDetails>): Card => {
  return createCard({ details: createCardDetails(overrides) });
};

/**
 * Create a CardDetails for testing by providing sane defaults but allow for overriding
 * @param overrides
 */
export const createCardDetails = (overrides?: Partial<CardDetails>): CardDetails => ({
  error: false,
  language: generateRandomString(LETTERS, 2).toLowerCase(),
  layout: '',
  isToken: false,
  name: generateRandomString(ALPHANUMERIC, 10, 25),
  scryfall_id: uuidv4(),
  oracle_id: uuidv4(),
  set: generateRandomString(ALPHANUMERIC, 3).toLowerCase(),
  collector_number: '123',
  released_at: '',
  promo: false,
  promo_types: undefined,
  reprint: false,
  digital: false,
  full_name: generateRandomString(LETTERS, 10, 25),
  name_lower: generateRandomString(LETTERS, 10, 25).toLowerCase(),
  artist: `${generateRandomString(LETTERS, 3, 10)} ${generateRandomString(LETTERS, 5, 15)}`,
  scryfall_uri: `https://scryfall.com/${uuidv4()}`,
  rarity: 'rare',
  legalities: {
    modern: 'banned',
    standard: 'not_legal',
    vintage: 'restricted',
    commander: 'legal',
  },
  oracle_text: 'oracle text goes here',
  cmc: 5,
  type: 'Instant',
  colors: ['w', 'b'],
  color_identity: ['w', 'b', 'r'],
  keywords: [],
  colorcategory: 'Lands',
  parsed_cost: ['1', 'w', 'b'],
  finishes: ['nonfoil', 'etched'],
  border_color: 'black',
  mtgo_id: 12345,
  full_art: true,
  prices: {
    usd: 10.1,
    eur: 9.0,
    tix: 3,
    usd_etched: 12.5,
    usd_foil: 15.25,
  },
  tokens: [],
  set_name: 'cool set',
  ...overrides,
});

export const createCube = (overrides?: Partial<Cube>): Cube => ({
  id: uuidv4(),
  shortId: generateRandomString(ALPHANUMERIC, 10).toLowerCase(),
  owner: createUser(),
  name: generateRandomString(LETTERS, 20),
  visibility: 'pu',
  priceVisibility: '',
  featured: false,
  categoryPrefixes: [],
  tagColors: [],
  defaultFormat: 0,
  numDecks: 0,
  description: '',
  imageName: '',
  date: 0,
  defaultSorts: [],
  formats: [],
  following: [],
  defaultStatus: 'Not Owned',
  defaultPrinting: '',
  disableAlerts: false,
  basics: [],
  tags: [],
  keywords: [],
  cardCount: 360,
  image: createCubeImage(),
  version: 0,
  ...overrides,
});

export const createUser = (overrides?: Partial<User>): User => ({
  id: uuidv4(),
  username: generateRandomString(LETTERS, 5, 10).toLowerCase(),
  imageName: 'Ambush Viper',
  ...overrides,
});

export const createCubeImage = (overrides?: Partial<CubeImage>): CubeImage => ({
  uri: `/content/images/${uuidv4()}.png`,
  artist: `${generateRandomString(LETTERS, 3, 10)} ${generateRandomString(LETTERS, 5, 15)}`,
  id: uuidv4(),
  imageName: `${generateRandomString(LETTERS, 5, 10)} ${generateRandomString(LETTERS, 5, 15)}`,
  ...overrides,
});

export const createBlogPost = (overrides?: Partial<BlogPost>): BlogPost => {
  return {
    id: uuidv4(),
    cube: createCube().id,
    ...overrides,
  } as BlogPost;
};

export const createBasicLand = (name: BasicLand): Card => {
  return createCard({
    type_line: `Basic Land - ${name}`,
    details: createCardDetails({
      name: name,
      type: `Basic Land - ${name}`,
      produced_mana: [BASIC_LAND_MANA_MAPPING[name]],
    }),
  });
};

export const createChangelog = (mainboard?: BoardChanges, maybeboard?: BoardChanges, version: number = 1): Changes => {
  const changes: Changes = {};

  //All fields can be missing (though logically at least one should be set)
  if (version) {
    changes.version = version;
  }
  if (mainboard) {
    changes.mainboard = mainboard;
  }
  if (maybeboard) {
    changes.maybeboard = maybeboard;
  }

  return changes;
};

export const createChangelogCardAdd = (overrides?: Partial<Card>): Card => {
  return { ...createCardWithoutDetails(), ...overrides } as Card;
};

export const createChangelogCardRemove = (overrides?: Partial<CubeCardRemove>): CubeCardRemove => {
  return { index: generateRandomNumber(1, 3), oldCard: createCardWithoutDetails(), ...overrides } as CubeCardRemove;
};

export const createChangelogCardEdit = (overrides?: Partial<CubeCardEdit>): CubeCardEdit => {
  return {
    index: generateRandomNumber(1, 3),
    oldCard: createCardWithoutDetails(),
    newCard: createCardWithoutDetails(),
    ...overrides,
  } as CubeCardEdit;
};

export const createChangelogCardSwap = (overrides?: Partial<CubeCardSwap>): CubeCardSwap => {
  return {
    index: generateRandomNumber(1, 3),
    oldCard: createCardWithoutDetails(),
    card: createCardWithoutDetails(),
    ...overrides,
  } as CubeCardSwap;
};

export const createCardImage = (overrides?: Partial<Image>): Image => {
  return {
    uri: `/content/images/${uuidv4()}.png`,
    artist: `${generateRandomString(LETTERS, 3, 10)} ${generateRandomString(LETTERS, 5, 15)}`,
    id: uuidv4(),
    imageName: `${generateRandomString(LETTERS, 5, 10)} ${generateRandomString(LETTERS, 5, 15)}`,
    ...overrides,
  } as Image;
};

const createContent = (type: ContentType, overrides?: Partial<Content>): Content => {
  const status = overrides?.status || ContentStatus.PUBLISHED;
  const user = overrides?.owner || createUser();
  const userId = user.id;

  return {
    id: uuidv4(),
    type,
    typeStatusComp: `${type}:${status}`,
    typeOwnerComp: `${type}:${userId}`,
    status: status,
    date: new Date('2024-03-24').valueOf(),
    body: generateRandomString(LETTERS, 10, 20),
    owner: user,
    short: generateRandomString(LETTERS, 5, 10),
    username: 'user-1',
    ...overrides,
  } as Content;
};

export const createArticle = (overrides?: Partial<Article>): Article => {
  return createContent(ContentType.ARTICLE, {
    imageName: 'Stock Up',
    image: createCardImage({ imageName: 'Stock Up' }),
    ...overrides,
  }) as Article;
};

export const createEpisode = (overrides?: Partial<Episode>): Episode => {
  return createContent(ContentType.EPISODE, {
    podcastName: 'This is a podcast',
    image: 'https://example.com/podcast.png',
    podcast: 'https://example.com/podcast.rss',
    podcastGuid: uuidv4(),
    ...overrides,
  }) as Episode;
};

export const createPodcast = (overrides?: Partial<Podcast>): Podcast => {
  return createContent(ContentType.PODCAST, {
    image: 'https://example.com/podcast.png',
    title: 'This is a podcast',
    url: 'https://example.com/podcast.rss',
    description: 'The best cubers around',
    ...overrides,
  }) as Podcast;
};

export const createVideo = (overrides?: Partial<Video>): Video => {
  return createContent(ContentType.VIDEO, {
    imageName: 'Stock Up',
    image: createCardImage({ imageName: 'Stock Up' }),
    url: 'https://youtube.example.com/video/abcdefg',
    ...overrides,
  }) as Video;
};
