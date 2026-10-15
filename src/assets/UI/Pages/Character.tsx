import Button from "../Components/Button"
import Card from "../Components/Card";
import Editable from "../Components/Editable";
import Icon from "../Components/Icon";
import Loading from "../Components/Loading";
import Error from "../Components/Error";
import Modal from "../Components/Modal";
import Badge from "../Components/Badge";
import Header from "../Components/Header";

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useFetch } from "../../Hooks/useFetch"
import { useForm } from "../../Hooks/useForm";
import { Routes, Route, useParams } from "react-router-dom";
import { type Profiles } from "./Dashboard";
import { Slug } from "../../Utils/Sanitizer";

import Pinning, {getPins} from "../../Utils/Pinning";
import Trait from "../../Utils/Trait";

interface CharacterProps {
    character_id: string;
    name: string;
    age: number;
    desc: string;
    gender: "male"|"female";
    stats: number[]
}

function CharacterCard(props: CharacterProps) {
    const {onDelete} = useForm({inputs: [], enp:"character", id:props.character_id})
    const [showModal, setShowModal] = useState(false)

    const [pinned, setPinned] = useState<boolean>(() => getPins().some((item) => item.id === props.character_id && item.type === "Character"))

    const handlePin = () => {
        const head = `${props?.name} | ${props?.age}`
        const body = `<div className="flex flex-col justify-center">
            <p>${Trait(props?.stats || [])}</p>
            <p>${props?.desc}</p>
        </div>`

        Pinning(head , body, "Character", props.character_id)
        setPinned(prev => !prev)
    }

    return <Card>
        <div className="h-full flex flex-col justify-between relative">
            <div className="flex flex-col gap-2">
                <h2 className="text-xl md:text-4xl font-black">{props.name}</h2>
                <span className="opacity-75 text-sm">{props.desc.slice(0, 100)}{props.desc.length >= 100 ? "..." : ""}</span>
            </div>
            <Button label={"Delete Character " + props.name} onClick={() => setShowModal(true)} type='custom' use="button" className='absolute top-0 right-0'>
                <Icon type="online" use="trash" width={3} color="var(--warning)" fill className="opacity-50 hover:opacity-100"/>
            </Button>
            {showModal && <Modal message={`Delete ${props.name}?`} type="warning" onConfirm={async () => { await onDelete(); }} onClose={() => setShowModal(false)}/>}
            <Button label={pinned ? "Unpin Character " + props.name : "Pin Character " + props.name} type="custom" use='button' className='absolute bottom-0 left-0' onClick={handlePin}>
                <Icon type="online" use="pin" color={pinned ? "var(--accent)" : "var(--text)"} fill className="opacity-50 hover:opacity-100"/>
            </Button>
            <Button label={"Edit " + props.name} type='normal' use='link' target={Slug(props.name)} className='absolute bottom-0 right-0 w-24 h-12 rounded-md'>Open</Button>
        </div>
    </Card>
}

