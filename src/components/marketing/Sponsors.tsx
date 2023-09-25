import Image from 'next/image'

import { Container } from '@/components/marketing/Container'
import someLogo from '@/images/logo.svg'

const sponsors = [
  { name: 'Transistor', logo: someLogo },
  { name: 'Tuple', logo: someLogo },
  { name: 'StaticKit', logo: someLogo },
  { name: 'Mirage', logo: someLogo },
  { name: 'Laravel', logo: someLogo },
  { name: 'Statamic', logo: someLogo },
]

export function Sponsors() {
  return (
    <section id="sponsors" aria-label="Sponsors" className="py-20 sm:py-32">
      <Container>
        <h2 className="font-display mx-auto max-w-2xl text-center text-4xl font-medium tracking-tighter text-blue-900 sm:text-5xl">
          Featured on
        </h2>
        <div className="mx-auto mt-20 grid max-w-max grid-cols-1 place-content-center gap-x-32 gap-y-12 sm:grid-cols-3 md:gap-x-16 lg:gap-x-32">
          {sponsors.map((sponsor) => (
            <div key={sponsor.name} className="flex items-center justify-center">
              <Image src={sponsor.logo} alt={sponsor.name} unoptimized />
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
