import Card from "../Components/Card";
import Button from "../Components/Button";
import Editable from "../Components/Editable";
import Loading from "../Components/Loading";
import Icon from "../Components/Icon";

import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { Routes, Route, useParams } from "react-router-dom"
import { useFetch } from "../../Hooks/useFetch"
import { useForm } from "../../Hooks/useForm";

interface RelicProps {
    relic_id:string;
    title:string | null;
    content:string | null;
}

const createSlug = (text: string | null | undefined) => {
    if (!text) return "Untitled";
    return text.toLowerCase().trim().replaceAll(" ","-");
};

function RelicAccordion(props: RelicProps) {
    const slug = createSlug(props.title)
    const {onDelete} = useForm([], "relic", props.relic_id)

    return <Card>
        <div className="h-full flex flex-col justify-between">
            <h2 className="text-4xl font-black capitalize">{props.title}</h2>
            <div className='flex w-full h-12 justify-end gap-4'>
                <Button onClick={onDelete} type='warning' use="button" target={slug} className='rounded-md w-12'>
                    <Icon type="normal" use="cancel" width={6} color="white"/>
                </Button>
                <Button type='normal' use='link' target={slug} className='rounded-md w-12'>
                    <Icon type="online" use="eye" color="white" fill/>
                </Button>
            </div>
        </div>
    </Card>
}

function RelicPage({props, loading}: {props: RelicProps[]; loading: boolean}) {
    const { slug } = useParams<{ slug: string }>()
    const relic = props.find((item) => createSlug(item.title) === slug)
    
    const { onSubmit, loading: formLoading, setValue, getValue } = useForm(['title','content'], 'relic', relic?.relic_id ?? "")

    const [mode, setMode] = useState<boolean>(false)

    useEffect(()=>{
        if (!relic) return
        setValue('title', relic.title)
        setValue('content', relic.content)
    }, [relic, setValue])

    const htmlContent = (getValue('content') as string) ?? ""

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res = await onSubmit(e);
        if (res?.ok) setMode(false);
    }

    if (loading && formLoading) return <div className="p-4">
        <p className="opacity-50 mb-4">Memuat Relic...</p>
    </div>;
    else if (!relic) return <div className="p-4">
        <p className="opacity-50 mb-4">Relic tidak ditemukan.</p>
        <Button type="normal" use="link" target="..">Back To List!</Button>
    </div>

    return <form onSubmit={handleSubmit} className="w-full h-full p-4 flex flex-col gap-4">
        <input type="hidden" name="content" value={htmlContent}/>
        <Editable type="input" name="title" editMode={mode} text={(getValue('title') as string) ?? relic.title} onChange={(v)=>setValue('title', v)} className="text-4xl font=bold">
            <h2 className="text-4xl font=bold">{(getValue('title') as string) ?? relic.title}</h2>
        </Editable>

        <Editable type="richedit" text={htmlContent} onChange={(html) => setValue("content", html)} editMode={mode} onClick={() => setMode(true)}/>
        {mode? <>  
            <div className="flex justify-end gap-2">
                <Button type="warning" use="button" className='rounded-md w-12' onClick={()=>{
                    setMode(false)
                    setValue('title', relic.title)
                    setValue('content', relic.content)
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

export default function Relic() {
    const {data, loading} = useFetch<RelicProps>("relics")
    const noteData = data ?? []
    const [searchQ, setSearchQ] = useState<string>("")

    const { onCreate } = useForm([], 'relic', "", {
        title: "Relic Title",
        content: "Write Description"
    })

    if (loading) {
        return <Loading message="Relics"/>
    }
    return <section className="w-full h-full flex flex-col gap-4">
        <div className="w-full h-12 flex">
            <input autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck="false" value={searchQ} onChange={(e: ChangeEvent<HTMLInputElement>) => 
                setSearchQ(e.target.value)
            } type="text" placeholder="Search relic..." className="w-full h-full bg-(--primary) p-4 m-4 rounded-xl"/>
        </div>
        <Routes>
            <Route path="/" element={<div className="flex gap-4 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] lg:grid-cols-2 p-4">
                {data.map((item) => item.title?.includes(searchQ) && <RelicAccordion key={item.relic_id} {...item}/>)}
                <div className="h-full w-full bg-(--primary) shadow-2xl rounded-2xl overflow-hidden">
                    <form onClick={onCreate} className="h-full w-full p-4 flex flex-col hover:bg-(--accent) center transition-colors transition-300">
                        <span className="text-white text-2xl"><code>+</code> Create New Character</span>
                    </form>
                </div>
            </div>}/>
            <Route path=":slug" element={<RelicPage props={noteData} loading={loading}/>}/>
        </Routes>
    </section>
}