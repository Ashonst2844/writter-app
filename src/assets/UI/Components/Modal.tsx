import Button from "./Button"

export default function Modal({message, type, onConfirm, onClose}: {message: string, type: "alert"|"warning", onConfirm: () => void, onClose?: () => void}) {
    return (
        <section className="top-0 right-0 fixed inset-0 z-100 flex justify-end bg-black/75 p-4">
            <div className="w-[40%] h-50 bg-(--primary) rounded-2xl shadow-2xl p-4 flex flex-col justify-between gap-4 border-l-8" style={{
                borderColor: type==="alert"?"yellow":"var(--warning)"
            }}>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-white">{type === "warning" ? "Confirmation" : "Notice"}</span>
                    </div>
                    <p className="text-base text-white/80">{message}</p>
                </div>
                <div className="flex justify-end gap-3 mt-2">
                    <Button type="alternate" use="button" onClick={() => onClose?.()} className="rounded-md">Cancel</Button>
                    <Button type="warning" use="button" onClick={() => { onConfirm(); onClose?.(); }} className="rounded-md">Confirm</Button>
                </div>
            </div>
        </section>
    )
}