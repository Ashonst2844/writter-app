import Button from "../../Components/Button";
import Modal from "../../Components/Modal";

import { type PinEntry, clearPins } from "../../../Utils/Pinning";
import { useState } from "react";

export default function Pin({pin}: {pin: PinEntry[]}) {
    const [showModal, setShowModal] = useState<boolean>(false)

    return <div className="w-full h-full overflow-y-auto relative">
        <div className="flex gap-2 fixed bottom-0 right-0 m-4 rounded-full z-50">
            {showModal && <Modal message={`Clear All Pinned? (${pin.length}) Pinned Found`} type="alert" onConfirm={() => {clearPins(); window.location.reload()}} onClose={() => setShowModal(false)}/> }
            <Button label="Clear Pinned" type="warning" use="button" onClick={(() => setShowModal(true))} className="w-24 rounded-md">Clear</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2 w-full h-full">
            {pin?.map((item, i) => <div key={i} className="bg-(--primary) overflow-auto group shadow-md rounded-2xl p-4 flex flex-col gap-4 break-inside-avoid mb-4">
                <h2 className="text-4xl font-black">{item?.title} </h2>
                <span className="opacity-75 text-(--accent)">{(item?.type ?? "").toUpperCase()}</span>
                <div dangerouslySetInnerHTML={{ __html: item?.content}} className={`p-4 bg-(--primary) border transition-all whitespace-pre-wrap leading-relaxed`}></div>
            </div>)}
        </div>
    </div>
}