import { DateTime } from 'luxon'

import ChartBar from './ChartBar'
import { Memory } from '@prisma/client'

type LastSevenDays = {
  columnName: string
  barParts: {
    barName: string
    color: string
    value: number
  }[]
}[]

export default async function Chart({ pastSevenDays }: { pastSevenDays: { memories: Memory[] } }) {
  let chartBarsLastSevenDays: LastSevenDays = []

  for (let i = 6; i >= 0; i--) {
    const startOfDay = DateTime.now().minus({ days: i }).startOf('day')
    const endOfDay = DateTime.now().minus({ days: i }).endOf('day')

    const words = pastSevenDays.memories.filter((m) => {
      return (
        !!m.dateTimeRepeated &&
        DateTime.fromJSDate(m.dateTimeRepeated) >= startOfDay &&
        DateTime.fromJSDate(m.dateTimeRepeated) <= endOfDay
      )
    })

    chartBarsLastSevenDays.push({
      columnName: startOfDay.setLocale('en-US').toLocaleString({ weekday: 'long' }),
      barParts: [
        {
          barName: 'Snippets',
          color: 'bg-indigo-100',
          value: words.length,
        },
      ],
    })
  }

  return (
    <div className="flex w-full grow items-end space-x-2 sm:space-x-3">
      {chartBarsLastSevenDays.map((chartBar, index) => (
        <ChartBar
          key={index}
          columnName={chartBar.columnName}
          maxHeight={200}
          maxValue={chartBarsLastSevenDays.reduce((acc, curr) => {
            const barHeight = curr.barParts.reduce((acc, curr) => acc + curr.value, 0)
            return barHeight > acc ? barHeight : acc
          }, 0)}
          barParts={chartBar.barParts}
        />
      ))}
    </div>
  )
}
