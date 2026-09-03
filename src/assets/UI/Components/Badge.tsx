export default function Badge({content}: {content: string}) {
    return <div className={`p-2 text-md uppercase center min-w-24 h-auto hover:brightness-125 rounded-2xl bg-(--accent)/50 border border-(--accent)`}>
        <p>{content}</p>
    </div>
}