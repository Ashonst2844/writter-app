import './App.css'
import { Routes, Route, Navigate } from "react-router-dom"

import Projects from "./assets/UI/Pages/Projects"
import Register from './assets/UI/Pages/Landing/Register'
import Terms from './assets/UI/Pages/Landing/Terms'
import Privacy from './assets/UI/Pages/Landing/Privacy'
import Changelog from './assets/UI/Pages/Landing/Changelog'
import Landing from "./assets/UI/Pages/Landing/Landing"
import Protected from './assets/UI/Pages/ProtectedRoute'
import ResetPassword from './assets/UI/Pages/Landing/ResetPassword'

export default function App() {
  return <main className='relative'>
    <Routes>
      {/* Public Routes */}
      <Route path='/' element={<Landing/>}/>
      <Route path='/terms-of-services' element={<Terms/>}/>
      <Route path='/privacy-policy' element={<Privacy/>}/>
      <Route path='/changelog' element={<Changelog/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/reset-password' element={<ResetPassword/>}/>
      
      {/* Fallback Routes */}
      <Route path='*' element={<Navigate to="/register" replace/>}/>
      
      {/* Protected Routes */}
      <Route element={<Protected/>}>
        <Route path='/projects/:user_id/*' element={<Projects/>}/>
      </Route>
    </Routes>
  </main>
}