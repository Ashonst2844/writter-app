import Button from "../../Components/Button"
import Icon from "../../Components/Icon"
import Loading from "../../Components/Loading"

import { supabase } from "../../../Utils/supabase"
import { useEffect, useState, useRef } from "react"
import { useFetch } from "../../../Hooks/useFetch"
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import Typewriter from "typewriter-effect"

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger)

interface Profiles {
    username: string;
    email: string;
    plan: 'free' | 'hobbies' | 'professionals'
}

const nav = ["home", "about", "features", "planning", "contact"]
function Header({plan}: {plan: 'free' | 'hobbies' | 'professionals'}) {
    const [modal, showModal] = useState<boolean>(false)

    const [userData, setUserData] = useState(() => {
        const authValue = window.localStorage.getItem("auth")
        return authValue ? JSON.parse(authValue) : null
    })

    const username = userData?.user?.user_metadata?.username ?? "User"
    const email = userData?.user?.email ?? "user@example.com"

    useEffect(() => {
        const syncAuth = () => {
            const authValue = window.localStorage.getItem("auth")
            setUserData(authValue ? JSON.parse(authValue) : null)
        }
        syncAuth()
        window.addEventListener('storage', syncAuth)

        return () => window.removeEventListener('storage', syncAuth)
    }, [])

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) {throw new Error(error.message)}

            window.localStorage.removeItem('auth')
            setUserData(null)
            location.reload()
        } catch (error) {
            console.error('Logout failed:', error)
            alert('Logout gagal, silakan coba lagi.')
        }
    }

    return <header className='header fixed top-0 left-0 w-full h-18 z-200'>
        <div className='w-full h-full bg-black/75 flex justify-between items-center p-4'>
            <div className="flex items-center gap-4">
                <img src="/favicon.svg" alt="Icon" width={50} height={50}/>
                <span className="font-bold text-xl">Writer App</span>
            </div>
            <div className="flex gap-4">
                {nav.map((item, i) => <Button key={i} use="url" target={`#${item}`} type="custom" className="hover:text-(--accent) hover:underline">{item.toUpperCase()}</Button>)}
            </div>
            <div className="relative">
                {modal && <div className="w-64 shadow-xl h-auto center flex-col gap-4 p-4 bg-(--primary) rounded-md absolute top-0 translate-y-9 -translate-x-full">
                    {userData && <div className="center flex-col gap-4">
                        <Icon type="online" use="user" fill color="white" />
                        <p className="opacity-75 text-sm">{username}</p>
                        <p className="opacity-75 text-sm">Tier : {(plan ?? "free").toUpperCase()}</p>
                        <p className="opacity-75 text-sm">{email}</p>
                    </div>}
                    <Button type="custom" use={userData ? "button" : "link"} onClick={userData ? handleLogout : undefined} target={userData ? undefined : "register"} className={`hover:brightness-75 ${userData?"text-(--warning)":""}`}>
                        {userData ? "Logout" : "Register"}
                    </Button>
                </div>}
                <Button type="custom" use="button" className="h-full w-18 hover:brightness-75" onClick={() => showModal(e => !e)}>
                    <Icon type="normal" use="burger" color="white" width={6}/>
                </Button>
            </div>
        </div>
    </header>
}

function CountUp({num}: {num: number}) {
    const numberRef = useRef<HTMLSpanElement>(null);
    const formatCompact = (num: number) => {
        return new Intl.NumberFormat('en-US', {
            notation: 'compact',
            maximumFractionDigits: 1,
        }).format(num).toLowerCase();
    };

    useGSAP(() => {
        if (!numberRef.current) return;

        numberRef.current.innerHTML = "0";
        const targetObj = { val: 0 };
        gsap.to(targetObj, {
            val: num,
            duration: 1,
            snap: { innerHTML: 1 },
            ease: "power2.out",
            stagger: 0.2,
            scrollTrigger:{trigger:numberRef.current, start:"top 85%", once:true},
            onUpdate: () => {
                if (numberRef.current) {
                    numberRef.current.innerText = formatCompact(Math.round(targetObj.val));
                }
            },
        });
    })

    return <span className="countup transition-all duration-150 font-black text-6xl text-(--accent)" ref={numberRef}>{formatCompact(0)}</span>;
}

