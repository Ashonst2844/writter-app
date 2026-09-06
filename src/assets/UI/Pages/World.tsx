import Carrousel from "../Components/Carrousel"
import Loading from "../Components/Loading"
import Icon from "../Components/Icon"
import Button from "../Components/Button"
import Editable from "../Components/Editable"

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import { Routes, Route, useParams } from "react-router-dom" 
import { useFetch } from "../../Hooks/useFetch"
import { supabase } from "../../Utils/supabase"
import { useForm } from "../../Hooks/useForm"
import { useUpload } from "../../Hooks/useUpload"

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
                    <Button onClick={onDelete} type='warning' use='button' className='rounded-md w-12'>
                        <Icon type="normal" use="cancel" width={3} color="white"/>
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

function ContinentPage({props, loading}: {props: ContinentData, loading: boolean}) {
    const slug = createSlug(props.name)
    const [placeLoading, isLoading] = useState<boolean>(false)
    const [placeData, setData] = useState<PlaceData[]>([])

    useEffect(() => {
        let isMounted = true
        if (!props.continent_id) return
                        
        const fetch = async () => {
            isLoading(true)
            const { data, error } = await supabase
                .from('places')
                .select('*', { count: 'exact' })
                .eq('continent_id', props?.continent_id)
                .order('created_at', { ascending: true })

            if (!isMounted) return

            if (error) {
                console.error(`Error fetching:`, error)
            } else {
                setData((data ?? []) as PlaceData[])
            }
            isLoading(false)
        }

        fetch()

        return () => {
            isMounted = false
        }
    }, [props.continent_id])

    const { onCreate } = useForm([], 'place', "", {
        name: "New Place",
        continent_id: props.continent_id ?? "",
        desc: "Write Description"
    })

    const [mode, setMode] = useState<boolean>(false);
    const { onSubmit, onDelete, setValue, getValue } = useForm(['image', 'name', 'desc'], 'continent', props.continent_id);
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

    if (loading || placeLoading) return <Loading message="Continent"/>
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
                    <Button onClick={onDelete} type='warning' use='button' target={slug} className='rounded-md w-12'>
                        <Icon type="normal" use="cancel" width={3} color="white"/>
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
            <h2 className="text-4xl font-black">Places :</h2>
            <Button type="normal" use="button" onClick={onCreate} className="rounded-full w-12">+</Button>
        </div>
        {placeData.map((item, i) => <PlaceAccordion key={i} props={item}/>)}
    </div>
}

function Continent({props, loading}: {props: TimelineData[]; loading: boolean}) {
    const { slug } = useParams<{ slug: string }>()
    const world = props.find((item) => createSlug(`Dunia ${item.name}`) === slug)

    const [isOpen, setOpen] = useState<"map" | "continent">("map")
    const [zoomLevel, setZoomLevel] = useState<number>(1) 

    const [continentLoading, isLoading] = useState<boolean>(false)
    const [continentData, setData] = useState<ContinentData[]>([])

    useEffect(() => {
        let isMounted = true
        if (!world?.timeline_id) return
                        
        const fetch = async () => {
            isLoading(true)
            const { data, error } = await supabase
                .from('continents')
                .select('*', { count: 'exact' })
                .eq('timeline_id', world?.timeline_id)
                .order('created_at', { ascending: true })

            if (!isMounted) return

            if (error) {
                console.error(`Error fetching:`, error)
            } else {
                setData((data ?? []) as ContinentData[])
            }
            isLoading(false)
        }

        fetch()

        return () => {
            isMounted = false
        }
    }, [world?.timeline_id])

    const { onCreate } = useForm([], 'continent', "", {
        name: "New Continent",
        timeline_id: world?.timeline_id ?? "",
        desc: "Write Description"
    })

    if (loading || continentLoading) return <Loading message="Continents"/>
    return <div className="flex flex-col w-full h-full overflow-hidden">
        <Routes>
            <Route path="/" element={<>
                <div className="w-full p-4 flex">
                    <Button onClick={() => setOpen("map")} use="button" type="custom" className="w-[50%] h-12 center hover:bg-(--accent) hover:text-(--primary) transition-all ">Map Overview</Button>
                    <Button onClick={() => setOpen("continent")} use="button" type="custom" className="w-[50%] h-12 center hover:bg-(--accent) hover:text-(--primary) transition-all ">World Contintents</Button>
                </div>
                <div>
                </div>
                <div className="flex w-full h-[calc(100%-48px)] transition-all duration-300" style={{transform: `translateX(-${isOpen === "map" ? 0 : 100}%)`}}>
                    <div className="min-w-full h-full flex flex-col p-4">
                        <div className="w-full h-full overflow-auto">
                            <img src={world?.map || ""} alt={world?.name ?? ""} onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.5))} onContextMenu={(e) => {
                                e.preventDefault();
                                setZoomLevel(prev => Math.max(1, prev - 0.5))
                            }}
                            style={{width:`calc(100% * ${zoomLevel})`}} className="cursor-zoom-in transition-all transition-300 top-0 inline-block vertical-align-center max-w-none"/>
                        </div>
                    </div>
                    <div className="min-w-full h-full p-4 flex flex-col gap-4 overflow-auto">
                        {continentData.map((item, i)=><div key={i} className="w-full h-32 bg-(--primary) rounded-xl shadow-md p-4 flex justify-between items-center">
                            <div className="flex flex-col gap-2">
                                <h2 className="text-2xl font-bold">{item.name}</h2>
                                <p className="text-sm opacity-50">{item.desc}</p>
                            </div>
                            <Button type="normal" use="link" target={createSlug(item.name)} className="rounded-xl">
                                <Icon type="online" use="eye" color="white" fill/>
                            </Button>
                        </div>)}
                        <div className="w-full h-32 rounded-xl shadow-md overflow-hidden bg-(--primary)">
                            <form onClick={onCreate} className="h-full hover:bg-(--accent) center p-4 transition-colors transition-300">
                                <span className="text-white text-2xl"><code>+</code> Create New Continent</span>
                            </form>
                        </div>
                    </div>
                </div>
            </>}/>
            {continentData.map((item, i) => <Route path={createSlug(item.name)} element={<ContinentPage key={i} props={item} loading={loading}/>}/>)}
        </Routes>
    </div>
}

export default function World() {
    const {data, loading} = useFetch<TimelineData>("timelines")
    const sortedData = data.sort((a, b) => a.index - b.index)

    if (loading) return <Loading message="Timelines"/>

    return <section className="w-full h-full">
        <Routes>
            <Route path="/" element={<Carrousel length={(data.length+1)}>
                {sortedData.map((item, i)=><Content key={i} timeline={item.timeline} name={item.name} map={item.map}/>)}
                <div className="min-h-full min-w-full p-4">
                    <form className="h-full w-full p-4 flex flex-col hover:bg-(--accent) center transition-colors transition-300 rounded-2xl">
                        <span className="text-white text-2xl"><code>+</code> Create New Timeline</span>
                    </form>
                </div>
            </Carrousel>}/>
            <Route path=":slug/*" element={<Continent props={sortedData} loading={loading}/>}/>
        </Routes>
    </section>
}