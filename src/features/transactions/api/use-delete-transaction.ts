

import { honoClient } from '@/lib/hono';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { InferResponseType, InferRequestType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof honoClient.api.transactions[':id']['$delete']>
type RequestType = InferRequestType<typeof honoClient.api.transactions[':id']['$delete']>

export const useDeleteTransaction = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error>({
            mutationKey: ['transactions'],
            mutationFn: async () => {

                const response = await honoClient.api.transactions[':id']['$delete']({
                    param: {
                        id
                    }
                });

                return await response.json()
            },
            onSuccess: () => {
                toast.success('Transaction deleted');
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
                toast.error('Failed to delete transaction')
            }
        })

    return mutation
}