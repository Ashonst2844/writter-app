export interface PatchUpdate {
    id: number;
    version: string;
    date: string;
    desc: string[]
}

export interface VersionUpdate {
    id: number;
    date: string;
    update: PatchUpdate[]
}

export const changelog = [
    {id:1,date:"4 Sept. 2026",update:[
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
        ]},
        {id:11,version:"8.0",date:"27 Sept. 2026",desc:[
            "Memperbarui planning-benefits",
            "Optimalisasi source-code"
        ]},
        {id:12,version:"8.1",date:"28 Sept. 2026",desc:[
            "Minority Change"
        ]},
        {id:13,version:"8.2",date:"28 Sept. 2026",desc:[
            "Security Update"
        ]}
    ]}
]