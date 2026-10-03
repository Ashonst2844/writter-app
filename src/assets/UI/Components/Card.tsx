import {type ReactNode} from "react"

interface CardProps {
    children?: ReactNode;
    className?: string;
    onCLick?: () => void;
}

export default function Card({children, className, onCLick}: CardProps) {
    return <div onClick={onCLick} className={`relative p-4 w-full min-h-40 md:min-h-60 bg-(--primary) shadow-xl rounded-xl flex flex-col gap-4 ${onCLick?"cursor-pointer":"cursor-auto"} ${className?className:""}`}>
        {children}
    </div>
}