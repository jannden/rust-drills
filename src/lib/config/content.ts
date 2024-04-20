import {
  Pickaxe,
  Swords,
  Telescope,
  Shovel,
  Scissors,
  Ruler,
  Paintbrush2,
  LandPlot,
  HardHat,
  Axe,
  Hammer,
  DraftingCompass,
} from 'lucide-react'

import flowControl from '@/images/decks/flow-control.webp'
import enums from '@/images/decks/enums.webp'
import structs from '@/images/decks/structs.webp'
import strings from '@/images/decks/strings.webp'
import vectors from '@/images/decks/vectors.webp'
import functions from '@/images/decks/functions.webp'
import traitsGenerics from '@/images/decks/traits-generics.webp'
import ownershipBorrowing from '@/images/decks/ownership-borrowing.webp'

export const categories = [
  {
    slug: 'fun-guides',
    title: 'Fun Guides',
    icon: Telescope,
    decks: [
      {
        slug: 'flow-control',
        title: 'Flow Control',
        subtitle: 'A fun but comprehensive guide for Control Flow in Rust with metaphors from the world of Dune.',
        url: 'https://medium.com/rustaceans/rust-conditionals-a-fun-guide-with-examples-85e831c86501?sk=94edf6b826f7e5fe350f8d5f082ca6bd',
        imageUrl: flowControl,
      },
      {
        slug: 'enums',
        title: 'Enums',
        subtitle: 'A fun but comprehensive guide for Enums in Rust with metaphors from The Matrix.',
        url: 'https://medium.com/rustaceans/rust-enums-a-fun-guide-with-examples-f3bb0f590d93?sk=08825ba512c2cf2638c1fa3e177a643a',
        imageUrl: enums,
      },
      {
        slug: 'structs',
        title: 'Structs',
        subtitle: 'A fun but comprehensive guide for Structs in Rust with metaphors from The Game of Thrones.',
        url: 'https://medium.com/rustaceans/rust-structs-a-fun-guide-with-examples-c2851dfb96c6?sk=a1493ed9de65e20c38aa7960d4312588',
        imageUrl: structs,
      },
      {
        slug: 'strings',
        title: 'Strings',
        subtitle: 'A fun but comprehensive guide for Strings in Rust with metaphors from The Witcher.',
        url: 'https://medium.com/rustaceans/rust-strings-a-fun-guide-with-examples-e412ff963465?sk=f7c6a09b38b4f3b2de76945cd16ae40a',
        imageUrl: strings,
      },
      {
        slug: 'vectors',
        title: 'Vectors',
        subtitle: 'A fun but comprehensive guide for Vectors in Rust with metaphors from The Lord of the Rings.',
        url: 'https://medium.com/rustaceans/rust-vectors-a-fun-guide-with-examples-ba9402139e5a?sk=a928927b3dd3108a4c9e4b7e8a5a6936',
        imageUrl: vectors,
      },
      {
        slug: 'functions',
        title: 'Functions',
        subtitle: 'A fun but comprehensive guide for functions in Rust with metaphors from Star Wars.',
        url: 'https://medium.com/rustaceans/rust-functions-a-fun-guide-with-examples-e9b43833a39b?sk=93bcd3e3cfca4bf54ab54cbbe7137cd0',
        imageUrl: functions,
      },
      {
        slug: 'traits-generics',
        title: 'Traits and Generics',
        subtitle: 'A fun but comprehensive guide for traits and generics in Rust with metaphors from Peaky Blinders.',
        url: 'https://medium.com/rustaceans/rust-traits-and-generics-a-fun-guide-with-examples-fb94c0bad81d?sk=e82ebce3ef1d94a4d35a017d1d5fef8d',
        imageUrl: traitsGenerics,
      },
      {
        slug: 'ownership-borrowing',
        title: 'Ownership and Borrowing',
        subtitle: 'A fun but comprehensive guide for Ownership in Rust with metaphors from the world of Danny Ocean.',
        url: 'https://medium.com/rustaceans/rust-ownership-a-fun-guide-with-examples-be54d4b5d0bf?sk=66d9b7b5a3154fd9925317af07e4bfe9',
        imageUrl: ownershipBorrowing,
      },
    ],
  },
]
