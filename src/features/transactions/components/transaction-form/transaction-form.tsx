import { z } from 'zod';
import { Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'


import { Input } from '@/src/shared/shadcn/ui/input';
import { Button } from '@/src/shared/shadcn/ui/button';
import { insertTransactionsSchema } from '@/db/schema';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/src/shared/shadcn/ui/form';
import { Select } from '@/src/shared/ui/select';
import { DatePicker } from '@/src/shared/ui/date-picker';
import { Textarea } from '@/src/shared/shadcn/ui/textarea';
import { AmountInput } from '@/src/shared/ui/amount-input';
import { convertAmountToMiliunits } from '@/lib/utils';

const formSchema = z.object({
    date: z.coerce.date(),
    accountId: z.string(),
    categoryId: z.string().nullable().optional(),
    payee: z.string(),
    amount: z.string(),
    notes: z.string().nullable().optional(),
})
const apiSchema = insertTransactionsSchema.omit({
    id: true
})

type FormValues = z.input<typeof formSchema>
type ApiFormValues = z.input<typeof apiSchema>

type Props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (values: ApiFormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
    accountOptions: { label: string, value: string }[];
    categoryOptions: { label: string, value: string }[];
    onCreateAccount: (name: string) => void
    onCreateCategory: (name: string) => void
};

export const TransactionForm = ({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disabled,
    accountOptions,
    categoryOptions,
    onCreateAccount,
    onCreateCategory
}: Props) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues
    });

    const handleSubmit = (values: FormValues) => {
        const amount = parseFloat(values.amount)
        const amountInMiliunits = convertAmountToMiliunits(amount)
        console.log({ values })
        // onSubmit(values)
        onSubmit({
            ...values,
            amount: amountInMiliunits
        })
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
                    name='date'
                    control={form.control}
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormControl>
                                    <DatePicker
                                        value={field.value}
                                        onChange={field.onChange}
                                        disabled={disabled}
                                    />
                                </FormControl>
                            </FormItem>
                        )
                    }}
                />
                <FormField
                    name='accountId'
                    control={form.control}
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel>
                                    Account
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        placeholder={'Select an account'}
                                        onChange={field.onChange}
                                        disabled={disabled}
                                        value={field.value}
                                        options={accountOptions}
                                        onCreate={onCreateAccount}
                                    />
                                </FormControl>
                            </FormItem>
                        )
                    }}
                />
                <FormField
                    name='categoryId'
                    control={form.control}
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel>
                                    Category
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        placeholder={'Select a category'}
                                        onChange={field.onChange}
                                        disabled={disabled}
                                        value={field.value}
                                        options={categoryOptions}
                                        onCreate={onCreateCategory}
                                    />
                                </FormControl>
                            </FormItem>
                        )
                    }}
                />
                <FormField
                    name='payee'
                    control={form.control}
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel>
                                    Payee
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={disabled}
                                        placeholder={'Add a payee'}
                                        {...field}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )
                    }}
                />
                <FormField
                    name='amount'
                    control={form.control}
                    render={({ field }) => {
                        console.log(field.value, typeof field.value)
                        return (
                            <FormItem>
                                <FormLabel>
                                    Amount
                                </FormLabel>
                                <FormControl>
                                    <AmountInput
                                        {...field}

                                        disabled={disabled}
                                        placeholder={'0.00'}
                                    />
                                </FormControl>
                            </FormItem>
                        )
                    }}
                />
                <FormField
                    name='notes'
                    control={form.control}
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel>
                                    Payee
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}

                                        value={field.value ?? ''}
                                        disabled={disabled}
                                        placeholder={'Optional notes'}
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
                    {id ? 'Save changes' : 'Create transaction'}
                </Button>
                {!!id && (<Button
                    type='button'
                    disabled={disabled}
                    onClick={handleDelete}
                    className='w-full'
                    variant='outline'
                >
                    <Trash className='size-4 mr-2' />

                    Delete transaction
                </Button>)}
            </form>
        </Form>
    )
}