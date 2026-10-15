export default function Badge({content}: {content: string}) {
    return <div className={`p-2 text-xs md:text-md uppercase center min-w-24 h-auto hover:brightness-125 rounded-md bg-(--accent)/50 border border-(--accent)`}>
        <p>{content}</p>
    </div>
}