

import { honoClient } from '@/lib/hono';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { InferResponseType, InferRequestType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof honoClient.api.accounts[':id']['$delete']>
type RequestType = InferRequestType<typeof honoClient.api.accounts[':id']['$delete']>

export const useDeleteAccount = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error>({
            mutationKey: ['accounts'],
            mutationFn: async () => {

                const response = await honoClient.api.accounts[':id']['$delete']({
                    param: {
                        id
                    }
                });

                return await response.json()
            },
            onSuccess: () => {
                toast.success('Account deleted');
                queryClient.invalidateQueries({
                    queryKey: ['accounts']
                })
                queryClient.invalidateQueries({
                    queryKey: ['account', { id }]
                })
                queryClient.invalidateQueries({
                    queryKey: ['transactions']
                })
                queryClient.invalidateQueries({
                    queryKey: ['summary']
                })
            },
            onError: () => {
                toast.error('Failed to delete account')
            }
        })

    return mutation
}