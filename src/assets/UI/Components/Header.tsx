import Button from "./Button"
import Icon from "./Icon"

import AI from "../Pages/Widgets/AI";
import Pin from "../Pages/Widgets/Pin";

import { type PinEntry, getPins } from "../../Utils/Pinning";
import type { Profiles } from "../Pages/Dashboard";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header({title, desc, profiles}: {title: string, desc: string, profiles: Profiles}) {
    const nav = useNavigate()
    const [openOverlay, setOpenOverlay] = useState<null|"pin"|"chat">(null)
    const [widget, setWidget] = useState<boolean>(false)

    const [pin, setPin] = useState<PinEntry[] | []>([])
    const handlePin = () => {
        setPin(getPins)
        setOpenOverlay("pin")
        setWidget(false)
    }
    
    const handleChat = () => {
        setOpenOverlay("chat")
        setWidget(false)
    }

    return <>
        <header className="w-full flex justify-between p-2 bg-(--primary) items-center">
            <div className="flex gap-4 items-center">
                <Button label="Back" type="custom" use="button" onClick={() => nav(-1)} className="w-12 h-12 bg-(--primary) rotate-180 hover:brightness-125">
                    <Icon type="normal" use="caret" color="var(--warning)" width={6}/>
                </Button>
                <div className="flex flex-col gap-2">
                    <h2 className="text-md lg:text-2xl uppercase font-black opacity-75">{title}</h2>
                    <span className="text-sm opacity-75 hidden lg:block">{desc}</span>
                </div>
            </div>
            {widget && <div className="grid grid-cols-1 lg:grid-cols-2 bg-(--primary) shadow-xl absolute right-16 top-4 z-50">
                <Button label="Pinned Widget" onClick={handlePin} type="custom" use="button" className="h-12 flex items-center gap-4 p-2 bg-(--primary) hover:brightness-125">
                    <Icon type="online" use="pin" color="var(--text)" fill scale="0.75"/>
                    <span>Pinned Items</span>
                </Button>
                <Button label="AI Companio Widget" onClick={handleChat} type="custom" use="button" className="h-12 flex items-center gap-4 p-2 bg-(--primary) hover:brightness-125">
                    <Icon type="online" use="assistant" color="var(--text)" fill scale="0.75"/>
                    <span>AI Companion</span>
                </Button>
                <Button label="Support Dev" use="url" type="custom" target="https://trakteer.id/masagusahmadramadhan" className="h-12 flex items-center gap-4 p-2 bg-(--primary) hover:brightness-125">
                    <Icon type="online" use="donate" color="var(--text)" fill scale="0.75"/>
                    <span>Support Dev</span>
                </Button>
            </div>}
            <Button label="Widget List" type="custom" use="button" onClick={() => setWidget(prev => !prev)} className="w-12 h-12 bg-(--primary) hover:brightness-125">
                <Icon type="normal" use="burger" color="var(--text)" width={3}/>
            </Button>
        </header>
        {/*//* Overlay */}
        {openOverlay && <div className="absolute w-full h-full bg-black/75 z-60 p-4 overflow-hidden">
            <Button label="Close" type="warning" use="button" onClick={() => setOpenOverlay(null)} className="z-70 w-12 h-12 absolute top-0 right-0 m-4 rounded-md">
                <Icon type="normal" use="cancel" color="var(--text)" width={6}/>
            </Button>
            {openOverlay=="pin"?<Pin pin={pin}/>:openOverlay=="chat"?<AI profiles={profiles}/>:null}
        </div>}
    </> 
}