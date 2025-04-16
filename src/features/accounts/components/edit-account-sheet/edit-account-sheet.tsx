import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from '@/src/shared/shadcn/ui/sheet'
import { useNewAccount } from '../../hooks/use-new-account';
import { AccountForm } from '../account-form/account-form';
import { insertAccountSchema } from '@/db/schema';
import type { z } from 'zod';
import { useCreateAccount } from '../../api/use-create-account';
import { useOpenAccount } from '../../hooks/use-open-account';
import { useGetAccountById } from '../../api/use-get-account-by-id';
import { Loader2 } from 'lucide-react';
import { useEditAccount } from '../../api/use-edit-account';
import { useDeleteAccount } from '../../api/use-delete-account';
import { useMemo } from 'react';
import { useConfirm } from '@/src/hooks/use-confirm';


const formSchema = insertAccountSchema.pick({
    name: true
})

type FormValues = z.input<typeof formSchema>

export const EditAccountSheet = () => {

    const { isOpen, onClose, onOpen, id } = useOpenAccount();
    const editMutation = useEditAccount(id)
    const deleteMutation = useDeleteAccount(id)
    const accountQuery = useGetAccountById(id)

    const [ConfirmDialog, confirm] = useConfirm(
        'Are you sure?',
        'You are about to dtlete this account.'
    )

    const isLoading = accountQuery.isLoading
    const isPending = editMutation.isPending || deleteMutation.isPending

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

    const defaultValues = useMemo(() => accountQuery.data ? {
        name: accountQuery.data.name
    } : {
        name: ''
    }, [accountQuery.data])

    return (
        <>
            <ConfirmDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className='space-y-4'>
                    <SheetHeader>
                        <SheetTitle>
                            Edit Account
                        </SheetTitle>
                        <SheetDescription>
                            Edit an existing account
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading
                        ? (
                            <div className='absolute inset-0 flex items-center justify-center'>
                                <Loader2 className='size-4 text-muted-foreground animate-spin' />
                            </div>
                        ) : (
                            <AccountForm
                                id={id}
                                onSubmit={onSubmit}
                                disabled={isPending}
                                defaultValues={defaultValues}
                                onDelete={onDelete}
                            />
                        )
                    }
                </SheetContent>
            </Sheet>
        </>

    )
}