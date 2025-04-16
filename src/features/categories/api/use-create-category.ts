import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { honoClient } from '@/lib/hono'
import { toast } from 'sonner'
import { log } from 'console';

type ResponseType = InferResponseType<typeof honoClient.api.categories.$post>
type RequestType = InferRequestType<typeof honoClient.api.categories.$post>['json']

export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            console.log(json, 'json')
            const response = await honoClient.api.categories.$post({ json })
            console.log(response, 'response')
            return await response.json()
        },
        onSuccess: () => {
            toast.success('category created')
            queryClient.invalidateQueries({ queryKey: ['categories'] })
        },
        onError: () => {
            toast.error('Failed to create a new category')
        }
    })

    return mutation;
}