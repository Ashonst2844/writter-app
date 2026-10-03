import { SYSTEM_PROMPT } from "./AIPromt";
import { GoogleGenAI } from "@google/genai";

export interface Chat {
    role: "user"|"model";
    text: string|undefined;
}

export async function askAI(message: string, history: Chat[]) {
    const apiKey = import.meta.env.VITE_GEMINI_AI_KEY;
    if (!apiKey) throw new Error("VITE_GEMINI_AI_KEY belum dikonfigurasi di file .env");

    const ai = new GoogleGenAI({ apiKey });

    const formattedContents = [
        ...history.map((msg) => ({
            role: msg.role === "model" ? "model" : "user",
            parts: [{ text: msg.text }],
        })),
        { role: "user", parts: [{ text: message }] },
    ];

    const candidateModels = [
        "gemini-3.5-flash-lite",
        "gemini-3.6-flash",
        "gemini-3.8-flash"
    ];

    let lastError: any = null;

    for (const modelName of candidateModels) {
        for (let attempt = 1; attempt <= 5; attempt++) {
            try {
                const response = await ai.models.generateContent({
                    model: modelName,
                    contents: formattedContents,
                    config: {
                        systemInstruction: SYSTEM_PROMPT,
                    },
                });

                if (response) {
                    return response;
                }
            } catch (error: any) {
                lastError = error;
                const errorMsg = error?.message || JSON.stringify(error) || "";
                const is503 = errorMsg.includes("503") || errorMsg.includes("UNAVAILABLE") || errorMsg.includes("high demand");

                if (is503) {
                    const delay = attempt * 1500;
                    console.warn(`[Gemini API] Model ${modelName} sibuk (503). Mencoba ulang (${attempt}/5) dalam ${delay}ms...`);
                    await new Promise((resolve) => setTimeout(resolve, delay));
                    continue;
                }

                if (errorMsg.includes("404") || errorMsg.includes("NOT_FOUND")) {
                    console.warn(`[Gemini API] Model ${modelName} tidak ditemukan (404). Beralih ke model alternatif...`);
                    break;
                }

                throw error;
            }
        }
    }

    console.error("[Gemini API Error Detail]:", lastError);
    throw new Error(
        lastError?.message || "Server Gemini sedang mengalami antrean tinggi. Silakan klik tombol kirim sekali lagi."
    );
}