function CharacterPage({props}: {props: CharacterProps[]}) {
    const { slug } = useParams<{ slug: string }>()
    const character = props.find((item) => Slug(item.name) === slug)

    const [mode, setMode] = useState<boolean>(false)
    const { onSubmit, result, setValue, getValue } = useForm({inputs:['name','age','gender','desc','stats'], enp:'character', id:character?.character_id ?? ""})

    useEffect(()=>{
        if (!character) return
        setValue('name', character.name)
        setValue('age', character.age)
        setValue('gender', character.gender)
        setValue('desc', character.desc)
        setValue('stats', character.stats)
    }, [character, setValue])

    const traits = Trait(character?.stats || []) 
    const category = [
        {name: "Appearencce", desc: "Informasi tentang penampilan karakter dan kharisma yang dia pancarkan (Menarik atau tidak)"},
        {name: "Morality", desc: "Informasi tentang moral karakter, bagaimana sikap dia kepada orang lain dan sekitar (Baik atau Jahat)"},
        {name: "Phsychology", desc: "Informasi tentang psikologi dan kewarasan karakter (Waras atau Gila)"},
        {name: "Combat", desc: "Informasi tentang kemampuan bela diri karakter dan keberaniannya"},
        {name: "Social", desc: "Informasi tentang bagaimana karakter bersosial dengan orang orang lain (Introvert atau Extrovert)"},
        {name: "Intelligence", desc: "Infromasi tentang kapasitas otak karakter (Bodoh atau Pintar)"}
    ]

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const res = await onSubmit(e)
        if (res?.ok) setMode(false)
    }
    const statValues = (getValue('stats') as number[] | undefined) ?? character?.stats ?? [0,0,0,0,0,0]

    if (result.loading) return <Loading message="Characters"/>
    if (result.error || !character) return <Error err={result.error || "Character not found!"}/>
    return <form onSubmit={handleSubmit} className="w-full h-full flex flex-col gap-4">
        <input type="hidden" name="stats" value={JSON.stringify(statValues)} />
        <div className="flex flex-col gap-4">
            <div className="border-y-2 border-neutral-700 w-full grid grid-rows-1 lg:grid-cols-3 gap-4">
                <div className="p-4 w-full h-full border-2 border-neutral-700 flex items-center">
                    <Editable type="input" name='name' text={(getValue('name') as string) ?? character.name} onChange={(v)=>setValue('name', v)} editMode={mode} className='text-4xl font-black'>
                        <h1 className="text-xl md:text-4xl font-black">{(getValue('name') as string) ?? character.name}</h1>
                    </Editable>
                </div>
                <div className="flex flex-col gap-2 p-4 w-full h-full border-2 border-neutral-700">
                    <span>Age:</span>
                    <Editable type="input" name='age' text={(getValue('age') as number) ?? character.age} onChange={(v)=>setValue('age', v)} editMode={mode} className="text-2xl">
                        <strong className="text-2xl"> {(getValue('age') as number) ?? character.age}</strong>
                    </Editable>
                </div>
                <div className="flex flex-col gap-2 p-4 w-full h-full border-2 border-neutral-700">
                    <span>Gender:</span>
                    <Editable type="option" list={['male','female']} name='gender' text={(getValue('gender') as string) ?? character.gender} onChange={(v)=>setValue('gender', v)} editMode={mode} className="text-2xl">
                        <strong className="capitalize text-2xl"> {(getValue('gender') as string) ?? character.gender}</strong>
                    </Editable>
                </div>
            </div>
            <div className="md:flex grid grid-cols-2 gap-2 overflow-x-scroll border-y-2 border-neutral-700 p-2">
                {traits.map((item, i) => <Badge key={i} content={item}/>)}
            </div>
            <div className="flex gap-4 flex-col p-2 border-y-2 border-neutral-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    {category.map((item, i) => <div key={i} className="flex gap-2 flex-col">
                        <div className="flex relative tooltip">
                            <span className="opacity-75 text-sm">{item.name}</span>
                            <p className="duration-150 transition-all tooltip-text w-48 absolute opacity-0 left-[50%] lg:right-[50%] translate-x-[-50%] bg-(--primary) p-2 rounded-md shadow-md">{item.desc}</p>
                        </div>
                        {mode ? <input name={item.name.toLowerCase()} type="number" min={0} max={5} value={Number(statValues[i] ?? 0)} onChange={(e) => {
                            const nextStats = [...(statValues ?? character.stats)] 
                            nextStats[i] = Number(e.target.value) 
                            setValue('stats', nextStats)}}
                        />:<div className="flex h-2 gap-1">
                            {Array.from({length: 5}, (_, j) => { const on = (j+1) <= statValues[i]
                                return <div key={j} className="w-12 h-full rounded-md" style={{backgroundColor: on?"var(--accent)":"var(--primary)"}}/>
                            })}
                        </div>}
                    </div>)} 
                </div>
            </div>
            <div className="p-2 border-y-2 border-neutral-700">
                <h2 className="text-2xl font-bold mb-2 opacity-50">Description</h2>
                <Editable type="textarea" name="desc" text={(getValue('desc') as string) ?? character.desc} onChange={(v)=>setValue('desc', v)} editMode={mode} className="text-justify w-full">
                    <p className="text-justify">{(getValue('desc') as string) ?? character.desc}</p>
                </Editable>
            </div>
            <div className='flex w-full border-y-2 border-neutral-700 h-16 z-90'>
                {mode?<> 
                    <Button label="Cancel" type='custom' use='button' onClick={()=>{
                        setMode(false)
                        setValue('name', character.name)
                        setValue('age', character.age)
                        setValue('gender', character.gender)
                        setValue('desc', character.desc)
                    }} className='w-full h-full center gap-2 hover:bg-(--warning)'>
                        <span>Cancel</span>
                    </Button>
                    <Button label="Save Changes" type='custom' use='submit' className='w-full h-full center gap-2 hover:bg-(--accent)'>
                        <span>{result.loading ? "..." : "Confirm"}</span>
                    </Button>
                </>:<Button label="Edit Character" type='custom' use='button' onClick={()=>setMode(prev=>!prev)} className='h-full w-full center gap-2 hover:bg-(--accent)'>
                    <Icon type="online" use="edit" width={2} color="var(--text)"/>
                    <span>Edit</span>
                </Button>}
            </div>
        </div>
    </form>
}

