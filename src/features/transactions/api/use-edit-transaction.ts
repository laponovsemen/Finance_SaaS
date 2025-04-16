

import { honoClient } from '@/lib/hono';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { InferResponseType, InferRequestType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof honoClient.api.transactions[':id']['$patch']>
type RequestType = InferRequestType<typeof honoClient.api.transactions[':id']['$patch']>['json']

export const useEditTransaction = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType>({
            mutationKey: ['transactions'],
            mutationFn: async (json) => {

                const response = await honoClient.api.transactions[':id']['$patch']({
                    json,
                    param: {
                        id
                    }
                });

                return await response.json()
            },
            onSuccess: () => {
                toast.success('transaction updated');
                queryClient.invalidateQueries({
                    queryKey: ['transactions']
                })
                queryClient.invalidateQueries({
                    queryKey: ['summary']
                })
                queryClient.invalidateQueries({
                    queryKey: ['transaction', { id }]
                })

            },
            onError: () => {
                toast.error('Failed to edit transaction')
            }
        })

    return mutation
}