'use client'
import { Button } from '@/src/shared/shadcn/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/shadcn/ui/card'
import { Loader2, Plus } from 'lucide-react'
import { DataTable } from '@/src/shared/shadcn/ui/data-table'
import { columns } from '../columns/columns'
import { Skeleton } from '@/src/shared/shadcn/ui/skeleton'
import { useNewTransaction } from '../../hooks/use-new-transaction'
import { useBulkDeleteTransactions } from '../../api/use-bulk-delete-transactions'
import { useGetTransactions } from '../../api/use-get-transactions'
import { useState } from 'react'
import { UploadButton } from './upload-button/upload-button'
import { ImportCard } from './import-card/import-card'
import { transactions as transactionsSchema } from '@/db/schema'
import { useSelectAccount } from '../../hooks/use-select-account'
import { toast } from 'sonner'
import { useBulkCreateTransactions } from '../../api/use-bulk-create-transactions';
enum VARIANTS {
    LIST = 'LIST',
    IMPORT = 'IMPORT'
}

const INITIAL_IMPORT_RESULTS = {
    data: [],
    errors: [],
    mets: {}
}

export const TransactionsPage = () => {

    const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
    const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS)
    const [AccountDialog, confirm] = useSelectAccount()

    const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {

        console.log({ results })
        setImportResults(results)
        setVariant(VARIANTS.IMPORT)
    }

    const onCancelImport = () => {
        setImportResults(INITIAL_IMPORT_RESULTS)
        setVariant(VARIANTS.LIST)
    }

    const newTransaction = useNewTransaction();
    const bulkCreateMutation = useBulkCreateTransactions()
    const deleteTransactions = useBulkDeleteTransactions()
    const transactionsQuery = useGetTransactions();
    const { data: transactions, isLoading, isError } = transactionsQuery

    const isDisabled = transactionsQuery.isLoading || deleteTransactions.isPending

    const onSubmitImport = async (
        values: typeof transactionsSchema.$inferInsert[],
    ) => {
        const accountId = await confirm()
        if (!accountId) {
            return toast.error('Please select an account to continue.')
        }

        const data = values.map((value) => ({
            ...value,
            accountId: accountId as string
        }))

        bulkCreateMutation.mutate(data, {
            onSuccess: () => {
                onCancelImport();
            }
        })
    }

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

    if (variant === VARIANTS.IMPORT) {
        return (
            <>
                <AccountDialog />
                <ImportCard
                    data={importResults.data}
                    onCancel={onCancelImport}
                    onSubmit={onSubmitImport}
                />
            </>
        )
    }

    return (
        <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
            <Card className='border-none drop-shadow-sm'>
                <CardHeader className='gap-y-2 lg:flex lg:flex-row lg:items-center lg:justify-between'>
                    <CardTitle className='text-xl line-clamp-1'>
                        Transaction History

                    </CardTitle>
                    <div className='flex flex-col lg:flex-row gap-y-2 items-center gap-x-2'>

                        <Button
                            onClick={newTransaction.onOpen}
                            size='sm'
                            className='w-full lg:w-auto'
                        >
                            <Plus className='size-4 mr-2' />
                            Add new
                        </Button>
                        <UploadButton
                            className='w-full lg:w-auto'
                            onUpload={onUpload}
                        />
                    </div>

                </CardHeader>
                <CardContent>
                    <DataTable
                        filterKey='payee'
                        columns={columns}
                        data={transactions ?? []}
                        onDelete={(row) => {
                            const ids = row.map((r) => r.original.id)
                            deleteTransactions.mutate({ ids })
                        }}
                        disabled={isLoading}
                    />
                </CardContent>
            </Card>
        </div>
    )

}