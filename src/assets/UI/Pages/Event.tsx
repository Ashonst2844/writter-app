import Card from "../Components/Card";
import Button from "../Components/Button";
import Editable from "../Components/Editable";
import Icon from "../Components/Icon";
import Loading from "../Components/Loading";
import Badge from "../Components/Badge";
import Modal from "../Components/Modal";
import Error from "../Components/Error";

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Routes, Route, useParams } from "react-router-dom"
import { useFetch } from "../../Hooks/useFetch"
import { useForm } from "../../Hooks/useForm";
import Pinning, {getPins} from "../../Utils/Pinning";

interface EventProps {
    event_id:string;
    title:string | null;
    content:string | null;
    tags:string[] | null;
}

const createSlug = (text: string | null | undefined) => {
    if (!text) return "Untitled";
    return text.toLowerCase().trim().replaceAll(" ","-");
};

function EventAccordion(props: EventProps) {
    const slug = createSlug(props.title)
    const {onDelete} = useForm([], "event", props.event_id)
    const [showModal, setShowModal] = useState<boolean>(false)

    const [pinned, setPinned] = useState<boolean>(() => getPins().some((item) => item.id === props.event_id && item.type === "Event"))

    const handlePin = () => {
        Pinning(props?.title || "", props?.content || "", "Event", props?.event_id)
        setPinned(prev => !prev)
    }

    return <Card>
        <div className="h-full flex flex-col justify-between">
            <h2 className="text-4xl font-black capitalize">{slug.replaceAll("-", " ")}</h2>
            <div className="flex gap-2 w-auto">
                {props.tags?.map((item, i)=><Badge key={i} content={item}/>)}
            </div>
            {showModal && <Modal message={`Delete ${props.title}?`} type="warning" onConfirm={async () => { await onDelete(); }} onClose={() => setShowModal(false)}/>}
            <div className='flex w-full h-12 justify-end gap-2'>
                <Button onClick={() => setShowModal(true)} type='warning' use="button" target={slug} className='rounded-md w-12'>
                    <Icon type="online" use="trash" width={3} color="white" fill/>
                </Button>
                <Button type={pinned ? "normal" : "alternate"} use='button' className='rounded-md w-12' onClick={handlePin}>
                    <Icon type="online" use="pin" color={pinned ? "var(--text)" : "var(--primary)"} fill/>
                </Button>
                <Button type='normal' use='link' target={slug} className='rounded-md w-12'>
                    <Icon type="online" use="eye" color="white" fill/>
                </Button>
            </div>
        </div>
    </Card>
}

function EventPage({props, error}: {props: EventProps[]; error: Error | null}) {
    const { slug } = useParams<{ slug: string }>()
    const event = props.find((item) => createSlug(item.title) === slug)
    
    const { onSubmit, loading, setValue, getValue } = useForm(['title','content','tags'], 'event', event?.event_id ?? "")

    const [mode, setMode] = useState<boolean>(false)

    useEffect(()=>{
        if (!event) return
        setValue('title', event.title)
        setValue('content', event.content)
        setValue('tags', event.tags ?? [])
    }, [event, setValue])

    const htmlContent = (getValue('content') as string) ?? ""

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res = await onSubmit(e);
        if (res?.ok) setMode(false);
    }

    if (loading) return <Loading message="Events"/>
    if (error || !event) return <Error err={error || "Event not found!"}/>
    return <form onSubmit={handleSubmit} className="w-full h-full p-4 flex flex-col gap-4">
        <input type="hidden" name="content" value={htmlContent}/>
        <Editable type="input" name="title" editMode={mode} text={(getValue('title') as string) ?? event.title} onChange={(v)=>setValue('title', v)} className="text-4xl font-bold">
            <h2 className="text-4xl font-bold">{(getValue('title') as string) ?? event.title}</h2>
        </Editable>

        <Editable type="richedit" text={htmlContent} onChange={(html) => setValue("content", html)} editMode={mode} onClick={() => setMode(true)}/>
        {mode? <>            
            <span className="text-xs text-neutral-500 mt-2 block">Masukkan Tags (Pisahkan dengan Koma(,))</span>
            <Editable type="input" name="tags" editMode={mode} onChange={(v)=>setValue('tags', v)} text={Array.isArray(getValue('tags')) ? (getValue('tags') as string[]).join(",") : (event.tags ?? []).join(",")} className="bg-(--primary) p-2 w-[50%] rounded-xl">
                {Array.isArray(getValue('tags')) ? (getValue('tags') as string[]).join(",") : (event.tags ?? []).join(",")}
            </Editable>

            <div className="flex h-12 justify-end gap-2">
                <Button type="warning" use="button" className='rounded-md w-12' onClick={()=>{
                    setMode(false)
                    setValue('title', event.title)
                    setValue('content', event.content)
                    setValue('tags', event.tags ?? [])
                }}>
                    <Icon type="normal" use="cancel" color="white" width={6}/>
                </Button>
                <Button type='normal' use='submit' className='rounded-md w-12'>
                    <Icon type="normal" use="submit" color="white" fill/>
                </Button>
            </div>
        </>
        : <div>
            <div onClick={() => setMode(true)} dangerouslySetInnerHTML={{ __html: htmlContent }} className="p-4 bg-(--primary) border hover:border-white cursor-pointer transition-all whitespace-pre-wrap leading-relaxed"/>
            <span className="text-xs text-neutral-500 mt-2 block">Klik teks untuk mengedit & meformat</span>
        </div>}
    </form>
}

export default function Event() {
    const {data, isLoading, error} = useFetch<EventProps>("events", 'event_id, title, content, tags')
    const [searchQ, setSearchQ] = useState<string>("")

    const { onCreate } = useForm([], 'event', "", {
        title: "Event Title",
        content: "Write Description"
    })

    if (isLoading) return <Loading message="Events"/>
    if (error || !data) return <Error err={error || "Event not found!"}/>
    return <section className="w-full h-full flex flex-col gap-4">
        <div className="w-full h-12 flex">
            <input autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck="false" value={searchQ} onChange={(e: ChangeEvent<HTMLInputElement>) => 
                setSearchQ(e.target.value)
            } type="text" placeholder="Search event..." className="w-full h-full bg-(--primary) p-4 m-4 rounded-xl"/>
        </div>
        <Routes>
            <Route path="/" element={<div className="grid gap-4 lg:grid-cols-2 p-4">
                {data.map((item) => item.title?.includes(searchQ) && <EventAccordion key={item.event_id} {...item}/>)}
                <div className="h-full w-full bg-(--primary) shadow-2xl rounded-2xl overflow-hidden">
                    <form onClick={onCreate} className="h-full hover:bg-(--accent) center p-4 transition-colors transition-300">
                        <span className="text-white text-2xl"><code>+</code> Create New Event</span>
                    </form>
                </div>
            </div>}/>
            <Route path=":slug" element={<EventPage props={data} error={error}/>}/>
        </Routes>
    </section>
}