import Button from "../Components/Button";
import Breadcrumb from "../Components/Breadcrumb";
import Icon from "../Components/Icon";

import Timeline from "./Timeline";
import World from "./World";
import Character from "./Character";
import Goals from "./Goals";
import Event from "./Event";
import Relic from "./Relic";
import Library from "./Library";
import Note from "./Note";

import {Routes, Route, useParams, useLocation, Navigate} from "react-router-dom"
import { useState } from "react";

interface ProjectData {
    project_id: string;
    name: string;
    created_at: string;
}

function Navigation({name}:{name:string}) {
    const {id} = useParams<{id:string}>();
    const currentPath = useLocation().pathname;

    const nav =["timeline-building","world-building","character-development","goals","events","relics","book-library","note"]
    return <nav className="w-[20%] h-full bg-(--primary) p-4 flex flex-col gap-4 shadow-sm z-30">
        <div>
            <span className="opacity-50">Project</span>
            <h1 className="text-2xl font-black uppercase">{name}</h1>
        </div>
        <div className="flex flex-col gap-2">
            {nav.map((item, i)=>{
                const targetPath = `/dashboard/${id}/${item}`;
                const isActive = currentPath == targetPath;
                return <Button key={i} type="custom" target={`/dashboard/${id}/${item}`} use="link">
                    <p className={`rounded-md text-sm bg-(--primary) w-full p-4 inline-block hover:outline hover:outline-white hover:brightness-150 ${isActive?"brightness-150 bg-linear-120 from-transparent via-transparent to-(--accent)/50 shadow-md":""}`}>{item.replace("-"," ").toUpperCase()}</p>
                </Button>
            })}
            <Button type="custom" target={`/`} use="link"><p className="rounded-md bg-(--primary) w-full p-4 inline-block hover:brightness-150 text-(--warning) uppercase">Back</p></Button>
        </div>
    </nav>
}

interface PinnedData {
    head: string;
    body: string;
    from: string;
}

function Pin() {
    const [show, setShow] = useState<boolean>(false)
    const [pin, setPin] = useState<PinnedData | null>(null)

    const handleOn = () => {
        const data = window.localStorage.getItem('pinned')
        if (data) {
            setPin(JSON.parse(data))
        }
        setShow(true)
    }

    return show ? <div className="absolute min-w-screen h-full top-0 right-0 bg-black/50 z-40 center">
        <Button type="warning" use="button" onClick={() => setShow(false)} className="absolute top-0 right-0 m-4 w-16 h-15 rounded-full z-50">
            <Icon type="normal" use="cancel" width={6} color="var(--text)" fill/>
        </Button>
        <div className="w-[50%] bg-(--primary) shadow-xl rounded-2xl p-4 flex flex-col gap-4">
            <h2 className="text-4xl font-black">{pin?.head} | from {pin?.from}</h2>
            <p className="opacity-75">{pin?.body}</p>
        </div>
    </div> : <Button type="normal" use="button" onClick={handleOn} className="absolute top-0 right-0 m-4 w-16 h-15 rounded-full z-50 shadow-md">
        <Icon type="online" use="pin" color="var(--text)" fill/>
    </Button>
}

export default function Dashboard({projects}:{projects:ProjectData[]}) {
    const { id } = useParams<{id:string}>();

    const projectName = id && projects.length > 0 
        ? projects.find(p => p.project_id === id)?.name ?? ""
        : "";

    return <section className="w-screen h-screen flex relative">
        <Pin/>
        <Navigation name={projectName}/>
        <div className="w-[80%] h-full">
            <Breadcrumb/>
            <div className="h-[90%] w-full overflow-y-scroll">
                <Routes>
                    <Route index element={<Navigate to="timeline-building" replace />} />
                    <Route path={`timeline-building`} element={<Timeline/>}/>
                    <Route path={`world-building/*`} element={<World/>}/>
                    <Route path={`character-development/*`} element={<Character/>}/>
                    <Route path={`goals`} element={<Goals/>}/>
                    <Route path={`events/*`} element={<Event/>}/>
                    <Route path={`relics/*`} element={<Relic/>}/>
                    <Route path={`book-library/*`} element={<Library/>}/>
                    <Route path={`note/*`} element={<Note/>}/>
                </Routes>
            </div>
        </div>
    </section>
}