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
}

export default function Button(props: ButtonProps) {
    const buttonStyle = `text-base p-2 center hover:outline hover:outline-white hover:brightness-150 ${props.type=="alternate"?
        "bg-(--text) text-(--bg)":props.type=="warning"?"bg-(--warning) text-(--text)":"bg-(--accent) text-white"
    } ${props.className?props.className:""}` 

    const handleClick: MouseEventHandler<HTMLElement> = (event) => {
        if (props.use !== "submit") {
            event.preventDefault();
            event.stopPropagation();
        }

        props.onClick?.(event);
    };

    if (props.use==="link") {
        return <Link to={props.target||"#"} style={props.style} className={props.type=="custom"?props.className:buttonStyle}>{props.children}</Link> 
    }
    if (props.use==="button") {
        return <button type={'button'} onClick={handleClick} style={props.style} className={props.type=="custom"?props.className:buttonStyle}>
            {props.children}
        </button>
    }
    if (props.use==="submit") {
        return <button type={'submit'} onClick={handleClick} style={props.style} className={props.type=="custom"?props.className:buttonStyle}>
            {props.children}
        </button>
    }
    if (props.use==="url") {
        return <a href={props.target} style={props.style} className={props.type=="custom"?props.className:buttonStyle} target="_blank">
            {props.children}
        </a>
    }
    
}