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
        slug: 'control-flow',
        title: 'Control Flow',
        subtitle: 'A fun but comprehensive guide for Control Flow in Rust with metaphors from the world of Dune.',
        url: 'https://medium.com/rustaceans/rust-conditionals-a-fun-guide-with-examples-85e831c86501?sk=94edf6b826f7e5fe350f8d5f082ca6bd',
        imageUrl: flowControl,
        snippets: [
          { slug: 'if-and-else', heading: 'If and Else' },
          { slug: 'while-loops', heading: 'While Loops' },
          { slug: 'for-loops', heading: 'For Loops' },
          { slug: 'nested-loops', heading: 'Nested Loops' },
          { slug: 'loops-with-continue', heading: 'Loops with Continue' },
          { slug: 'loops-with-break', heading: 'Loops with Break' },
          { slug: 'simple-pattern-matching', heading: 'Simple Pattern Matching' },
          { slug: 'result-type', heading: 'Result Type' },
          { slug: 'option-type', heading: 'Option Type' },
          { slug: 'if-let-pattern', heading: 'If-Let Pattern' },
        ],
      },
      {
        slug: 'enums',
        title: 'Enums',
        subtitle: 'A fun but comprehensive guide for Enums in Rust with metaphors from The Matrix.',
        url: 'https://medium.com/rustaceans/rust-enums-a-fun-guide-with-examples-f3bb0f590d93?sk=08825ba512c2cf2638c1fa3e177a643a',
        imageUrl: enums,
        snippets: [
          {
            slug: 'the-basics-of-enums',
            heading: 'The Basics of Enums',
          },
          {
            slug: 'enums-with-data',
            heading: 'Enums with Data',
          },
          {
            slug: 'option-handling-with-enums',
            heading: 'Option handling with enums',
          },
          {
            slug: 'error-handling-with-enums',
            heading: 'Error handling with enums',
          },
          {
            slug: 'enums-with-match-guards',
            heading: 'Enums with Match Guards',
          },
          {
            slug: 'enums-with-generics',
            heading: 'Enums with Generics',
          },
          {
            slug: 'methods-in-enums',
            heading: 'Methods in Enums',
          },
          {
            slug: 'enum-forwarding-with-delegation',
            heading: 'Enum Forwarding with Delegation',
          },
          {
            slug: 'enums-in-state-design-pattern',
            heading: 'Enums in State Design Pattern',
          },
          {
            slug: 'recursive-enums',
            heading: 'Recursive Enums',
          },
        ],
      },
      {
        slug: 'structs',
        title: 'Structs',
        subtitle: 'A fun but comprehensive guide for Structs in Rust with metaphors from The Game of Thrones.',
        url: 'https://medium.com/rustaceans/rust-structs-a-fun-guide-with-examples-c2851dfb96c6?sk=a1493ed9de65e20c38aa7960d4312588',
        imageUrl: structs,
        snippets: [
          {
            slug: 'the-basics-of-structs',
            heading: 'The Basics of Structs',
          },
          {
            slug: 'methods-in-structs',
            heading: 'Methods in Structs',
          },
          {
            slug: 'associated-functions',
            heading: 'Associated Functions',
          },
          {
            slug: 'structs-with-enums',
            heading: 'Structs with Enums',
          },
          {
            slug: 'structs-with-traits',
            heading: 'Structs with Traits',
          },
        ],
      },
      {
        slug: 'strings',
        title: 'Strings',
        subtitle: 'A fun but comprehensive guide for Strings in Rust with metaphors from The Witcher.',
        url: 'https://medium.com/rustaceans/rust-strings-a-fun-guide-with-examples-e412ff963465?sk=f7c6a09b38b4f3b2de76945cd16ae40a',
        imageUrl: strings,
        snippets: [
          {
            slug: 'creating-strings',
            heading: 'Creating Strings',
          },
          {
            slug: 'string-types',
            heading: 'String Types',
          },
          {
            slug: 'string-methods',
            heading: 'String Methods',
          },
          {
            slug: 'methods-for-updating-strings',
            heading: 'Methods for updating Strings',
          },
          {
            slug: 'iterating-over-strings',
            heading: 'Iterating Over Strings',
          },
          {
            slug: 'converting-between-strings-and-other-types',
            heading: 'Converting Between Strings and Other Types',
          },
          {
            slug: 'advanced-string-manipulation',
            heading: 'Advanced String Manipulation',
          },
        ],
      },
      {
        slug: 'vectors',
        title: 'Vectors',
        subtitle: 'A fun but comprehensive guide for Vectors in Rust with metaphors from The Lord of the Rings.',
        url: 'https://medium.com/rustaceans/rust-vectors-a-fun-guide-with-examples-ba9402139e5a?sk=a928927b3dd3108a4c9e4b7e8a5a6936',
        imageUrl: vectors,
        snippets: [
          {
            slug: 'the-basics-of-vectors',
            heading: 'The Basics of Vectors',
          },
          {
            slug: 'accessing-elements',
            heading: 'Accessing Elements',
          },
          {
            slug: 'iterating-over-vectors',
            heading: 'Iterating Over Vectors',
          },
          {
            slug: 'iterating-with-indexes',
            heading: 'Iterating with indexes',
          },
          {
            slug: 'modifying-elements',
            heading: 'Modifying Elements',
          },
          {
            slug: 'using-enumerations-with-vectors',
            heading: 'Using Enumerations with Vectors',
          },
          {
            slug: 'vector-capacity-and-reallocation',
            heading: 'Vector Capacity and Reallocation',
          },
          {
            slug: 'slicing-vectors',
            heading: 'Slicing Vectors',
          },
          {
            slug: 'removing-elements',
            heading: 'Removing Elements',
          },
          {
            slug: 'concatenating-vectors',
            heading: 'Concatenating Vectors',
          },
          {
            slug: 'extending-vectors',
            heading: 'Extending Vectors',
          },
          {
            slug: 'clearing-vectors',
            heading: 'Clearing Vectors',
          },
        ],
      },
      {
        slug: 'functions',
        title: 'Functions',
        subtitle: 'A fun but comprehensive guide for functions in Rust with metaphors from Star Wars.',
        url: 'https://medium.com/rustaceans/rust-functions-a-fun-guide-with-examples-e9b43833a39b?sk=93bcd3e3cfca4bf54ab54cbbe7137cd0',
        imageUrl: functions,
        snippets: [
          {
            slug: 'how-to-create-a-function',
            heading: 'How to Create a Function',
          },
          {
            slug: 'parameters-and-arguments',
            heading: 'Parameters and Arguments',
          },
          {
            slug: 'return-values',
            heading: 'Return Values',
          },
          {
            slug: 'function-signatures',
            heading: 'Function Signatures',
          },
          {
            slug: 'functions-of-objects',
            heading: 'Functions of Objects',
          },
          {
            slug: 'error-handling',
            heading: 'Error Handling',
          },
          {
            slug: 'closures',
            heading: 'Closures',
          },
        ],
      },
      {
        slug: 'traits-generics',
        title: 'Traits and Generics',
        subtitle: 'A fun but comprehensive guide for traits and generics in Rust with metaphors from Peaky Blinders.',
        url: 'https://medium.com/rustaceans/rust-traits-and-generics-a-fun-guide-with-examples-fb94c0bad81d?sk=e82ebce3ef1d94a4d35a017d1d5fef8d',
        imageUrl: traitsGenerics,
        snippets: [
          {
            slug: 'traits',
            heading: 'Traits',
          },
          {
            slug: 'traits-with-default-methods',
            heading: 'Traits with Default Methods',
          },
          {
            slug: 'trait-bounds',
            heading: 'Trait Bounds',
          },
          {
            slug: 'generics',
            heading: 'Generics',
          },
          {
            slug: 'traits-with-generics',
            heading: 'Traits with Generics',
          },
          {
            slug: 'generics-with-trait-bounds',
            heading: 'Generics with Trait Bounds',
          },
          {
            slug: 'associated-types-in-traits',
            heading: 'Associated Types in Traits',
          },
          {
            slug: 'using-supertraits-to-build-on-existing-traits',
            heading: 'Using Supertraits to Build on Existing Traits',
          },
          {
            slug: 'newtype-pattern-to-implement-external-traits-on-external-types',
            heading: 'Newtype Pattern to Implement External Traits on External Types',
          },
        ],
      },
      {
        slug: 'ownership-borrowing',
        title: 'Ownership and Borrowing',
        subtitle: 'A fun but comprehensive guide for Ownership in Rust with metaphors from the world of Danny Ocean.',
        url: 'https://medium.com/rustaceans/rust-ownership-a-fun-guide-with-examples-be54d4b5d0bf?sk=66d9b7b5a3154fd9925317af07e4bfe9',
        imageUrl: ownershipBorrowing,
        snippets: [
          {
            slug: 'the-rules-of-ownership',
            heading: 'The Rules of Ownership',
          },
          {
            slug: 'borrowing',
            heading: 'Borrowing',
          },
          {
            slug: 'mutable-borrowing',
            heading: 'Mutable Borrowing',
          },
          {
            slug: 'the-rules-of-borrowing',
            heading: 'The Rules of Borrowing',
          },
          {
            slug: 'lifetimes',
            heading: 'Lifetimes',
          },
        ],
      },
    ],
  },
]
