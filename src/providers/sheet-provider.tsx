'use client'

import { useMountedState } from 'react-use'
import { NewAccountSheet } from '@/src/features/accounts/components/new-account-sheet/new-account-sheet'
import { EditAccountSheet } from '@/src/features/accounts/components/edit-account-sheet/edit-account-sheet';
import { NewCategorySheet } from '../features/categories/components/new-category-sheet/new-category-sheet';
import { EditCategorySheet } from '../features/categories/components/edit-category-sheet/edit-category-sheet';
import { NewTransactionSheet } from '../features/transactions/components/new-transaction-sheet/new-transaction-sheet';
import { EditTransactionSheet } from '../features/transactions/components/edit-transaction-sheet/edit-transaction-sheet';

export const SheetProvider = () => {
    const isMounted = useMountedState();

    if (!isMounted) return null;


    return (
        <>
            <NewAccountSheet />
            <EditAccountSheet />

            <NewCategorySheet />
            <EditCategorySheet />

            <NewTransactionSheet />
            <EditTransactionSheet />
        </>
    )
}