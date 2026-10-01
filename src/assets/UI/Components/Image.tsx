interface ImageProps {
    target: string;
    isLink?: boolean;
    isLazy?: boolean;
    className?: string;
}

export default function Images(props: ImageProps) {
    return <picture>
        <source srcSet={props.isLink?props.target:"/"+props.target} type="image/avif"/>
        <source srcSet={props.isLink?props.target:"/"+props.target} type="image/webp"/>
        <img width={800} height={600} src={props.isLink?props.target:"/"+props.target} alt={props.target} decoding="async" loading={props.isLazy?"lazy":"eager"} fetchPriority={props.isLazy?"low":"high"} className={props.className||""}/>
    </picture>
}