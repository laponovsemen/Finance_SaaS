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


export type ResponseType = InferResponseType<typeof honoClient.api.categories.$get, 200>['data'][0]

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
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Name
                    <ArrowUpDown className='ml-4 h-4 w-4' />
                </Button>
            )
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <Actions id={row.original.id} />
    }

]

