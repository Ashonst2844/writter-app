import Card from './assets/UI/Components/Card'
import Button from './assets/UI/Components/Button'
import Icon from './assets/UI/Components/Icon'
import Editable from './assets/UI/Components/Editable'
import Loading from './assets/UI/Components/Loading'

import Dashboard from './assets/UI/Pages/Dashboard'

import './App.css'
import { Route, Routes } from 'react-router-dom'
import { useFetch } from './assets/Hooks/useFetch'
import { useState, useEffect } from 'react'
import { useForm } from './assets/Hooks/useForm'

interface ProjectData {
  project_id:string;
  created_at:string;
  name:string;
}

function Projects(props: ProjectData) {
  const [mode, setMode] = useState<boolean>(false)
  const { onSubmit, loading, setValue, getValue } = useForm(['name'], 'project', props.project_id)

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
        <span className='opacity-50'>Author: Masagus Ahmad Ramadhan</span>
        <span className='opacity-50'>Created: {props.created_at}</span>
      </div>
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
          <Button type='alternate' use='button' onClick={()=>setMode(prev=>!prev)} className='rounded-md w-12 h-12'>
            <Icon type="online" use="edit" width={1} color="var(--bg)"/>
          </Button>
          <Button type='normal' use='link' target={`/dashboard/${props.project_id}`} className='rounded-md w-25'><p>Open</p></Button>
        </>
        }
      </div>
    </form>
  </Card>
}

export default function App() {
  const {data, isLoading} = useFetch<ProjectData>("projects", '')

  if (isLoading) return <Loading message="Projects"/>
  return (
    <main>
        <Routes>
          <Route path='/' element={
            <section className='p-4'>
              <div className='text-center mb-4'>
                <h1 className='text-4xl font-bold uppercase'>Universes</h1>
                <span className='opacity-50'>Masagus Ahmad Ramadhan</span>
              </div>
              <div className='grid gap-2 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] lg:grid-cols-3'>
                {data.map((item)=><Projects key={item.project_id} name={item.name} created_at={item.created_at.slice(0,10)} project_id={item.project_id}/>) }
              </div>
            </section>
          }/>
          <Route path='/dashboard/:id/*' element={<Dashboard projects={data}/>}/>
        </Routes>
    </main>
  )
}
