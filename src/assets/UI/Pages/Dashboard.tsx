import Button from "../Components/Button";
import Icon from "../Components/Icon";
import Loading from "../Components/Loading";

import {Routes, Route, useParams, Navigate} from "react-router-dom"
import { useState, useEffect, lazy, Suspense } from "react";
import { Slug } from "../../Utils/Sanitizer";

const Timeline = lazy(() => import("./Timeline"))
const World = lazy(() => import("./World"))
const Character = lazy(() => import("./Character"))
const Goals = lazy(() => import("./Goals"))
const Library = lazy(() => import("./Library"))
const Note = lazy(() => import("./Note"))

interface ProjectData {
    project_id: string;
    name: string;
    created_at: string;
}

export type Profiles = {
    username: string;
    email: string;
    plan: "free"|"hobbies"|"professionals";
}

function Navigation({name, click, state}:{name:string, click:()=>void, state:boolean}) {
    const {id} = useParams<{id:string}>();

    const authValue = window.localStorage.getItem("auth");
    const user = authValue ? JSON.parse(authValue) : null;
    const user_id = user?.user?.id ?? ""

    const nav = ["timeline-building","world-building","character-development","book-library","note","goals"]
    const [currNav, setCurrNav] = useState<string>("")
    console.log(currNav)

    return <nav className={`w-full overflow-hidden ${state?"lg:w-[20%]":"lg:w-auto"} p-2 bg-(--primary) flex flex-col gap-2 shadow-sm z-30 overflow-auto transition-all duration-150`}>
        <div className="lg:flex gap-2 h-12 items-center hidden"> {/* Title Header */}
            <Button label="Change Layout" type="custom" use="button" className={`bg-(--primary) hover:brightness-150 h-12 hidden lg:block ${state?"w-12":"w-full"}`} onClick={click}>{state?'<':'>'}</Button>
            {state && <h1 className="text-xl font-black uppercase">{name}</h1>}
        </div> {/* Navigation Header */}
        <div className="flex lg:flex-col overflow-x-auto">
            {nav.map((item, i) => {
            const active = item === currNav
            
            return <Button label={item} key={i} type="custom" target={`/projects/${user_id}/dashboard/${id}/${item}`} onClick={() => setCurrNav(Slug(item))} use="link" className={`${active?"bg-(--accent) text-(--bg)":"bg-(--primary) text-(--text)"} rounded-md w-full flex items-center text-xs hover:brightness-150 min-h-12 uppercase p-2`}>
                {state ? <p className="hidden lg:block">{(item.replace("-"," ") ?? "").toUpperCase()}</p> : <Icon scale="0.75" type="online" use={item} fill color="var(--text)"/>}
            </Button>})}
            <Button label="Back" type="custom" target={`/projects/${user_id}`} use="link" className={`rounded-md bg-(--primary) w-full flex items-center text-xs hover:brightness-150 text-(--warning) uppercase p-2 min-h-12`}>
                {state?"Back":<Icon scale="0.75" type="online" use="exit" fill color="var(--warning)"/>}
            </Button>
        </div>
    </nav>
}

export default function Dashboard({projects, profiles}:{projects:ProjectData[], profiles: Profiles}) {
    useEffect(() => {
        document.title = "UniFiction | Dashboard"
    }, [])

    const { id } = useParams<{id:string}>();
    const projectName = id && projects.length > 0 ? projects.find(user => user.project_id === id)?.name : ""
    const projectId = id && projects.length > 0 ? projects.find(user => user.project_id === id)?.project_id : ""

    const [mode, setMode] = useState<boolean>(false)

    return <section className="w-screen h-screen flex flex-col lg:flex-row relative">
        <Navigation name={projectName ?? ""} click={() => setMode(prev => !prev)} state={mode}/>
        <div className={`h-[calc(100%-12rem)] lg:h-full w-full ${mode?"lg:w-[80%]":"lg:w-[95%]"}`}>
            <div className="h-screen w-full overflow-y-scroll">
                <Suspense fallback={<Loading message="Section"/>}>
                    <Routes>
                        <Route index element={<Navigate to="timeline-building" replace />} />
                        <Route path={`timeline-building`} element={<Timeline project_id={projectId ?? ""} profiles={profiles}/>}/>
                        <Route path={`world-building/*`} element={<World project_id={projectId ?? ""} profiles={profiles}/>} />
                        <Route path={`character-development/*`} element={<Character project_id={projectId ?? ""} profiles={profiles}/>}/>
                        <Route path={`book-library/*`} element={<Library project_id={projectId ?? ""} profiles={profiles}/>}/>
                        <Route path={`note/*`} element={<Note project_id={projectId ?? ""} profiles={profiles}/>}/>
                        <Route path={`goals`} element={<Goals project_id={projectId ?? ""} profiles={profiles}/>}/>
                    </Routes>
                </Suspense>
            </div>
        </div>
    </section>
}