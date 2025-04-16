import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from '@/src/shared/shadcn/ui/sheet'
import { insertAccountSchema, insertTransactionsSchema } from '@/db/schema';
import type { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { useConfirm } from '@/src/hooks/use-confirm';
import { useOpenTransaction } from '../../hooks/use-open-transaction';
import { useEditTransaction } from '../../api/use-edit-transaction';
import { useDeleteTransaction } from '../../api/use-delete-transaction';
import { useGetTransactionById } from '../../api/use-get-transaction-by-id';
import { TransactionForm } from '../transaction-form/transaction-form';
import { useCreateCategory } from '@/src/features/categories/api/use-create-category';
import { useGetCategories } from '@/src/features/categories/api/use-get-categories';
import { useGetAccounts } from '@/src/features/accounts/api/use-get-accounts';
import { useCreateAccount } from '@/src/features/accounts/api/use-create-account';


const formSchema = insertTransactionsSchema.omit({
    id: true
})

type FormValues = z.input<typeof formSchema>

export const EditTransactionSheet = () => {

    const { isOpen, onClose, onOpen, id } = useOpenTransaction();
    const editMutation = useEditTransaction(id)
    const deleteMutation = useDeleteTransaction(id)
    const transactionQuery = useGetTransactionById(id)

    const [ConfirmDialog, confirm] = useConfirm(
        'Are you sure?',
        'You are about to delete this transaction.'
    )



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

    const transactionEditMutation = useEditTransaction()


    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose()
            }
        })
    }

    const onDelete = async () => {
        const ok = await confirm();

        if (ok) {
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    onClose();
                }
            })
        }

    }

    const defaultValues = useMemo(() => transactionQuery.data ? {
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId,
        amount: transactionQuery.data.amount.toString(),
        date: transactionQuery.data.date
            ? new Date(transactionQuery.data.date)
            : new Date(),
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes
    } : {
        accountId: '',
        categoryId: '',
        amount: '',
        date: new Date(),
        payee: '',
        notes: ''
    }, [transactionQuery.data])

    const isLoading =
        transactionQuery.isLoading
        || categoryQuery.isLoading
        || accountQuery.isLoading

    const isPending =
        editMutation.isPending
        || deleteMutation.isPending
        || transactionQuery.isLoading
        || categoryMutation.isPending
        || accountMutation.isPending

    return (
        <>
            <ConfirmDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className='space-y-4'>
                    <SheetHeader>
                        <SheetTitle>
                            Edit Transaction
                        </SheetTitle>
                        <SheetDescription>
                            Edit an existing transaction
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading
                        ? (
                            <div className='absolute inset-0 flex items-center justify-center'>
                                <Loader2 className='size-4 text-muted-foreground animate-spin' />
                            </div>
                        ) : (
                            <TransactionForm
                                id={id}
                                defaultValues={defaultValues}
                                onSubmit={onSubmit}
                                disabled={isPending}
                                onDelete={onDelete}
                                categoryOptions={categoryOptions}
                                onCreateCategory={handleCreateCategory}
                                accountOptions={accountOptions}
                                onCreateAccount={handleCreateAccount}

                            />
                        )
                    }
                </SheetContent>
            </Sheet>
        </>

    )
}