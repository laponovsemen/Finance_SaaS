'use client'
import { Button } from '@/src/shared/shadcn/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/src/shared/shadcn/ui/dropdown-menu'

import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useOpenTransaction } from './hooks/use-open-transaction';
import { useDeleteTransaction } from './api/use-delete-transaction';
import { useConfirm } from '@/src/hooks/use-confirm';


type Props = {
    id: string;
}

export const Actions = ({ id }: Props) => {
    const deleteMutation = useDeleteTransaction(id);

    const [ConfirmDialog, confirm] = useConfirm(
        'Are you sure?',
        'You are about to delete this transaction.'
    )
    const { onOpen } = useOpenTransaction()
    const handleDelete = async () => {
        const ok = await confirm();

        if (ok) {
            deleteMutation.mutate()
        }
    }
    return (
        <>
            <ConfirmDialog />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant='ghost'
                        className='size-4 p-0'
                    >
                        <MoreHorizontal className='size-4' />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                    <DropdownMenuItem
                        disabled={deleteMutation.isPending}
                        onClick={() => onOpen(id)}
                    >
                        <Edit className='size-4 mr-2' />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        disabled={deleteMutation.isPending}
                        onClick={() => handleDelete()}
                    >
                        <Trash className='size-4 mr-2' />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}