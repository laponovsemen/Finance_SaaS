'use client'
import { Button } from '@/src/shared/shadcn/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/shadcn/ui/card'
import { Loader2, Plus } from 'lucide-react'
import { useNewAccount } from '../../hooks/use-new-account'
import { DataTable } from '@/src/shared/shadcn/ui/data-table'
import { columns } from '../columns/columns'
import { useGetAccounts } from '../../api/use-get-accounts'
import { Skeleton } from '@/src/shared/shadcn/ui/skeleton'
import { useBulkDeleteAccounts } from '../../api/use-bulk-delete'
import { accounts } from '../../../../../db/schema';


export const AccountsPage = () => {

    const newAccount = useNewAccount();
    const deleteAccounts = useBulkDeleteAccounts()
    const accountsQuery = useGetAccounts();
    const { data: accounts, isLoading, isError } = accountsQuery

    const isDisabled = accountsQuery.isLoading || deleteAccounts.isPending

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
                        Account Page

                    </CardTitle>
                    <Button
                        onClick={newAccount.onOpen}
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
                            deleteAccounts.mutate({ ids })
                        }}
                        disabled={isLoading}
                    />
                </CardContent>
            </Card>
        </div>
    )

}