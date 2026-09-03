import Loading from "../Components/Loading"
import Card from "../Components/Card";
import Icon from "../Components/Icon";
import Editable from "../Components/Editable";
import Button from "../Components/Button";

import { useState, useEffect, type FormEvent } from "react";
import { useFetch } from "../../Hooks/useFetch";
import { useForm } from "../../Hooks/useForm";

interface GoalsProps {
    goal_id: string;
    created_at: string;
    name: string;
    status: boolean;
    due: string;
}
interface StickyProps extends GoalsProps {
    refetch?: () => Promise<void>;
}

function StickyNotes(props: StickyProps) {
    const [mode, setMode] = useState<boolean>(false)
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

    return <Card>
        <form onSubmit={handleSubmit} className="w-full h-full relative">
            <div className="justify-between hover:outline-white hover:outline-2 w-full h-full flex items-center flex-col rounded-md p-2" onClick={()=>setMode(true)}>
                <Editable type="input" name='name' text={(getValue('name') as string) ?? props.name} onChange={(v)=>setValue('name', v)} editMode={mode} className="font-bold underline text-xl text-center w-full">
                    <h2 className="font-bold underline text-center text-xl">{(getValue('name') as string) ?? props.name}</h2>
                </Editable>
                <span>{props.created_at.slice(0,10)}</span>
                <Editable type="date" name='due' text={(getValue('due') as string) ?? props.due} onChange={(v)=>setValue('due', v)} editMode={mode} className="font-bold">
                    <span>For {(getValue('due') as string) ?? props.due}</span>
                </Editable>
                <span className="font-bold text-xl">{computeWarn((getValue('due') as string) ?? props.due)}</span>
                {mode?
                <Editable type="checklist" text={(getValue('status') as boolean) ?? props.status} name="status" editMode={mode} onChange={(v)=>setValue('status', v)}>
                    Status
                </Editable>  
                : <span className="pl-2 font-bold" style={{color: props.status? "var(--accent)":"var(--warning)"}}>{props.status?"Done":"Undone"}</span>
                }
            </div>
            {mode?<>
                <Button type="normal" use="submit" className="w-12 h-12 absolute -top-2 -right-2 rounded-full z-30">
                    {formLoading?"...":<Icon type="normal" use="save" color="white" width={3} scale="150%"/>}
                </Button>
                <Button type="warning" use="button" onClick={onDelete} className="w-12 h-12 absolute -top-2 -left-2 rounded-full z-30">
                    {formLoading?"...":<Icon type="normal" use="cancel" color="white" width={3} scale="150%"/>}
                </Button>
            </>
            :""}
        </form>
    </Card>
}

export default function Goals() {
    const {data, loading, refetch} = useFetch<GoalsProps>("goals")
    const goalData = data ?? [];

    const { onCreate } = useForm([], 'goal', "", {
        name: "Your Goal",
        status: false
    })

    if (loading) {
        return <Loading message="Goals"/>
    }
    return <section className="w-full h-full">
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(250px,1fr))] lg:grid-cols-4 p-4">
            {goalData.map((item, i)=><StickyNotes key={i} goal_id={item.goal_id} name={item.name} created_at={item.created_at} due={item.due} status={item.status} refetch={refetch}/>)}
            <div className="h-full w-full bg-(--primary) shadow-2xl rounded-2xl overflow-hidden">
                <form onClick={onCreate} className="h-full w-full p-4 flex flex-col hover:bg-(--accent) center transition-colors transition-300">
                    <span className="text-white text-xl"><code>+</code> Create New Goals</span>
                </form>
            </div>
        </div>
    </section>
}