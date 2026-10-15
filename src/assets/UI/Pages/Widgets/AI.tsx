import Button from "../../Components/Button";
import Modal from "../../Components/Modal";
import Icon from "../../Components/Icon";

import { useState, useRef, useEffect, type FormEvent, type ChangeEvent } from "react";
import { askAI, type Chat } from "../../../Utils/AIService"
import { type Profiles } from "../Dashboard";

export default function AI({profiles}: {profiles: Profiles}) {
    const [showModal, setShowModal] = useState<boolean>(false)

    const [input, setInput] = useState<string>("");
    const [messages, setMessages] = useState<Chat[]>(() => {
        const savedChat = window.localStorage.getItem("ai-chat-history")
        if(savedChat) {
            try { return JSON.parse(savedChat) } 
            catch (err) { console.error("Failed Get Chat History!") }
        } return [{role: "model", text: "Halo! Saya Writer Companion ✍️. Butuh inspirasi cerita atau panduan menggunakan fitur di aplikasi ini?"}]
    });
    const [loading, setLoading] = useState<boolean>(false);

    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        ref?.current?.scrollIntoView({behavior:"smooth"}) ?? null
        localStorage.setItem("ai-chat-history", JSON.stringify(messages));
    }, [messages, loading])

    const handleSend = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userText = input;
        setInput("");

        const newMessages: Chat[] = [...messages, { role: "user", text: userText }];
        setMessages(newMessages);
        setLoading(true);

        try {
            const reply = await askAI(userText, messages);
            setMessages([...newMessages, { role: "model", text: reply?.text }]);
        } catch (err) {
            console.error("Detail Error:", err);
            setMessages([...newMessages, { role: "model", text: "Maaf, terjadi masalah koneksi ke AI." }]);
        } finally {
            setLoading(false);
        }
    };

    const clearHistory = () => {
        window.localStorage.removeItem("ai-chat-history")
        setMessages([{role: "model", text: "Halo! Saya Writer Companion ✍️. Butuh inspirasi cerita atau panduan menggunakan fitur di aplikasi ini?"}])
    }

    return <div className="w-full h-full grid grid-cols-1 md:grid-cols-2">
        <div className="flex gap-2 fixed bottom-0 right-0 m-4 rounded-full z-50">
            {showModal && <Modal message={`Clear All Your Chat History?`} type="alert" onConfirm={() => {clearHistory(); window.location.reload()}} onClose={() => setShowModal(false)}/> }
            <Button label="Clear Chat History" type="warning" use="button" onClick={(() => setShowModal(true))} className="rounded-md">Clear Chat</Button>
        </div>
        <div className="w-full h-150 bg-(--primary) rounded-xl p-4 flex flex-col gap-2">
            <div className="w-full min-h-0 flex-1 rounded-lg bg-(--bg) overflow-y-auto shadow-inner p-4 flex gap-2 flex-col">
                {messages?.map((item, i) => {
                    const isUser = item.role === "user";
                    const senderName = isUser 
                        ? (profiles?.username ? `${profiles.username} (You)` : "YOU")
                        : "COMPANION";

                    return <div key={i} className={`max-w-[85%] rounded-2xl px-4 py-2.5 flex flex-col gap-1 shadow-xs transition-all ${
                        isUser? "self-end bg-(--accent) text-white rounded-br-xs": "self-start bg-(--primary) text-(--text) rounded-bl-xs border border-(--text)/10"
                    } ${i===0?"mt-auto":""}`}>
                        <strong className="opacity-75">{senderName.toUpperCase()}</strong>
                        <p className="whitespace-pre-wrap wrap-break-words">{item.text}</p>
                    </div>})} 
                {loading && <div className="self-start max-w-[80%] px-4 py-3 bg-(--primary) rounded-2xl rounded-bl-xs border border-(--accent)/20 animate-pulse">
                    <p className="text-xs opacity-75 font-medium">Companion sedang mengetik...</p>
                </div>}
                <div ref={ref} />
            </div>
            <form onSubmit={handleSend} className="flex gap-2 w-full h-11 shrink-0">
                <input type="text" value={input} onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)} disabled={loading} className="flex-1 rounded-lg bg-(--bg) px-4 py-2 text-sm text-(--text) border border-(--text)/10 focus:outline-none focus:ring-2 focus:ring-(--accent) disabled:opacity-50 transition-all placeholder:text-sm" placeholder="Tanyakan ide cerita atau fitur aplikasi..."/>
                <button aria-label="Send Button" type="submit" disabled={loading || !input.trim()} className="px-4 h-full bg-(--accent) text-white rounded-lg hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center shrink-0 cursor-pointer">
                    {loading ? "..." : <Icon type="normal" use="submit" color="white" fill width={1} />}
                </button>
            </form>
        </div>
    </div>
}