import { supabase } from "../Utils/supabase"
import { useQuery, type UseQueryOptions } from "@tanstack/react-query"
import { useState } from "react";

export interface SupabaseConfig {
    eq?: Record<string,unknown>;
    ascend?: {col: string, order: boolean};
    limit?: number;
    range?: {from: number, to: number};
    count?: string
}

export type UseFetchOptions<T> = Omit<
    UseQueryOptions<T[], Error>,
    "queryKey" | "queryFn"
>

export function useFetch<T = unknown>(key: string, take: string, q?: SupabaseConfig, option?: UseFetchOptions<T>) {
    const [counted, setCount] = useState<number>(0)
    const { data = [], error, isLoading, refetch} = useQuery({
        queryKey: [key, take || "*", JSON.stringify({ q: q ?? null })],
        queryFn: async () => {
            let query = supabase.from(key).select(take || "*", { count: q?.count })
            if(q?.eq) {
                Object.entries(q.eq).forEach(([col, value]) => {
                    if (value !== undefined && value !== null) {
                        query = query.eq(col, value as never)
                    }
                })
            }

            if(q?.ascend) {
                query = query.order(q.ascend.col, {ascending: q.ascend.order ?? true})
            }

            if(q?.limit) {
                query = query.limit(q.limit)
            }

            if(q?.range) {
                query = query.range(q.range.from, q.range.to)
            }

            const { data: result, error, count } = await query

            if (error) {
                console.error(`Error fetching ${key}:`, error)
                throw error
            } else {
                if(q?.count) {
                    setCount(count || 0)
                }
            }

            return (result ?? []) as T[]
        },
        ...option
    })
    return {data, error, isLoading, refetch, counted}
}