

import { honoClient } from '@/lib/hono';
import { useQuery } from '@tanstack/react-query';

export const useGetCategoryById = (id?: string) => {
    const query = useQuery({
        enabled: !!id,
        queryKey: ['category', { id }],
        queryFn: async () => {

            const response = await honoClient.api.categories[':id'].$get({
                param: {
                    id
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch category')
            }

            const { data } = await response.json()
            return data
        }
    })

    return query
}