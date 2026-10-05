import Icon from "./Icon";
import {type MouseEventHandler, type ReactNode, type CSSProperties} from "react";
import { Link } from "react-router-dom";

interface ButtonProps {
    type: "normal"|"alternate"|"warning"|"custom";
    use?: "button"|"link"|"submit"|"url";
    target?: string;
    onClick?: MouseEventHandler<HTMLElement>;
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
    disabled?: boolean
    label?: string
}

export function BackButton() {
    return <Button label="Back Previous" type="warning" use="link" target="../" className="w-12 h-12 rounded-full fixed bottom-0 right-0 m-4 z-100">
        <Icon type="normal" use="caret" width={6} color="white" className="rotate-180"/>
    </Button>
}

export default function Button(props: ButtonProps) {
    const buttonStyle = `text-base p-2 center ${props.disabled?"opacity-50 brightness-50":"hover:outline hover:outline-white hover:brightness-150"} ${props.type=="alternate"?
        "bg-white text-(--bg)":props.type=="warning"?"bg-(--warning) text-white":"bg-(--accent) text-white"
    } ${props.className?props.className:""}` 

    const handleClick: MouseEventHandler<HTMLElement> = (event) => {
        if (props.use !== "submit") {
            event.preventDefault();
            event.stopPropagation();
        }

        props.onClick?.(event);
    };

    if (props.use==="link") {
        return <Link aria-label={props.label+" Button"} to={props.target||"#"} style={props.style} className={props.type=="custom"?props.className:buttonStyle}>{props.children}</Link> 
    }
    if (props.use==="button") {
        return <button aria-label={props.label+" Button"} disabled={props.disabled} type={'button'} onClick={handleClick} style={props.style} className={props.type=="custom"?props.className:buttonStyle}>
            {props.children}
        </button>
    }
    if (props.use==="submit") {
        return <button aria-label={props.label+" Button"} type={'submit'} onClick={handleClick} style={props.style} className={props.type=="custom"?props.className:buttonStyle}>
            {props.children}
        </button>
    }
    if (props.use==="url") {
        const href = props.target || undefined;
        const isHashLink = !!props.target && props.target.startsWith("#");

        return <a aria-label={props.label+" Button"} href={href} style={props.style} className={props.type=="custom"?props.className:buttonStyle} target={isHashLink ? undefined : "_blank"}>
            {props.children}
        </a>
    }
    
}