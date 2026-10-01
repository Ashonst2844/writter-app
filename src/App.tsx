import './App.css'
import { Routes, Route, Navigate } from "react-router-dom"
import { lazy, Suspense } from 'react'

import Loading from './assets/UI/Components/Loading'

const Projects = lazy(() => import("./assets/UI/Pages/Projects"))
const Register = lazy(() => import("./assets/UI/Pages/Landing/Register"))
const Protected = lazy(() => import("./assets/UI/Pages/ProtectedRoute"))
const Terms = lazy(() => import("./assets/UI/Pages/Landing/Terms"))
const Privacy = lazy(() => import("./assets/UI/Pages/Landing/Privacy"))
const Changelog = lazy(() => import("./assets/UI/Pages/Landing/Changelog"))
const Landing = lazy(() => import("./assets/UI/Pages/Landing/Landing"))
const ResetPassword = lazy(() => import("./assets/UI/Pages/Landing/ResetPassword"))

export default function App() {
  return <main className='relative'>
    <Suspense fallback={<Loading message="Page..."/>}>
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
    </Suspense>
  </main>
}