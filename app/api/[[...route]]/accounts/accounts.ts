import { accounts } from '@/db/schema';
import {Hono} from 'hono'
import { db } from '@/db/drizzle'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import {HTTPException} from'hono/http-exception'

const app = new Hono()
.get('/', 
    clerkMiddleware(),
    async (ctx) => {

        const auth = getAuth(ctx);
        if(!auth?.userId) {
            throw new HTTPException(401, {
                res: ctx.json({ error: 'unauthorized' })
            })
        }

    const data = await db.select({
        id: accounts.id,
        name: accounts.name
    })
    .from(accounts)
    return ctx.json({ data })
})

export default app;