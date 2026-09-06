import Card from "../Components/Card";
import Button from "../Components/Button";
import Editable from "../Components/Editable";
import Icon from "../Components/Icon";
import Loading from "../Components/Loading";
import Badge from "../Components/Badge";

import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { Routes, Route, useParams } from "react-router-dom"
import { useFetch } from "../../Hooks/useFetch"
import { useForm } from "../../Hooks/useForm";

import Pinning, { getPins } from "../../Utils/Pinning";

interface NoteProps {
    note_id:string;
    title:string | null;
    content:string | null;
    tags:string[] | null;
}

const createSlug = (text: string | null | undefined) => {
    if (!text) return "Untitled";
    return text.toLowerCase().trim().replaceAll(" ","-");
};

function NoteAccordion(props: NoteProps) {
    const slug = createSlug(props.title)
    const {onDelete} = useForm([], "note", props.note_id)
    const [pinned, setPinned] = useState(() =>
        getPins().some((item) => item.id === props.note_id && item.type === "Note")
    )

    const handlePin = () => {
        Pinning(props?.title || "", props?.content || "", "Note", props?.note_id)
        setPinned(true)
    }

    return <Card>
        <div className="h-full flex flex-col justify-between">
            <h2 className="text-4xl font-black capitalize">{props.title}</h2>
            <div className="flex gap-2 w-auto">
                {props.tags?.map((item, i)=><Badge key={i} content={item}/>)}
            </div>
            <div className='flex w-full h-12 justify-end gap-2'>
                <Button onClick={onDelete} type='warning' use="button" target={slug} className='rounded-md w-12'>
                    <Icon type="normal" use="cancel" width={6} color="white"/>
                </Button>
                <Button type={pinned ? "normal" : "alternate"} use='button' className='rounded-md w-12' onClick={handlePin}>
                    <Icon type="online" use="pin" color={pinned ? "var(--text)" : "var(--primary)"} fill/>
                </Button>
                <Button type='normal' use='link' target={slug} className='rounded-md w-12'>
                    <Icon type="online" use="eye" fill color="var(--text)"/>
                </Button>
            </div>
        </div>
    </Card>
}

function NotePage({props, loading}: {props: NoteProps[]; loading: boolean}) {
    const { slug } = useParams<{ slug: string }>()
    const note = props.find((item) => createSlug(item.title) === slug)
    
    const { onSubmit, loading: formLoading, setValue, getValue } = useForm(['title','content','tags'], 'note', note?.note_id ?? "")
    
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

    if (loading && formLoading) return <div className="p-4">
        <p className="opacity-50 mb-4">Memuat Catatan...</p>
    </div>;
    else if (!note) return <div className="p-4">
        <p className="opacity-50 mb-4">Catatan tidak ditemukan.</p>
        <Button type="normal" use="link" target="..">Back To List!</Button>
    </div>

    return <form onSubmit={handleSubmit} className="w-full h-full p-4 flex flex-col gap-4">
        <input type="hidden" name="content" value={htmlContent}/>
        <Editable type="input" name="title" editMode={mode} text={(getValue('title') as string) ?? note.title} onChange={(v)=>setValue('title', v)} className="text-4xl font-bold">
            <h2 className="text-4xl font-bold">{(getValue('title') as string) ?? note.title}</h2>
        </Editable>

        <Editable type="richedit" text={htmlContent} onChange={(html) => setValue("content", html)} editMode={mode} onClick={() => setMode(true)}/>
        {mode? <>            
            <span className="text-xs text-neutral-500 mt-2 block">Masukkan Tags (Pisahkan dengan Koma(,))</span>
            <Editable type="input" name="tags" editMode={mode} onChange={(v)=>setValue('tags', v)} text={Array.isArray(getValue('tags')) ? (getValue('tags') as string[]).join(",") : (note.tags ?? []).join(",")} className="bg-(--primary) p-2 w-[50%] rounded-xl"/>

            <div className="flex h-12 justify-end gap-2">
                <Button type="warning" use="button" className='rounded-md w-12' onClick={()=>{
                    setMode(false)
                    setValue('title', note.title)
                    setValue('content', note.content)
                    setValue('tags', note.tags ?? [])
                }}>
                    <Icon type="normal" use="cancel" width={6} color="var(--text)"/>
                </Button>
                <Button type='normal' use='submit' className='rounded-md w-12'>
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

export default function Note() {
    const {data, loading} = useFetch<NoteProps>("notes")
    const noteData = data ?? []
    const [searchQ, setSearchQ] = useState<string>("")

    const { onCreate } = useForm([], 'note', "", {
        title: "Note Title",
        content: "Write Description"
    })

    if (loading) {
        return <Loading message="Notes"/>
    }
    return <section className="w-full h-full flex flex-col gap-4">
        <div className="w-full h-12 flex">
            <input autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck="false" value={searchQ} onChange={(e: ChangeEvent<HTMLInputElement>) => 
                setSearchQ(e.target.value)
            } type="text" placeholder="Search notes..." className="w-full h-full bg-(--primary) p-4 m-4 rounded-xl"/>
        </div>
        <Routes>
            <Route path="/" element={<div className="grid gap-4 lg:grid-cols-1 p-4">
                    {data.map((item)=><NoteAccordion key={item.note_id} {...item}/>)}
                    <div className="h-full w-full bg-(--primary) shadow-2xl rounded-2xl overflow-hidden">
                        <form onClick={onCreate} className="h-full w-full p-4 flex flex-col hover:bg-(--accent) center transition-colors transition-300">
                            <span className="text-white text-2xl"><code>+</code> Create New Character</span>
                        </form>
                    </div>
                </div>}/>
            <Route path=":slug" element={<NotePage props={noteData} loading={loading}/>}/>
        </Routes>
    </section>
}