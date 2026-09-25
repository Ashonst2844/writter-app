import Button from "../Components/Button"
import Card from "../Components/Card";
import Editable from "../Components/Editable";
import Icon from "../Components/Icon";
import Loading from "../Components/Loading";
import Error from "../Components/Error";
import Modal from "../Components/Modal";
import Badge from "../Components/Badge";

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useFetch } from "../../Hooks/useFetch"
import { useForm } from "../../Hooks/useForm";
import { Routes, Route, useParams } from "react-router-dom";

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
interface Profiles {
    username: string;
    email: string;
    plan: "free"|"hobbies"|"professionals";
}

const createSlug = (text: string) => text.toLowerCase().trim().replace(/\s+/g, "-")

function CharacterCard(props: CharacterProps) {
    const slug = createSlug(props.name)
    const {onDelete} = useForm([], "character", props.character_id)
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
                <h2 className="text-4xl font-black">{props.name}</h2>
                <span className="opacity-75 text-sm">{props.desc.slice(0, 100)}{props.desc.length >= 100 ? "..." : ""}</span>
            </div>
            <div className='flex w-full h-12 justify-end gap-2 relative'>
                <Button onClick={() => setShowModal(true)} type='warning' use="button" target={slug} className='rounded-md w-12'>
                    <Icon type="online" use="trash" width={3} color="white" fill/>
                </Button>
                {showModal && <Modal message={`Delete ${props.name}?`} type="warning" onConfirm={async () => { await onDelete(); }} onClose={() => setShowModal(false)}/>}
                <Button type={pinned ? "normal" : "alternate"} use='button' className='rounded-md w-12' onClick={handlePin}>
                    <Icon type="online" use="pin" color={pinned ? "var(--text)" : "var(--primary)"} fill/>
                </Button>
                <Button type='normal' use='link' target={slug} className='rounded-md w-12'>
                    <Icon type="normal" use="burger" width={3} color="white"/>
                </Button>
            </div>
        </div>
    </Card>
}

