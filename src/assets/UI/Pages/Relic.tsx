import Card from "../Components/Card";
import Button from "../Components/Button";
import Editable from "../Components/Editable";
import Loading from "../Components/Loading";
import Icon from "../Components/Icon";
import Error from "../Components/Error";
import Modal from "../Components/Modal";

import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { Routes, Route, useParams } from "react-router-dom"
import { useFetch } from "../../Hooks/useFetch"
import { useForm } from "../../Hooks/useForm";

import Pinning, {getPins} from "../../Utils/Pinning";

interface RelicProps {
    relic_id:string;
    title:string | null;
    content:string | null;
}
interface Profiles {
    username: string;
    email: string;
    plan: "free"|"hobbies"|"professionals";
}

const createSlug = (text: string | null | undefined) => {
    if (!text) return "Untitled";
    return text.toLowerCase().trim().replaceAll(" ","-");
};

function RelicAccordion(props: RelicProps) {
    const slug = createSlug(props.title)
    const {onDelete} = useForm([], "relic", props.relic_id)

    const [pinned, setPinned] = useState<boolean>(() => getPins().some(item => item.id == props.relic_id && item.type == "Relic"))
    const [showModal, setShowModal] = useState<boolean>(false)

    const handlePin = () => {
        Pinning(props?.title || "", props?.content || "", "Relic", props.relic_id)
        setPinned(prev => !prev)
    }

    return <Card>
        <div className="h-full flex flex-col justify-between">
            <h2 className="text-4xl font-black capitalize">{props.title}</h2>
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

function RelicPage({props, error}: {props: RelicProps[]; error: Error | null}) {
    const { slug } = useParams<{ slug: string }>()
    const relic = props.find((item) => createSlug(item.title) === slug)
    
    const { onSubmit, loading, setValue, getValue } = useForm(['title','content'], 'relic', relic?.relic_id ?? "")

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

    if (loading) return <Loading message="Relic"/>
    if (error || !relic) return <Error err={error || "Relic not found!"}/>
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

export default function Relic({project_id, profiles}: {project_id: string, profiles: Profiles}) {
    const {data, isLoading, error} = useFetch<RelicProps>("relics", 'relic_id, title, content', {
        eq: {
            project_id: project_id
        }
    })
    const [searchQ, setSearchQ] = useState<string>("")

    const maxRelic = profiles?.plan === "free" ? 20 : profiles?.plan === "hobbies" ? 40 : 60

    const { onCreate } = useForm([], 'relic', data.length > 0 ? data[0].relic_id : '')
    const handleCreate = async () => {
        if (data.length < maxRelic) {
            const res = await onCreate({
                project_id: project_id,
                title: "Relic Title",
                content: "Write Description"
            })
            if(res.ok) console.log("Created Succesed!")
        } else alert("Your Reach Maximum Relic!")
    } 

    if (isLoading) return <Loading message="Relics"/>
    if (error || !data) return <Error err={error || "Relics not found!"}/>
    return <section className="w-full h-full flex flex-col gap-4">
        <Routes>
            <Route path="/" element={<div className="flex flex-col gap-4">
                <div className="w-full h-12 flex">
                    <input autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck="false" value={searchQ} onChange={(e: ChangeEvent<HTMLInputElement>) => 
                        setSearchQ(e.target.value)
                    } type="text" placeholder="Search relic..." className="w-full h-full bg-(--primary) p-4 m-4 rounded-xl"/>
                </div>
                <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] lg:grid-cols-2 p-4">
                    {data.map((item) => item.title?.includes(searchQ) && <RelicAccordion key={item.relic_id} {...item}/>)}
                    <div className="min-h-60 w-full bg-(--primary) shadow-xl rounded-2xl overflow-hidden">
                        <form onClick={handleCreate} className="h-full w-full p-4 flex flex-col hover:bg-(--accent) center transition-colors transition-300">
                            <span>{data.length} / {maxRelic}</span>
                            <span className="text-white text-2xl"><code>+</code> Create New Relic</span>
                        </form>
                    </div>
                </div>
            </div>}/>
            <Route path=":slug" element={<RelicPage props={data} error={error}/>}/>
        </Routes>
    </section>
}