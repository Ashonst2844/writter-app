import Card from "../Components/Card";
import Button from "../Components/Button";
import Editable from "../Components/Editable";
import Icon from "../Components/Icon";
import Loading from "../Components/Loading";
import Error from "../Components/Error";
import Modal from "../Components/Modal";
import Header from "../Components/Header";

import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { Routes, Route, useParams } from "react-router-dom"
import { useFetch } from "../../Hooks/useFetch"
import { useForm } from "../../Hooks/useForm";
import { type Profiles } from "./Dashboard";

import Pinning, { getPins } from "../../Utils/Pinning";
import { Slug } from "../../Utils/Sanitizer";

interface NoteProps {
    note_id:string;
    title:string | null;
    content:string | null;
    label:string | null;
}

function NoteAccordion(props: NoteProps) {
    const {onDelete} = useForm({inputs:[], enp:"note", id:props?.note_id})
    const [pinned, setPinned] = useState<boolean>(() => getPins().some((item) => item.id === props.note_id && item.type === "Note"))
    const [showModal, setShowModal] = useState<boolean>(false)

    const handlePin = () => {
        Pinning(props?.title || "", props?.content || "", "Note", props?.note_id)
        setPinned(prev => !prev)
    }

    return <Card>
        <div className="h-full flex flex-col gap-2 relative">
            <h2 className="text-xl md:text-2xl font-black capitalize">{props.title}</h2>
            <span className="text-xl text-(--accent) font-bold">{props?.label}</span>
            {showModal && <Modal message={`Delete ${props.title}?`} type="warning" onConfirm={async () => { await onDelete(); }} onClose={() => setShowModal(false)}/>}
            <Button label={pinned?"Unpin Note " + props.title : "Pin Note " + props.title} type="custom" use='button' className='absolute bottom-0 left-0' onClick={handlePin}>
                <Icon type="online" use="pin" color={pinned ? "var(--accent)" : "var(--text)"} fill className="opacity-50 hover:opacity-100"/>
            </Button>
            <div className="absolute bottom-0 right-0 flex gap-2">
                <Button label={"Delete "+props.title} onClick={() => setShowModal(true)} type='custom' use="button" target={Slug(props.title)} className='w-12'>
                    <Icon type="online" use="trash" width={3} color="var(--warning)" fill className="opacity-50 hover:opacity-100"/>
                </Button>
                <Button label={"Open "+props.title} type='normal' use='link' target={Slug(props.title)} className='rounded-md w-24 h-12'>Open</Button>
            </div>
        </div>
    </Card>
}

function NotePage({props, opt}: {props: NoteProps[], opt: string[]}) {
    const { slug } = useParams<{ slug: string }>()
    const note = props.find((item) => Slug(item.title) === slug)
    
    const { result, onSubmit, setValue, getValue } = useForm({inputs:['title','content','label'], enp:'note', id:note?.note_id||""})
    
    const [mode, setMode] = useState<boolean>(false)

    useEffect(()=>{
        if (!note) return
        setValue('title', note.title)
        setValue('content', note.content)
        setValue('label', note.label ?? "")
    }, [note, setValue])

    const htmlContent = (getValue('content') as string) ?? ""

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res = await onSubmit(e);
        if (res?.ok) setMode(false);
    }

    if (result.loading) return <Loading message="Note"/>
    if (result.error || !note) return <Error err={result.error || "Note not found!"}/>
    return <form onSubmit={handleSubmit} className="w-full h-full p-4 flex flex-col gap-4 relative">
        <input type="hidden" name="content" value={htmlContent}/>
        <Editable type="input" name="title" editMode={mode} text={(getValue('title') as string) ?? note.title} onChange={(v)=>setValue('title', v)} className="text-xl md:text-4xl font-bold">
            <h2 className="text-xl md:text-4xl font-bold">{(getValue('title') as string) ?? note.title}</h2>
        </Editable>

        <Editable type="richedit" text={htmlContent} onChange={(html) => setValue("content", html)} editMode={mode} onClick={() => setMode(true)}/>
        {mode? <>            
            <span className="text-xs text-neutral-500 mt-2 block">Masukkan label</span>
            <Editable type="input" name="label" editMode={mode} onChange={(v)=>setValue('label', v)} text={getValue('label') as string ?? note.label} option={opt} className="bg-(--primary) p-2 w-[50%] rounded-xl"/>

            <div className="flex h-12 justify-end gap-2">
                <Button label="Cancel" type="warning" use="button" className='rounded-md w-12' onClick={()=>{
                    setMode(false)
                    setValue('title', note.title)
                    setValue('content', note.content)
                    setValue('label', note.label ?? "")
                }}>
                    <Icon type="normal" use="cancel" width={6} color="var(--text)"/>
                </Button>
                <Button label="Submit" type='normal' use='submit' className='rounded-md w-12'>
                    <Icon type="normal" use="submit" width={3} fill color="var(--text)"/>
                </Button>
            </div>
        </>
        : <div>
            <div onClick={() => setMode(true)} dangerouslySetInnerHTML={{ __html: htmlContent }} className="p-4 bg-(--primary) border hover:border-white cursor-pointer transition-all whitespace-pre-wrap leading-relaxed"/>
            <span className="text-xs text-neutral-500 mt-2 block">Klik teks untuk mengedit & meformat</span>
        </div>}
    </form>
}

