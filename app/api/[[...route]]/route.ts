import { z } from 'zod'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import accounts from '../../../src/api/accounts/accounts'
import categories from '../../../src/api/categories/categories'
import transactions from '../../../src/api/transactions/transactions'
import summary from '../../../src/api/summary/summary'
import { HTTPException } from 'hono/http-exception'


// export const runtime = 'edge'

const app = new Hono()
    .use(async (ctx, next) => {
        console.log(`Received request: ${ctx.req.method} ${ctx.req.url}`);
        await next();
    })
    .basePath('/api')
    .route('/accounts', accounts)
    .route('/categories', categories)
    .route('/transactions', transactions)
    .route('/summary', summary)
    .onError((err, ctx) => {
        console.log('eeror', err)
        if (err instanceof HTTPException) {
            return err.getResponse();
        }

        return ctx.json({
            error: 'Internal Server Error'
        })
    })


export const GET = handle(app)
export const POST = handle(app)
export const DELETE = handle(app)
export const PUT = handle(app)
export const PATCH = handle(app)
export const OPTIONS = handle(app)

export type AppType = typeof app;