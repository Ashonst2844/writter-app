import Button from "../../Components/Button"
import Icon from "../../Components/Icon"
import Loading from "../../Components/Loading"

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import { supabase } from "../../../Utils/supabase"

interface PasswordProps {
    name: string;
    placeholder: string;
    isNormal?: boolean;
    onScoreChange?: (score: number) => void;
}
interface PassChangeProps {
    email: string;
    loading: boolean;
    message: {type: "success"|"error", text: string} | null
}

export function Password(props :PasswordProps) {
    const [state, setState] = useState<boolean>(false)
    
    const [input, setInput] = useState<string>('')
    const requirements = [
        { text: "minimal 8 karakter", cond: input.length >= 8 },
        { text: "terdiri dari 1 huruf kecil", cond: /[a-z]/.test(input) },
        { text: "terdiri dari 1 huruf besar", cond: /[A-Z]/.test(input) },
        { text: "terdiri dari 1 angka", cond: /\d/.test(input) },
        { text: "terdiri dari 1 simbol", cond: /[^a-zA-Z0-9]/.test(input) },
    ];

    const score = requirements.filter(req => req.cond == true).length * (100 / requirements.length)
    useEffect(() => {
        props.onScoreChange?.(score)
    }, [score, props.onScoreChange])
    const stage = () => {
        if(score <= 40) return "Bad"
        if(score >= 40 && score <= 60) return "Good"
        else return "Best"
    }

    return <>
        <div className="w-full h-12 flex gap-2">
            <input type={state?"text":"password"} onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)} name={props.name} placeholder={props.placeholder} className="w-[80%] h-full shadow-inner bg-(--bg) p-2" required/>
            <Button label="Hide/Show Password" type={state?"normal":"alternate"} use="button" className="w-[20%] h-full rounded-md" onClick={() => setState(e => !e)}>
                <Icon type="online" use="eye" color={state?"white":"var(--bg)"} fill/>
            </Button>
        </div> 
        {!props.isNormal && <div className="w-full flex flex-col gap-2">
            <p className="text-center">{score}% ({stage()})</p>
            <div className="w-full grid gap-2" style={{gridTemplateColumns: `repeat(${requirements.length}, 1fr)`}}>
                {requirements.map((item, i) => <div key={i} className="w-full h-2 rounded-md" style={{backgroundColor: item.cond?"var(--accent)":"var(--bg)"}}/>)}
            </div>
        </div>}
    </>
}

const toErrorMessage = (err: unknown) => {
    if (err instanceof Error) return err.message;
    if (typeof err === "string") return err;
    return "Unexpected error";
}

