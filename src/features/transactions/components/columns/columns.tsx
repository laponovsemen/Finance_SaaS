"use client"

import { Button } from '@/src/shared/shadcn/ui/button'
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { InferResponseType } from 'hono';
import { honoClient } from '@/lib/hono'
import { Checkbox } from '@/src/shared/shadcn/ui/checkbox';
import React, { type HTMLProps, type Ref } from 'react';
import { Input } from '@/src/shared/shadcn/ui/input';
import { Actions } from '../../actions';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/src/shared/shadcn/ui/badge';
import { AccountColumn } from './account-column';
import { CategoryColumn } from './category-column';


export type ResponseType = InferResponseType<typeof honoClient.api.transactions.$get, 200>['data'][0]

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
function IndeterminateCheckbox({
    indeterminate,
    className = '',
    ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
    const ref = React.useRef<HTMLInputElement>(null!)

    React.useEffect(() => {
        if (typeof indeterminate === 'boolean') {
            ref.current.indeterminate = !rest.checked && indeterminate
        }
    }, [ref, indeterminate])

    return (
        <input
            ref={ref}
            type='checkbox'
            className={className + ' cursor-pointer'}
            {...rest}
        />
    )
}

export const columns: ColumnDef<ResponseType>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <IndeterminateCheckbox
                {...{
                    checked: table.getIsAllRowsSelected(),
                    indeterminate: table.getIsSomeRowsSelected(),
                    onChange: table.getToggleAllRowsSelectedHandler(),
                    className: ' w-4 h-4 border border-gray-400 rounded accent-black  checked:border-green-700'
                }} //or getToggleAllPageRowsSelectedHandler
            />
        ),
        cell: ({ row }) => (
            <IndeterminateCheckbox
                {...{
                    checked: row.getIsSelected(),
                    disabled: !row.getCanSelect(),
                    indeterminate: row.getIsSomeSelected(),
                    onChange: row.getToggleSelectedHandler(),
                    className: ' w-4 h-4 border border-gray-400 rounded accent-black  checked:border-green-700'
                }}
            />
        ),
        accessorKey: 'id',
        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: "date",
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Date
                    <ArrowUpDown className='ml-4 h-4 w-4' />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = row.getValue('date') as Date;
            return (
                <span>{format(date, 'dd MMMM, yyyy')}</span>
            )
        }
    },
    {
        accessorKey: "category",
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Category
                    <ArrowUpDown className='ml-4 h-4 w-4' />
                </Button>
            )
        },
        cell: ({ row }) => {
            return (
                <CategoryColumn
                    id={row.original.id}
                    category={row.original.category}
                    categoryId={row.original.categoryId}
                />
            )
        }
    },
    {
        accessorKey: "payee",
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Payee
                    <ArrowUpDown className='ml-4 h-4 w-4' />
                </Button>
            )
        },
    },
    {
        accessorKey: "amount",
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Amount
                    <ArrowUpDown className='ml-4 h-4 w-4' />
                </Button>
            )
        },
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('amount'))
            return (
                <Badge
                    variant={amount < 0 ? 'destructive' : 'primary'}
                    className='text-xs font-medium px-3.5 py-2.5 rounded-full'
                >
                    {formatCurrency(amount)}
                </Badge>
            )
        }
    },
    {
        accessorKey: "account",
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Account
                    <ArrowUpDown className='ml-4 h-4 w-4' />
                </Button>
            )
        },
        cell: ({ row }) => {
            return (
                <AccountColumn
                    account={row.original.account}
                    accountId={row.original.accountId}
                />
            )
        }
    },



    {
        id: 'actions',
        cell: ({ row }) => <Actions id={row.original.id} />
    }

]

