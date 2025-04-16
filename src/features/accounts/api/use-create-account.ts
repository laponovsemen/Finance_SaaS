import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { honoClient } from '@/lib/hono'
import { toast } from 'sonner'
import { log } from 'console';

type ResponseType = InferResponseType<typeof honoClient.api.accounts.$post>
type RequestType = InferRequestType<typeof honoClient.api.accounts.$post>['json']

export const useCreateAccount = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            console.log(json, 'json')
            const response = await honoClient.api.accounts.$post({ json })
            console.log(response, 'response')
            return await response.json()
        },
        onSuccess: () => {
            toast.success('account created')
            queryClient.invalidateQueries({ queryKey: ['accounts'] })
        },
        onError: () => {
            toast.error('Failed to create a new account')
        }
    })

    return mutation;
}