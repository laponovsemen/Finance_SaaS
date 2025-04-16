import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from '@/src/shared/shadcn/ui/sheet'
import { useNewTransaction } from '../../hooks/use-new-transaction';
import { TransactionForm } from '../transaction-form/transaction-form';
import { insertTransactionsSchema } from '@/db/schema';
import type { z } from 'zod';
import { useCreateTransaction } from '../../api/use-create-transaction';
import { useNewCategory } from '@/src/features/categories/hooks/use-new-category';
import { useCreateCategory } from '@/src/features/categories/api/use-create-category';
import { useGetCategories } from '@/src/features/categories/api/use-get-categories';
import { useGetAccounts } from '@/src/features/accounts/api/use-get-accounts';
import { useCreateAccount } from '@/src/features/accounts/api/use-create-account';
import { Loader2 } from 'lucide-react';


const formSchema = insertTransactionsSchema.omit({
    id: true
})

type FormValues = z.input<typeof formSchema>

export const NewTransactionSheet = () => {

    const { isOpen, onClose, onOpen } = useNewTransaction();

    const categoryMutation = useCreateCategory()
    const categoryQuery = useGetCategories()
    const handleCreateCategory = (name: string) => categoryMutation.mutate({
        name
    })

    const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
        label: category.name,
        value: category.id
    }));

    const accountQuery = useGetAccounts();
    const accountMutation = useCreateAccount();
    const handleCreateAccount = (name: string) => accountMutation.mutate({
        name
    })

    const accountOptions = (accountQuery.data ?? []).map((account) => ({
        label: account.name,
        value: account.id
    }))

    const transactionMutation = useCreateTransaction()
    const onSubmit = (values: FormValues) => {
        transactionMutation.mutate(values, {
            onSuccess: () => {
                onClose()
            }
        })
    }

    const isPending = transactionMutation.isPending
        || categoryMutation.isPending
        || accountMutation.isPending

    const isLoading = categoryQuery.isLoading
        || accountQuery.isLoading

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className='space-y-4'>
                <SheetHeader>
                    <SheetTitle>
                        New Transaction
                    </SheetTitle>
                    <SheetDescription>
                        Create new transaction
                    </SheetDescription>
                </SheetHeader>

                {isLoading
                    ? (
                        <div className='absolute inset-0 flex items-center justify-center'>
                            <Loader2 className='size-4 text-muted-foreground animate-spin' />
                        </div>
                    )
                    : (
                        <TransactionForm
                            onSubmit={onSubmit}
                            disabled={false}
                            categoryOptions={categoryOptions}
                            onCreateCategory={handleCreateCategory}
                            accountOptions={accountOptions}
                            onCreateAccount={handleCreateAccount}
                        />
                    )}
            </SheetContent>
        </Sheet>
    )
}