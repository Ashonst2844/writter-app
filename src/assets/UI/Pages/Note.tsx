import Card from "../Components/Card";
import Button, { BackButton } from "../Components/Button";
import Editable from "../Components/Editable";
import Icon from "../Components/Icon";
import Loading from "../Components/Loading";
import Badge from "../Components/Badge";
import Error from "../Components/Error";
import Modal from "../Components/Modal";

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
    tags:string[] | null;
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
        <div className="h-full flex flex-col justify-between">
            <h2 className="text-xl md:text-4xl font-black capitalize">{props.title}</h2>
            <div className="flex gap-2 w-auto">
                {props.tags?.map((item, i)=><Badge key={i} content={item}/>)}
            </div>
            {showModal && <Modal message={`Delete ${props.title}?`} type="warning" onConfirm={async () => { await onDelete(); }} onClose={() => setShowModal(false)}/>}
            <div className='flex w-full h-12 justify-end gap-2'>
                <Button label={"Delete "+props.title} onClick={() => setShowModal(true)} type='warning' use="button" target={Slug(props.title)} className='rounded-md w-12'>
                    <Icon type="online" use="trash" width={3} color="white" fill/>
                </Button>
                <Button label={pinned?"Unpin Note " + props.title : "Pin Note " + props.title} type={pinned ? "normal" : "alternate"} use='button' className='rounded-md w-12' onClick={handlePin}>
                    <Icon type="online" use="pin" color={pinned ? "var(--text)" : "var(--primary)"} fill/>
                </Button>
                <Button label={"Open "+props.title} type='normal' use='link' target={Slug(props.title)} className='rounded-md w-12'>
                    <Icon type="online" use="eye" fill color="var(--text)"/>
                </Button>
            </div>
        </div>
    </Card>
}

function NotePage({props}: {props: NoteProps[]}) {
    const { slug } = useParams<{ slug: string }>()
    const note = props.find((item) => Slug(item.title) === slug)
    
    const { result, onSubmit, setValue, getValue } = useForm({inputs:['title','content','tags'], enp:'note', id:note?.note_id||""})
    
    const [mode, setMode] = useState<boolean>(false)

    useEffect(()=>{
        if (!note) return
        setValue('title', note.title)
        setValue('content', note.content)
        setValue('tags', note.tags ?? [])
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
            <span className="text-xs text-neutral-500 mt-2 block">Masukkan Tags (Pisahkan dengan Koma(,))</span>
            <Editable type="input" name="tags" editMode={mode} onChange={(v)=>setValue('tags', v)} text={Array.isArray(getValue('tags')) ? (getValue('tags') as string[]).join(",") : (note.tags ?? []).join(",")} className="bg-(--primary) p-2 w-[50%] rounded-xl"/>

            <div className="flex h-12 justify-end gap-2">
                <Button label="Cancel" type="warning" use="button" className='rounded-md w-12' onClick={()=>{
                    setMode(false)
                    setValue('title', note.title)
                    setValue('content', note.content)
                    setValue('tags', note.tags ?? [])
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
        <BackButton/>
    </form>
}

export default function Note({project_id, profiles}: {project_id: string, profiles: Profiles}) {
    const {data, isLoading, error} = useFetch<NoteProps>("notes", '', {
        eq: {project_id: project_id}
    })
    const [searchQ, setSearchQ] = useState<string>("")

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
    return <section className="w-full h-full flex flex-col gap-4">
        <Routes>
            <Route path="/" element={<div className="flex flex-col gap-4">
                <div className="w-full h-12 flex">
                    <input autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck="false" value={searchQ} onChange={(e: ChangeEvent<HTMLInputElement>) => 
                        setSearchQ(e.target.value)
                    } type="text" placeholder="Search notes..." className="w-full h-full bg-(--primary) p-4 m-4 rounded-xl"/>
                </div>
                <div className="grid gap-4 lg:grid-cols-2 p-4">
                    {data.map((item)=><NoteAccordion key={item.note_id} {...item}/>)}
                    <div className="min-h-40 md:min-h-60 w-full bg-(--primary) shadow-2xl rounded-2xl overflow-hidden">
                        <form onClick={handleCreate} className="h-full w-full p-4 flex flex-col hover:bg-(--accent) center transition-colors transition-300">
                            <span>{data.length} / {maxNote}</span>
                            <span className="text-white text-2xl"><code>+</code> Create New Character</span>
                        </form>
                    </div>
                </div>
            </div>}/>
            <Route path=":slug" element={<NotePage props={data}/>}/>
        </Routes>
    </section>
}