

import { honoClient } from '@/lib/hono';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { InferResponseType, InferRequestType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof honoClient.api.accounts[':id']['$patch']>
type RequestType = InferRequestType<typeof honoClient.api.accounts[':id']['$patch']>['json']

export const useEditAccount = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType>({
            mutationKey: ['accounts'],
            mutationFn: async (json) => {

                const response = await honoClient.api.accounts[':id']['$patch']({
                    json,
                    param: {
                        id
                    }
                });

                return await response.json()
            },
            onSuccess: () => {
                toast.success('Account updated');
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
                toast.error('Failed to edit account')
            }
        })

    return mutation
}