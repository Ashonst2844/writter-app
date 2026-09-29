import Button from "./Button";
import { useState, useEffect, useRef } from "react";

interface SpeechSetting {
    voice: string;
    rate: number;
    pitch: number;
}

interface TextToSpeechProps {
    text: string;
    isLoadingText?: boolean;
}

export default function TextToSpeech({ text, isLoadingText = false }: TextToSpeechProps) {
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    const [setting, setSetting] = useState<SpeechSetting>({
        voice: "",
        rate: 1,
        pitch: 1,
    });

    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const currentChunkIndex = useRef<number>(0);
    const textChunks = useRef<string[]>([]);

    useEffect(() => {
        const updateVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            if (availableVoices.length === 0) return;

            setVoices(availableVoices);

            const defaultVoice =
                availableVoices.find((v) => v.lang.includes("id")) ||
                availableVoices.find((v) => v.lang.includes("en")) ||
                availableVoices[0];

            if (defaultVoice) {
                setSetting((prev) => ({
                    ...prev,
                    voice: prev.voice || defaultVoice.name,
                }));
            }
        };

        updateVoices();

        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            window.speechSynthesis.onvoiceschanged = updateVoices;
        }

        return () => {
            if (typeof window !== "undefined" && "speechSynthesis" in window) {
                window.speechSynthesis.onvoiceschanged = null;
            }
        };
    }, []);

    const splitTextIntoChunks = (rawText: string): string[] => {
        const cleanText = rawText.replace(/[\r\n]+/g, " ").trim();
        const chunks = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];
        return chunks.map((c) => c.trim()).filter((c) => c.length > 0);
    };

    const speakChunk = (index: number) => {
        if (index >= textChunks.current.length) {
            setIsSpeaking(false);
            currentChunkIndex.current = 0;
            return;
        }

        const chunkText = textChunks.current[index];
        const utterance = new SpeechSynthesisUtterance(chunkText);
        utteranceRef.current = utterance;

        const voiceObj = voices.find((v) => v.name === setting.voice);
        if (voiceObj) utterance.voice = voiceObj;

        const pitchValue = Number(setting.pitch);
        const rateValue = Number(setting.rate);

        utterance.pitch = Number.isFinite(pitchValue) && pitchValue > 0 ? pitchValue : 1;
        utterance.rate = Number.isFinite(rateValue) && rateValue > 0 ? rateValue : 1;

        utterance.onend = () => {
            currentChunkIndex.current = index + 1;
            speakChunk(currentChunkIndex.current);
        };

        utterance.onerror = (e) => {
            console.error("SpeechSynthesis Error:", e);
            setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
    };

    const handleToggleSpeak = () => {
        if (!("speechSynthesis" in window)) {
            alert("Browser kamu tidak mendukung fitur Text-to-Speech.");
            return;
        }

        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            currentChunkIndex.current = 0;
            return;
        }

        if (isLoadingText || !text || !text.trim()) {
            alert("Teks cerita belum selesai dimuat.");
            return;
        }

        window.speechSynthesis.cancel();

        textChunks.current = splitTextIntoChunks(text);
        currentChunkIndex.current = 0;

        if (textChunks.current.length === 0) return;

        setIsSpeaking(true);
        speakChunk(0);
    };

    return <div className="w-full h-12 flex gap-2">
        <Button use="button" type={isSpeaking ? "normal" : "alternate"} className="rounded-md p-4 disabled:opacity-50" onClick={handleToggleSpeak} disabled={isLoadingText || !text.trim()}>
            {isLoadingText ? "Loading Chapter..." : isSpeaking ? "Stop Reader" : "Chapter Reader"}
        </Button>

        <div className="flex gap-2 w-[40%]">
            <select title="Pitch" value={setting.pitch ?? 1} onChange={(e) => setSetting((prev) => ({...prev,pitch: parseFloat(e.target.value) || 1}))}>
                {[0.5, 1, 1.25, 1.5, 1.75, 2].map((pitch) => <option key={pitch} value={pitch}>
                    {pitch}
                </option>)}
            </select>
            <select title="Speed" value={setting.rate ?? 1} onChange={(e) => setSetting((prev) => ({...prev,rate: parseFloat(e.target.value) || 1}))}>
                {[0.5, 1, 1.25, 1.5, 1.75, 2].map((rate) => <option key={rate} value={rate}>
                    {rate}
                </option>)}
            </select>
            <select title="Voice" value={setting.voice ?? ""} onChange={(e) => setSetting((prev) => ({...prev,voice: e.target.value}))}className="p-2 text-sm bg-(--bg) text-(--text) rounded-md border border-(--text)/20 outline-none">
                {voices.map((voice) => <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                </option>)}
            </select>
        </div>
    </div>
}