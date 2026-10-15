export default function Badge({content}: {content: string}) {
    return <div className={`text-center text-xs md:text-md uppercase center min-w-24 h-auto hover:brightness-125 p-2 bg-(--accent)/50 border border-(--accent)`}>
        <p>{content}</p>
    </div>
}