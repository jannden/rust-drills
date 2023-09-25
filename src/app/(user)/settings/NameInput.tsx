'use client'

import React from 'react'

export default function Input({
  label,
  defaultValue,
  placeholder,
}: {
  label: string
  defaultValue: string
  placeholder: string
}) {
  const [value, setValue] = React.useState<String>()
  const [isSaving, setIsSaving] = React.useState(false)

  React.useEffect(() => {
    if (!value) return
    let timeoutDone: NodeJS.Timeout
    const timeoutSaving = setTimeout(() => {
      setIsSaving(true)
      fetch('/api/languages', {
        method: 'PATCH',
        body: JSON.stringify({
          publicName: value,
        }),
      })
        .then(() => {
          timeoutDone = setTimeout(() => {
            setIsSaving(false)
          }, 1500)
        })
        .catch((error) => {
          console.error(error)
          setIsSaving(false)
        })
    }, 1000)
    return () => {
      if (timeoutSaving) clearTimeout(timeoutSaving)
      if (timeoutDone) clearTimeout(timeoutDone)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const newValue = e.target.value
    setValue(newValue)
  }

  return (
    <div className="pt-6 sm:flex">
      <label htmlFor="input" className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
        {`${label} ${isSaving ? '(saving...)' : ''}`}
      </label>
      <input
        type="text"
        name="input"
        id="input"
        defaultValue={defaultValue}
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        placeholder={placeholder}
        onChange={handleChange}
      />
    </div>
  )
}
