import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from '@/src/shared/shadcn/ui/sheet'
import { insertCategoriesSchema } from '@/db/schema';
import type { z } from 'zod';
import { useNewCategory } from '../../hooks/use-new-category';
import { useCreateCategory } from '../../api/use-create-category';
import { CategoryForm } from '../category-form/category-form';


const formSchema = insertCategoriesSchema.pick({
    name: true
})

type FormValues = z.input<typeof formSchema>

export const NewCategorySheet = () => {

    const { isOpen, onClose, onOpen } = useNewCategory();

    const mutation = useCreateCategory()
    const onSubmit = (values: FormValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                onClose()
            }
        })
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className='space-y-4'>
                <SheetHeader>
                    <SheetTitle>
                        New Category
                    </SheetTitle>
                    <SheetDescription>
                        Create new category to track your transactions
                    </SheetDescription>
                </SheetHeader>

                <CategoryForm
                    onSubmit={onSubmit}
                    disabled={mutation.isPending}
                    defaultValues={{
                        name: ''
                    }}
                />


            </SheetContent>
        </Sheet>
    )
}