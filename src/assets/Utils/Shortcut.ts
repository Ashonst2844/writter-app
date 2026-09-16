import { useEffect } from "react";

interface Combinator {
    ctrl?: boolean,
    alt?: boolean,
    shift?: boolean,
    key: string
}

export default function Shortcut(combine: Combinator, callback: (e: KeyboardEvent) => void) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const combinator = 
            (combine.ctrl ?? false) === e.ctrlKey &&
            (combine.alt ?? false) === e.altKey &&
            (combine.shift ?? false) === e.shiftKey &&
            e.key.toLowerCase() === combine.key.toLowerCase()

            if(combinator) {
                e.preventDefault()
                callback(e)
            }
        } 

        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [combine, callback])
}