export default function Character({project_id, profiles}: {project_id: string, profiles: Profiles}) {
    const {data, isLoading, error} = useFetch<CharacterProps>("characters", '', {
        eq: {project_id: project_id}
    })
    const [searchQ, setSearchQ] = useState<string>("")

    const maxCharacter = profiles?.plan === "free" ? 30 : profiles?.plan === "hobbies" ? 60 : 100

    const { onCreate } = useForm({inputs:[], enp:'character', id:data.length > 0 ? data[0].character_id : ''})
    const handleCreate = async () => {
        if (data.length < maxCharacter) {
            const res = await onCreate({
                project_id: project_id,
                name: "Name",
                age: 0,
                desc: "Write Description",
                gender: "male",
                stats: [0,0,0,0,0]
            })
            if(res.ok) console.log("Created Succesed!")
        } else alert("Your Reach Maximum Character!")
    } 

    if (isLoading) return <Loading message="Characters"/>
    if (error || !data) return <Error err={error || "Characters not found!"}/>
    return <section className="w-full h-full relative">
        <Header title="Character Development" desc="Create And Customize Character!" profiles={profiles}/>
        <div className="px-8">
            <div className="min-h-screen w-full flex flex-col py-4 border-x-2 border-neutral-700">                
                <Routes>
                    <Route path="/" element={<div className="flex flex-col gap-4 overflow-y-auto">
                        <div className="w-full h-12 flex">
                            <input autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck="false" value={searchQ} onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQ(e.target.value)} type="text" placeholder="Search characters..." className="w-full h-full p-4 border-y-2 border-neutral-700"/>
                        </div>
                        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] lg:grid-cols-3">
                            {data?.sort((a, b) => a?.name?.toLowerCase()?.localeCompare(b?.name?.toLowerCase()))?.map((item) => item.name.includes(searchQ) && <CharacterCard key={item.character_id} {...item}/>)}
                            <div className="h-full w-full bg-(--primary) border-y-2 border-neutral-700 shadow-2xl">
                                <form onClick={handleCreate} className="min-h-40 md:min-h-60 w-full p-4 flex flex-col hover:bg-(--accent) center">
                                    <span>{data.length} / {maxCharacter}</span>
                                    <span className="text-white text-2xl"><code>+</code> Create New Character</span>
                                </form>
                            </div>
                        </div>
                    </div>}/>
                    <Route path=":slug" element={<CharacterPage props={data}/>}/>
                </Routes>
            </div>
        </div>
    </section>
}