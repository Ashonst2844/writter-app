import { useMemo } from "react";

export interface TextStats {
    wordCount: number;
}

export function useWordCounter(htmlContent: string): TextStats {
    const doc = htmlContent ? new DOMParser().parseFromString(htmlContent, 'text/html') : new DOMParser().parseFromString('', 'text/html');
    const plainText = doc.body.textContent || "";

    const trimmedText = plainText.trim();

    const words = trimmedText ? trimmedText.split(/\s+/) : [];

    const wordCount = useMemo(() => { return words.length }, [words.length]);

    return { wordCount };
}