export default function Landing() {
    const authValue = window.localStorage.getItem("auth");
    const userData = authValue ? JSON.parse(authValue) : null;
    const id = userData?.user?.id ?? ""
    const {data: profiles = [], isLoading} = useFetch<Profiles>('user_data', '', {
        eq: {
            user_id: id || undefined
        }
    })

    const aboutDetailData = [
        {id: 1, count:10, title:'Places'},
        {id: 1, count:20, title:'Characters'},
        {id: 1, count:5, title:'Novels'},
        {id: 1, count:15, title:'Notes'},
    ]

    const featuresData = [
        {id:1,icon:"project",name:"Multi-Universe & Project Management",desc:["Kelola lebih dari satu universe atau proyek fiksi secara terpisah dalam satu akun tanpa membuat lore saling bentrok."]},
        {id:2,icon:"world-building",name:"Comprehensive Worldbuilding",desc:["Urutkan garis waktu dan alur kronologis universe milikmu secara runtut.", "Deskripsikan peta dunia, benua, hingga tempat-tempat penting dan sistem aturan duniamu.", "Catat peristiwa bersejarah serta benda pusaka / item penting yang memengaruhi alur cerita."]},
        {id:3,icon:"character-development",name:"Advanced Character Development",desc:["Kelola nama, umur, gender, faksi (Baik / Netral / Jahat), serta deskripsi latar belakang.", "Berikan statistik personal dan tags kepribadian otomatis untuk visualisasi perkembangan karakter."]},
        {id:4,icon:"book-library",name:"Seamless Writing Workspace (Book Library)",desc:["Tulis draf novel atau cerpen secara langsung per bab dalam antarmuka yang bersih.", "Buat catatan garis besar sebelum dituangkan ke dalam Chapter."]},
        {id:5,icon:"features",name:"Smart Writing Utilities (Fitur Penunjang Produktivitas)",desc:["Pin catatan (Notes) atau peristiwa penting (Events) ke bilah samping agar kamu tidak perlu berpindah halaman saat sedang mengetik bab cerita.", "Pantau statistik dan estimasi rata-rata jumlah kata per bab secara otomatis.", "Akses fitur-fitur krusial secara cepat dengan kombinasi tombol navigasi.", "Ekspor karya tulismu ke format .docx dengan opsi pemformatan teks (justify, tata letak draf naskah) yang siap kirim.", "Tetapkan target penulisan agar alur kerja proyekmu tetap konsisten."]}
    ]

    const planData = [
        {id:1,title:"Free",benefits:[
            "max. 1 Universe",
            "max. 10 Timeline, & 10 Continent/Timeline",
            "max. 15 Place/Continent",
            "max. 30 Character",
            "max. 20 Goal, Event, Relic, Note",
            "max. 2 Novel in Libary",
            "Infinity Chapter/Book",
        ],price:0},
        {id:2,title:"Hobbies",benefits:[
            "max. 3 Universe",
            "max. 15 Timeline, & 15 Continent/Timeline",
            "max. 30 Place/Continent",
            "max. 60 Character",
            "max. 40 Goal, Event, Relic, Note",
            "max. 5 Novel in Libary",
            "Infinity Chapter/Book",
            "Export to .docx Feature"
        ],price:45000},
        {id:3,title:"Professionals",benefits:[
            "max. 10 Universe",
            "max. 25 Timeline, & 25 Continent/Timeline",
            "max. 45 Place/Continent",
            "max. 100 Character",
            "max. 60 Goals, Event, Relics, Notes",
            "max. 15 Novel di Libary",
            "Jumlah Bab/Book tanpa batas",
            "Infinity Chapter/Book",
            "Export to .docx Feature"
        ],price:90000}
    ]

    const socialMedia = [
        {id:3,icon:"instagram",username:"@msgs_adra",url:"https://www.instagram.com/msgs_adra/"},
        {id:4,icon:"facebook",username:"Masagus Ramadhan",url:"https://www.facebook.com/profile.php?id=61589665117247"},
        {id:5,icon:"github",username:"Ashonst2844",url:"https://github.com/Ashonst2844"},
        {id:6,icon:"x",username:"@sasha28446419",url:"https://x.com/sasha28446419"},
    ]

    const home = useRef<HTMLElement>(null)
    const builder = useRef<HTMLElement>(null)
    const about = useRef<HTMLElement>(null)
    const features = useRef<HTMLElement>(null)
    const planning = useRef<HTMLElement>(null)
    useGSAP(() => {
        if (!home.current || !builder.current || !about.current || !features.current || ! planning.current) return

        // Home Section Animation
        gsap.fromTo(".home", {y:-20, opacity:0}, {y:0,opacity:1,stagger:0.2,duration:1,scrollTrigger:{
            trigger: home.current,
            start: "top 80%",
            toggleActions: 'play none none reverse'
        }})

        // Builder Section Animation
        gsap.fromTo(".builder", {x:-20, opacity:0}, {x:0,opacity:1,stagger:0.2,duration:1,scrollTrigger:{
            trigger: builder.current,
            start: "top 80%",
            toggleActions: 'play none none reverse'
        }})

        // About Section Animation
        gsap.fromTo(".about", {y:20, opacity:0}, {y:0,opacity:1,stagger:0.2,duration:1,scrollTrigger:{
            trigger: ".about",
            start: "top 80%",
            toggleActions: 'play none none reverse'
        }})

        // Features Section Animation
        const featureCards = gsap.utils.toArray<HTMLElement>('.feature')
        featureCards.forEach((card) => {
            gsap.fromTo(card, {opacity: 0, x: -20, scale: 0.25}, {opacity: 1, x: 0, scale:1, duration: 0.8, ease: 'power3.out', scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
            }})
        })

        // Planning Section Animation
        gsap.fromTo(".plan", {opacity: 0, y: -20, scale: 0.25}, {opacity: 1, x: 0, scale:1, duration: 0.8, ease: 'bounce', stagger: 0.2, scrollTrigger: {
            trigger: planning.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
        }})
    })

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) {throw new Error(error.message)}

            window.localStorage.removeItem('auth')
            location.reload()
        } catch (error) {
            console.error('Logout failed:', error)
            alert('Logout gagal, silakan coba lagi.')
        }
    }

    return <main className="w-screen relative">
        {isLoading && <Loading message="User"/>}
        <Header plan={profiles[0]?.plan}/>
        {/* Home Section */}
        <section ref={home} id="home" className="w-full h-screen bg-[url(/bg.jpg)] bg-cover bg-center bg-no-repeat">
            <div className="w-full h-full bg-linear-to-r from-black to-transparent flex justify-center flex-col gap-8 p-8">
                <code className="home text-(--accent)">// app-v1.6.0</code>
                <h1 className="home text-8xl font-bold">From Zero, <br /> <span className="text-(--accent) font-light">To Universe</span></h1>
                <p className="home w-[60%] p-4 text-white/75">Platform all-in-one workspace khusus novelis dan worldbuilder. Kelola garis waktu, atribut karakter, lokasi krusial, hingga draf naskah dalam satu ekosistem yang terstruktur</p>
                <div className="home flex gap-4 w-[40%] h-16">
                    <Button type="normal" use="url" target="#about" className="w-[50%] rounded-md h-full shadow-md">Jelajahi</Button>
                    {userData?
                        <>
                            <Button type="normal" use="link" target={`/projects/${id}`} className="rounded-md h-full shadow-md">
                                <Icon type="normal" use="grid" color="white" scale="0.75"/>
                            </Button>
                            <Button type="warning" use="button" onClick={handleLogout} className="rounded-md h-full shadow-md">
                                Logout
                            </Button>
                        </>:
                        <Button type="alternate" use="link" target="register" className="w-[50%] rounded-md h-full shadow-md">
                            Daftar
                        </Button>
                    }
                </div>
            </div>
        </section>
        {/* Builder Section */}
        <section ref={builder} className="w-full h-48 bg-(--primary) center gap-24">
            <span className="builder uppercase font-bold text-white/75">Build By</span>
            {["vite","react","vercel"].map(item => 
                <div className="builder center gap-2 text-2xl font-extralight hover:gap-4 hover:font-bold transition-all duration-150">
                    <img src={`/${item}.svg`} alt={item.toUpperCase()} width={50} height={50} />
                    <span>{item.toUpperCase()}</span>
                </div>
            )}
        </section>
        {/* About Section */}
        <section ref={about} id="about" className="w-full min-h-screen p-8 flex flex-col gap-8">
            <div className="w-full p-8 grid grid-cols-4 h-64">
                {aboutDetailData.map(item => <div key={item.id} className="countbox uppercase flex border-l-2 border-neutral-700 justify-around p-4 flex-col text-sm font-bold">
                    <code>Create</code>
                    <CountUp num={item.count}/>
                    <code>+ {item.title}</code>
                </div>)}
            </div>
            <div className="about w-full flex flex-col gap-8">
                <div className="about w-full h-96 center border-b-2 border-neutral-700">
                    <div className="grid grid-cols-2 h-full items-center">
                        <div className="center flex-col gap-4">
                            <h2 className="text-center text-xl text-(--accent) font-bold">Writer App</h2>
                            <p className="text-center text-sm p-4">adalah platform all-in-one worldbuilding & story writing workspace yang dirancang khusus untuk novelis, kreator, dan lore-master yang ingin membangun fiksi imajinatif berskala besar dalam jangka panjang.</p>
                        </div>
                        <div className="w-full h-full overflow-hidden">
                            <img loading="eager" src="/Illustrations/illus-1.jpg" alt="Writer Illustration" className="hover:scale-125 transition-transform duration-150"/>
                        </div>
                    </div>
                </div>
                <div className="about w-full h-96 center border-b-2 border-neutral-700">
                    <div className="grid grid-cols-2 h-full items-center">
                        <div className="w-full h-full overflow-hidden">
                            <img loading="eager" src="/Illustrations/illus-2.jpg" alt="Fantasy Illustration" className="hover:scale-125 transition-transform duration-150"/>
                        </div>
                        <div className="center flex-col gap-4">
                            <h2 className="text-center text-xl text-(--accent) font-bold">Bangun Dunia Fiksimu</h2>
                            <p className="text-center text-sm p-4">Menulis multiverse atau fiksi fantasi yang rumit sering kali membingungkan ketika lore, garis waktu, dan relasi karakter bertebaran di mana-mana. Writter App hadir untuk menyatukan seluruh elemen cerita—mulai dari sejarah dunia, hirarki karakter, lokasi krusial, hingga draf bab cerita—ke dalam satu ekosistem dashboard yang terstruktur dan responsif.</p>
                        </div>
                    </div>
                </div>
                <div className="w-full h-64 center text-xl font-extralight text-center rounded-xl shadow-inner bg-(--primary)">
                    <code>
                        <Typewriter options={{
                            strings: '"Satu tempat untuk merancang dunia fiksi, mengelola alur, dan menyelesaikan karya tanpa kehilangan fokus."',
                            autoStart: true, loop: true, deleteSpeed: 25, delay: 25
                        }}/>
                    </code>
                </div>
            </div>
        </section>
        {/* Features Section */}
        <section ref={features} id="features" className="w-full min-h-screen p-8 center flex-col gap-16">
            <h2 className="text-2xl uppercase text-(--accent)">| App Features |</h2>
            {featuresData.map(item => <div key={item.id} className="feature w-full border-b border-neutral-700 p-16 flex flex-col gap-4">
                <div className="flex flex-col gap-8 pl-4">
                    <Icon type="online" use={item.icon} fill color="var(--accent)" scale="2"/>
                    <h3 className="font-bold text-2xl">{item.id + ". " + item.name}</h3>
                </div>
                <div className='grid gap-8' style={{
                    gridTemplateColumns: `repeat(${item.desc.length}, 1fr)`
                }}>
                    {item.desc.map((item, i) => <code key={i} className="opacity-75 border-l-2 p-2 border-neutral-700">{item}</code>)}
                </div>
            </div>)}
        </section>
        {/* Planning Section */}
        <section ref={planning} id="planning" className="w-full min-h-screen p-8 center flex-col gap-16 bg-(--primary)">
            <h2 className="text-2xl uppercase text-(--accent)">| Be Part Of Universe Creator |</h2>
            <div className="grid grid-cols-3 gap-8">
                {planData.map(item => {
                    const active = item.title.toLowerCase() === profiles[0]?.plan
                    return <div key={item.id} className="plan w-80 bg-(--bg) p-4 rounded-xl flex h-full flex-col justify-between gap-8 transition-all duration-150 hover:outline-2 outline-neutral-600 hover:shadow-xl">
                        <h3 className="text-xl font-bold border-b-2 border-neutral-700">{item.title} <code className="font-extralight">{active && "(Current Plan)"}</code></h3>
                        <code className="pl-4 text-4xl font-light text-(--accent)">{new Intl.NumberFormat("id-ID", {style:"currency", currency:"IDR"}).format(item.price)}</code>
                        <div className="flex flex-col gap-4">
                            {item.benefits.map((item, i) => <p key={i} className="text-sm opacity-75">- {item}</p>)}
                        </div>
                        <Button disabled={active} use="button" type="normal" className="rounded-md">Planning</Button>
                    </div>})
                }
            </div>
        </section>
        {/* Contact & Footer Section */}
        <footer id="contact" className="w-full min-h-full p-16 text-sm">
            <div className="grid grid-cols-3 h-full gap-16">
                <div className="flex h-full flex-col gap-4">
                    <img src="/favicon.svg" alt="Icon"  width={75}/>
                    <p>Writer App</p>
                    <hr className="border border-neutral-600"/>
                    <p className="opacity-75">Reach Developer :</p>
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-2 items-center">
                            <img src="/public/Icons/google.svg" alt="google" width={25}/>
                            <p className="hover:underline hover:brightness-75">agusyantosugiyanto@gmail.com</p>
                        </div>
                        <div className="flex gap-2 items-center">
                            <img src="/public/Icons/phone.svg" alt="phone" width={25}/>
                            <p className="hover:underline hover:brightness-75">(+62) 858-9129-9147</p>
                        </div>
                        {socialMedia.map(item => <div key={item.id} className="flex gap-2 items-center">
                            <img src={`/public/Icons/${item.icon}.svg`} alt={item.icon} width={25}/>
                            <a target="_blank" href={item.url} className="hover:underline hover:brightness-75">{item.username}</a>
                        </div>)}
                    </div>
                </div>
                <div className="flex h-full flex-col gap-4">
                    <p className="opacity-75 text-lg">Pages</p>
                    <div className="flex flex-col gap-4">
                        {nav.map((item, i) => <a key={i} href={`#${item}`} className="hover:underline hover:brightness-75">{item.toUpperCase()}</a>)}
                    </div>
                </div>
                <div className="flex h-full flex-col gap-4">
                    <p className="opacity-75 text-lg">About</p>
                    <div className="flex flex-col gap-4">
                        {['terms-of-services','privacy-policy','changelog'].map((item, i) => <Button key={i} use="link" type="custom" target={item} className="hover:underline hover:brightness-75">{item.toUpperCase().replaceAll("-"," ")}</Button>)}
                    </div>
                </div>
            </div>
        </footer>
        <hr className="border border-neutral-600"/>
        <div className="w-full h-24 center text-sm">
            <p>Copyright &copy; 2026, Masagus Ahmad Ramadhan, All Right Reserved</p>
        </div>
    </main>
}