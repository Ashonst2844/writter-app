import Editable from "../Components/Editable";
import Button from "../Components/Button";
import Icon from "../Components/Icon";
import Carrousel from "../Components/Carrousel";
import Loading from "../Components/Loading";

import { useState, useEffect } from "react";
import { useFetch } from "../../Hooks/useFetch"
import { useForm } from "../../Hooks/useForm";

interface TimelineData {
    index: number;
    timeline_id:string;
    name:string;
    timeline:string;
    desc:string;
}

function Content({timeline_id, name, timeline, desc}: {timeline_id: string, name: string, timeline: string, desc: string}) {
    const [mode, setMode] = useState<boolean>(false)
    const { onSubmit, onDelete, loading, setValue, getValue } = useForm(['name','timeline','desc'], 'timeline', timeline_id)

    useEffect(()=>{
        setValue('timeline', timeline)
        setValue('name', name)
        setValue('desc', desc)
    }, [timeline, name, desc, setValue])
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const res = await onSubmit(e)
        if (res?.ok) setMode(false)
    }

    return <form onSubmit={handleSubmit} className="h-full min-w-full p-4 flex flex-col gap-8">
        <div className="w-full p-8 bg-(--primary) center flex-col gap-8 rounded-xl shadow-inner">
            <Editable type="input" name='timeline' text={(getValue('timeline') as string) ?? timeline} onChange={(v)=>setValue('timeline', v)} editMode={mode} className='text-4xl font-black text-center'>
                <h2 className="text-4xl font-black text-center">{(getValue('timeline') as string) ?? timeline}</h2>
            </Editable>
            <Editable type="input" name="name" text={(getValue('name') as string) ?? name} onChange={(v)=>setValue('name', v)} editMode={mode} className="tracking-widest text-(--accent) uppercase text-xl text-center">
                <span className="tracking-widest text-(--accent) uppercase text-xl text-center">{(getValue('name') as string) ?? name}</span>
            </Editable>
        </div>
        <div className="px-16 flex flex-col gap-4">
            <span className="text-2xl font-bold opacity-50">Description</span>
            <Editable type="textarea" name="desc" text={(getValue('desc') as string) ?? desc} onChange={(v)=>setValue('desc', v)} editMode={mode} className="text-justify">
                <p className="text-justify">{(getValue('desc') as string) ?? desc}</p>
            </Editable>
        </div>
        <div className='flex w-full h-12 justify-end gap-4 z-90'>
            {mode?<> 
                <Button type='warning' use='button' onClick={()=>{
                    setMode(false)
                    setValue('name', name)
                    setValue('timeline', timeline)
                    setValue('desc', desc)
                }} className='rounded-full w-12'>
                    <Icon type="normal" use="cancel" color="white" width={3}/>
                </Button>
                <Button type='normal' use='submit' className='rounded-full w-12'><p>{loading ? '...' : <Icon type="normal" use="submit" color="white" fill width={1}/>}</p></Button>
            </>:<>
                <Button onClick={onDelete} type='warning' use="button" className='rounded-full w-12'>
                    <Icon type="normal" use="cancel" width={3} color="white"/>
                </Button>
                <Button type='alternate' use='button' onClick={()=>setMode(prev=>!prev)} className='rounded-full w-12 h-12'>
                    <Icon type="online" use="edit" width={1} color="var(--bg)"/>
                </Button>
            </>}
        </div>
    </form>
}

export default function Timeline() {
    const {data, loading} = useFetch<TimelineData>("timelines")
    const sortedData = data.sort((a, b) => a.index - b.index)

    const { onCreate } = useForm([], 'timeline', "", {
        name: "Name Of Era",
        timeline: "... - ...",
        desc: "Write Description"
    })

    if (loading) return <Loading message="Timelines"/>
    return <section className="w-full h-full">
        <Carrousel length={(data.length+1)}>
            {sortedData.map((item, i)=><Content key={i} timeline_id={item.timeline_id} timeline={item.timeline} name={item.name} desc={item.desc}/>)}
            <div className="min-h-full min-w-full p-4">
                <form onClick={()=>onCreate()} className="h-full w-full p-4 flex flex-col hover:bg-(--accent) center transition-colors transition-300 rounded-2xl">
                    <span className="text-white text-2xl"><code>+</code> Create New Timeline</span>
                </form>
            </div>
        </Carrousel>
    </section>
}