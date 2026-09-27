import Button from "../../Components/Button"
import Icon from "../../Components/Icon"

import { changelog } from "../../../Utils/Version"

export default function Changelog() {
    return <main className="w-screen min-h-screen flex flex-col">
        <header className="flex text-xl items-center gap-4 h-16 w-full border-b border-neutral-700">
            <Button type="custom" use="link" target="/" className="w-16 h-full hover:brightness-125 center">
                <Icon type="online" use="exit" fill color="var(--warning)"/>
            </Button>
            <h1>Changelog</h1>
        </header>
        <section className="w-full h-full px-16">
            <div className="border-x border-neutral-700 w-full h-full">
                {changelog.map(item => <div key={item.id} className="flex flex-col w-full min-h-24 p-8 gap-4">
                    <h2 className="text-xl">app-build v{item.id}</h2>
                    <div className="px-8 flex flex-col border-l-2 border-(--accent) w-full">
                        {item.update.map(version => <div className="w-full flex flex-col p-2">
                            <code>v.{item.id}.{version.version} ({version.date})</code>
                            <ul className="text-sm opacity-75 px-8 list-disc">
                                {version.desc.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>)}
                    </div>
                </div>)}
            </div>
        </section>
    </main>
}