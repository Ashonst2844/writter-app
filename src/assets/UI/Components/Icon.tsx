import { type CSSProperties } from "react";

interface IconProps {
    type:"normal"|"online";
    use:string;
    color?:string;
    width?:number;
    scale?:string;
    fill?:boolean;
    className?:string;
    style?: CSSProperties
}

export default function Icon(props: IconProps) {
    if (props.type=="normal") {
        return <svg viewBox="0 0 100 100" stroke={props.color} strokeWidth={props.width} fill={props.fill?props.color:"none"} className={`${props.className?props.className:"w-full h-full"}`} xmlns="http://www.w3.org/2000/svg" style={{scale:props.scale, width: '100%', height: '100%', ...props.style}}>
            {
                props.use==="caret"?
                <polyline points="40,20 60,50 40,80"/>
                :props.use==="plus"?
                <>
                    <line x1={50} y1={30} x2={50} y2={70}/>
                    <line x1={30} y1={50} x2={70} y2={50}/>
                </>
                :props.use==="submit"?
                <polyline points="30,30 70,50 30,70 40,50 30,30"/>
                :props.use==="cancel"?
                <>
                    <line x1={30} y1={30} x2={70} y2={70}/>
                    <line x1={70} y1={30} x2={30} y2={70}/>
                </>
                :props.use==="burger"?
                <>
                    <line x1={30} y1={30} x2={70} y2={30}/>
                    <line x1={30} y1={50} x2={70} y2={50}/>
                    <line x1={30} y1={70} x2={70} y2={70}/>
                </>
                :props.use==="save"?
                <>
                    <polyline points="40,30 30,30 30,70 70,70 70,30 50,30 50,60" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="40,50 50,60 60,50" strokeLinecap="round" strokeLinejoin="round"/>
                </>
                :""
            }
        </svg>
    } else {
        if (props.use==="edit") {return <svg xmlns="http://www.w3.org/2000/svg" fill={props.fill?props.color:"none"} width="32" height="32" viewBox="0 0 24 24" style={{scale:props.scale}}>
            <g stroke={props.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={props.width}>
                <path d="M19.09 14.441v4.44a2.37 2.37 0 0 1-2.369 2.369H5.12a2.37 2.37 0 0 1-2.369-2.383V7.279a2.356 2.356 0 0 1 2.37-2.37H9.56"/>
                <path d="M6.835 15.803v-2.165c.002-.357.144-.7.395-.953l9.532-9.532a1.36 1.36 0 0 1 1.934 0l2.151 2.151a1.36 1.36 0 0 1 0 1.934l-9.532 9.532a1.36 1.36 0 0 1-.953.395H8.197a1.36 1.36 0 0 1-1.362-1.362M19.09 8.995l-4.085-4.086"/>
            </g>
        </svg>}
        if (props.use==="danger") {return <svg xmlns="http://www.w3.org/2000/svg" fill={props.fill?props.color:"none"} width="32" height="32" viewBox="0 0 16 16" style={{scale:props.scale}}>
            <path d="M7.134 2.5a1 1 0 0 1 1.732 0L14.928 13a1 1 0 0 1-.866 1.5H1.938a1 1 0 0 1-.866-1.5zM8 11a1 1 0 1 0 0 2a1 1 0 0 0 0-2m0-6a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V6a1 1 0 0 0-1-1"/>
        </svg>}
        if (props.use==="eye") {return <svg xmlns="http://www.w3.org/2000/svg" fill={props.fill?props.color:"none"} width="32" height="32" viewBox="0 0 24 24" style={{scale:props.scale}}>
            <path d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5"/>
        </svg>}
        if (props.use==="pin") {return <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill={props.fill?props.color:"none"} style={{scale:props.scale}}>
            <path d="m15.113 3.21l.094.083l5.5 5.5a1 1 0 0 1-1.175 1.59l-3.172 3.171l-1.424 3.797a1 1 0 0 1-.158.277l-.07.08l-1.5 1.5a1 1 0 0 1-1.32.082l-.095-.083L9 16.415l-3.793 3.792a1 1 0 0 1-1.497-1.32l.083-.094L7.585 15l-2.792-2.793a1 1 0 0 1-.083-1.32l.083-.094l1.5-1.5a1 1 0 0 1 .258-.187l.098-.042l3.796-1.425l3.171-3.17a1 1 0 0 1 1.497-1.26z"/>
        </svg>}
    }
}