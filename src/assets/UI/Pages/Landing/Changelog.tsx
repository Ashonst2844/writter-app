import Button from "../../Components/Button"
import Icon from "../../Components/Icon"

const changelog = [
    {id:1,type:"app-build",date:"4 Sept. 2026",update:[
        {id:1,version:"0.1",date:"5 Sept. 2026",desc:[
            "Perbaikan backend saat melakukan pembuatan, penghapusan, dan pembaruan data ke supabase"
        ]},
        {id:2,version:"1.0",date:"7 Sept. 2026",desc:[
            "Melakukan pembaruan UI/UX",
            "penambahan fitur hitung estimasi rata-rata jumlah kata",
            "Membuat tombol minimize navigasi dashboard",
            "Perbaruan Single Pinning -> Multi Pinning"
        ]},
        {id:3,version:"2.0",date:"9 Sept. 2026",desc:[
            "Optimalisasi code-source",
            "Melakukan pembaruan UI/UX",
            "Menambahkan Modal Box untuk beberapa aksi krusial",
            "Integrasi TanStack agar load data menjadi lebih cepat"
        ]},
        {id:4,version:"3.0",date:"12 Sept. 2026",desc:[
            "Menambahkan fitur copy-to-clipboard",
            "Menambahkan fitur export untuk buku menjadi customable .docx"
        ]},
        {id:5,version:"4.0",date:"17 Sept. 2026",desc:[
            "Menambahkan fitur Short-Cut Keyboard",
            "Membuat alignment exported document menjadi justify",
            "Menambahkan fitur Stats Personalisasi Karakter",
        ]},
        {id:6,version:"5.0",date:"17 Sept. 2026",desc:[
            "Menambahkan icon",
            "Menambahkan tags untuk Traits Character sesuai dengan statistic yang diberikan",
            "Fix search position"
        ]},
        {id:7,version:"6.0",date:"23 Sept. 2026",desc:[
            "Membuat Landing Page untuk umum dan mengintegrasikan dengan GSAP Animation",
            "Membuat Halam Register untuk Sistem Authentication Register (Sign-up, Sign-in, Sign-out)"
        ]},
        {id:8,version:"6.1",date:"23 Sept. 2026",desc:[
            "Memperbaiki Formatting pada Pinning"
        ]},
        {id:9,version:"7.0",date:"25 Sept. 2026",desc:[
            "Membuat halaman teknis (Privacy Policy, Terms Of Services, dan Changelog)",
            "Memberikan batasan pengguna sesuai dengan Plan/Tier"
        ]},
        {id:10,version:"7.1",date:"27 Sept. 2026",desc:[
            "Fix Error",
        ]}
    ]}
]

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