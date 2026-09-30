import { Password } from "./Register"
import Button from "../../Components/Button"

import { useState, type FormEvent } from "react";
import { supabase } from "../../../Utils/supabase";

interface PassChangeProps {
    loading: boolean;
    message: {type: "success"|"error", text: string} | null
}

export default function ResetPassword() {
    const [passChange, setPassChange] = useState<PassChangeProps>({
        loading: false,
        message: null
    })

    const handleUpdatePassword = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPassChange(prev => ({...prev, loading: true}))
        setPassChange(prev => ({...prev, message: null}))

        const formData = new FormData(e.currentTarget)
        const password = formData.get("password") as string

        const { error } = await supabase.auth.updateUser({
            password: password,
        });

        if (error) {
            setPassChange(prev => ({...prev, message: {type: "error", text: error.message}}))
        } else {
            setPassChange(prev => ({...prev, message: {type: "success", text: "Password Changed, try Sign-in again with new Password!"}}))
            setPassChange(prev => ({...prev, email:""}))
        }
        setPassChange(prev => ({...prev, loading: false}))
    };

    return <main className="w-screen h-screen center">
        <form onSubmit={handleUpdatePassword} className="w-[40%] p-4 bg-(--primary) rounded-xl flex flex-col gap-4">
            <Password name="password" placeholder="Enter New Password"/>
            <Button type="normal" use="submit" className="h-12 rounded-md">Update!</Button>
            {passChange.message && <div className="w-full center text-sm">
                <p style={{color:passChange.message.type==="success"?"var(--success)":"var(--warning)"}}>({passChange.message.type}) {passChange.message.text}</p>
            </div>}
        </form>
    </main>
}