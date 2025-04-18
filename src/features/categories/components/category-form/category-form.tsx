import { z } from 'zod';
import { Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'


import { Input } from '@/src/shared/shadcn/ui/input';
import { Button } from '@/src/shared/shadcn/ui/button';
import { insertCategoriesSchema } from '@/db/schema';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/src/shared/shadcn/ui/form';

const formSchema = insertCategoriesSchema.pick({
    name: true
})

type FormValues = z.input<typeof formSchema>

type Props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (values: FormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
};

export const CategoryForm = ({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disabled
}: Props) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues
    });

    const handleSubmit = (values: FormValues) => {
        onSubmit(values)
    }

    const handleDelete = () => {
        onDelete?.()
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className='space-y-4 p-4 pt-4'
            >
                <FormField
                    name='name'
                    control={form.control}
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel>
                                    Name
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={disabled}
                                        placeholder='e.g. Food, Travel, etc.'
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )
                    }}
                />
                <Button
                    className='w-full'
                    disabled={disabled}
                >
                    {id ? 'Save changes' : 'Create category'}
                </Button>
                {!!id && (<Button
                    type='button'
                    disabled={disabled}
                    onClick={handleDelete}
                    className='w-full'
                    variant='outline'
                >
                    <Trash className='size-4 mr-2' />

                    Delete category
                </Button>)}
            </form>
        </Form>
    )
}