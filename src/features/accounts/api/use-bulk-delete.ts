

import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { honoClient } from '@/lib/hono'
import { toast } from 'sonner'
import { log } from 'console';

type ResponseType = InferResponseType<typeof honoClient.api.accounts['bulk-delete']['$post']>
type RequestType = InferRequestType<typeof honoClient.api.accounts['bulk-delete']['$post']>['json']

export const useBulkDeleteAccounts = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            console.log(json, 'json')
            const response = await honoClient.api.accounts['bulk-delete'].$post({ json })
            console.log(response, 'response')
            return await response.json()
        },
        onSuccess: () => {
            toast.success('accounts deleted')
            queryClient.invalidateQueries({ queryKey: ['accounts'] })
            // also invalidate summary
        },
        onError: () => {
            toast.error('Failed to delete accounts')
        }
    })

    return mutation;
}