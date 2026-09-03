import { useState, useEffect, useCallback } from "react"
import { supabase } from "../Utils/supabase"

export function useFetch<T = unknown>(key: string) {
    const [data, setData] = useState<T[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<Error | null>(null)

    const refetch = useCallback(async () => {
        setLoading(true)
        setError(null)

        const res = await supabase.from(key).select("*")
        const { data: result, error } = res as { data: T[] | null; error: Error | null }

        if (error) {
            console.error(`Error fetching ${key}:`, error)
            setError(error)
        } else {
            setData((result ?? []) as T[])
        }
        setLoading(false)
    }, [key])

    useEffect(() => {
        let isMounted = true

        const loadInitialData = async () => {
            const res = await supabase.from(key).select("*")
            const { data: result, error } = res as { data: T[] | null; error: Error | null }

            if (!isMounted) return

            if (error) {
                console.error(`Error fetching ${key}:`, error)
                setError(error)
            } else {
                setData((result ?? []) as T[])
                setError(null)
            }
            setLoading(false)
        }

        loadInitialData()

        return () => {
            isMounted = false
        }
    }, [key])

    return { data, loading, error, refetch }
}