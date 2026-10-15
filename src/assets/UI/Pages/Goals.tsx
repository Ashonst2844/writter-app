import Loading from "../Components/Loading"
import Icon from "../Components/Icon";
import Editable from "../Components/Editable";
import Button from "../Components/Button";
import Error from "../Components/Error";
import Modal from "../Components/Modal";
import Header from "../Components/Header";

import { useState, useEffect, type FormEvent } from "react";
import { useFetch } from "../../Hooks/useFetch";
import { useForm } from "../../Hooks/useForm";
import { type QueryObserverResult } from "@tanstack/react-query";
import { type Profiles } from "./Dashboard";

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

function StickyNotes(props: StickyProps) {
    const [mode, setMode] = useState<boolean>(false)
    const [showModal, setShowModal] = useState<boolean>(false)
    const { result, onSubmit, onDelete, setValue, getValue } = useForm({inputs:['name','status','due'], enp:'goal', id:props?.goal_id})

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

    if (result.loading) return <Loading message="Goals"/>
    if (result.error || !props) return <Error err={result.error || "Goals not found!"}/>
    return <form onSubmit={handleSubmit} className="w-full min-h-60 bg-(--primary) shadow-xl p-4 relative border-y-2 border-neutral-700">
        <div className="w-full max-h-[80%] center gap-4 flex-col">
            <div className="w-full h-2 rounded-md shadow-md" style={{backgroundColor:props.status?"var(--success)":"var(--warning)"}}/>
            <Editable type="input" name='name' text={(getValue('name') as string) ?? props.name} onChange={(v)=>setValue('name', v)} editMode={mode} className="font-bold underline text-xl text-center w-full">
                <h2 className="font-bold underline text-center text-xl">{(getValue('name') as string) ?? props.name}</h2>
            </Editable>
            <Editable type="date" name='due' text={(getValue('due') as string) ?? props.due} onChange={(v)=>setValue('due', v)} editMode={mode} className="font-bold">
                <span>{(getValue('due') as string) ?? props.due} <b className="uppercase">( {props.status ? "completed" : computeWarn((getValue('due') as string) ?? props.due)} )</b></span>
            </Editable>
            <Editable type="checklist" text={(getValue('status') as boolean) ?? props.status} name="status" editMode={mode} onChange={(v)=>setValue('status', v)}></Editable>
        </div>
        {showModal && <Modal message={`Delete ${props.name}?`} type="warning" onConfirm={async () => { await onDelete(); }} onClose={() => setShowModal(false)}/>}
        {mode?<>
            <Button label={"Cancel Edit "+props.name} type="custom" use="button" className='w-12 absolute m-4 bottom-0 left-0' onClick={()=>{
                setMode(false)
                setValue('name', props.name)
                setValue('status', props.status)
                setValue('due', props.due)
            }}><Icon type="normal" use="cancel" color="var(--warning)" width={3} className="opacity-50 hover:opacity-100"/></Button>
            <Button label={"Submit Edit "+props.name} type="custom" use="submit" className="w-12 absolute m-4 bottom-0 right-0">
                {result.loading?"...":<Icon type="normal" use="submit" color="var(--text)" width={3} fill className="opacity-50 hover:opacity-100"/>}
            </Button>
        </> : <>
            <Button label={"Delete "+props.name} type="custom" use="button" onClick={() => setShowModal(true)} className="w-12 absolute m-4 bottom-0 left-0">
                <Icon type="online" use="trash" width={3} color="var(--warning)" fill className="opacity-50 hover:opacity-100"/>
            </Button>
            <Button label={"Edit "+props.name} type='custom' use='button' onClick={()=>{setMode(true)}} className='w-12 absolute m-4 bottom-0 right-0'>
                <Icon type="online" use="edit" width={2} color="var(--text)" className="opacity-50 hover:opacity-100"/>
            </Button>
        </>}
    </form>
}

export default function Goals({project_id, profiles}: {project_id: string, profiles: Profiles}) {
    const {data, isLoading, error} = useFetch<GoalsProps>("goals", '', {
        eq: {project_id: project_id}
    })

    const maxGoals = profiles?.plan === "free" ? 20 : 40
    const { onCreate } = useForm({inputs:[], enp:'goal', id:data.length > 0 ? data[0]?.goal_id : ''})
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
    return <section className="w-full h-full relative">
        <Header title="Goals" desc="Create Goals Remainder!" profiles={profiles}/>
        <div className="px-8">
            <div className="h-screen w-full flex flex-col py-4 border-x-2 border-neutral-700">
                <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]s lg:grid-cols-4">
                    {data.map((item, i)=><StickyNotes key={i} goal_id={item.goal_id} name={item.name} created_at={item.created_at} due={item.due} status={item.status}/>)}
                    <div className="h-full w-full bg-(--primary) shadow-xl">
                        <form onClick={handleCreate} className="min-h-60 w-full border-y-2 border-neutral-700 flex-col hover:bg-(--accent) center">
                            <span>{data.length} / {maxGoals}</span>
                            <span className="text-white text-xl"><code>+</code> Create New Goals</span>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
}