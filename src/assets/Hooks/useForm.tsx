import { useCallback, useState, type FormEvent } from "react"
import { supabase } from "../Utils/supabase";
import { useQueryClient } from "@tanstack/react-query";

export function useForm(inputs: string[], enp: string, id: string, defaultValues?: Record<string,unknown>) {
    const [values, setValues] = useState<Record<string, unknown>>({})
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | string | null>(null)

    const normalizeValue = useCallback((value: unknown, fieldName?: string) => {
        if (fieldName === 'tags') {
            if (Array.isArray(value)) {
                return value
                    .map((item) => String(item).trim())
                    .filter(Boolean)
            }

            if (typeof value === 'string') {
                return value
                    .split(',')
                    .map((item) => item.trim())
                    .filter(Boolean)
            }

            if (value === null || value === undefined || value === '') return []
            return [String(value).trim()].filter(Boolean)
        }

        if (fieldName === 'stats') {
            if (Array.isArray(value)) return value.map((v) => Number(v))

            if (typeof value === 'string') {
                try {
                    const parsed = JSON.parse(value)
                    if (Array.isArray(parsed)) return parsed.map((v) => Number(v))
                } catch (e) {console.error(e)}

                return String(value).split(',').map((item) => Number(item.trim()))
            }

            if (value === null || value === undefined || value === '') return [0,0,0,0,0,0]
            return [Number(value)]
        }
        if (value === 'on') return true
        if (value === 'true') return true
        if (value === 'false') return false
        if (value === null) return false
        return value
    }, [])

    const onSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget
        setLoading(true)
        setError(null)

        const formData = new FormData(form)
        const resultForm: Record<string, unknown> = {}
        try {
            inputs.forEach((field) => {
                const element = form.elements.namedItem(field) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null

                if (element && element instanceof HTMLInputElement && element.type === 'checkbox') {
                    resultForm[field] = element.checked
                    return
                }

                const value: unknown = normalizeValue(formData.get(field), field)
                resultForm[field] = value
            })

            setValues((prev) => ({ ...prev, ...resultForm }))

            const { error: updateError, data } = await supabase
                .from(`${enp}s`)
                .update(resultForm)
                .eq(`${enp}_id`, id)
                .select()

            if (updateError) throw updateError

            return { ok: true, data }
        } catch (err) {
            console.error("Gagal update project:", err)
            setError(err as Error | string || "Gagal mengedit data")
            return { ok: false, error: err }
        } finally {
            setLoading(false)
            window.location.reload();
        }
    }, [inputs, enp, id, normalizeValue])

    const setValue = useCallback((name: string, value: unknown) => {
        setValues((prev) => ({ ...prev, [name]: normalizeValue(value, name) }))
    }, [normalizeValue])

    const getValue = useCallback((name: string) => values[name], [values])

    const submitField = useCallback(async (name: string, value?: unknown) => {
        setLoading(true)
        setError(null)
        let v = value !== undefined ? value : values[name]
        v = normalizeValue(v, name)
        const payload = { [name]: v }
        try {
            setValues((prev) => ({ ...prev, ...payload }))
            const { error: updateError, data } = await supabase
                .from(`${enp}s`)
                .update(payload)
                .eq(`${enp}_id`, id)
                .select()

            if (updateError) throw updateError
            return { ok: true, data }
        } catch (err) {
            console.error(`Gagal update field ${name}:`, err)
            setError(err as Error | string || `Gagal mengedit field ${name}`)
            return { ok: false, error: err }
        } finally {
            setLoading(false)
        }
    }, [enp, id, normalizeValue, values])

    const queryClient = useQueryClient()

    const onCreate = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const { data, error } = await supabase
                .from(`${enp}s`)
                .insert([{ ...(defaultValues ?? {}) }])
                .select();

            if (error) throw error

            // Invalidate cache for this entity
            try { queryClient.invalidateQueries({ queryKey: [enp + 's'] }) } catch (err) {return {ok: false, error: err}}

            window.location.reload()
            return { ok: true, data }
        } catch (err) {
            console.error(`Gagal create ${enp}:`, err)
            setError(err as Error | string || `Gagal membuat ${enp}`)
            return { ok: false, error: err }
        } finally {
            setLoading(false)
        }
    }, [enp, defaultValues, queryClient])

    const onDelete = useCallback(async () => {        
        const { error } = await supabase
            .from(`${enp}s`)
            .delete()
            .eq(`${enp}_id`, id);

        if (error) {
            console.error("Failed To Delete:", error.message);
            return false;
        }

        console.log("1 Row Deleted!");
        window.location.reload();
    }, [enp, id])

    return { onCreate, onDelete, onSubmit, loading, error, values, setValue, getValue, submitField }
}