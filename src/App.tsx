import './App.css'
import { Routes, Route } from "react-router-dom"

import Projects from "./assets/UI/Pages/Projects"
import Register from './assets/UI/Pages/Landing/Register'
import Terms from './assets/UI/Pages/Landing/Terms'
import Privacy from './assets/UI/Pages/Landing/Privacy'
import Changelog from './assets/UI/Pages/Landing/Changelog'
import Landing from "./assets/UI/Pages/Landing/Landing"

export default function App() {
  return <main className='relative'>
    <Routes>
      <Route path='/' element={<Landing/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/terms-of-services' element={<Terms/>}/>
      <Route path='/privacy-policy' element={<Privacy/>}/>
      <Route path='/changelog' element={<Changelog/>}/>
      <Route path='/projects/:user_id/*' element={<Projects/>}/>
    </Routes>
  </main>
}