function CharacterPage({props, error}: {props: CharacterProps[], error: Error | null}) {
    const { slug } = useParams<{ slug: string }>()
    const character = props.find((item) => createSlug(item.name) === slug)

    const [mode, setMode] = useState<boolean>(false)
    const { onSubmit, loading, setValue, getValue } = useForm(['name','age','gender','desc','stats'], 'character', character?.character_id ?? "")

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

    if (loading) return <Loading message="Characters"/>
    if (error || !character) return <Error err={error || "Character not found!"}/>
    return <form onSubmit={handleSubmit} className="w-full h-full p-4 flex flex-col gap-4">
        <input type="hidden" name="stats" value={JSON.stringify(statValues)} />
        <div className="flex flex-col gap-4">
            <Editable type="input" name='name' text={(getValue('name') as string) ?? character.name} onChange={(v)=>setValue('name', v)} editMode={mode} className='text-4xl font-black'>
                <h1 className="text-4xl font-black">{(getValue('name') as string) ?? character.name}</h1>
                <div className="flex gap-2">
                    {traits.map((item, i) => <Badge key={i} content={item}/>)}
                </div>
            </Editable>
            <div className="flex gap-4 flex-col">
                <span>Age : 
                    <Editable type="input" name='age' text={(getValue('age') as number) ?? character.age} onChange={(v)=>setValue('age', v)} editMode={mode}>
                        <strong> {(getValue('age') as number) ?? character.age}</strong>
                    </Editable>
                </span>
                <span>Gender : 
                    <Editable type="option" list={['male','female']} name='gender' text={(getValue('gender') as string) ?? character.gender} onChange={(v)=>setValue('gender', v)} editMode={mode}>
                        <strong className="capitalize"> {(getValue('gender') as string) ?? character.gender}</strong>
                    </Editable>
                </span>
                <div className="grid grid-cols-2 grid-rows-3 gap-1">
                    {category.map((item, i) => <div key={i} className="flex gap-2 flex-col">
                        <div className="flex relative tooltip">
                            <span className="opacity-75 text-sm">{item.name}</span>
                            <p className="duration-150 transition-all tooltip-text w-48 absolute opacity-0 right-[50%] translate-x-[-50%] bg-(--primary) p-2 rounded-md shadow-md">{item.desc}</p>
                        </div>
                        {mode ? <input name={item.name.toLowerCase()} type="number" min={0} max={5} value={Number(statValues[i] ?? 0)} onChange={(e) => {
                                const nextStats = [...(statValues ?? character.stats)]
                                nextStats[i] = Number(e.target.value)
                                setValue('stats', nextStats)
                            }}
                        /> :
                        <>
                            <div className="flex h-2 gap-1">
                                {Array.from({length: 5}, (_, j) => {
                                    const on = (j+1) <= statValues[i]
                                    return <div key={j} className="w-12 h-full rounded-md" style={{backgroundColor: on?"var(--accent)":"var(--primary)"}}/>
                                })}
                            </div>
                        </>    
                    }
        </div>)} 
                </div>
            </div>
            <div className="mt-4">
                <h2 className="text-2xl font-bold mb-2 opacity-50">Description</h2>
                <Editable type="textarea" name="desc" text={(getValue('desc') as string) ?? character.desc} onChange={(v)=>setValue('desc', v)} editMode={mode} className="text-justify w-full">
                    <p className="text-justify">{(getValue('desc') as string) ?? character.desc}</p>
                </Editable>
            </div>
            <div className='flex w-full h-12 justify-end gap-2 z-90'>
                {mode?<> 
                    <Button type='warning' use='button' onClick={()=>{
                        setMode(false)
                        setValue('name', character.name)
                        setValue('age', character.age)
                        setValue('gender', character.gender)
                        setValue('desc', character.desc)
                    }} className='rounded-md w-12'>
                        <Icon type="normal" use="cancel" color="white" width={3}/>
                    </Button>
                    <Button type='normal' use='submit' className='rounded-md w-12'><p>{loading ? '...' : <Icon type="normal" use="submit" color="white" fill width={1}/>}</p></Button>
                </>:<Button type='alternate' use='button' onClick={()=>setMode(prev=>!prev)} className='rounded-md w-12 h-12'>
                    <Icon type="online" use="edit" width={1} color="var(--bg)"/>
                </Button>}
            </div>
        </div>
    </form>
}

export default function Character({project_id, profiles}: {project_id: string, profiles: Profiles}) {
    const {data, isLoading, error} = useFetch<CharacterProps>("characters", '', {
        eq: {
            project_id: project_id
        }
    })
    const [searchQ, setSearchQ] = useState<string>("")

    const maxCharacter = profiles?.plan === "free" ? 10 : profiles?.plan === "hobbies" ? 15 : 25

    const { onCreate } = useForm([], 'character', data.length > 0 ? data[0].character_id : '')
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
    return <section className="w-full h-full flex flex-col gap-4">
        <Routes>
            <Route path="/" element={<div className="flex flex-col gap-4">
                <div className="w-full h-12 flex">
                    <input autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck="false" value={searchQ} onChange={(e: ChangeEvent<HTMLInputElement>) => 
                        setSearchQ(e.target.value)
                    } type="text" placeholder="Search characters..." className="w-full h-full bg-(--primary) p-4 m-4 rounded-xl"/>
                </div>
                <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] lg:grid-cols-3 p-4">
                    {data?.map((item) => item.name.includes(searchQ) && <CharacterCard key={item.character_id} {...item}/>)}
                    <div className="h-full w-full bg-(--primary) shadow-2xl rounded-2xl overflow-hidden">
                        <form onClick={handleCreate} className="min-h-60 w-full p-4 flex flex-col hover:bg-(--accent) center transition-colors transition-300">
                            <span>{data.length} / {maxCharacter}</span>
                            <span className="text-white text-2xl"><code>+</code> Create New Character</span>
                        </form>
                    </div>
                </div>
            </div>}/>
            <Route path=":slug" element={<CharacterPage props={data} error={error}/>}/>
        </Routes>
    </section>
}