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
        if (props.use==="timeline-building") {return <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill={props.fill?props.color:"none"} style={{scale:props.scale}}>
            <path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m4.2 14.2L11 13V7h1.5v5.2l4.5 2.7z"/>
        </svg>}
        if (props.use==="world-building") {return <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill={props.fill?props.color:"none"} style={{scale:props.scale}}>
            <path d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12q0-.175-.012-.363t-.013-.312q-.125.725-.675 1.2T18 13h-2q-.825 0-1.412-.587T14 11v-1h-4V8q0-.825.588-1.412T12 6h1q0-.575.313-1.012t.762-.713q-.5-.125-1.012-.2T12 4Q8.65 4 6.325 6.325T4 12h5q1.65 0 2.825 1.175T13 16v1h-3v2.75q.5.125.988.188T12 20"/>
        </svg>}
        if (props.use==="character-development") {return <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill={props.fill?props.color:"none"} style={{scale:props.scale}}>
            <path d="m19.07 14.88l2.05 2.05L15.06 23H13v-2.06zm1.97-1.75c.14 0 .27.06.38.17l1.28 1.28c.22.21.22.56 0 .77l-1 1l-2.05-2.05l1-1c.11-.11.25-.17.39-.17M21 9h-6v7l-2 2v-2h-2v6H9V9H3V7h18zm-9-7c1.1 0 2 .9 2 2s-.9 2-2 2s-2-.9-2-2s.9-2 2-2"/>
        </svg>}
        if (props.use==="goals") {return <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 1024 1024" fill={props.fill?props.color:"none"} style={{scale:props.scale}}>
            <path d="M704 192h160v736H160V192h160v64h384zM288 512h448v-64H288zm0 256h448v-64H288zm96-576V96h256v96z"/>
        </svg>}
        if (props.use==="events") {return <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill={props.fill?props.color:"none"} style={{scale:props.scale}}>
            <path d="M15.616 20q-.402 0-.701-.299t-.3-.701v-4.384q0-.402.3-.701t.7-.3H20q.402 0 .701.3t.299.7V19q0 .402-.299.701T20 20zM3 17.308v-1h8.23v1zm12.616-6.924q-.402 0-.701-.299t-.3-.7V5q0-.402.3-.701t.7-.299H20q.402 0 .701.299T21 5v4.385q0 .401-.299.7t-.701.3zM3 7.692v-1h8.23v1z"/>
        </svg>}
        if (props.use==="relics") {return <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 8 8" fill={props.fill?props.color:"none"} style={{scale:props.scale}}>
            <path d="M1 8L0 7l2-2l-2-2h1l2 1l3-3l2-1l-1 2l-3 3l1 2v1L3 6"/>
        </svg>}
        if (props.use==="book-library") {return <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill={props.fill?props.color:"none"} style={{scale:props.scale}}>
            <path d="M6 22q-.825 0-1.412-.587T4 20V4q0-.825.588-1.412T6 2h12q.825 0 1.413.588T20 4v16q0 .825-.587 1.413T18 22zm5-11l2.5-1.5L16 11V4h-5z"/>
        </svg>}
        if (props.use==="note") {return <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill={props.fill?props.color:"none"} style={{scale:props.scale}}>
            <path d="M6 22q-.825 0-1.412-.587T4 20V4q0-.825.588-1.412T6 2h8l6 6v12q0 .825-.587 1.413T18 22zm7-13h5l-5-5z"/>
        </svg>}
        if (props.use==="exit") {return <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill={props.fill?props.color:"none"} style={{scale:props.scale}}>
            <path fill-rule="evenodd" d="M3.5 6A3.5 3.5 0 0 1 7 2.5h5a1.5 1.5 0 0 1 0 3H7a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h5a1.5 1.5 0 0 1 0 3H7A3.5 3.5 0 0 1 3.5 18zm12.44 2.11a1.5 1.5 0 0 1 2.12 0l2.829 2.83a1.5 1.5 0 0 1 0 2.12l-2.828 2.83a1.5 1.5 0 1 1-2.122-2.122l.268-.268H12a1.5 1.5 0 0 1 0-3h4.207l-.268-.268a1.5 1.5 0 0 1 0-2.121" clip-rule="evenodd"/>
        </svg>
            
        }
    }
}