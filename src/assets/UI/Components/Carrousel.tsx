import Button from "./Button"
import Icon from "./Icon"

import { useState, type ReactNode } from "react"

export default function Carrousel({length, children}: {length:number, children:ReactNode}) {
    const [index, setIndex] = useState<number>(0)
    const handlePrev = () => {
        setIndex((prev) => (prev === 0 ? length - 1 : prev - 1));
    }
    const handleNext = () => {
        setIndex((prev) => (prev === length - 1 ? 0 : prev + 1));
    }

    return <div className="overflow-x-hidden center w-full h-full">
        <div className="flex h-full w-full transition-transform transition-300" style={{transform: `translateX(-${100 * index}%)`}}>
            {children}
        </div>
        <div className="absolute center gap-4 bottom-0 w-auto h-16">
            <Button onClick={handlePrev} type="custom" use="button" className="hover:brightness-150 bg-(--primary)/20 w-16 h-16 center rounded-full">
                <Icon type="normal" use="caret" width={4} color="var(--text)" scale="50%" className="rotate-180"></Icon>
            </Button>
            <div className="flex gap-4">
                {Array.from({length}, (_,i) => <Button className="w-2 h-2 rounded-full border border-(--text)" key={i} onClick={()=>setIndex(i)} type="custom" use="button" style={{
                    backgroundColor:index==i?"var(--text)":"var(--bg)"
                }}>{""}</Button>)}
            </div>
            <Button onClick={handleNext} type="custom" use="button" className="hover:brightness-150 bg-(--primary)/20 w-16 h-16 center rounded-full p-0">
                <Icon type="normal" use="caret" width={4} color="var(--text)" scale="50%" ></Icon>
            </Button>
        </div>
    </div>
}
