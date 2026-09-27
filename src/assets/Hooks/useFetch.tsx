import { supabase } from "../Utils/supabase";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

export interface SupabaseConfig {
    eq?: Record<string, unknown>;
    ascend?: { col: string; order: boolean };
    limit?: number;
    range?: { from: number; to: number };
    count?: "exact" | "planned" | "estimated";
}

export type UseFetchOptions<T> = Omit<UseQueryOptions<{ data: T[]; count: number }, Error>,"queryKey" | "queryFn">;

export function useFetch<T = unknown>(key: string, take: string, q?: SupabaseConfig, option?: UseFetchOptions<T>) {
    const { data: queryResult, error, isLoading } = useQuery({
        queryKey: [key, take || "*", q],
        queryFn: async () => {
            let query = supabase.from(key).select(take || "*", { count: q?.count });

            if (q?.eq) {
                Object.entries(q.eq).forEach(([col, value]) => {
                    if (value !== undefined && value !== null) query = query.eq(col, value as never)
                })
            }

            if (q?.ascend) query = query.order(q.ascend.col, { ascending: q.ascend.order ?? true });
            if (q?.limit) query = query.limit(q.limit);
            if (q?.range) query = query.range(q.range.from, q.range.to);

            const { data: result, error: fetchError, count } = await query;

            if (fetchError) {
                console.error(`Error fetching ${key}:`, fetchError);
                throw fetchError;
            }

            return {
                data: (result ?? []) as T[],
                count: count ?? 0,
            }},
        ...option,
    });

    return {data: queryResult?.data ?? [], counted: queryResult?.count ?? 0, error, isLoading};
}