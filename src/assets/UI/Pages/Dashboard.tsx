import Button from "../Components/Button";
import Breadcrumb from "../Components/Breadcrumb";
import Icon from "../Components/Icon";
import Modal from "../Components/Modal";
import Loading from "../Components/Loading";

import {Routes, Route, useParams, Navigate} from "react-router-dom"
import { useState, useRef, useEffect, type FormEvent, type ChangeEvent, lazy, Suspense } from "react";
import {type PinEntry, getPins, clearPins} from "../../Utils/Pinning";
import { askAI, type Chat } from "../../Utils/AIService";

const Timeline = lazy(() => import("./Timeline"))
const World = lazy(() => import("./World"))
const Character = lazy(() => import("./Character"))
const Goals = lazy(() => import("./Goals"))
const Event = lazy(() => import("./Event"))
const Relic = lazy(() => import("./Relic"))
const Library = lazy(() => import("./Library"))
const Note = lazy(() => import("./Note"))

interface ProjectData {
    project_id: string;
    name: string;
    created_at: string;
}

export type Profiles = {
    username: string;
    email: string;
    plan: "free"|"hobbies"|"professionals";
}

function Navigation({name, click, state}:{name:string, click:()=>void, state:boolean}) {
    const {id} = useParams<{id:string}>();

    const authValue = window.localStorage.getItem("auth");
    const user = authValue ? JSON.parse(authValue) : null;
    const user_id = user?.user?.id ?? ""

    const nav =["timeline-building","world-building","character-development","goals","events","relics","book-library","note"]
    
    return <nav className={`min-h-32 lg:h-full w-full overflow-hidden ${state?"lg:w-[20%] p-4":"lg:w-auto p-2"} bg-(--primary) flex flex-col gap-8 shadow-sm z-30 overflow-auto transition-all duration-150`}>
        <div className="flex h-12 lg:h-16"> {/* Title Header */}
            <div className={`w-[90%] block ${state?"lg:block":"lg:hidden"}`}>
                <span className="opacity-50">Project</span>
                <h1 className="text-2xl font-black uppercase">{name}</h1>
            </div>
            <Button label="Change Layout" type="custom" use="button" className={`bg-(--primary) hover:brightness-150 h-16 hidden lg:block ${state?"w-[10%]":"w-full"}`} onClick={click}>{state?'<':'>'}</Button>
        </div> {/* Navigation Header */}
        <div className="flex lg:flex-col overflow-x-auto">
            {nav.map((item, i)=><Button label={item} key={i} type="custom" target={`/projects/${user_id}/dashboard/${id}/${item}`} use="link" className={`rounded-md bg-(--primary) w-full inline-block text-xs hover:brightness-150 text-(--text) min-h-12 uppercase ${state?"p-4":"p-2"}`}>
                {state ? <p className="hidden lg:block">{(item.replace("-"," ") ?? "").toUpperCase()}</p> : <Icon scale="0.75" type="online" use={item} fill color="var(--text)"/>}
            </Button>)}
            <Button label="Back" type="custom" target={`/projects/${user_id}`} use="link" className={`rounded-md bg-(--primary) w-full inline-block text-xs hover:brightness-150 text-(--warning) uppercase ${state?"p-4":"p-2"}`}>
                {state?"Back":<Icon scale="0.75" type="online" use="exit" fill color="var(--warning)"/>}
            </Button>
        </div>
    </nav>
}

function Pin({pin}: {pin: PinEntry[]}) {
    const [showModal, setShowModal] = useState<boolean>(false)

    return <div className="w-full h-full overflow-y-auto relative">
        <div className="flex gap-2 fixed bottom-0 right-0 m-4 rounded-full z-50">
            {showModal && <Modal message={`Clear All Pinned? (${pin.length}) Pinned Found`} type="alert" onConfirm={() => {clearPins(); window.location.reload()}} onClose={() => setShowModal(false)}/> }
            <Button label="Clear Pinned" type="warning" use="button" onClick={(() => setShowModal(true))} className="w-24 rounded-md">Clear</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2 w-full h-full">
            {pin?.map((item, i) => <div key={i} className="bg-(--primary) overflow-auto group shadow-md rounded-2xl p-4 flex flex-col gap-4 break-inside-avoid mb-4">
                <h2 className="text-4xl font-black">{item?.title} </h2>
                <span className="opacity-75 text-(--accent)">{(item?.type ?? "").toUpperCase()}</span>
                <div dangerouslySetInnerHTML={{ __html: item?.content}} className={`p-4 bg-(--primary) border transition-all whitespace-pre-wrap leading-relaxed`}></div>
            </div>)}
        </div>
    </div>
}

