import Button from "../../Components/Button";
import Modal from "../../Components/Modal";

import { type PinEntry, clearPins } from "../../../Utils/Pinning";
import { useState } from "react";

export default function Pin({pin}: {pin: PinEntry[]}) {
    const [showModal, setShowModal] = useState<boolean>(false)

    return <div className="w-full h-full overflow-y-auto relative">
        <div className="flex p-2 w-full">
            {showModal && <Modal message={`Clear All Pinned? (${pin.length}) Pinned Found`} type="alert" onConfirm={() => {clearPins(); window.location.reload()}} onClose={() => setShowModal(false)}/> }
            <Button label="Clear Pinned" type="warning" use="button" onClick={(() => setShowModal(true))} className="w-24 h-12 rounded-md">Clear</Button>
        </div>
        <div className="w-full h-full">
            {pin?.map((item, i) => <div key={i} className="bg-(--primary) overflow-auto group shadow-md p-4 flex flex-col gap-4 break-inside-avoid">
                <h2 className="text-4xl font-black">{item?.title} </h2>
                <span className="opacity-75 text-(--accent)">{(item?.type ?? "").toUpperCase()}</span>
                <div dangerouslySetInnerHTML={{ __html: item?.content}} className={`p-2 bg-(--primary) border transition-all whitespace-pre-wrap leading-relaxed`}></div>
            </div>)}
        </div>
    </div>
}