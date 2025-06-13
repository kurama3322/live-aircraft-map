import { NextResponse, type NextRequest } from 'next/server'
import { getAirportById } from './service'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const airport = await getAirportById(id)

    return NextResponse.json({ airport }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
