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

interface Profiles {
  username: string;
  email: string;
  plan: 'free' | 'hobbies' | 'professionals'
}

interface ProjectData {
  user_id?: string;
  project_id:string;
  created_at:string;
  name:string;
  author?: string | null;
}

function Project(props: ProjectData) {
  const [mode, setMode] = useState<boolean>(false)
  const { onSubmit, onDelete, loading, setValue, getValue } = useForm(['name'], 'project', props.project_id)
  const [showModal, setShowModal] = useState<boolean>(false)

  useEffect(()=>{
    if (props.name) setValue('name', props.name)
  }, [props.name, setValue])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await onSubmit(e)
    if (res?.ok) setMode(false)
  }

  if(loading) return <Loading message='Project'/>
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
      <div className='flex w-full h-12 justify-end gap-2'>
        {mode?<> 
          <Button type='warning' use='button' onClick={()=>{
            setMode(false) 
            setValue('name', props.name)}} className='rounded-md w-12'>
              <Icon type="normal" use="cancel" width={6} color="var(--text)"/>
            </Button>
          <Button type='normal' use='submit' className='rounded-md w-12'>
            <Icon type="normal" use="submit" width={3} fill color="var(--text)"/>
          </Button>
        </>:<>
          <Button type='warning' use='button' onClick={() => setShowModal(true)} className='rounded-md w-12 h-12'>
            <Icon type="online" use="trash" width={1} fill color="white"/>
          </Button>
          <Button type='alternate' use='button' onClick={()=>setMode(prev=>!prev)} className='rounded-md w-12 h-12'>
            <Icon type="online" use="edit" width={1} color="var(--bg)"/>
          </Button>
          <Button type='normal' use='link' target={`/projects/${props.user_id}/dashboard/${props.project_id}`} className='rounded-md w-25'><p>Open</p></Button>
        </>
        }
      </div>
    </form>
  </Card>
}

export default function Projects() {
  const authValue = window.localStorage.getItem("auth");
  const userData = authValue ? JSON.parse(authValue) : null;
  const id = userData?.user?.id ?? ""
  const { data, isLoading: userLoading } = useFetch<Profiles>('user_data', '', {
    eq: {
      user_id: id || undefined
    }
  })

  const profiles = data[0]
  console.log(profiles)

  const maxProject = profiles?.plan==="free"?1:profiles?.plan==="hobbies"?3:10
  const author = profiles?.username;

  const { data: project, isLoading: projectLoading, error } = useFetch<ProjectData>("projects", "", {
    eq: {
      user_id: id || undefined
    }
  });

  const { onCreate } = useForm([], "project", id);
  const handleCreate = async () => {
    if (data.length < maxProject) {
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
  return (
    <main>
        <Routes>
          <Route path='/' element={
            <section className='p-4'>
              <div className='text-center mb-4 relative'>
                <h1 className='text-4xl font-bold uppercase'>Universes</h1>
                <span className='opacity-50'>{author || "User"}</span>
                <Button use='link' type='custom' target='/' className='absolute top-0 left-0 hover:brightness-125'>
                  <Icon type='online' use='exit' fill width={6} color='var(--warning)'/>
                </Button>
              </div>
              <div className='w-full center p-4'>
                <code className='text-xl'>{data.length} / {maxProject} Projects</code>
              </div>
              <div className='grid gap-2 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] lg:grid-cols-3'>
                {project.map(item => <Project key={item.project_id} author={item.author} user_id={item.user_id} name={item.name} created_at={item.created_at.slice(0,10)} project_id={item.project_id}/>) }
                <div className="h-full w-full bg-(--primary) shadow-xl rounded-xl overflow-hidden">
                  <form onClick={handleCreate} className="h-full w-full p-4 flex flex-col hover:bg-(--accent) center transition-colors transition-300">
                    <span className="text-white text-xl"><code>+</code> Create New Universe</span>
                  </form>
                </div>
              </div>
            </section>
          }/>
          <Route path='/dashboard/:id/*' element={<Dashboard projects={project} profiles={profiles}/>}/>
        </Routes>
    </main>
  )
}