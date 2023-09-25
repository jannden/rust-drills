import { DateTime, Duration } from 'luxon'

export type NavType = {
  name: string
  icon: string
  href: string
  activePathnames: string[]
}

export const navigation: NavType[] = [
  { name: 'Dashboard', icon: 'Dashboard', href: '/dashboard', activePathnames: ['/dashboard'] },
  { name: 'Articles', icon: 'BookOpen', href: '/articles', activePathnames: ['/articles'] },
  {
    name: 'Snippets',
    icon: 'Bookmark',
    href: '/collections',
    activePathnames: ['/collections', '/lesson'],
  },
]

export const projectSettings = {
  selectionEveryXHours: 4,
  secondsToRepeatWhenFailed: Duration.fromObject({ seconds: 15 }).seconds,
  numberOfWordsForPhraseGeneration: 20,
  oneCombinationPerXElements: 1,
  availableLanguages: {
    en: { nativeName: 'English', englishName: 'English' },
    de: { nativeName: 'Deutsch', englishName: 'German' },
    es: { nativeName: 'Español', englishName: 'Spanish' },
    it: { nativeName: 'Italiano', englishName: 'Italian' },
    fr: { nativeName: 'Français', englishName: 'French' },
    ru: { nativeName: 'Русский', englishName: 'Russian' },
    sk: { nativeName: 'Slovenčina', englishName: 'Slovak' },
    cs: { nativeName: 'Čeština', englishName: 'Czech' },
    bg: { nativeName: 'Български', englishName: 'Bulgarian' },
  },
}

export const paginationItemsPerPage = 5

export const wordIds = {
  first: 101,
  last: 1388,
}

export const algorithmDefaults = {
  repetition: 0,
  eFactor: 2.5,
  interval: 0,
  dateTimePlanned: DateTime.utc().toISO(),
}

// This is the same as the one in the frontend
export const pollyVoices = {
  // Neural voices:
  en: 'Joanna',
  de: 'Vicki',
  es: 'Lucia',
  it: 'Bianca',
  // Standard voices:
  fr: 'Celine',
  ru: 'Tatyana',
}

export const wordCategories = [
  'Greetings and Farewells',
  'Travel and Directions',
  'Vacation and Tourism',
  'Numbers and Counting',
  'Date and Time',
  'Weather and Climate',
  'Colors and Shapes',
  'Food and Drinks',
  'Shopping and Commerce',
  'Eating out and Restaurants',
  'Clothing and Accessories',
  'Housing and Furniture',
  'Family and Relationships',
  'Job and Occupation',
  'Education and Science',
  'Body, Mind, and Health',
  'Nature and Animals',
  'Sports and Recreation',
  'Literature, Music, and Arts',
  'Technology and Media',
  'Commerce and Banking',
  'Celebrations and Holidays',
  'Politics and Government',
  'Emergency and Safety',
  'Religion and Philosophy',
  'Hobbies and Interests',
  'Directions and Locations',
  'Measurement and Units',
  'Cars and Transportation',
]
