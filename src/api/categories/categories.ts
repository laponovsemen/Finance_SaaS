import { categories, insertCategoriesSchema } from '@/db/schema';
import { Hono } from 'hono'
import { z } from 'zod'
import { db } from '@/db/drizzle'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { HTTPException } from 'hono/http-exception'
import { and, eq, inArray } from 'drizzle-orm'
import { zValidator } from '@hono/zod-validator'
import { createId } from '@paralleldrive/cuid2'

const app = new Hono()
    .get('/',
        clerkMiddleware(),
        async (ctx) => {

            const auth = getAuth(ctx);
            if (!auth?.userId) {
                throw new HTTPException(401, {
                    res: ctx.json({ error: 'unauthorized' })
                })
            }

            const data = await db.select({
                id: categories.id,
                name: categories.name
            })
                .from(categories)
                .where(eq(categories.userId, auth.userId))

            return ctx.json({ data })
        })
    .get(
        '/:id',
        zValidator('param', z.object({
            id: z.string().optional(),
        })),
        clerkMiddleware(),
        async (ctx) => {
            const auth = getAuth(ctx);
            const { id } = ctx.req.valid('param');

            if (!id) {
                return ctx.json({
                    error: 'Missing id'
                }, 400)
            }

            if (!auth?.userId) {
                return ctx.json({
                    error: 'Unauthorized'
                }, 401)
            }

            const [data] = await db
                .select({
                    id: categories.id,
                    name: categories.name,
                })
                .from(categories)
                .where(
                    and(
                        eq(categories.userId, auth.userId),
                        eq(categories.id, id)
                    )
                );

            if (!data) {
                return ctx.json({ error: 'Not found' }, 404)
            }
            return ctx.json({ data })
        }
    )
    .post('/',
        clerkMiddleware(),
        zValidator("json", insertCategoriesSchema.pick({
            name: true
        })),
        async (ctx) => {
            const auth = getAuth(ctx)
            console.log('pizda')
            if (!auth?.userId) {
                return ctx.json({
                    error: 'Unauthorized'
                }, 401)
            }

            const values = ctx.req.valid('json')
            const [data] = await db.insert(categories).values({
                id: createId(),
                userId: auth.userId,
                ...values
            })
                .returning();

            return ctx.json({ data }, 200)
        })
    .post(
        '/bulk-delete',
        clerkMiddleware(),
        zValidator(
            'json',
            z.object({
                ids: z.array(z.string())
            })
        ),
        async (ctx) => {
            const auth = await getAuth(ctx);
            const values = ctx.req.valid('json');

            if (!auth?.userId) {
                return ctx.json({ error: 'Unauthorized' }, 401)
            }

            const data = await db
                .delete(categories)
                .where(
                    and(
                        eq(categories.userId, auth.userId),
                        inArray(categories.id, values.ids)
                    )
                )
                .returning({
                    id: categories.id
                });

            return ctx.json({ data })
        }
    )
    .patch(
        '/:id',
        clerkMiddleware(),
        zValidator(
            'param',
            z.object({
                id: z.string().optional()
            })
        ),
        zValidator(
            'json',
            insertCategoriesSchema.pick({
                name: true
            })
        ),
        async (ctx) => {
            const auth = getAuth(ctx);
            const { id } = ctx.req.valid('param')
            const values = ctx.req.valid('json')

            if (!id) {
                return ctx.json({ error: 'Missing id' }, 400)
            }

            if (!auth?.userId) {
                return ctx.json({
                    error: 'Unauthorized'
                }, 401)
            }

            const [data] = await db
                .update(categories)
                .set(values)
                .where(
                    and(
                        eq(categories.userId, auth.userId),
                        eq(categories.id, id)
                    )
                )
                .returning();

            if (!data) {
                return ctx.json({
                    error: 'Not found'
                }, 401)
            }
            return ctx.json({ data })

        }
    )
    .delete(
        '/:id',
        clerkMiddleware(),
        zValidator(
            'param',
            z.object({
                id: z.string().optional()
            })
        ),

        async (ctx) => {
            const auth = getAuth(ctx);
            const { id } = ctx.req.valid('param')

            if (!id) {
                return ctx.json({ error: 'Missing id' }, 400)
            }

            if (!auth?.userId) {
                return ctx.json({
                    error: 'Unauthorized'
                }, 401)
            }

            const [data] = await db
                .delete(categories)
                .where(
                    and(
                        eq(categories.userId, auth.userId),
                        eq(categories.id, id)
                    )
                )
                .returning({
                    id: categories.id
                });

            if (!data) {
                return ctx.json({
                    error: 'Not found'
                }, 404)
            }
            return ctx.json({ data })

        }
    )

export default app;