function AI({profiles}: {profiles: Profiles}) {
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

export default function Dashboard({projects, profiles}:{projects:ProjectData[], profiles: Profiles}) {
    useEffect(() => {
        document.title = "Writer App | Dashboard"
    }, [])

    const { id } = useParams<{id:string}>();
    const projectName = id && projects.length > 0 ? projects.find(user => user.project_id === id)?.name : ""
    const projectId = id && projects.length > 0 ? projects.find(user => user.project_id === id)?.project_id : ""

    const [mode, setMode] = useState<boolean>(false)
    const [openOverlay, setOpenOverlay] = useState<null|"pin"|"chat">(null)

    const [pin, setPin] = useState<PinEntry[] | []>([])
    const handlePin = () => {
        setPin(getPins)
        setOpenOverlay("pin")
    }
    
    const handleChat = () => {
        setOpenOverlay("chat")
    }

    return <section className="w-screen h-screen flex flex-col lg:flex-row relative">
        
        {/*//* Widget Button */}
        <div className="absolute h-12 flex gap-2 top-0 right-0 m-4 z-50">
            <Button label="Pinned Widget" onClick={handlePin} type="normal" use="button" className="w-12 rounded-full shadow-md">
                <Icon type="online" use="pin" color="var(--text)" fill scale="0.75"/>
            </Button>
            <Button label="AI Companio Widget" onClick={handleChat} disabled={profiles?.plan==="free"} type="normal" use="button" className="w-12 rounded-full shadow-md">
                <Icon type="online" use="assistant" color="var(--text)" fill scale="0.75"/>
            </Button>
        </div>

        {/*//* Overlay */}
        {openOverlay && <div className="absolute w-screen h-screen bg-black/75 z-60 p-4 overflow-hidden">
            <Button label="Close" type="warning" use="button" onClick={() => setOpenOverlay(null)} className="z-70 w-12 h-12 absolute top-0 right-0 m-4 rounded-md">
                <Icon type="normal" use="cancel" color="var(--text)" width={6}/>
            </Button>
            {openOverlay=="pin"?<Pin pin={pin}/>:openOverlay=="chat"?<AI profiles={profiles}/>:null}
        </div>}

        <Navigation name={projectName ?? ""} click={() => setMode(prev => !prev)} state={mode}/>
        <div className={`h-[calc(100%-12rem)] lg:h-full w-full ${mode?"lg:w-[80%]":"lg:w-[95%]"}`}>
            <Breadcrumb/>
            <div className="h-full lg:h-[90%] w-full overflow-y-scroll">
                <Suspense fallback={<Loading message="Section"/>}>
                </Suspense>
                <Routes>
                    <Route index element={<Navigate to="timeline-building" replace />} />
                    <Route path={`timeline-building`} element={<Timeline project_id={projectId ?? ""} profiles={profiles}/>}/>
                    <Route path={`world-building/*`} element={<World project_id={projectId ?? ""} profiles={profiles}/>} />
                    <Route path={`character-development/*`} element={<Character project_id={projectId ?? ""} profiles={profiles}/>}/>
                    <Route path={`goals`} element={<Goals project_id={projectId ?? ""} profiles={profiles}/>}/>
                    <Route path={`events/*`} element={<Event project_id={projectId ?? ""} profiles={profiles}/>}/>
                    <Route path={`relics/*`} element={<Relic project_id={projectId ?? ""} profiles={profiles}/>}/>
                    <Route path={`book-library/*`} element={<Library project_id={projectId ?? ""} profiles={profiles}/>}/>
                    <Route path={`note/*`} element={<Note project_id={projectId ?? ""} profiles={profiles}/>}/>
                </Routes>
            </div>
        </div>
    </section>
}