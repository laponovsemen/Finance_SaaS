

import { honoClient } from '@/lib/hono';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { InferResponseType, InferRequestType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof honoClient.api.categories[':id']['$delete']>
type RequestType = InferRequestType<typeof honoClient.api.categories[':id']['$delete']>

export const useDeleteCategory = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error>({
            mutationKey: ['categories'],
            mutationFn: async () => {

                const response = await honoClient.api.categories[':id']['$delete']({
                    param: {
                        id
                    }
                });

                return await response.json()
            },
            onSuccess: () => {
                toast.success('Account deleted');
                queryClient.invalidateQueries({
                    queryKey: ['categories']
                })
                queryClient.invalidateQueries({
                    queryKey: ['category', { id }]
                })
                queryClient.invalidateQueries({
                    queryKey: ['transactions']
                })
                queryClient.invalidateQueries({
                    queryKey: ['summary']
                })


            },
            onError: () => {
                toast.error('Failed to delete category')
            }
        })

    return mutation
}