'use server'

import ListOfCategories from '@/components/ListOfCategories'
import WelcomeMessage from '@/components/WelcomeMessage'

export default async function Decks() {
  return (
    <>
      <WelcomeMessage />

      <ListOfCategories />
    </>
  )
}
