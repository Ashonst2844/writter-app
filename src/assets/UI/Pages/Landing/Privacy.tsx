import Button from "../../Components/Button"
import Icon from "../../Components/Icon"

import { useEffect } from "react"

const privacy = [
    {id:1,title:"Informasi Yang Dikumpulkan",desc:[
        "UniFiction akan meminta data pengguna untuk memberikan berupa username, dan email, serta metadata dari proyek-proyek pengguna",
        "Segala hasil tulisan dan hasil brainstorming dalam proyek pengguna akan disimpan di dalam database (Supabase)",
        "Sistem browser akan menyimpan data-data teknis seperti session key dan log akses"
    ]},
    {id:2,title:"Penggunaan Data",desc:[
        "Tersedia fitur utama pada aplikasi seperti autentikasi (Sign-Up, Sign-In, dan Log-out), Pembuatan dan penulisan proyek, serta konversi novel menjadi file .docx",
        "UniFiction akan memproses status tingkatan fitur pengguna (Free / Hobbies / Professionals)"
    ]},
    {id:3,title:"Penyimpanan & Layanan Pihak Ketiga",desc:[
        "Menggunakan Pihak Ketiga Supabase sebagai infrastruktur Backend Minimalis dan Database untuk menyimpan data pengguna di cloud yang aman dan menyimpan Session dan Autentikasi pengguna"
    ]},
    {id:4,title:"Kepemilikan & Kerahasiaan Teks",desc:[
        "Segala ide, hasil brainstorm, dan naskah pengguna tidak akan dijual/dimanfaatkan untuk komersial dan tidak digunakan untuk pelatihan AI tanpa izin tertulis dari pengguna."
    ]},
    {id:5,title:"Hak Pengguna",desc:[
        "Hak pengguna untuk mengeksop data miliknya sendiri",
        "Hak pengguna untuk menghapus seluruh data yang terkait di dalam aplikasi",
    ]},
]

export default function Privacy() {
    useEffect(() => {
        document.title = "UniFiction | Privacy Policy"
    }, [])

    return <main className="w-screen min-h-screen flex flex-col relative">
        <header className="flex text-xl items-center gap-4 h-16 w-full border-b border-neutral-700">
            <Button label="Back" type="custom" use="link" target="/" className="w-16 h-full hover:brightness-125 center">
                <Icon type="online" use="exit" fill color="var(--warning)"/>
            </Button>
            <h1>Privacy Policy</h1>
        </header>
        <section className="w-full h-full px-8 md:px-16">
            <div className="border-x border-neutral-700 w-full h-full">
                {privacy.map(item => <div key={item.id} className="flex flex-col w-full min-h-24 p-4 md:p-8 gap-4">
                    <h2 className="text-xl">{item.title}</h2>
                    <div className="px-4 md:px-8 flex flex-col border-l-2 border-(--accent) w-full">
                        <ul className="text-sm opacity-75 px-4 md:px-8 list-disc">
                            {item.desc.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </div>
                </div>)}
            </div>
        </section>
        <Button label="Got To Top" type="alternate" use="url" target="#" className="fixed m-4 bottom-0 right-0 w-16 h-16 rounded-full">
            <Icon type="normal" use="caret" color="var(--bg)" width={6} className="rotate-270"/>
        </Button>
    </main>
}