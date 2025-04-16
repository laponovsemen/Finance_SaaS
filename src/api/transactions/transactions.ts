import { transactions, insertTransactionsSchema, categories, accounts } from '@/db/schema';
import { Hono } from 'hono'
import { z } from 'zod'
import { db } from '@/db/drizzle'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { HTTPException } from 'hono/http-exception'
import { and, eq, gte, inArray, lte, desc, sql } from 'drizzle-orm'
import { zValidator } from '@hono/zod-validator'
import { createId } from '@paralleldrive/cuid2'
import { parse, subDays } from 'date-fns';
import Page from '../../../app/(dashboard)/categories/page';

const app = new Hono()
    .get('/',
        zValidator('query', z.object({
            from: z.string().optional(),
            to: z.string().optional(),
            accountId: z.string().optional(),
        })),
        clerkMiddleware(),
        async (ctx) => {
            const { accountId, from, to } = ctx.req.valid('query')
            const auth = getAuth(ctx);
            if (!auth?.userId) {
                throw new HTTPException(401, {
                    res: ctx.json({ error: 'unauthorized' })
                })
            }

            const defaultTo = new Date()
            const defaultFrom = subDays(defaultTo, 30)

            const startDate = from
                ? parse(from, 'yyyy-MM-dd', new Date())
                : defaultFrom

            const endDate = to
                ? parse(to, 'yyyy-MM-dd', new Date())
                : defaultTo

            const data = await db.select({
                id: transactions.id,
                date: transactions.date,
                category: categories.name,
                categoryId: transactions.categoryId,
                payee: transactions.payee,
                amount: transactions.amount,
                notes: transactions.notes,
                account: accounts.name,
                accountId: transactions.accountId
            })
                .from(transactions)
                .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                .leftJoin(categories, eq(transactions.categoryId, categories.id))
                .where(
                    and(
                        accountId ? eq(transactions.accountId, accountId) : undefined,
                        eq(accounts.userId, auth.userId),
                        gte(transactions.date, startDate),
                        lte(transactions.date, endDate),

                    )
                )
                .orderBy(desc(transactions.date))

            console.log(data, 'datas')
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

            const [data] = await db.select({
                id: transactions.id,
                date: transactions.date,
                categoryId: transactions.categoryId,
                payee: transactions.payee,
                amount: transactions.amount,
                notes: transactions.notes,
                accountId: transactions.accountId
            })
                .from(transactions)
                .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                .where(
                    and(
                        eq(accounts.userId, auth.userId),
                        eq(transactions.id, id)
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
        zValidator("json", insertTransactionsSchema.omit({
            id: true
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
            const [data] = await db.insert(transactions).values({
                id: createId(),
                ...values
            })
                .returning();
            console.log(data, 'createData')
            return ctx.json({ data }, 200)
        })
    .post(
        '/bulk-create',
        clerkMiddleware(),
        zValidator(
            'json',
            z.array(
                insertTransactionsSchema.omit({
                    id: true
                })
            )
        ),
        async (ctx) => {
            const auth = getAuth(ctx);
            const values = ctx.req.valid('json');

            if (!auth?.userId) {
                return ctx.json({
                    error: 'Unauthorized'
                }, 401)
            }

            const data = await db
                .insert(transactions)
                .values(
                    values.map((value) => {
                        return {
                            id: createId(),
                            ...value
                        }
                    })
                )
                .returning()

            return ctx.json({ data })
        }

    )
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
            const transactionsToDelete = db.$with('transactions_to_delete').as(
                db.select({
                    id: transactions.id
                })
                    .from(transactions)
                    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                    .where(
                        and(
                            inArray(transactions.id, values.ids),
                            eq(accounts.userId, auth.userId)
                        )
                    )
            )

            const data = await db
                .with(transactionsToDelete)
                .delete(transactions)
                .where(
                    inArray(transactions.id, sql`(select id from ${transactionsToDelete})`)
                )
                .returning({
                    id: transactions.id
                })


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
            insertTransactionsSchema.omit({
                id: true
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

            const transactionsToUpdate = db.$with('transactions_to_update').as(
                db.select({
                    id: transactions.id
                })
                    .from(transactions)
                    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                    .where(
                        and(
                            eq(transactions.id, id),
                            eq(accounts.userId, auth.userId)
                        )
                    )
            )

            const [data] = await db
                .with(transactionsToUpdate)
                .update(transactions)
                .set(values)
                .where(
                    inArray(transactions.id, sql`(select id from ${transactionsToUpdate})`)
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

            const transactionsToDelete = db.$with('transactions_to_delete').as(
                db.select({
                    id: transactions.id
                })
                    .from(transactions)
                    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                    .where(
                        and(
                            eq(transactions.id, id),
                            eq(accounts.userId, auth.userId)
                        )
                    )
            )


            const [data] = await db
                .with(transactionsToDelete)
                .delete(transactions)
                .where(
                    inArray(transactions.id, sql`(select id from ${transactionsToDelete})`)
                )
                .returning({
                    id: transactions.id
                })

            if (!data) {
                return ctx.json({
                    error: 'Not found'
                }, 404)
            }
            return ctx.json({ data })

        }
    )

export default app;