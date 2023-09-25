import { env } from '@/env.mjs'
import * as Postmark from 'postmark'

export const postmark = new Postmark.ServerClient(env.POSTMARK_SECRET_KEY)
