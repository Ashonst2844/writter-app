import Card from '../Components/Card'
import Button from '../Components/Button'
import Icon from '../Components/Icon'
import Editable from '../Components/Editable'
import Loading from '../Components/Loading'
import Modal from '../Components/Modal'
import Error from '../Components/Error'

import Dashboard from './Dashboard'

import { Route, Routes } from 'react-router-dom'
import { useFetch } from '../../Hooks/useFetch'
import { useForm } from '../../Hooks/useForm'
import { useState, useEffect } from 'react'
import { type Profiles } from "./Dashboard";

interface ProjectData {
    user_id?: string;
    project_id:string;
    created_at:string;
    name:string;
    author?: string | null;
}

function Project(props: ProjectData) {
    const [mode, setMode] = useState<boolean>(false)
    const { result, onSubmit, onDelete, setValue, getValue } = useForm({inputs:['name'], enp:"project", id:props?.project_id})
    const [showModal, setShowModal] = useState<boolean>(false)

    useEffect(()=>{
        if (props.name) setValue('name', props.name)
    }, [props.name, setValue])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const res = await onSubmit(e)
        if (res?.ok) setMode(false)
    }

    if (result.loading) return <Loading message="Project"/>
    if (result.error || !props) return <Error err={result.error || "Project not found!"}/>
    return <Card>
        <form className='flex flex-col justify-between h-full' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4'>
            <Editable type='input' name='name' text={(getValue('name') as string) ?? props.name} onChange={(v)=>setValue('name', v)} editMode={mode} className='text-4xl font-black'>
                <h2 className='text-4xl font-black'>{(getValue('name') as string) ?? props.name}</h2>
            </Editable>
            <span className='opacity-50'>Author: {props.author}</span>
            <span className='opacity-50'>Created: {props.created_at}</span>
        </div>
        {showModal && <Modal message={`Delete ${props.name}?`} type="warning" onConfirm={async () => { await onDelete(); }} onClose={() => setShowModal(false)}/>}
        {mode?<> 
            <Button label={"Cancel Edit "+props.name} type='custom' use='button' onClick={()=>{setMode(false); setValue('name', props.name)}} className='absolute bottom-0 left-0 w-12'>
                <Icon type="normal" use="cancel" width={6} color="var(--warning)" className='opacity-50 hover:opacity-100'/>
            </Button>
            <Button label={"Submit Edit "+props.name} type='custom' use='submit' className='absolute bottom-0 right-0 w-12'>
                <Icon type="normal" use="submit" width={3} fill color="var(--text)" className='opacity-50 hover:opacity-100'/>
            </Button>
            </>:<>
            <Button label={"Delete "+props.name} type='custom' use='button' onClick={() => setShowModal(true)} className='absolute bottom-0 left-0'>
                <Icon type="online" use="trash" width={1} fill color="var(--warning)" className='opacity-50 hover:opacity-100'/>
            </Button>
            <Button label={"Edit "+props.name} type='custom' use='button' onClick={()=>setMode(prev=>!prev)} className='absolute top-0 right-0'>
                <Icon type="online" use="edit" width={1} color="var(--text)" className='opacity-50 hover:opacity-100'/>
            </Button>
            <Button label={"Open "+props.name} type='normal' use='link' target={`/projects/${props.user_id}/dashboard/${props.project_id}`} className='absolute bottom-0 right-0 rounded-md w-24'><p>Open</p></Button>
        </>}
        </form>
    </Card>
}

export default function Projects() {
    useEffect(() => {
        document.title = "UniFiction | Projects"
    }, [])

    const authValue = window.localStorage.getItem("auth");
    const userData = authValue ? JSON.parse(authValue) : null;
    const id = userData?.user?.id ?? ""
    const { data, isLoading: userLoading } = useFetch<Profiles>('user_data', '', {
        eq: {user_id: id || undefined}
    })

    const profiles = data[0]
    const author = profiles?.username;
    
    const { data: project, isLoading: projectLoading, error } = useFetch<ProjectData>("projects", "", {
        eq: {user_id: id || undefined}
    });
    
    const maxProject = profiles?.plan==="free"?1:profiles?.plan==="hobbies"?3:5
    const { onCreate } = useForm({inputs:[], enp:"project", id:id ?? ""});
    const handleCreate = async () => {
        if (project.length < maxProject) {
        const res = await onCreate({
            name: "New Universe",
            author: author,
            user_id: id,
        })
        if(res.ok) console.log("Created Succesed!")
        } else alert("Your Reach Maximum Project!")
    } 

    if (projectLoading || userLoading) return <Loading message="Projects"/>
    if (error) return <Error err={error || "Character not found!"}/>
    return <main>
        <Routes>
            <Route path='/' element={<section className='px-8'>
                <div className='border-x-2 border-neutral-700 py-2 h-screen flex flex-col gap-4'>
                    <div className='text-center center border-y-2 border-neutral-700'>
                        <div className='flex flex-col gap-2'>
                            <div className='flex items-center gap-4'>
                                <Button label='Back' use='link' type='custom' target='/' className='hover:brightness-125'>
                                    <Icon type='online' use='exit' fill color='var(--warning)' className='rotate-180'/>
                                </Button>
                                <h1 className='text-4xl font-bold uppercase'>Universes</h1>
                            </div>
                            <span className='opacity-50'>{author || "User"}</span>
                        </div>
                    </div>
                    <div className='grid gap-2 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] lg:grid-cols-3'>
                        {project.map(item => <Project key={item.project_id} author={item.author} user_id={item.user_id} name={item.name} created_at={item.created_at.slice(0,10)} project_id={item.project_id}/>) }
                        <div className="min-h-60 w-full bg-(--primary) shadow-xl border-y-2 border-neutral-700">
                            <form onClick={handleCreate} className="h-full w-full hover:bg-(--accent) center flex-col gap-2">
                                <code className='text-xl'>{project.length} / {maxProject}</code>
                                <span className="text-white text-xl"><code>+</code> Create New Universe</span>
                            </form>
                        </div>
                    </div>
                </div>
            </section>}/>
            <Route path='/dashboard/:id/*' element={<Dashboard projects={project} profiles={profiles}/>}/>
        </Routes>
    </main>
}