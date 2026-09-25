import Loading from "../Components/Loading"
import Icon from "../Components/Icon";
import Editable from "../Components/Editable";
import Button from "../Components/Button";
import Error from "../Components/Error";
import Modal from "../Components/Modal";

import { useState, useEffect, type FormEvent } from "react";
import { useFetch } from "../../Hooks/useFetch";
import { useForm } from "../../Hooks/useForm";
import { type QueryObserverResult } from "@tanstack/react-query";

interface GoalsProps {
    goal_id: string;
    created_at: string;
    name: string;
    status: boolean;
    due: string;
}
interface StickyProps extends GoalsProps {
    refetch?: () => Promise<QueryObserverResult<GoalsProps[], Error>>;
}
interface Profiles {
    username: string;
    email: string;
    plan: "free"|"hobbies"|"professionals";
}

function StickyNotes(props: StickyProps) {
    const [mode, setMode] = useState<boolean>(false)
    const [showModal, setShowModal] = useState<boolean>(false)
    const { onSubmit, onDelete, loading: formLoading, setValue, getValue } = useForm(['name','status','due'], 'goal', props.goal_id)

    useEffect(()=>{
        setValue('name', props.name)
        setValue('status', props.status)
        setValue('due', props.due)
    }, [props.name, props.status, props.due, setValue])
    
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const res = await onSubmit(e)
        if (res?.ok) setMode(false)
        if (res?.ok) await props.refetch?.()
    }

    const computeWarn = (dueStr: string | null | undefined) => {
        if (!dueStr) return 'No date set'
        const [y, m, d] = dueStr.split('-').map(Number)
        const due = new Date(y, m - 1, d)
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

        const diffMs = due.getTime() - today.getTime()
        if (diffMs === 0) return 'today'
        if (diffMs < 0) return 'expired'

        let years = due.getFullYear() - today.getFullYear()
        let months = due.getMonth() - today.getMonth()
        let days = due.getDate() - today.getDate()

        if (days < 0) {
            months -= 1
            const daysInPrevMonth = new Date(due.getFullYear(), due.getMonth(), 0).getDate()
            days += daysInPrevMonth
        }
        if (months < 0) {
            years -= 1
            months += 12
        }

        if (days > 0) return `${days} Day${days > 1 ? 's' : ''} Left`
        if (months > 0) return `${months} Month${months > 1 ? 's' : ''} Left`
        return `${years} Year${years > 1 ? 's' : ''} Left`
    }

    return <form onSubmit={handleSubmit} className="w-full h-full bg-(--primary) rounded-xl shadow-xl p-4 flex flex-col items-center justify-between gap-2">
        <div className="w-full h-2 rounded-md shadow-md" style={{backgroundColor:props.status?"var(--success)":"var(--warning)"}}/>
        <Editable type="input" name='name' text={(getValue('name') as string) ?? props.name} onChange={(v)=>setValue('name', v)} editMode={mode} className="font-bold underline text-xl text-center w-full">
            <h2 className="font-bold underline text-center text-xl">{(getValue('name') as string) ?? props.name}</h2>
        </Editable>
        <Editable type="date" name='due' text={(getValue('due') as string) ?? props.due} onChange={(v)=>setValue('due', v)} editMode={mode} className="font-bold">
            <span>{(getValue('due') as string) ?? props.due} <b className="uppercase">( {props.status ? "completed" : computeWarn((getValue('due') as string) ?? props.due)} )</b></span>
        </Editable>
        <Editable type="checklist" text={(getValue('status') as boolean) ?? props.status} name="status" editMode={mode} onChange={(v)=>setValue('status', v)}></Editable>
        {showModal && <Modal message={`Delete ${props.name}?`} type="warning" onConfirm={async () => { await onDelete(); }} onClose={() => setShowModal(false)}/>}
        <div className="flex justify-between w-full">
            {mode?<>
                <Button type="warning" use="button" className='rounded-md w-12' onClick={()=>{
                    setMode(false)
                    setValue('name', props.name)
                    setValue('status', props.status)
                    setValue('due', props.due)
                }}><Icon type="normal" use="cancel" color="white" width={3}/></Button>
                <Button type="normal" use="submit" className="w-12 h-12 rounded-md">
                    {formLoading?"...":<Icon type="normal" use="submit" color="white" width={3} fill/>}
                </Button>
            </>
            : <>
                <Button type="warning" use="button" onClick={() => setShowModal(true)} className="w-12 h-12 rounded-md">
                    <Icon type="online" use="trash" width={3} color="white" fill/>
                </Button>
                <Button type='alternate' use='button' onClick={()=>{setMode(true)}} className='rounded-md w-12'>
                    <Icon type="online" use="edit" width={1} color="var(--bg)"/>
                </Button>
            </>}
        </div>
    </form>
}

export default function Goals({project_id, profiles}: {project_id: string, profiles: Profiles}) {
    const {data, isLoading, error} = useFetch<GoalsProps>("goals", '', {
        eq: {
            project_id: project_id
        }
    })

    const maxGoals = profiles?.plan === "free" ? 20 : profiles?.plan === "hobbies" ? 40 : 60

    const { onCreate } = useForm([], 'goal', data.length > 0 ? data[0].goal_id : '')
    const handleCreate = async () => {
        if ( data.length < maxGoals ) {
            const res = await onCreate({
                project_id: project_id,
                name: "Your Goal",
                status: false
            })
            if(res.ok) console.log("Created Succesed!")
        } else alert("Your Reach Maximum Goals!")
    } 

    if (isLoading) return <Loading message="Goals"/>
    if (error || !data) return <Error err={error || "Goals not found!"}/>
    return <section className="w-full h-full">
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(250px,1fr))] grid-rows-[250px] lg:grid-cols-4 p-4">
            {data.map((item, i)=><StickyNotes key={i} goal_id={item.goal_id} name={item.name} created_at={item.created_at} due={item.due} status={item.status}/>)}
            <div className="h-full w-full bg-(--primary) shadow-xl rounded-xl overflow-hidden">
                <form onClick={handleCreate} className="h-full w-full p-4 flex flex-col hover:bg-(--accent) center transition-colors transition-300">
                    <span>{data.length} / {maxGoals}</span>
                    <span className="text-white text-xl"><code>+</code> Create New Goals</span>
                </form>
            </div>
        </div>
    </section>
}