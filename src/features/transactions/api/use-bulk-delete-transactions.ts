

import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { honoClient } from '@/lib/hono'
import { toast } from 'sonner'
import { log } from 'console';

type ResponseType = InferResponseType<typeof honoClient.api.transactions['bulk-delete']['$post']>
type RequestType = InferRequestType<typeof honoClient.api.transactions['bulk-delete']['$post']>['json']

export const useBulkDeleteTransactions = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            console.log(json, 'json')
            const response = await honoClient.api.transactions['bulk-delete'].$post({ json })
            console.log(response, 'response')
            return await response.json()
        },
        onSuccess: () => {
            toast.success('transactions deleted')
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
            // also invalidate summary
        },
        onError: () => {
            toast.error('Failed to delete transactions')
        }
    })

    return mutation;
}