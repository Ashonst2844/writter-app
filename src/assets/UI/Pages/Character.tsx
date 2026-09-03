import Button from "../Components/Button"
import Card from "../Components/Card";
import Editable from "../Components/Editable";
import Icon from "../Components/Icon";
import Loading from "../Components/Loading";

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useFetch } from "../../Hooks/useFetch"
import { useForm } from "../../Hooks/useForm";
import { Routes, Route, useParams } from "react-router-dom";

interface CharacterProps {
    character_id: string;
    name: string;
    age: number;
    desc: string;
    gender: "male"|"female";
    faction: "good"|"neutral"|"evil";
}

const createSlug = (text: string) => text.toLowerCase().trim().replace(/\s+/g, "-")

function CharacterCard(props: CharacterProps) {
    const slug = createSlug(props.name)
    const {onDelete} = useForm([], "character", props.character_id)

    return <Card>
        <div className="h-full flex flex-col justify-between">
            <h2 className="text-4xl font-black">{props.name}</h2>
            <div className='flex w-full h-12 justify-end gap-4'>
                <Button onClick={onDelete} type='warning' use="button" target={slug} className='rounded-md w-12'>
                    <Icon type="normal" use="cancel" width={3} color="white"/>
                </Button>
                <Button type='normal' use='link' target={slug} className='rounded-md w-12'>
                    <Icon type="normal" use="burger" width={3} color="white"/>
                </Button>
            </div>
        </div>
    </Card>
}

function CharacterPage({props, loading}: {props: CharacterProps[]; loading: boolean}) {
    const { slug } = useParams<{ slug: string }>()
    const character = props.find((item) => createSlug(item.name) === slug)

    const [mode, setMode] = useState<boolean>(false)
    const { onSubmit, loading: formLoading, setValue, getValue } = useForm(['name','age','gender','faction','desc'], 'character', character?.character_id ?? "")

    useEffect(()=>{
        if (!character) return
        setValue('name', character.name)
        setValue('age', character.age)
        setValue('gender', character.gender)
        setValue('faction', character.faction)
        setValue('desc', character.desc)
    }, [character, setValue])

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const res = await onSubmit(e)
        if (res?.ok) setMode(false)
    }

    if (loading && formLoading) return <div className="p-4">
        <p className="opacity-50 mb-4">Memuat karakter...</p>
    </div>;
    else if (!character) return <div className="p-4">
        <p className="opacity-50 mb-4">Karakter tidak ditemukan.</p>
        <Button type="normal" use="link" target="..">Back To List!</Button>
    </div>

    return <form onSubmit={handleSubmit} className="w-full h-full p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-4">
            <Editable type="input" name='name' text={(getValue('name') as string) ?? character.name} onChange={(v)=>setValue('name', v)} editMode={mode} className='text-4xl font-black'>
                <h1 className="text-4xl font-black">{(getValue('name') as string) ?? character.name}</h1>
            </Editable>
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
            <span>Faction :
                <Editable type="option" list={['good','neutral','evil']} name='faction' text={(getValue('faction') as string) ?? character.faction} onChange={(v)=>setValue('faction', v)} editMode={mode}>
                    <strong className="capitalize"> {(getValue('faction') as string) ?? character.faction}</strong>
                </Editable>
            </span>
            <div className="mt-4">
                <h2 className="text-2xl font-bold mb-2 opacity-50">Description</h2>
                <Editable type="textarea" name="desc" text={(getValue('desc') as string) ?? character.desc} onChange={(v)=>setValue('desc', v)} editMode={mode} className="text-justify w-full">
                    <p className="text-justify">{(getValue('desc') as string) ?? character.desc}</p>
                </Editable>
            </div>
            <div className='flex w-full h-12 justify-end gap-4 z-90'>
                {mode?<> 
                    <Button type='warning' use='button' onClick={()=>{
                        setMode(false)
                        setValue('name', character.name)
                        setValue('age', character.age)
                        setValue('gender', character.gender)
                        setValue('faction', character.faction)
                        setValue('desc', character.desc)
                    }} className='rounded-full w-12'>
                        <Icon type="normal" use="cancel" color="white" width={3}/>
                    </Button>
                    <Button type='normal' use='submit' className='rounded-full w-12'><p>{formLoading ? '...' : <Icon type="normal" use="submit" color="white" fill width={1}/>}</p></Button>
                </>:<Button type='alternate' use='button' onClick={()=>setMode(prev=>!prev)} className='rounded-full w-12 h-12'>
                    <Icon type="online" use="edit" width={1} color="var(--bg)"/>
                </Button>}
            </div>
        </div>
    </form>
}

export default function Character() {
    const {data, loading} = useFetch<CharacterProps>("characters")
    const characterData = data ?? []
    const [searchQ, setSearchQ] = useState<string>("")

    const { onCreate } = useForm([], 'character', "", {
        name: "Name",
        age: 0,
        desc: "Write Description",
        gender: "male",
        faction: "neutral"
    })

    if (loading) {
        return <Loading message="Characters"/>
    }
    return <section className="w-full h-full flex flex-col gap-4">
        <div className="w-full h-12 flex">
            <input autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck="false" value={searchQ} onChange={(e: ChangeEvent<HTMLInputElement>) => 
                setSearchQ(e.target.value)
            } type="text" placeholder="Search characters..." className="w-full h-full bg-(--primary) p-4 m-4 rounded-xl"/>
        </div>
        <Routes>
            <Route path="/" element={<div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] lg:grid-cols-3 p-4">
                {data?.map((item) => item.name.includes(searchQ) && <CharacterCard key={item.character_id} {...item}/>)}
                <div className="h-full w-full bg-(--primary) shadow-2xl rounded-2xl overflow-hidden">
                    <form onClick={onCreate} className="h-full w-full p-4 flex flex-col hover:bg-(--accent) center transition-colors transition-300">
                        <span className="text-white text-2xl"><code>+</code> Create New Character</span>
                    </form>
                </div>
            </div>}/>
            <Route path=":slug" element={<CharacterPage props={characterData} loading={loading}/>}/>
        </Routes>
    </section>
}