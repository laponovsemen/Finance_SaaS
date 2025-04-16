'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/shadcn/ui/card';
import { DataTable } from '@/src/shared/shadcn/ui/data-table';
import { Skeleton } from '@/src/shared/shadcn/ui/skeleton';
import { Loader2, Plus } from 'lucide-react';
import { useBulkDeleteAccounts } from '../../../accounts/api/use-bulk-delete';
import { useGetAccounts } from '../../../accounts/api/use-get-accounts';
import { useNewAccount } from '../../../accounts/hooks/use-new-account';
import { Button } from '@/src/shared/shadcn/ui/button';
import { useGetCategories } from '../../api/use-get-categories';
import { useNewCategory } from '../../hooks/use-new-category';
import { useBulkDeleteCategories } from '../../api/use-bulk-delete-categories';
import { columns } from '../columns/columns';


export const CategoriesPage = () => {

    const newCategory = useNewCategory();
    const deleteCategories = useBulkDeleteCategories()
    const categoriesQuery = useGetCategories();
    const { data: accounts, isLoading, isError } = categoriesQuery

    const isDisabled = categoriesQuery.isLoading || deleteCategories.isPending

    if (isLoading) {
        return (
            <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
                <Card className='border-none drop-shadow-sm'>
                    <CardHeader>
                        <Skeleton className='h-8 w-48' />
                    </CardHeader>
                    <CardContent>
                        <div className='h-[500px] w-full flex items-center justify-center'>
                            <Loader2 className='size-6 text-slate-300 animate-spin' />
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
            <Card className='border-none drop-shadow-sm'>
                <CardHeader className='gap-y-2 lg:flex lg:flex-row lg:items-center lg:justify-between'>
                    <CardTitle className='text-xl line-clamp-1'>
                        Categories Page

                    </CardTitle>
                    <Button
                        onClick={newCategory.onOpen}
                        size='sm'
                    >


                        <Plus className='size-4 mr-2' />
                        Add new
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable
                        filterKey='name'
                        columns={columns}
                        data={accounts ?? []}
                        onDelete={(row) => {
                            const ids = row.map((r) => r.original.id)
                            deleteCategories.mutate({ ids })
                        }}
                        disabled={isDisabled}
                    />
                </CardContent>
            </Card>
        </div>
    )

}