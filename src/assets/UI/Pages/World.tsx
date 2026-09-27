import Carrousel from "../Components/Carrousel"
import Loading from "../Components/Loading"
import Icon from "../Components/Icon"
import Button from "../Components/Button"
import Editable from "../Components/Editable"
import Error from "../Components/Error"
import Modal from "../Components/Modal"

import { useState, type ChangeEvent, type FormEvent } from "react"
import { Routes, Route, useParams } from "react-router-dom" 
import { useFetch } from "../../Hooks/useFetch"
import { useForm } from "../../Hooks/useForm"
import { useUpload } from "../../Hooks/useUpload"
import { type Profiles } from "./Dashboard";

interface TimelineData {
    index: number;
    name: string
    timeline_id:string;
    timeline:string;
    map: string | null;
}
interface ContinentData {
    continent_id: string;
    timeline_id: string;
    name: string;
    desc: string;
    image: string;
}
interface PlaceData {
    place_id: string;
    continent_id: string;
    name: string;
    desc: string;
}

const createSlug = (text: string | null | undefined) => {
    if (!text) return "Untitled";
    return text.toLowerCase().trim().replaceAll(" ","-");
};

function Content({timeline, name, map}: {timeline: string, name: string, map: string | null}) {
    const slug = createSlug(`Dunia ${name}`)

    return <div className="h-full min-w-full p-8">
        <div className="w-full h-full rounded-2xl shadow-inner overflow-hidden relative">
            {map ? <div className="w-full h-full relative">
                <img src={map} alt={timeline} className="w-full h-full object-cover"/>
                <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-black via-transparent to-black/50"></div>
                <span className="absolute text-4xl font-bold left-4 top-4 z-10">{timeline}</span>
            </div>:
            <div className="w-full h-full bg-(--primary) center flex-col gap-4">
                <Icon type="online" use="danger" color="var(--text)" scale="2" fill/>
                <i>File Not Found</i>
            </div>}
            <div className="z-20 absolute top-0 bg-black/25 left-0 w-full h-full opacity-0 hover:opacity-100 transition-all duration-150 cursor-pointer flex justify-end items-end p-4">
                <Button type="normal" use="link" target={slug} className="p-4 rounded-md w-16 h-12">
                    <Icon type="normal" use="submit" color="white" scale="2" width={4} fill/>
                </Button>
            </div>
        </div>
    </div>
}

function PlaceAccordion({props}: {props: PlaceData}) {
    const [open, setOpen] = useState<boolean>(false)
    const [mode, setMode] = useState<boolean>(false)

    const { onSubmit, onDelete, setValue, getValue } = useForm(['name', 'desc'], 'place', props.place_id);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res = await onSubmit(e);
        if (res?.ok) {
            setMode(false);
        }
    };
    const [showModal, setShowModal] = useState<boolean>(false)

    return <form onSubmit={handleSubmit} className="w-full p-4 flex flex-col">
        <div className="flex gap-4 items-center">
            <Editable type="input" name='name' text={(getValue('name') as string) ?? props.name} onChange={(v)=>setValue('name', v)} editMode={mode} className='text-2xl'>
                <h3 className="text-2xl">{(getValue('name') as string) ?? props.name}</h3>
            </Editable>
            <Button onClick={() => setOpen(prev => !prev)} type="custom" use="button" className="w-8 rounded-full bg-(--primary) hover:brightness-150">
                <Icon type="normal" use="caret" width={6} color="var(--text)" className="transition-transform duration-150" style={{
                    rotate: open?"-90deg":"90deg"
                }}/>
            </Button>
        </div>
        {open && <div className="p-4 flex flex-col gap-2">
            <Editable type="textarea" name='desc' text={(getValue('desc') as string) ?? props.desc} onChange={(v)=>setValue('desc', v)} editMode={mode} className='opacity-75'>
                <p className="opacity-75">{(getValue('desc') as string) ?? props.desc}</p>
            </Editable>
            {showModal && <Modal message={`Delete ${props.name}?`} type="warning" onConfirm={async () => { await onDelete(); }} onClose={() => setShowModal(false)}/>}
            <div className="flex h-12 gap-2">
                {mode ? <>
                    <Button type='warning' use="button" className='rounded-md w-12' onClick={() => {
                        setMode(false);
                        setValue('name', props.name);
                        setValue('desc', props.desc);
                    }}>
                        <Icon type="normal" use="cancel" width={3} color="white"/>
                    </Button>
                    <Button type='normal' use="submit" className='rounded-md w-12'>
                        <Icon type="normal" use="submit" width={3} color="white" fill/>
                    </Button>
                </> : <>
                    <Button onClick={() => setShowModal(true)} type='warning' use='button' className='rounded-md w-12'>
                        <Icon type="online" use="trash" width={3} color="white" fill/>
                    </Button>
                    <Button type='alternate' use='button' onClick={()=>{
                        setMode(true);
                    }} className='rounded-md w-12'>
                        <Icon type="online" use="edit" width={1} color="var(--bg)"/>
                    </Button>
                </>}
            </div>
        </div>}
    </form>
}

