import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { honoClient } from '@/lib/hono'
import { toast } from 'sonner'
import { log } from 'console';

type ResponseType = InferResponseType<typeof honoClient.api.transactions.$post>
type RequestType = InferRequestType<typeof honoClient.api.transactions.$post>['json']

export const useCreateTransaction = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            console.log(json, 'json')
            const response = await honoClient.api.transactions.$post({ json })
            console.log(response, 'response')
            return await response.json()
        },
        onSuccess: () => {
            toast.success('transaction created')
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
        },
        onError: () => {
            toast.error('Failed to create a new transaction')
        }
    })

    return mutation;
}