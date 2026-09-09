import Button from "../Components/Button";
import Breadcrumb from "../Components/Breadcrumb";
import Icon from "../Components/Icon";
import Modal from "../Components/Modal";

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
import {type PinEntry, getPins, clearPins} from "../../Utils/Pinning";

interface ProjectData {
    project_id: string;
    name: string;
    created_at: string;
}

function Navigation({name, click, state}:{name:string, click:()=>void, state:boolean}) {
    const {id} = useParams<{id:string}>();
    const currentPath = useLocation().pathname;

    const nav =["timeline-building","world-building","character-development","goals","events","relics","book-library","note"]
    return <nav className="h-full bg-(--primary) flex flex-col gap-4 shadow-sm z-30 overflow-auto transition-all duration-150" style={{
        width: state?"20%":"auto",
        padding: state?"1rem":"0"
    }}>
        <div className="flex h-16">
            <div className="w-[90%]" style={{
                display: state?"block":"none"
            }}>
                <span className="opacity-50">Project</span>
                <h1 className="text-2xl font-black uppercase">{name}</h1>
            </div>
            <Button type="custom" use="button" className="bg-(--primary) hover:brightness-150 h-16" onClick={click} style={{
                width: state?"10%":"100%"
            }}>{state?'<':'>'}</Button>
        </div>
        <div className="flex flex-col">
            {nav.map((item, i)=>{
                const targetPath = `/dashboard/${id}/${item}`;
                const isActive = currentPath == targetPath;
                return <Button key={i} type="custom" target={`/dashboard/${id}/${item}`} use="link">
                    <p className={`text-xs bg-(--primary) w-full flex gap-2 items-center hover:outline hover:outline-white hover:brightness-150 ${state?"":"center"} ${isActive?"brightness-150 bg-linear-120 from-transparent via-transparent to-(--accent)/50 shadow-md":""}`} style={{
                        padding: state?"1rem":"0.5rem"
                    }}>
                        {state?item.replace("-"," ").toUpperCase():<Icon scale="0.75" type="online" use={item} fill color="var(--text)"/>}
                    </p>
                </Button>
            })}
            <Button type="custom" target={`/`} use="link" className="rounded-md bg-(--primary) w-full p-4 inline-block hover:brightness-150 text-(--warning) uppercase">
                {state?"Back":<Icon scale="0.75" type="online" use="exit" fill color="var(--warning)"/>}
            </Button>
        </div>
    </nav>
}

function Pin() {
    const [show, setShow] = useState<boolean>(false)
    const [pin, setPin] = useState<PinEntry[] | null>([])

    const handleOn = () => {
        setPin(getPins)
        setShow(true)
    }
    const [showModal, setShowModal] = useState<boolean>(false)

    return show ? <div className="absolute min-w-screen h-full top-0 right-0 bg-black/75 z-40 flex flex-col gap-2 overflow-auto p-4">
        <div className="flex gap-2 fixed top-0 right-0 m-4 rounded-full z-50">
            {showModal && pin && <Modal message={`Clear All Pinned? (${pin.length}) Pinned Found`} type="alert" onConfirm={() => {clearPins(); window.location.reload()}} onClose={() => setShowModal(false)}/> }
            <Button type="warning" use="button" onClick={(() => setShowModal(true))} className="w-24 rounded-md">Clear</Button>
            <Button type="warning" use="button" onClick={() => setShow(false)} className="w-16 rounded-md">
                <Icon type="normal" use="cancel" width={6} color="var(--text)" fill/>
            </Button>
        </div>
        {pin?.map((item, i) => <div key={i} className="w-[50%] bg-(--primary) shadow-md rounded-2xl p-4 flex flex-col gap-4">
            <h2 className="text-4xl font-black">{item?.title} </h2>
            <span className="opacity-75 text-(--accent)">{item?.type.toUpperCase()}</span>
            <p className="opacity-75">{item?.content}</p>
        </div>)}
    </div> : <Button type="normal" use="button" onClick={handleOn} className="absolute top-0 right-0 m-4 w-16 h-15 rounded-full z-50 shadow-md">
        <Icon type="online" use="pin" color="var(--text)" fill/>
    </Button>
}

export default function Dashboard({projects}:{projects:ProjectData[]}) {
    const { id } = useParams<{id:string}>();

    const [mode, setMode] = useState<boolean>(false)

    const projectName = id && projects.length > 0 
        ? projects.find(p => p.project_id === id)?.name ?? ""
        : "";

    return <section className="w-screen h-screen flex relative">
        <Pin/>
        <Navigation name={projectName} click={() => setMode(prev => !prev)} state={mode}/>
        <div className="h-full" style={{
            width: mode?"80%":"95%"
        }}>
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