import Button from "../../Components/Button"
import Icon from "../../Components/Icon"
import Loading from "../../Components/Loading"

import { useState, type FormEvent } from "react"
import { supabase } from "../../../Utils/supabase"

function Password({name, placeholder} :{name: string, placeholder: string}) {
    const [state, setState] = useState<boolean>(false)
    return <div className="w-full h-12 flex gap-2">
        <input type={state?"text":"password"} name={name} placeholder={placeholder} className="w-[80%] h-full shadow-inner bg-(--bg) p-2" required/>
        <Button type={state?"normal":"alternate"} use="button" className="w-[20%] h-full rounded-md" onClick={() => setState(e => !e)}>
            <Icon type="online" use="eye" color={state?"white":"var(--bg)"} fill/>
        </Button>
    </div> 
}

const toErrorMessage = (err: unknown) => {
    if (err instanceof Error) return err.message;
    if (typeof err === "string") return err;
    return "Unexpected error";
}

export default function Register() {
    const [mode, setMode] = useState<boolean>(false)
    const inputStyle = "w-full h-12 shadow-inner p-2 bg-(--bg)"

    const [loading, setLoading] = useState<boolean>(false)

    const handleSignUP = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(false)

        const formData = new FormData(e.currentTarget)
        const email = formData.get("email") as string
        const password = formData.get("password") as string
        const c_password = formData.get("c_password") as string
        const username = formData.get("username") as string

        if (password !== c_password) {
            alert("Password Doesn't Match")
            return
        }

        const {data, error: authErr} = await supabase.auth.signUp({
            email, 
            password,
        })
        if (authErr) throw new Error(authErr.message)

        const user = data?.user;
        if (!user) throw new Error("User creation failed.")

        try {
            setLoading(true)
            const { error: profileError } = await supabase.from('user_data').insert([
                {
                    user_id: user.id,
                    username: username,
                },
            ]);

            if (profileError) throw new Error(profileError.message);
        } catch (err) {
            setLoading(false)
            alert("Sign-Up Failed!")
            console.error(err)
            return { ok: false, error: toErrorMessage(err) };
        } finally {
            setLoading(false)
            setMode(true)
        }
    }

    const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(false)

        const formData = new FormData(e.currentTarget)
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        try {
            const {data, error} = await supabase.auth.signInWithPassword({
                email, 
                password,
            })
            if (error) throw new Error(error.message)
    
            window.localStorage.setItem("auth", JSON.stringify(data))
            alert("Sign-In Successfully! Please Back!")
            location.reload()
        } catch (err) {
            setLoading(false)
            alert("Sign-In Failed! Wrong Email/Password Please Back!")
            console.error(err)
            return { ok: false, error: toErrorMessage(err) };
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <Loading message="Register"/>
    return <main className="w-screen h-screen flex relative">
        <section className="w-[50%] h-full center flex-col gap-4">
            <form onSubmit={handleSignUP} className="w-[60%] bg-(--primary) shadow-xl p-8 flex flex-col gap-8">
                <input type="text" name="username" placeholder="Username" className={inputStyle} required/>
                <input type="email" name="email" placeholder="Email" className={inputStyle} required/>
                <Password name="password" placeholder="Password"/>
                <Password name="c_password" placeholder="Confirm Password"/>
                <Button type="normal" use="submit" className="h-12 w-full rounded-md">Sign-Up</Button>
            </form>
        </section>
        <section className="w-[50%] h-full center flex-col gap-4">
            <form onSubmit={handleSignIn} className="w-[60%] bg-(--primary) shadow-xl p-8 flex flex-col gap-8">
                <input type="email" name="email" placeholder="Email" className={inputStyle} required/>
                <Password name="password" placeholder="Password"/>
                <Button type="normal" use="submit" className="h-12 w-full rounded-md">Sign-In</Button>
            </form>
        </section>
        <section className="center w-[50%] text-white h-full absolute top-0 left-0 transition-all duration-300 flex-col gap-8" style={{
            transform: `translateX(${mode?"0":"100%"})`,
            background:`linear-gradient(${mode?"90":"-90"}deg, var(--accent), var(--bg))`
        }}>
            <h1 className="font-black text-4xl">{mode?"Sign-In":"Sign-Up"}</h1>
            <p className="w-[50%] opacity-75 text-center">{mode?"Create Your Account, If You Have One, Click Sign-In Button!":"Please Sign-In Your Account, If You Don't Have One, Click Sign-Up Button!"}</p>
            <div className="flex gap-2 w-[50%]">
                <Button type="alternate" use="button" onClick={() => setMode(e => !e)} className="w-[50%] h-12 rounded-md">{mode?"Sign-Up":"Sign-In"}</Button>
                <Button type="warning" use="link" target="/" className="w-[50%] h-12 rounded-md">Back</Button>
            </div>
        </section>
    </main>
}