import Button from "../../Components/Button"
import Icon from "../../Components/Icon"

import { useEffect } from "react"

const terms = [
    {id:1,title:"Pendaftaran Akun & Keamanan",desc:[
        "Anda harus berusia setidaknya 13 tahun (atau usia legal minimum di wilayah hukum Anda) untuk membuat akun dan menggunakan Layanan ini.",
        "Anda bertanggung jawab penuh untuk menjaga kerahasiaan informasi akun dan kata sandi Anda. Kami mengolah otentikasi akun secara aman menggunakan penyedia layanan otentikasi pihak ketiga (seperti Supabase Auth).",
        "Anda bertanggung jawab atas seluruh aktivitas yang terjadi di bawah akun Anda. Apabila terjadi indikasi peretasan atau penggunaan tanpa izin, Anda wajib segera memberi tahu Kami."
    ]},
    {id:2,title:"Fitur Layanan & Paket Pengguna",desc:[
        "Layanan kami menyediakan platform manajemen penulisan fiksi/non-fiksi, pengorganisasian proyek cerita (Universes / Projects), ekspor dokumen (format .docx).",
        "Paket Gratis (Free Plan): Memberikan akses terbatas ke fitur-fitur dasar, batas jumlah proyek, dan batasan penggunaan kuota AI bulanan/harian.",
        "Paket Berbayar (Hobbies/Professionals Plan): Memberikan akses ke fitur tingkat lanjut, kapasitas penyimpanan proyek lebih besar, kuota penggunaan AI yang lebih tinggi, serta prioritas ekspor dokumen.",
        "Perubahan Harga & Fitur: Kami berhak mengubah, memodifikasi, atau menghentikan sementara fitur atau paket harga sewaktu-waktu dengan pemberitahuan terlebih dahulu melalui aplikasi atau email."
    ]},
    {id:3,title:"Hak Kekayaan Intelektual & Kepemilikan Konten",desc:[
        "Seluruh hak cipta dan kepemilikan atas cerita, konsep dunia (universes), karakter, plot, dan dokumen yang Anda buat atau unggah di platform ini adalah 100% milik Anda sepenuhnya. Kami tidak mengklaim kepemilikan atas karya kreatif Anda.",
        "Dengan mengunggah atau menyimpan konten di platform kami, Anda memberi Kami lisensi terbatas, non-eksklusif, dan bebas royalti hanya untuk menyimpan, memproses, dan menampilkan konten tersebut guna keperluan operasional Layanan (misalnya: membuat cadangan data, merender tampilan, dan memproses ekspor .docx).",
        "Seluruh desain UI/UX, kode sumber (source code), merek dagang, logo, dan logika aplikasi adalah milik sah Kami dan dilindungi oleh hukum hak cipta yang berlaku.",
    ]},
    {id:4,title:"Penggunaan yang Dilarang (Unacceptable Use)",desc:[
        "Menggunakan Layanan untuk tindakan ilegal atau melanggar hukum yang berlaku di Republik Indonesia maupun wilayah hukum Pengguna.",
        "Membongkar, merekayasa balik (reverse engineer), atau mencoba mengekstrak kode sumber dari Layanan.",
        "Melakukan serangan Denial of Service (DoS), scraping massal tanpa izin, atau mengganggu kestabilan server dan sistem API Kami.",
        "Mengunggah materi yang mengandung virus, malware, atau kode berbahaya lainnya."
    ]},
    {id:5,title:"Pembatasan Tanggung Jawab",desc:[
        "Layanan ini disediakan sebagaimana adanya ('as is') dan sebagaimana tersedia ('as available') tanpa jaminan dalam bentuk apa pun, baik tersurat maupun tersirat.",
        "Kami berusaha maksimal menjaga keamanan data Anda. Namun, Kami tidak bertanggung jawab atas kerugian tidak langsung, kehilangan data cerita, kegagalan ekspor, atau gangguan layanan yang disebabkan oleh faktor teknis di luar kendali Kami (seperti gangguan penyedia cloud, penyedia API pihak ketiga, atau bencana alam). Pengguna disarankan untuk secara rutin mengekspor file karya mereka."
    ]},
    {id:6,title:"Penutupan & Penghentian Akun",desc:[
        "Anda dapat berhenti menggunakan Layanan dan menghapus akun Anda kapan saja melalui pengaturan profil akun.",
        "Kami berhak untuk membekukan atau menutup akun Anda secara sepihak tanpa pemberitahuan sebelumnya jika Anda terbukti melanggar ketentuan dalam Syarat dan Ketentuan ini."
    ]},
    {id:7,title:"Perubahan Syarat & Ketentuan",desc:[
        "Kami dapat memperbarui Syarat dan Ketentuan ini dari waktu ke waktu. Perubahan akan berlaku segera setelah draf terbaru diunggah di situs web ini. Penggunaan berkelanjutan atas Layanan setelah perubahan berlaku dianggap sebagai persetujuan Anda terhadap ketentuan yang baru."
    ]},
    {id:8,title:"Kontak & Hubungi Kami",desc:[
        "Jika Anda memiliki pertanyaan, saran, atau kendala mengenai Syarat dan Ketentuan ini, silakan hubungi kami melalui Email Support agusyantosugiyanto@gmail.com"
    ]}
]

export default function Terms() {
    useEffect(() => {
        document.title = "Writer App | Terms Of Services"
    }, [])

    return <main className="w-screen min-h-screen flex flex-col relative">
        <header className="flex text-xl items-center gap-4 h-16 w-full border-b border-neutral-700">
            <Button label="Back" type="custom" use="link" target="/" className="w-16 h-full hover:brightness-125 center">
                <Icon type="online" use="exit" fill color="var(--warning)"/>
            </Button>
            <h1>Terms Of Services</h1>
        </header>
        <section className="w-full h-full px-4 md:px-16">
            <div className="border-x border-neutral-700 w-full h-full">
                <div className="p-4 md:p-8">
                    <p>Terakhir Diperbarui: 24, September 2026</p>
                    <p>Selamat datang di Writer App. Layanan ini dioperasikan dan dikembangkan oleh Masagus Ahmad Ramadhan.</p>
                    <p>Dengan mendaftar, mengakses, atau menggunakan Layanan kami, Anda ("Pengguna") menyatakan bahwa Anda telah membaca, memahami, dan menyetujui untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak menyetujui bagian mana pun dari ketentuan ini, Anda tidak diperkenankan menggunakan Layanan kami.</p>
                </div>
                {terms.map(item => <div key={item.id} className="flex flex-col w-full min-h-24 p-4 md:p-8 gap-4">
                    <h2 className="text-xl">{item.title}</h2>
                    <div className="px-4 md:px-8 flex flex-col border-l-2 border-(--accent) w-full">
                        <ul className="text-sm opacity-75 px-8 list-disc">
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