export default function Note({project_id, profiles}: {project_id: string, profiles: Profiles}) {
    const {data, isLoading, error} = useFetch<NoteProps>("notes", '', {
        eq: {project_id: project_id}
    })
    const [searchQ, setSearchQ] = useState<string>("")

    const labelQuery = [...new Set(data?.map(q => q.label?.trim()?.toLowerCase())?.filter((label): label is string => Boolean(label)))]
    const [filter, setFilter] = useState<string|"All">("All")

    const maxNote = profiles?.plan === "free" ? 20 : 40
    const { onCreate } = useForm({inputs:[], enp:"note", id:data.length > 0 ? data[0]?.note_id : ''})
    const handleCreate = async () => {
        if (data.length < maxNote) {
            const res = await onCreate({
                project_id: project_id,
                title: "Note Title",
                content: "Write Description"
            })
            if(res.ok) console.log("Created Succesed!")
        } else alert("Your Reach Maximum Note!")
    } 

    if (isLoading) return <Loading message="Notes"/>
    if (error || !data) return <Error err={error || "Notes not found!"}/>
    return <section className="w-full h-full relative">
        <Header title="Note" desc="Create And Write Brainstormed Notes!" profiles={profiles}/>
        <div className="px-8">
            <div className="min-h-screen w-full flex flex-col py-4 border-x-2 border-neutral-700">
                <Routes>
                    <Route path="/" element={<div className="flex flex-col gap-2">
                        <div className="w-full h-12 flex">
                            <input autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck="false" value={searchQ} onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQ(e.target.value)} type="text" placeholder="Search notes..." className="w-full h-full p-4 border-y-2 border-neutral-700"/>
                        </div>
                        <div className="w-full flex gap-2 p-2 border-y-2 border-neutral-700">
                            <Button label="Filter All" type="custom" use="button" onClick={() => setFilter("All")} className={`p-2 h-12 rounded-md min-w-12 center outline-2 outline-(--accent) hover:brightness-125 cursor-pointer ${filter==="All"?"bg-(--accent)":"bg-(--accent)/25"}`}>All</Button>
                            {labelQuery?.map((q, i) => <Button key={i} label={`Filter ${q}`} type="custom" use="button" onClick={() => setFilter(q)} className={`p-2 h-12 rounded-md min-w-12 center outline-2 outline-(--accent) hover:brightness-125 cursor-pointer ${filter.toLowerCase()===q.toLowerCase()?"bg-(--accent)":"bg-(--accent)/25"}`}>{q.toUpperCase()}</Button>)}
                        </div>
                        <div className="grid gap-4 lg:grid-cols-2">
                            {filter.toLowerCase() === "all" ? data?.map((item) => (item?.title && item.title.toLowerCase().includes(searchQ?.toLowerCase())) ? <NoteAccordion key={item.note_id} {...item}/> : null) : 
                            data?.filter(note => note?.label?.toLowerCase() === filter?.toLowerCase())?.map(item => (item?.title && item.title.toLowerCase().includes(searchQ?.toLowerCase())) ? <NoteAccordion key={item.note_id} {...item}/> : null) }
                            <div className="min-h-60 w-full bg-(--primary) shadow-2xl overflow-hidden border-y-2 border-neutral-700">
                                <form onClick={handleCreate} className="h-full w-full flex-col hover:bg-(--accent) center">
                                    <span>{data.length} / {maxNote}</span>
                                    <span className="text-white text-2xl"><code>+</code> Create New Character</span>
                                </form>
                            </div>
                        </div>
                    </div>}/>
                    <Route path=":slug" element={<NotePage props={data} opt={labelQuery}/>}/>
                </Routes>
            </div>
        </div>
    </section>
}