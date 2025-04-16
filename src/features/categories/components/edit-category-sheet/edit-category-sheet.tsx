import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from '@/src/shared/shadcn/ui/sheet'
import { insertCategoriesSchema } from '@/db/schema';
import type { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { useConfirm } from '@/src/hooks/use-confirm';
import { useOpenCategory } from '../../hooks/use-open-category';
import { useEditCategory } from '../../api/use-edit-category';
import { useDeleteCategory } from '../../api/use-delete-category';
import { useGetCategoryById } from '../../api/use-get-category-by-id';
import { CategoryForm } from '../category-form/category-form';


const formSchema = insertCategoriesSchema.pick({
    name: true
})

type FormValues = z.input<typeof formSchema>

export const EditCategorySheet = () => {

    const { isOpen, onClose, onOpen, id } = useOpenCategory();
    const editMutation = useEditCategory(id)
    const deleteMutation = useDeleteCategory(id)
    const categoryQuery = useGetCategoryById(id)

    const [ConfirmDialog, confirm] = useConfirm(
        'Are you sure?',
        'You are about to dtlete this account.'
    )

    const isLoading = categoryQuery.isLoading
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

    const defaultValues = useMemo(() => categoryQuery.data ? {
        name: categoryQuery.data.name
    } : {
        name: ''
    }, [categoryQuery.data])

    return (
        <>
            <ConfirmDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className='space-y-4'>
                    <SheetHeader>
                        <SheetTitle>
                            Edit Category
                        </SheetTitle>
                        <SheetDescription>
                            Edit an existing category
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading
                        ? (
                            <div className='absolute inset-0 flex items-center justify-center'>
                                <Loader2 className='size-4 text-muted-foreground animate-spin' />
                            </div>
                        ) : (
                            <CategoryForm
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