import Image from 'next/image'

import { Container } from '@/components/marketing/Container'

import avatarImage1 from '@/images/avatars/avatar-1.png'
import avatarImage2 from '@/images/avatars/avatar-2.png'
import avatarImage3 from '@/images/avatars/avatar-3.png'
import avatarImage4 from '@/images/avatars/avatar-4.png'
import avatarImage5 from '@/images/avatars/avatar-5.png'
import avatarImage6 from '@/images/avatars/avatar-6.png'
import { BackgroundImage } from './BackgroundImage'

const testimonials = [
  [
    {
      content:
        'My English has improved dramatically. With the engaging role-plays, I’ve gone from timid greetings to fully voiced conversations. It’s been an amazing journey of language growth and newfound confidence!',
      author: {
        name: 'Emma García',
        role: 'Learning English',
        image: avatarImage1,
      },
    },
    {
      content:
        'I love how it adapts to my learning pace - it’s like a personal tutor that truly understands my needs. Every session leaves me feeling more equipped to converse fluently in my new language.',
      author: {
        name: 'Wei Lian',
        role: 'Learning French',
        image: avatarImage2,
      },
    },
  ],
  [
    {
      content:
        'The interactive approach has been nothing short of phenomenal. It has managed to strike the perfect balance between learning and entertainment, making the task of mastering another language an absolute joy.',
      author: {
        name: 'Fatima Zahra Asghar',
        role: 'Learning Spanish',
        image: avatarImage3,
      },
    },
    {
      content:
        'This transformed my approach to learning. Not only did the role-play scenarios push me out of my comfort zone, but they were incredibly fun and relevant to real-life situations. I now feel ready to tackle any conversation!',
      author: {
        name: 'Aarav Patil',
        role: 'Learning German',
        image: avatarImage4,
      },
    },
  ],
  [
    {
      content:
        'I never thought language learning could be this engaging! This innovative vocabulary learning had me actually using the language in meaningful ways from day one. Each lesson feels like a personalized adventure.',
      author: {
        name: 'Alex Johnson',
        role: 'Learning Italian',
        image: avatarImage5,
      },
    },
    {
      content:
        'As someone who has always been intimidated by the intricacies of grammar, this has been a revelation. The clever mix of friendly guidance and practical exercises has made all the difference. It’s language learning that I actually look forward to!',
      author: {
        name: 'Chloe Dubois',
        role: 'Learning English',
        image: avatarImage6,
      },
    },
  ],
]

function QuoteIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg aria-hidden="true" width={105} height={78} {...props}>
      <path d="M25.086 77.292c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622C1.054 58.534 0 53.411 0 47.686c0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C28.325 3.917 33.599 1.507 39.324 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Zm54.24 0c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622-2.11-4.52-3.164-9.643-3.164-15.368 0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C82.565 3.917 87.839 1.507 93.564 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Z" />
    </svg>
  )
}

export function Testimonials() {
  return (
    <section id="testimonials" aria-label="What our customers are saying" className="py-20 sm:py-32">
      <div className="relative">
        <BackgroundImage position="right" className="-bottom-32 -top-40" />
        <Container className="relative">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-4xl lg:pr-24">
            <h2 className="font-display text-4xl font-medium tracking-tighter text-blue-600 [text-wrap:balance] sm:text-5xl">
              Used worldwide
            </h2>
            <p className="font-display mt-4 text-2xl tracking-tight text-blue-900 [text-wrap:balance]">
              So simple that people can’t help but fall in love with it.
              <br />
              Here’s what they have to say.
            </p>
          </div>
          <ul
            role="list"
            className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3"
          >
            {testimonials.map((column, columnIndex) => (
              <li key={columnIndex}>
                <ul role="list" className="flex flex-col gap-y-6 sm:gap-y-8">
                  {column.map((testimonial, testimonialIndex) => (
                    <li key={testimonialIndex}>
                      <figure className="relative rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10">
                        <QuoteIcon className="absolute left-6 top-6 fill-slate-100" />
                        <blockquote className="relative">
                          <p className="text-lg tracking-tight text-slate-900">{testimonial.content}</p>
                        </blockquote>
                        <figcaption className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                          <div>
                            <div className="font-display text-base text-slate-900">{testimonial.author.name}</div>
                            <div className="mt-1 text-sm text-slate-500">{testimonial.author.role}</div>
                          </div>
                          <div className="overflow-hidden rounded-full bg-slate-50">
                            <Image
                              className="size-14 object-cover"
                              src={testimonial.author.image}
                              alt=""
                              width={56}
                              height={56}
                            />
                          </div>
                        </figcaption>
                      </figure>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </section>
  )
}
