import Editable from "../Components/Editable";
import Button from "../Components/Button";
import Icon from "../Components/Icon";
import Carrousel from "../Components/Carrousel";
import Loading from "../Components/Loading";
import Error from "../Components/Error";
import Modal from "../Components/Modal";
import Header from "../Components/Header";

import Pinning,{ getPins } from "../../Utils/Pinning";
import { type Profiles } from "./Dashboard";
import { useState, useEffect } from "react";
import { useFetch } from "../../Hooks/useFetch"
import { useForm } from "../../Hooks/useForm";

interface TimelineData {
    index: number;
    timeline_id:string;
    project_id: string;
    name:string;
    timeline:string;
    desc:string;
}

interface DeleteTarget {
    name: string;
    onConfirm: () => Promise<void> | void;
}

function Content({props, onRequestDelete}: {props: TimelineData, onRequestDelete: (target: DeleteTarget) => void}) {
    const [mode, setMode] = useState<boolean>(false)
    const { result, onSubmit, onDelete, setValue, getValue } = useForm({inputs:['name','timeline','desc'], enp:"timeline", id:props?.timeline_id})

    const [pinned, setPinned] = useState<boolean>(() => getPins().some(item => item.id == props.timeline_id && item.type == "Timeline"))

    const handlePin = () => {
        const head = `${props.name || ""} (${props.timeline})`;
        Pinning(head, props.desc || "", "Timeline", props.timeline_id)
        setPinned(prev => !prev)
    }

    useEffect(()=>{
        setValue('timeline', props.timeline)
        setValue('name', props.name)
        setValue('desc', props.desc)
    }, [props.timeline, props.name, props.desc, setValue])
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const res = await onSubmit(e)
        if (res?.ok) setMode(false)
    }

    if (result.loading) return <Loading message="Timeline"/>
    if (result.error || !props) return <Error err={result.error || "Timeline not found!"}/>
    return <form onSubmit={handleSubmit} className="h-full w-full flex flex-col relative overflow-y-scroll pb-16">
        <div className="w-full min-h-48 border-y-2 border-neutral-700 center flex-col gap-8 relative">
            <Editable type="input" name='timeline' text={(getValue('timeline') as string) ?? props.timeline} onChange={(v)=>setValue('timeline', v)} editMode={mode} className='text-4xl font-black text-center'>
                <h2 className="text-4xl font-black text-center">{(getValue('timeline') as string) ?? props.timeline}</h2>
            </Editable>
            <Editable type="input" name="name" text={(getValue('name') as string) ?? props.name} onChange={(v)=>setValue('name', v)} editMode={mode} className="tracking-widest text-(--accent) uppercase text-xl text-center">
                <span className="tracking-widest text-(--accent) uppercase text-xl text-center">{(getValue('name') as string) ?? props.name}</span>
            </Editable>
            {mode?<> 
                <Button label={"Cancel Edit "+props.name} type='custom' use='button' onClick={()=>{
                    setMode(false)
                    setValue('name', props.name)
                    setValue('timeline', props.timeline)
                    setValue('desc', props.desc)
                }} className='absolute top-0 left-0 m-4 w-12'>
                    <Icon type="normal" use="cancel" color="var(--warning)" width={4} className="opacity-50 hover:opacity-100"/>
                </Button>
                <Button label={"Submit Edit "+props.name} type='custom' use='submit' className='absolute bottom-0 right-0 m-4 w-12'>
                    <p>{result.loading ? '...' : <Icon type="normal" use="submit" color="var(--text)" fill width={1} className="opacity-50 hover:opacity-100"/>}</p>
                </Button>
            </>:<>
                <Button label={"Delete "+props.name} onClick={() => onRequestDelete({
                    name: props.name,
                    onConfirm: async () => { await onDelete(); }
                })} type='custom' use="button" className='absolute top-0 left-0 m-4'>
                    <Icon type="online" use="trash" width={3} color="var(--warning)" fill className="opacity-50 hover:opacity-100"/>
                </Button>
                <Button label={pinned?"Unpin Timeline " + props.name : "Pin Timeline " + props.name} type="custom" use='button' className='absolute top-0 right-0 m-4' onClick={handlePin}>
                    <Icon type="online" use="pin" color={pinned ? "var(--accent)" : "var(--text)"} fill className="opacity-50 hover:opacity-100"/>
                </Button>
                <Button label={"Edit "+props.name} type='custom' use='button' onClick={()=>setMode(prev=>!prev)} className='absolute bottom-0 right-0 m-4'>
                    <Icon type="online" use="edit" width={2} color="var(--text)" className="opacity-50 hover:opacity-100"/>
                </Button>
            </>}
        </div>
        <div className="flex flex-col gap-4 p-4">
            <span className="text-2xl font-bold opacity-50">Description</span>
            <Editable type="textarea" name="desc" text={(getValue('desc') as string) ?? props.desc} onChange={(v)=>setValue('desc', v)} editMode={mode} className="text-justify">
                <p className="text-justify">{(getValue('desc') as string) ?? props.desc}</p>
            </Editable>
        </div>
    </form>
}

export default function Timeline({project_id, profiles}: {project_id: string, profiles: Profiles}) {
    const {data, isLoading, error} = useFetch<TimelineData>("timelines", '', {
        eq: {project_id: project_id},
        ascend: {
            col: "index",
            order: true
        }
    })
    
    const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null)
    
    const maxTimeline = profiles?.plan === "free" ? 10 : profiles?.plan === "hobbies" ? 15 : 20

    const { onCreate } = useForm({inputs:[], enp:"timeline", id:data.length > 0 ? data[0]?.timeline_id : ''})
    const handleCreate = async () => {
        if (data.length < maxTimeline) {
            const res = await onCreate({
                project_id: project_id,
                name: "Name Of Era",
                timeline: "... - ...",
                desc: "Write Description"
            })
            if(res.ok) console.log("Created Succesed!")
        } else alert("Your Reach Maximum Timeline!")
    } 

    if (isLoading) return <Loading message="Timelines"/>
    if (error || !data) return <Error err={error || "Timelines not found!"}/>
    return <section className="w-full h-full relative">
        {deleteTarget && <Modal message={`Delete ${deleteTarget.name}?`} type="warning" onConfirm={async () => { await deleteTarget.onConfirm(); setDeleteTarget(null); }} onClose={() => setDeleteTarget(null)}/> }
        <Header title="Timeline Building" desc="Create Timeline Collection In Universe!" profiles={profiles}/>
        <div className="px-4 lg:px-8">
            <div className="h-screen w-full flex flex-col py-4 border-x-2 border-neutral-700">
                <Carrousel length={(data.length+1)}>
                    {data.map((item, i)=><Content key={i} props={item} onRequestDelete={setDeleteTarget}/>) }
                    <div className="h-full min-w-full">
                        <form onClick={handleCreate} className="h-full w-full p-4 flex flex-col hover:bg-(--accent) center border-y-2 border-neutral-700">
                            <span>{data.length} / {maxTimeline}</span>
                            <span className="text-white text-2xl"><code>+</code> Create New Timeline</span>
                        </form>
                    </div>
                </Carrousel>
            </div>
        </div>
    </section>
}
