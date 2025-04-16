

import { useRef, useState, type JSX } from 'react';
import { Button } from '@/src/shared/shadcn/ui/button';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/src/shared/shadcn/ui/dialog'
import { useGetAccounts } from '../../accounts/api/use-get-accounts';
import { useCreateAccount } from '../../accounts/api/use-create-account';
import { Select } from '@/src/shared/ui/select';

export const useSelectAccount = (

): [() => JSX.Element, () => Promise<unknown>] => {

    const accountQuery = useGetAccounts();
    const accountMutation = useCreateAccount();
    const onCreateAccount = (name: string) => accountMutation.mutate({
        name
    })

    const accountOptions = (accountQuery.data ?? []).map((account) => ({
        label: account.name,
        value: account.id
    }))


    const [promise, setPromise] = useState<{ resolve: (value?: string) => void } | null>(null);
    const selectValue = useRef<string | undefined>(undefined)
    const confirm = () => new Promise((resolve, reject) => {
        setPromise({ resolve })
    })

    const handleClose = () => {
        setPromise(null)
    }

    const handleConfirm = () => {
        promise?.resolve(selectValue.current)
        handleClose()
    }
    const handleCancel = () => {
        promise?.resolve(undefined)
        handleClose()
    }

    const ConfirmationDialog = () => (
        <Dialog
            open={promise !== null}
        >
            <DialogContent>


                <DialogHeader>
                    <DialogTitle>
                        Select Account
                    </DialogTitle>
                    <DialogDescription>
                        Please select an account to continue
                    </DialogDescription>
                </DialogHeader>
                <Select
                    placeholder='Select an account'
                    options={accountOptions}
                    onCreate={onCreateAccount}
                    onChange={(value) => selectValue.current = value}
                    disabled={accountQuery.isLoading || accountMutation.isPending}
                />
                <DialogFooter className='pt-2'>
                    <Button
                        onClick={handleCancel}
                        variant='outline'
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
    return [ConfirmationDialog, confirm]
}