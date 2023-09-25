import { PropsWithChildren } from 'react'

// TODO: https://floating-ui.com/docs/react

export default function Tooltip({ text, children }: PropsWithChildren<{ text: string }>) {
  return (
    <div className="group">
      {children}
      <div className="relative hidden flex-col items-center group-hover:flex">
        <div className="absolute top-0 mt-2 flex flex-col items-center rounded-t-full">
          <div className="-mb-2 size-3 rotate-45 bg-indigo-600"></div>
          <span className="relative z-10 w-32 rounded-sm bg-indigo-600 p-2 text-center text-sm text-white shadow-lg">
            {text}
          </span>
        </div>
      </div>
    </div>
  )
}
