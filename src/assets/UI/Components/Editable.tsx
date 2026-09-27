import Button from "./Button";
import Icon from "./Icon";

import { useRef, useEffect, type ReactNode, type ChangeEvent } from "react";
import { useFormat } from "../../Hooks/useFormat";
import { Sanitizer } from "../../Utils/Sanitizer";

interface EditableProps {
    type: "input"|"textarea"|"option"|"date"|"checklist"|"upload"|"richedit";
    text?: string | number | boolean;
    name?: string;
    children?: ReactNode;
    editMode: boolean;
    className?: string;
    onChange?: (e: string | boolean | ChangeEvent<HTMLInputElement>) => void;
    onClick?: () => void;
    list?: string[];
    uploading?: boolean;
}

export function RichText({ value, onChange, editMode, onClickView, className }: {value: string, onChange: (e: string) => void, editMode: boolean, onClickView: () => void, className: string}) {
    const editorRef = useRef<HTMLDivElement>(null)    
    const { executeCommand, handleKeyDown, clearFormat } = useFormat([editorRef])

    useEffect(()=>{
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || "";
        }
    }, [value, editMode])

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    if (!editMode) {
        return <div>
            <div onClick={onClickView} dangerouslySetInnerHTML={{ __html: value || "<p class='opacity-50'>Klik untuk mengedit...</p>" }} className={`p-4 bg-(--primary) border hover:border-white cursor-pointer transition-all whitespace-pre-wrap leading-relaxed ${className ?? ""}`}>
            </div>
            <span className="text-xs text-neutral-500 mt-2 block">Klik teks untuk mengedit & meformat</span>
        </div>
    }
    
    return <div className="flex flex-col gap-4">
        <div className="flex gap-2">
            <Button type="alternate" use="button" className="w-12 rounded-xl" onClick={() => {
                navigator.clipboard.writeText(Sanitizer(value))
                alert("Copy To Clipboard!")
            }}>
                <Icon type="normal" use="copy" color="black" width={3}/>
            </Button>
            <Button type="normal" use="button" onClick={() => executeCommand("bold")} className="w-12 rounded-xl font-bold">
                B
            </Button>
            <Button type="normal" use="button" onClick={() => executeCommand("italic")} className="w-12 rounded-xl italic">
                I
            </Button>
            <Button type="normal" use="button" onClick={() => executeCommand("underline")} className="w-12 rounded-xl underline">
                U
            </Button>
            <Button type="normal" use="button" onClick={clearFormat} className="w-12 rounded-xl">
                CF
            </Button>
        </div>

        <div ref={editorRef} contentEditable onInput={handleInput} onKeyDown={handleKeyDown} className={`w-full min-h-30 p-4 bg-(--primary) rounded-xl focus:outline-none focus:ring-2 focus:ring-white resize-y overflow-auto ${className ?? ""}`}/>
    </div>
} 

export default function Editable(props:EditableProps) {
    const today = new Date();
    const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const date = minDate.toISOString().split('T')[0]

    if (!props.editMode) return props.children

    if (props.type == "input") {
        return <input type="text" name={props.name} value={String(props.text ?? "")} onChange={(e) => props.onChange?.(e.target.value)} className={props.className}></input>
    }
    if (props.type == "textarea") {
        return <textarea name={props.name} value={String(props.text ?? "")} onChange={(e) => props.onChange?.(e.target.value)} className={props.className}></textarea>
    }
    if (props.type == "option") {
        return <select name={props.name} value={String(props.text ?? "")} onChange={(e)=>props.onChange?.(e.target.value)}>
            {(props.list ?? []).map((item, i)=> <option key={i} value={item}>{item.toUpperCase()}</option>)}
        </select>
    }
    if (props.type == "date") {
        return <input min={date} type="date" name={props.name} value={String(props.text ?? "")} onChange={(e)=>props.onChange?.(e.target.value)} />
    }
    if (props.type == "checklist") {
        const checked = Boolean(props.text)
        return <input type="checkbox" name={props.name} checked={checked} onChange={(e)=>props.onChange?.(e.target.checked)} />
    }
    if (props.type == "upload") {
        return <input type="file" name={props.name} accept="image/*" onChange={(e) => props.onChange?.(e)} disabled={props.uploading} className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 cursor-pointer"/>
    }
    if (props.type == "richedit") {
        return <RichText value={props.text?.toString() ?? ""} onChange={props.onChange ?? (() => {})} editMode={props.editMode} onClickView={props.onClick ?? (() => {})} className="w-full text-justify text-base font-sans min-h-30 p-4 bg-(--primary) rounded-xl focus:outline-none focus:ring-2 focus:ring-white resize-y overflow-auto" />
    }

    return null
}
