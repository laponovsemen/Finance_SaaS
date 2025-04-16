

import { honoClient } from '@/lib/hono';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { InferResponseType, InferRequestType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof honoClient.api.categories[':id']['$patch']>
type RequestType = InferRequestType<typeof honoClient.api.categories[':id']['$patch']>['json']

export const useEditCategory = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType>({
            mutationKey: ['categories'],
            mutationFn: async (json) => {

                const response = await honoClient.api.categories[':id']['$patch']({
                    json,
                    param: {
                        id
                    }
                });

                return await response.json()
            },
            onSuccess: () => {
                toast.success('category updated');
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
                toast.error('Failed to edit category')
            }
        })

    return mutation
}