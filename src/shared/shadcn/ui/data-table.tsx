"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getFilteredRowModel,
    RowSelection,
    getSortedRowModel,
    type Row,
    type RowSelectionState

} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/shared/shadcn/ui/table"

import { Button } from '@/src/shared/shadcn/ui/button'
import { Input } from '@/src/shared/shadcn/ui/input'
import { useState, type HTMLProps } from 'react'
import { Trash } from 'lucide-react'
import React from 'react'
import { useConfirm } from '@/src/hooks/use-confirm'

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    filterKey: string,
    disabled?: boolean,
    onDelete: (rows: Row<TData>[]) => void;
}



export function DataTable<TData, TValue>({
    columns,
    data,
    filterKey,
    onDelete,
    disabled
}: DataTableProps<TData, TValue>) {

    const [sorting, setSorting] = useState<SortingState>([])
    const [ConfirmDialog, confirm] = useConfirm(
        'Are you sure?',
        'You are about to perform bulk delete.'
    )
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        enableRowSelection: true,
        state: {
            sorting,
            columnFilters,
            rowSelection
        }
    })

    return (
        <div>
            <ConfirmDialog />
            <div className='flex items-center py-4'>
                <Input
                    placeholder={`Filter ${filterKey}...`}
                    value={(table.getColumn(filterKey)?.getFilterValue() as string) ?? ''}
                    onChange={(event) => {
                        return table.getColumn(filterKey)?.setFilterValue(event.target.value)
                    }}
                    className='max-w-sm'
                />
                {table.getFilteredSelectedRowModel().rows.length > 0 && (
                    <Button
                        size='sm'
                        variant='outline'
                        className='ml-auto font-normal text-xs'
                        disabled={disabled}
                        onClick={async () => {
                            const ok = await confirm();
                            if (ok) {
                                onDelete(table.getFilteredSelectedRowModel().rows);
                                table.resetRowSelection();
                            }
                        }}
                    >
                        <Trash className='size-4 mr-2' />
                        Delete ({table.getFilteredSelectedRowModel().rows.length})
                    </Button>
                )}
            </div>
            <div className="rounded-md border" >
                <Table>
                    <TableHeader>
                        {
                            table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} >
                                    {
                                        headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id} >
                                                    {
                                                        header.isPlaceholder
                                                            ? null
                                                            : flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )
                                                    }
                                                </TableHead>
                                            )
                                        })
                                    }
                                </TableRow>
                            ))
                        }
                    </TableHeader>
                    <TableBody>
                        {
                            table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {
                                            row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} >
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())
                                                    }
                                                </TableCell>
                                            ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center" >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                    </TableBody>
                </Table>
            </div>



            <div className="flex items-center justify-end space-x-2 py-4">
                <div className='flex-1 text-sm text-muted-foreground'>
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
