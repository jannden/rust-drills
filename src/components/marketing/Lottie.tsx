'use client'

import { useLottie, useLottieInteractivity } from 'lottie-react'
import animation from '@/images/lottie/learn.json'

const style = {
  height: 300,
  width: 300,
}

const options = {
  animationData: animation,
}

const Lottie = () => {
  const lottieObj = useLottie(options, style)
  const Animation = useLottieInteractivity({
    lottieObj,
    mode: 'scroll',
    actions: [
      {
        visibility: [0.5, 0.9],
        type: 'seek',
        frames: [0, 120],
      },
    ],
  })

  return Animation
}

export default Lottie
