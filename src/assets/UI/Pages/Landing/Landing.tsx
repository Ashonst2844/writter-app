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
import { changelog } from "../../../Utils/Version"
import { type Profiles } from "../Dashboard"

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger)

//* Header Section
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
//* Count Up Function
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

    return <span className="countup transition-all duration-150 font-black text-8xl text-(--accent)" ref={numberRef}>{formatCompact(0)}</span>;
}
//* Home Section
function Home() {
    const authValue = window.localStorage.getItem("auth");
    const userData = authValue ? JSON.parse(authValue) : null;
    const id = userData?.user?.id ?? ""

    const version = `app-v${changelog[changelog.length-1].id}.${changelog[changelog.length-1].update[changelog[changelog.length-1].update.length-1].version}`

    const home = useRef<HTMLElement>(null)
    useGSAP(() => {
        if (!home) return
        gsap.fromTo(".home", {y:-20, opacity:0}, {y:0,opacity:1,stagger:0.2,duration:1,scrollTrigger:{
            trigger: home.current,
            start: "top 80%",
            toggleActions: 'play none none reverse'
        }})
    })

    return <section ref={home} id="home" className="w-full h-screen bg-[url(/bg.jpg)] bg-cover bg-center bg-no-repeat">
        <div className="w-full h-full bg-linear-to-r from-black to-transparent flex justify-center flex-col gap-8 p-8">
            <code className="home text-(--accent)">// {version}</code>
            <h1 className="home text-8xl font-bold">From Zero, <br /> <span className="text-(--accent) font-light">To Universe</span></h1>
            <p className="home w-[60%] p-4 text-white/75">Platform all-in-one workspace khusus novelis dan worldbuilder. Kelola garis waktu, atribut karakter, lokasi krusial, hingga draf naskah dalam satu ekosistem yang terstruktur</p>
            <div className="home flex gap-4 w-[40%] h-16">
                <Button type="normal" use="url" target="#about" className="w-[50%] rounded-md h-full shadow-md">Jelajahi</Button>
                {userData?
                    <>
                        <Button type="normal" use="link" target={`/projects/${id}`} className="rounded-md h-full shadow-md">
                            <Icon type="normal" use="grid" color="white" scale="0.75"/>
                        </Button>
                    </>:
                    <Button type="alternate" use="link" target="register" className="w-[50%] rounded-md h-full shadow-md">
                        Daftar
                    </Button>
                }
            </div>
        </div>
    </section>
}
//* Builder Section
function Builder() {
    const builder = useRef<HTMLElement>(null)
    useGSAP(() => {
        if (!builder) return
        gsap.fromTo(".builder", {x:-20, opacity:0}, {x:0,opacity:1,stagger:0.2,duration:1,scrollTrigger:{
            trigger: builder.current,
            start: "top 80%",
            toggleActions: 'play none none reverse'
        }})
    })

    return <section ref={builder} className="w-full h-64 bg-(--primary) grid grid-cols-4 gap-24">
        <span className="builder uppercase font-bold text-white/75 center">Development & Build By :</span>
        <div className="grid grid-cols-3 col-span-3">
            {["vite","react","vercel","supabase","tailwind-css","gsap"].map((item, i) => <div key={i} className="builder flex items-center gap-2 text-xl font-extralight hover:gap-4 hover:font-bold transition-all duration-150">
                <img src={`/${item}.svg`} alt={item.toUpperCase()} width={50} height={50} />
                <span>{item.replaceAll("-", " ").toUpperCase()}</span>
            </div>)}
        </div>
    </section>
}
//* About Section
function About() {
    const aboutDetailData = [
        {id: 1, context:'use', count:14, title:'Features'},
        {id: 2, context:'create', count:5, title:'Universes'},
        {id: 3, context:'create', count:600, title:'Places'},
        {id: 4, context:'create', count:100, title:'Characters'},
        {id: 5, context:'create', count:120, title:'Write Note'},
    ]

    const about = useRef<HTMLElement>(null)
    useGSAP(() => {
        if (!about) return
        gsap.fromTo(".about", {y:20, opacity:0}, {y:0,opacity:1,stagger:0.2,duration:1,scrollTrigger:{
            trigger: ".about",
            start: "top 80%",
            toggleActions: 'play none none reverse'
        }})
    })
    
    return <section ref={about} id="about" className="w-full min-h-screen p-8 flex flex-col gap-8">
        <div className="w-full p-8 gap-8 justify-center flex flex-wrap">
            {aboutDetailData.map(item => <div key={item.id} className="countbox uppercase flex border-l-2 border-neutral-700 justify-around p-4 gap-4 flex-col text-lg font-bold w-[calc(33.333%-2rem)]">
                <code>{item.context}</code>
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
                        autoStart: true, loop: true, deleteSpeed: 25, delay: 50
                    }}/>
                </code>
            </div>
        </div>
    </section>
}
//* Feature Section
function Feature() {
    const detailsData = [
        {id:1,icon:"project",name:"Project Management",desc:"(Projects) Kelola lebih dari satu universe atau proyek fiksi secara terpisah dalam satu akun tanpa membuat lore saling bentrok."},
        {id:2,icon:"world-building",name:"Comprehensive Timelining & Worldbuilding",desc:"(Timeline Building) Urutkan garis waktu dan alur kronologis universe milikmu secara runtut; (World Building) Deskripsikan peta dunia, benua, hingga tempat-tempat penting dan sistem aturan duniamu; Catat peristiwa bersejarah serta benda pusaka / item penting yang memengaruhi alur cerita."},
        {id:3,icon:"character-development",name:"Advanced Character Development",desc:"(Character Development) Kelola nama, umur, gender, faksi (Baik / Netral / Jahat), serta deskripsi latar belakang; Berikan statistik personal dan tags kepribadian otomatis untuk visualisasi perkembangan karakter."},
        {id:4,icon:"note",name:"Brainstorming Tools",desc:"(Goals) Atur penjadwalan dan tujuan dengan waktu yang anda tentukan sendiri; (Events) Catat kejadian penting yang terjadi di dalam cerita anda; (Relics) Catat Pusaka penting yang muncul dalam dunia anda; (Notes) Catat segala ide untuk mengembangkan dunia anda"},
        {id:5,icon:"book-library",name:"Seamless Writing Workspace (Book Library)",desc:"(Book Library) Tulis draf novel atau cerpen secara langsung per bab dalam antarmuka yang bersih; Buat catatan garis besar sebelum dituangkan ke dalam Chapter."}
    ]
    const featuresData = [
        {id:1,name:"All-in-one Workflow",icon:"tools",desc:"Alat perencanaan dan menulis yang lengkap untuk membangun dunia."},
        {id:2,name:"Multi-Pin Note",icon:"pin",desc:"Pin berbagai catatan penting agar rancangan anda lebih konsisten dan sesuai."},
        {id:3,name:"Export To Document",icon:"docx",desc:"Ekspor karya tulismu ke format .docx dengan opsi pemformatan teks yang lengkap."},
        {id:4,name:"AI Companion",icon:"ai",desc:"Gunakan AI Companion sebagai teman dikusi anda dalam membangun dunia fiksi."},
        {id:5,name:"Chapter Reader",icon:"voice",desc:"Gunakan Chapter Reader untuk mendengar kembali cerita yang sudah anda buat."},
    ]

    const features = useRef<HTMLElement>(null)
    const tools = useRef<HTMLDivElement>(null)
    useGSAP(() => {
        if (!features || !tools) return

        gsap.fromTo('.features', {opacity:0,scale:0}, {opacity:1,scale:1,duration:0.5,stagger:0.2,ease:'power3.inOut',scrollTrigger:{
            trigger: tools.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
        }})

        const featureCards = gsap.utils.toArray<HTMLElement>('.details')
        featureCards.forEach(card => {
            gsap.fromTo(card, {opacity: 0, x: -20, scale: 0.25}, {opacity: 1, x: 0, scale:1, duration: 0.8, ease: 'power3.out', scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
            }})
        })
    })

    return <section ref={features} id="features" className="w-full min-h-screen p-8 center flex-col gap-24">
        <h2 className="text-2xl uppercase text-(--accent)">| App Features |</h2>
        <div className="w-full flex flex-wrap justify-center gap-8 p-8 shadow-inner rounded-xl bg-center bg-[url(/public/illustrations/illus-3.jpg)]" ref={tools}>
            {featuresData.map(item => <div key={item.id} className="features center transition-all duration-150 hover:border-(--accent) hover:bg-(--primary) border-b-2 border-neutral-600 flex-col min-h-48 gap-8 p-4 rounded-lg bg-(--primary)/75 w-[calc(33.333%-2rem)]">
                <h3 className="uppercase font-bold">{item.name}</h3>
                <Icon type="online" use={item.icon} fill color="var(--accent)" scale="2"/>
                <p className="text-center opacity-75">{item.desc}</p>
            </div>)}
        </div>
        {detailsData.map(item => <div key={item.id} className="details w-full border-b border-neutral-700 p-16 flex flex-col gap-8">
            <div className="flex gap-8">
                <Icon type="online" use={item.icon} fill color="var(--accent)" scale="2"/>
                <h3 className="font-bold text-2xl">{item.name}</h3>
            </div>
            <p className="opacity-75 w-[85%]">{item.desc}</p>
        </div>)}
    </section>
}
//* Planning Section
function Planning() {
    const authValue = window.localStorage.getItem("auth");
    const userData = authValue ? JSON.parse(authValue) : null;
    const id = userData?.user?.id ?? ""
    const {data: profiles = []} = useFetch<Profiles>('user_data', '', {
        eq: {
            user_id: id || undefined
        }
    })

    const planData = [
        {id:1,title:"Free",benefits:[
            "max. 1 Universe",
            "max. 10 Timeline, & 10 Continent per Timeline",
            "max. 20 Place per Continent",
            "max. 30 Character",
            "max. 20 Goal, Event, Relic, Note",
            "max. 2 Novel in Libary",
            "max. 100 Chapter per Book",
        ],price:0},
        {id:2,title:"Hobbies",benefits:[
            "All Feature on Free Plan /w:",
            "+2 Universe",
            "+5 Timeline, & +5 Continent/Timeline",
            "+5 Place per Continent",
            "+30 Character",
            "+20 Goal, Event, Relic, Note",
            "+3 Novel in Libary",
            "+20 Chapter per Book",
            "Export to .docx Feature",
            "Usable AI Companion"
        ],price:49999},
        {id:3,title:"Professionals",benefits:[
            "All Feature on Hobbies Plan /w:",
            "+2 Universe",
            "+5 Timeline, +5 Continent/Timeline",
            "+5 Place per Continent",
            "+40 Character",
            "+5 Novel in Libary",
            "+20 Chapter per Book",
        ],price:99999}
    ]

    const planning = useRef<HTMLElement>(null)
        useGSAP(() => {
        if (!planning.current) return

        gsap.fromTo(".plan", {opacity: 0, y: -20, scale: 0.25}, {opacity: 1, x: 0, scale:1, duration: 0.8, ease: 'bounce', stagger: 0.2, scrollTrigger: {
            trigger: planning.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
        }})
    })

    return <section ref={planning} id="planning" className="w-full min-h-screen p-8 center flex-col gap-16 bg-(--primary)">
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
}
//* Footer Section
function Footer() {
    const socialMedia = [
        {id:3,icon:"instagram",username:"@msgs_adra",url:"https://www.instagram.com/msgs_adra/"},
        {id:4,icon:"facebook",username:"Masagus Ramadhan",url:"https://www.facebook.com/profile.php?id=61589665117247"},
        {id:5,icon:"github",username:"Ashonst2844",url:"https://github.com/Ashonst2844"},
        {id:6,icon:"x",username:"@sasha28446419",url:"https://x.com/sasha28446419"},
    ]

    return <footer id="contact" className="w-full min-h-full p-16 text-sm">
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
    
    return <main className="w-screen relative">
        {isLoading && <Loading message="User"/>}
        <Header plan={profiles[0]?.plan}/>
        <Home/>
        <Builder/>
        <About/>
        <Feature/>
        <Planning/>
        <Footer/>
        <hr className="border border-neutral-600"/>
        <div className="w-full h-24 center text-sm">
            <p>Copyright &copy; 2026, Masagus Ahmad Ramadhan, All Right Reserved</p>
        </div>
    </main>
}