function ContinentPage({props, profiles}: {props: ContinentData, profiles: Profiles}) {
    const slug = createSlug(props.name)

    const { data, isLoading, error } = useFetch<PlaceData>("places", '', {
        eq: {continent_id: props?.continent_id},
        ascend: {
            col: "created_at",
            order: true
        }
    });

    const maxPlace = profiles?.plan === "free" ? 20 : profiles?.plan === "hobbies" ? 25 : 30

    const { onCreate } = useForm([], 'place', data.length > 0 ? data[0].place_id : '')
    const handleCreate = async () => {
        if ( data.length < maxPlace ) {
            const res = await onCreate({
                name: "New Place",
                continent_id: props.continent_id ?? "",
                desc: "Write Description"
            })
            if(res.ok) console.log("Created Succesed!")
        } else alert("Your Reach Maximum Place!")
    }

    const [showModal, setShowModal] = useState<boolean>(false)

    const [mode, setMode] = useState<boolean>(false);
    const { onSubmit, onDelete, setValue, getValue, loading } = useForm(['image', 'name', 'desc'], 'continent', props.continent_id);
    const { upload, uploading } = useUpload("book-cover/continents");

    const [uploadedCover, setUploadedCover] = useState<string | null>(null);
    const currentCover = uploadedCover ?? props.image ?? "";

    const handleCoverUpload = async (e: ChangeEvent<HTMLInputElement> | string | boolean) => {
        if (!e || typeof e !== 'object' || !('target' in e) || !e.target.files) return;

        const url = await upload(e as ChangeEvent<HTMLInputElement>);
        if (url) {
            setUploadedCover(url);
            setValue('image', url);
            setValue('name', props.name);
            setValue('desc', props.desc);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res = await onSubmit(e);
        if (res?.ok) {
            setMode(false);
            setUploadedCover(null);
        }
    };

    if (loading && isLoading) return <Loading message="Continent"/>
    if (error || !data) return <Error err={error || "Continent not found!"}/>
    return <div className="w-full h-full p-4 flex flex-col gap-4 overflow-auto">
        <form onSubmit={handleSubmit} className="w-full h-48 bg-(--primary) rounded-xl flex justify-between items-end p-4 shadow-md">
            <div className="center gap-4 h-full">
                <Editable type="upload" editMode={mode} onChange={handleCoverUpload} uploading={uploading}>
                    {props.image==null||props.image==""?
                        <p>NotFound</p>:
                        <img src={currentCover} alt={props.name} className="h-full" />
                    }
                </Editable>
                <input type="hidden" name="image" value={currentCover} />
                <div className="flex flex-col">
                    <Editable type="input" name='name' text={(getValue('name') as string) ?? props.name} onChange={(v)=>setValue('name', v)} editMode={mode} className='text-2xl font-bold capitalize'>
                        <h2 className="text-2xl font-bold capitalize">{(getValue('name') as string) ?? props.name}</h2>
                    </Editable>
                    <Editable type="textarea" name='desc' text={(getValue('desc') as string) ?? props.desc} onChange={(v)=>setValue('desc', v)} editMode={mode} className='opacity-75'>
                        <p className="opacity-75">{(getValue('desc') as string) ?? props.desc}</p>
                    </Editable>
                </div>
            </div>
            {showModal && <Modal message={`Delete ${props.name}?`} type="warning" onConfirm={async () => { await onDelete(); }} onClose={() => setShowModal(false)}/>}
            <div className='flex h-12 gap-2'>
                {mode ? <>
                    <Button type='warning' use="button" className='rounded-md w-12' onClick={() => {
                        setMode(false);
                        setUploadedCover(null);
                        setValue('name', props.name);
                        setValue('desc', props.desc);
                        setValue('image', props.image);
                    }}>
                        <Icon type="normal" use="cancel" width={3} color="white"/>
                    </Button>
                    <Button type='normal' use="submit" className='rounded-md w-12'>
                        <Icon type="normal" use="submit" width={3} color="white" fill/>
                    </Button>
                </> : <>
                    <Button onClick={() => setShowModal(true)} type='warning' use='button' target={slug} className='rounded-md w-12'>
                        <Icon type="online" use="trash" width={3} color="white" fill/>
                    </Button>
                    <Button type='alternate' use='button' onClick={()=>{
                        setMode(true);
                    }} className='rounded-md w-12'>
                        <Icon type="online" use="edit" width={1} color="var(--bg)"/>
                    </Button>
                </>}
            </div>
        </form>
        <div className="flex gap-4">
            <h2 className="text-4xl font-black">Places ({data.length} / {maxPlace}) :</h2>
            <Button type="normal" use="button" onClick={handleCreate} className="rounded-full w-12">+</Button>
        </div>
        {data.map((item, i) => <PlaceAccordion key={i} props={item}/>)}
    </div>
}

function Continent({props, profiles}: {props: TimelineData[], profiles: Profiles}) {
    const { slug } = useParams<{ slug: string }>()
    const world = props.find((item) => createSlug(`Dunia ${item.name}`) === slug)

    const [isOpen, setOpen] = useState<"map" | "continent">("map")
    const [zoomLevel, setZoomLevel] = useState<number>(1) 

    const { data, isLoading, error } = useFetch<ContinentData>("continents", '', {
        eq: {timeline_id: world?.timeline_id},
        ascend: {
            col: "created_at",
            order: true
        }
    });

    const maxContinent = profiles?.plan === "free" ? 10 : profiles?.plan === "hobbies" ? 15 : 20

    const { onCreate } = useForm([], 'continent', data.length > 0 ? data[0].continent_id : '')
    const handleCreate = async () => {
        if ( data.length < maxContinent ) {
            const res = await onCreate({
                timeline_id: world?.timeline_id ?? "",
                name: "New Continent",
                desc: "Write Description"
            })
            if(res.ok) console.log("Created Succesed!")
        } else alert("Your Reach Maximum Continent!")
    } 

    if (isLoading) return <Loading message="Continents"/>
    if (error || !data) return <Error err={error || "Continents not found!"}/>
    return <div className="flex flex-col w-full h-full overflow-hidden">
        <Routes>
            <Route path="/" element={<div className="w-full h-full flex flex-col overflow-hidden">
                <div className="w-full p-4 flex shrink-0">
                    <Button onClick={() => setOpen("map")} use="button" type="custom" className="w-[50%] h-12 center hover:bg-(--accent) hover:text-(--primary) transition-all ">Map Overview</Button>
                    <Button onClick={() => setOpen("continent")} use="button" type="custom" className="w-[50%] h-12 center hover:bg-(--accent) hover:text-(--primary) transition-all ">World Contintents</Button>
                </div>
                <div className="flex w-full min-h-0 transition-all duration-300" style={{transform: `translateX(-${isOpen === "map" ? 0 : 100}%)`}}>
                    <div className="min-w-full h-full flex flex-col p-4">
                        <div className="w-full h-full overflow-auto">
                            <img src={world?.map || ""} alt={world?.name ?? ""} onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.5))} onContextMenu={(e) => {
                                e.preventDefault();
                                setZoomLevel(prev => Math.max(1, prev - 0.5))
                            }}
                            style={{width:`calc(100% * ${zoomLevel})`}} className="cursor-zoom-in transition-all transition-300 top-0 inline-block vertical-align-center max-w-none"/>
                        </div>
                    </div>
                    <div className="min-w-full p-4 flex flex-col gap-4 overflow-y-scroll">
                        {data.map((item, i)=><div key={i} className="w-full min-h-32 bg-(--primary) rounded-xl shadow-md p-4 flex justify-between items-center">
                            <div className="flex flex-col gap-2">
                                <h2 className="text-2xl font-bold">{item.name}</h2>
                                <p className="text-sm opacity-50">{item.desc}</p>
                            </div>
                            <Button type="normal" use="link" target={createSlug(item.name)} className="rounded-xl">
                                <Icon type="online" use="eye" color="white" fill/>
                            </Button>
                        </div>)}
                        <div className="w-full min-h-32 rounded-xl shadow-md overflow-hidden bg-(--primary)">
                            <form onClick={handleCreate} className="h-full hover:bg-(--accent) center p-4 transition-colors transition-300 center flex-col">
                                <span>{data.length} / {maxContinent}</span>
                                <span className="text-white text-2xl"><code>+</code> Create New Continent</span>
                            </form>
                        </div>
                    </div>
                </div>
            </div>}/>
            {data.map((item, i) => <Route path={createSlug(item.name)} element={<ContinentPage key={i} props={item} profiles={profiles}/>}/>)}
        </Routes>
    </div>
}

export default function World({project_id, profiles}: {project_id: string, profiles: Profiles}) {
    const {data, isLoading, error} = useFetch<TimelineData>("timelines", 'index, name, timeline, timeline_id, map', {
        eq: {
            project_id: project_id
        },
        ascend: {
            col: "index",
            order: true
        }
    })

    if (isLoading) return <Loading message="Timelines"/>
    if (error || !data) return <Error err={error || "Worlds not found!"}/>
    return <section className="w-full h-full">
        <Routes>
            <Route path="/" element={<Carrousel length={(data.length+1)}>
                {data.map((item, i)=><Content key={i} timeline={item.timeline} name={item.name} map={item.map}/>)}
                <section className="w-full h-full center flex-col gap-4">
                    <span className="text-xl">There Is No Continent Anymore!</span>
                    <span className="opacity-75">Create Another on Timline Section</span>
                </section>
            </Carrousel>}/>
            <Route path=":slug/*" element={<Continent props={data} profiles={profiles}/>}/>
        </Routes>
    </section>
}