import { useCallback, useState, type FormEvent } from "react";
import { supabase } from "../Utils/supabase";
import { useQueryClient } from "@tanstack/react-query";

export function useForm(inputs: string[], enp: string, id: string, defaultValues?: Record<string, unknown>) {
    const [values, setValues] = useState<Record<string, unknown>>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | string | null>(null);
    const queryClient = useQueryClient();

    const tableName = `${enp}s`;
    const key = `${enp}_id`

    const normalizeValue = useCallback((value: unknown, fieldName?: string) => {
        if (fieldName === "tags") {
            if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
            if (typeof value === "string") return value.split(",").map((item) => item.trim()).filter(Boolean);
            if (!value) return [];
            return [String(value).trim()].filter(Boolean);
        }

        if (fieldName === "stats") {
            if (Array.isArray(value)) return value.map((v) => Number(v));
            if (typeof value === "string") {
                try {
                    const parsed = JSON.parse(value);
                if (Array.isArray(parsed)) return parsed.map((v) => Number(v));
                } catch (e) {
                    console.error(e);
                }
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
        setLoading(true);
        setError(null);

        const formData = new FormData(form);
        const resultForm: Record<string, unknown> = {};

        try {
            inputs.forEach((field) => {
                const element = form.elements.namedItem(field) as HTMLInputElement | null;
                if (element && element.type === "checkbox") {
                    resultForm[field] = element.checked;
                    return;
                }
                resultForm[field] = normalizeValue(formData.get(field), field);
            });

            setValues((prev) => ({ ...prev, ...resultForm }));

            const { error: updateError, data } = await supabase
                .from(tableName)
                .update(resultForm)
                .eq(key, id)
                .select();

            if (updateError) throw updateError;

            await queryClient.invalidateQueries({ queryKey: [tableName] });

            return { ok: true, data };
        } catch (err) {
            console.error(`Gagal update ${tableName}:`, err);
            setError((err as Error)?.message || "Gagal mengedit data");
            return { ok: false, error: err };
        } finally {
            setLoading(false);
        }
    }, [inputs, key, tableName, id, normalizeValue, queryClient]);

    const onCreate = useCallback(async (customPayload: Record<string, unknown>) => {
        setLoading(true);
        setError(null);

        try {
            const payload = {
                ...(defaultValues ?? {}),
                ...(customPayload ?? {})
            };
            const { data, error: insertError } = await supabase
                .from(tableName)
                .insert([payload])
                .select();

            if (insertError) throw insertError;
            await queryClient.invalidateQueries({ queryKey: [tableName] });
            return { ok: true, data };
        } catch (err) {
            console.error(`Gagal membuat ${tableName}:`, err);
            setError((err as Error)?.message || `Gagal membuat ${tableName}`);
            return { ok: false, error: err };
        } finally {
            setLoading(false);
        }
    }, [tableName, defaultValues, queryClient]);

    const onDelete = useCallback(async () => {
        setLoading(true);
        try {
            const { error: deleteError } = await supabase
                .from(tableName)
                .delete()
                .eq(key, id);

            if (deleteError) throw deleteError;
            await queryClient.invalidateQueries({ queryKey: [tableName] });
            return true;
        } catch (err) {
            console.error("Failed To Delete:", err);
            return false;
        } finally {
            setLoading(false);
        }
    }, [tableName, key, id, queryClient]);

    const setValue = useCallback((name: string, value: unknown) => {
        setValues((prev) => ({ ...prev, [name]: normalizeValue(value, name) }));
    }, [normalizeValue]);

    const getValue = useCallback((name: string) => values[name], [values]);

    const submitField = useCallback(async (name: string, value?: unknown) => {
        setLoading(true);
        setError(null);
        let v = value !== undefined ? value : values[name];
        v = normalizeValue(v, name);
        const payload = { [name]: v };

        try {
            setValues((prev) => ({ ...prev, ...payload }));
            const { error: updateError, data } = await supabase
                .from(tableName)
                .update(payload)
                .eq(key, id)
                .select();

            if (updateError) throw updateError;
            await queryClient.invalidateQueries({ queryKey: [tableName] });
            return { ok: true, data };
        } catch (err) {
            console.error(`Gagal update field ${name}:`, err);
            setError((err as Error)?.message || `Gagal mengedit field ${name}`);
            return { ok: false, error: err };
        } finally {
            setLoading(false);
        }
    }, [tableName, key, id, normalizeValue, values, queryClient]);

    return {onCreate,onDelete,onSubmit,loading,error,values,setValue,getValue,submitField,}
}