import { NextResponse } from 'next/server'

import { getClerkWithDb } from '@/lib/server/getClerkWithDb'
import { getEnergy } from '@/lib/server/getEnergy'

// * Get energy data for user
export async function GET() {
  const user = await getClerkWithDb()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const energyData = await getEnergy(user.db.role === 'ADMIN', user.db.id)

  if (!energyData) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(energyData, { status: 200 })
}
