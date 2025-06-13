import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

// this ensures the app isn't run with invalid environment variables
export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
    OPENAIP_API_KEY: z.string(),
    CRON_SECRET: z.string(),
    UPSTASH_REDIS_REST_URL: z.string(),
    UPSTASH_REDIS_REST_TOKEN: z.string(),
  },
  client: {
    NEXT_PUBLIC_MAPBOX_TOKEN: z.string(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    OPENAIP_API_KEY: process.env.OPENAIP_API_KEY,
    CRON_SECRET: process.env.CRON_SECRET,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
  },
  // run with `SKIP_ENV_VALIDATION` to skip env validation
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
})
