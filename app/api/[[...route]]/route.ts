import {z} from 'zod'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import {clerkMiddleware, getAuth} from '@hono/clerk-auth'
import accounts from './accounts/accounts'
import { HTTPException } from 'hono/http-exception'


export const runtime = 'edge'

const app = new Hono()
.basePath('/api')
.onError((err, ctx) => {
    if(err instanceof HTTPException) {
        return err.getResponse();
    }

    return ctx.json({
        error: 'Internal Server Error'
    })
})
.route('/accounts', accounts)


export const GET = handle(app)
export const POST = handle(app)
export const DELETE = handle(app)
export const PUT = handle(app)
export const PATCH = handle(app)
export const OPTIONS = handle(app)

export type AppType = typeof app;