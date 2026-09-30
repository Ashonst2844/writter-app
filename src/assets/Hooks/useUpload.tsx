// src/Hooks/useUpload.ts
import { useState, type ChangeEvent } from "react";
import { supabase } from "../Utils/supabase";

export function useUpload(bucket: string) {
    const [uploading, setUploading] = useState(false);
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    const upload = async (e: ChangeEvent<HTMLInputElement>): Promise<string | null> => {
        const file = e.target.files?.[0];
        if (!file) return null;

        try {
            setUploading(true);

            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error } = await supabase.storage
                .from(bucket)
                .upload(filePath, file);

            if (error) throw error;

            const { data: publicData } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            const url = publicData.publicUrl;
            setFileUrl(url);
            
            return url;
        } catch (err: unknown) {
            alert(`Failed to upload: ${err}`);
            return null;
        } finally {
            setUploading(false);
        }
    };

    return { upload, uploading, fileUrl };
}