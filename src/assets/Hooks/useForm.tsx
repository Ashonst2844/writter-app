import { useCallback, useState, type FormEvent } from "react";
import { supabase } from "../Utils/supabase";
import { useQueryClient } from "@tanstack/react-query";

interface FormProps {
    inputs: string[];
    enp: string;
    id: string;
    defaultValues?: Record<string, unknown>
}
interface ResultState {
    values: Record<string, unknown>;
    loading: boolean;
    error: Error | string | null;
} 

export function useForm({inputs, enp, id, defaultValues}: FormProps) {
    const [result, setResult] = useState<ResultState>({
        values: {},
        loading: false,
        error: null,
    })
    const queryClient = useQueryClient();

    const normalizeValue = useCallback((value: unknown, fieldName?: string) => {
        if (fieldName === "tags") {
            if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
            if (typeof value === "string") return value.split(",").map((v) => v.trim()).filter(Boolean);
            if (!value) return [];
            return [String(value).trim()].filter(Boolean);
        }

        if (fieldName === "stats") {
            if (Array.isArray(value)) return value.map((v) => Number(v));
            if (typeof value === "string") {
                try {
                    const parsed = JSON.parse(value);
                    if (Array.isArray(parsed)) return parsed.map((v) => Number(v));
                } catch (e) {console.error(e)}
                return value.split(",").map((item) => Number(item.trim()));
            }
            if (!value) return [0, 0, 0, 0, 0, 0];
            return [Number(value)];
        }

        if (value === "on" || value === "true") return true;
        if (value === "false" || value === null) return false;
        return value;
    }, []);

    const onSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        setResult(prev => ({...prev, loading: true}));
        setResult(prev => ({...prev, error: null}));

        const formData = new FormData(form);
        const resultForm: Record<string, unknown> = {};

        try {inputs.forEach((field) => {
                const element = form.elements.namedItem(field) as HTMLInputElement | null;
                if (element && element.type === "checkbox") {
                    resultForm[field] = element.checked;
                    return;
                }
                resultForm[field] = normalizeValue(formData.get(field), field);
            });
            setResult(prev => ({...prev, values: {...prev.values, ...resultForm}}));

            const { error: updateError, data } = await supabase
                .from(enp+"s")
                .update(resultForm)
                .eq(enp+"_id", id)
                .select();

            if (updateError) throw updateError;
            await queryClient.invalidateQueries({ queryKey: [enp+"s"] });
            return { ok: true, data };

        } catch (err) {
            console.error(`Failed to Update [${(enp+"s").toUpperCase()}]:`, err);
            setResult(prev => ({...prev, error: (err as Error)?.message || `Failed to Update ${enp+"s"}`}));
            return { ok: false, error: err };

        } finally {setResult(prev => ({...prev, loading: false}))}
    }, [inputs, enp, id, normalizeValue, queryClient]);

    const onCreate = useCallback(async (customPayload: Record<string, unknown>) => {
        setResult(prev => ({...prev, loading: true}));
        setResult(prev => ({...prev, error: null}));

        try {
            const payload = {...(defaultValues ?? {}), ...(customPayload ?? {})}
            const { data, error: insertError } = await supabase
                .from(enp+"s")
                .insert([payload])
                .select();

            if (insertError) throw insertError;
            await queryClient.invalidateQueries({ queryKey: [enp+"s"] });
            return { ok: true, data };
        } catch (err) {
            console.error(`Failed to Create [${(enp+"s").toUpperCase()}]:`, err);
            setResult(prev => ({...prev, error: (err as Error)?.message || `Failed to Create ${enp+"s"}`}));
            return { ok: false, error: err };
        } finally {setResult(prev => ({...prev, loading: false}))}
    }, [enp, defaultValues, queryClient]);

    const onDelete = useCallback(async () => {
        setResult(prev => ({...prev, loading: true}))
        try {
            const { error: deleteError } = await supabase
                .from(enp+"s")
                .delete()
                .eq(enp+"_id", id);

            if (deleteError) throw deleteError;
            await queryClient.invalidateQueries({ queryKey: [enp+"s"] });
            return true;
        } catch (err) {
            console.error(`Failed to Delete [${(enp+"s").toUpperCase()}]:`, err);
            setResult(prev => ({...prev, error: (err as Error)?.message || `Failed to Delete ${enp+"s"}`}));
            return { ok: false, error: err };
        } finally {setResult(prev => ({...prev, loading: false}))}
    }, [enp, id, queryClient]);

    const setValue = useCallback((name: string, value: unknown) => {
        setResult(prev => ({ ...prev, values: {...(prev.values ?? {}), [name]: normalizeValue(value, name)}}));
    }, [normalizeValue]);

    const getValue = useCallback((name: string) => result?.values?.[name],  [result.values]);

    return {result, onCreate,onDelete,onSubmit,setValue,getValue}
}