export default function Register() {
    useEffect(() => {
        document.title = "Writer App | Register"
    }, [])

    const [mode, setMode] = useState<0|1|2>(0)
    const inputStyle = "w-full h-12 shadow-inner p-2 bg-(--bg)"

    const [loading, setLoading] = useState<boolean>(false)
    const [passwordScore, setPasswordScore] = useState(0)

    const [passChange, setPassChange] = useState<PassChangeProps>({
        email: '',
        loading: false,
        message: null
    })

    const handleChangePassword = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(!passChange.email) return
        setPassChange(prev => ({...prev, loading: true}))
        setPassChange(prev => ({...prev, message: null}))

        const redirectUrl = `${window.location.origin}/reset-password`;

        const { error } = await supabase.auth.resetPasswordForEmail(passChange.email.toLowerCase().trim(), {
            redirectTo: redirectUrl,
        });

        if (error) {
            setPassChange(prev => ({...prev, message: {type: "error", text: error.message}}))
        } else {
            setPassChange(prev => ({...prev, message: {type: "success", text: "Link Reset has been Send to your Inbox!"}}))
            setPassChange(prev => ({...prev, email:""}))
        }

        setPassChange(prev => ({...prev, loading: false}))
    }

    const handleSignUP = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(false)

        const formData = new FormData(e.currentTarget)
        const form = {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            c_password: formData.get("c_password") as string,
            username: formData.get("username") as string,
        }

        if (form.password !== form.c_password) {
            alert("Password Doesn't Match")
            return
        }
        if (passwordScore <= 60) {
            alert("Password Doesn't Strong Enough!")
            return
        }

        const {data, error: authErr} = await supabase.auth.signUp({
            email: form.email, 
            password: form.password,
        })
        if (authErr) throw new Error(authErr.message)

        const user = data?.user;
        if (!user) throw new Error("User creation failed.")

        try {
            setLoading(true)
            const { error: profileError } = await supabase.from('user_data').insert([
                {
                    user_id: user.id,
                    username: form.username,
                    email: form.email.toLowerCase().trim(),
                },
            ]);

            if (profileError) {
                if (profileError.code === "23505") {
                    alert("Email has been registered! Use another Email")
                    return
                }
            }
            alert("Registered Succes!")
        } catch (err) {
            setLoading(false)
            alert("Sign-Up Failed!")
            console.error(err)
            return { ok: false, error: toErrorMessage(err) };
        } finally {
            setLoading(false)
            setMode(1)
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
    return <main className="w-screen h-screen overflow-x-hidden">
        <section className="w-screen h-full flex transition-transform duration-150" style={{
            transform: `translateX(calc(-100% * ${mode}))`
        }}> {/* Page Controller */}
            <div className="h-full min-w-screen center"> {/* Sign Up */}
                <div className="flex gap-4 w-full md:w-[70%]">
                    <form onSubmit={handleSignUP} className="w-full lg:w-[50%] bg-(--primary) shadow-xl p-4 md:p-8 flex flex-col gap-8">
                        <input type="text" name="username" placeholder="Username" className={inputStyle} required/>
                        <input type="email" name="email" placeholder="Email" className={inputStyle} required/>
                        <Password name="password" placeholder="Password" onScoreChange={setPasswordScore}/>
                        <Password name="c_password" placeholder="Confirm Password" isNormal/>
                        <Button label="Sign-Up" type="normal" use="submit" className="h-12 w-full rounded-lg">Sign-Up</Button>
                        <div className="flex flex-col gap-4 lg:hidden">
                            <hr className="w-full border-2 border-(--bg)"/>
                            <div className="w-full flex gap-2">
                                <Button label="Change Mode" type="alternate" use="button" onClick={() => setMode(1)} className="w-[50%] h-12 rounded-md">Sign-In</Button>
                                <Button label="Back" type="warning" use="link" target="/" className="w-[50%] h-12 rounded-md">Back</Button>
                            </div>
                        </div>
                    </form>
                    <div className="w-full p-4 hidden lg:w-[50%] lg:flex items-center justify-center flex-col rounded-2xl bg-(--accent) gap-4 text-white">
                        <h1 className="font-black text-4xl">Sign-Up</h1>
                        <p className="w-[50%] opacity-75 text-center">Create Your Account</p>
                        <p className="w-[50%] opacity-75 text-center">If You Have One, Click Sign-In Button!</p>
                        <div className="flex gap-2 w-[50%]">
                            <Button label="Change Mode" type="alternate" use="button" onClick={() => setMode(1)} className="w-[50%] h-12 rounded-md">Sign-In</Button>
                            <Button label="Back" type="warning" use="link" target="/" className="w-[50%] h-12 rounded-md">Back</Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-full min-w-screen center"> {/* Sign In */}
                <div className="flex gap-4 w-full md:w-[70%]">
                    <form onSubmit={handleSignIn} className="w-full lg:w-[50%] bg-(--primary) shadow-xl p-4 md:p-8 flex flex-col gap-8">
                        <input type="email" name="email" placeholder="Email" className={inputStyle} required/>
                        <Password name="password" placeholder="Password" isNormal/>
                        <Button label="Sign-In" type="normal" use="submit" className="h-12 w-full rounded-md">Sign-In</Button>
                        <Button label="Forgot Password" type="custom" use="button" onClick={() => setMode(2)} className="text-center underline hover:opacity-75">Forgot Password</Button>
                        <div className="flex flex-col gap-4 lg:hidden">
                            <hr className="w-full border-2 border-(--bg)"/>
                            <div className="w-full flex gap-2">
                                <Button label="Change Mode" type="alternate" use="button" onClick={() => setMode(0)} className="w-[50%] h-12 rounded-md">Sign-In</Button>
                                <Button label="Back" type="warning" use="link" target="/" className="w-[50%] h-12 rounded-md">Back</Button>
                            </div>
                        </div>
                    </form>
                    <div className="w-full p-4 hidden lg:w-[50%] lg:flex items-center justify-center flex-col rounded-2xl bg-(--accent) gap-4 text-white">
                        <h1 className="font-black text-4xl">Sign-In</h1>
                        <p className="w-[50%] opacity-75 text-center">Please Sign-In Your Account</p>
                        <p className="w-[50%] opacity-75 text-center">If You Don't Have One, Click Sign-Up Button!</p>
                        <div className="flex gap-2 w-[50%]">
                            <Button label="Change Mode" type="alternate" use="button" onClick={() => setMode(0)} className="w-[50%] h-12 rounded-md">Sign-Up</Button>
                            <Button label="Back" type="warning" use="link" target="/" className="w-[50%] h-12 rounded-md">Back</Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-full min-w-screen center"> {/* Forgot Password */}
                <div className="flex gap-4 w-full md:w-[70%]">
                    <form onSubmit={handleChangePassword} className="w-full bg-(--primary) p-4 rounded-lg flex flex-col gap-4">
                        <input type="email" name="email" placeholder="Email (email@example.com)" className={inputStyle} value={passChange.email} onChange={e => setPassChange(prev => ({...prev, email:e.target.value}))} required/>
                        <Button label="Send Link" type="normal" use="submit" className="h-12 rounded-md">Kirim Link!</Button>
                        {passChange.message && <div className="w-full center text-sm">
                            <p style={{color:passChange.message.type==="success"?"var(--success)":"var(--warning)"}}>({passChange.message.type}) {passChange.message.text}</p>
                        </div>}
                        <Button label="Cancel" type="custom" use="button" onClick={() => setMode(0)} className="text-center underline hover:opacity-75">Cancel</Button>
                    </form>
                </div>
            </div>
        </section>
    </main>
}