import { NextResponse } from 'next/server'
import { getAirports } from './service'

// serve airport data as static JSON from CDN
export const dynamic = 'force-static'

// time-based revalidation:
// - 1st request post-build is a cache HIT
// - cache remains fresh for `revalidate` seconds
// - after expiry, 1st request gets STALE data & triggers background regeneration (stale-while-revalidate)
// https://nextjs.org/docs/app/deep-dive/caching#time-based-revalidation
export const revalidate = 604800 // 7 days (60*60*24*7) the value needs to be statically analysable

// to keep the data fresh, there's a cron job for this route in `vercel.json`
export const GET = async () => {
  try {
    const airports = await getAirports()
    return NextResponse.json({ airports }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: (error as Error)?.message }, { status: 502 })
  }
}
