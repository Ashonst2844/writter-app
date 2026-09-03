export default function Loading({message}: {message: string}) {
    return <div className="w-screen h-screen z-100 absolute center top-0 left-0 bg-black/50">
        <div className="center flex-col gap-4">
            <div className="w-24 h-24 relative">
                <div className="animate-spin w-24 h-24 absolute top-0 left-0 rounded-full bg-linear-to-r from-(--primary) to-(--accent)"/>
                <div className="w-20 h-20 absolute top-0 left-0 m-2 rounded-full bg-black"/>
            </div>
            <span>Loading {message}...</span>
        </div>
    </div>
}