import { Link, useLocation } from "react-router-dom"

export default function Breadcrumb() {
    const location = useLocation()
    const pathname = location.pathname.split("/").filter((x)=>x)

    return <div className="w-full h-[10%] hidden lg:flex p-4 items-center text-sm">
        <Link to="/" className="hover:text-(--accent)">HOME</Link>
        {pathname.map((item,i)=>{
            const to = `/${pathname.slice(0, i + 1).join("/")}`;
            const isLast = i === pathname.length - 1;
            if(item==="projects") return
            if(item==="dashboard") return
            if(i === 1) return <Link key={i} to={to} className="hover:text-(--accent)">/ DASHBOARD</Link>
            
            const text = item.toUpperCase().replaceAll("-"," ")

            return <span key={to}>
                <span>/ </span>
                {isLast?<span className="text-(--accent) font-bold">{text}</span>
                :<Link aria-label={"Navigasi " + text} to={to} className="hover:text-(--accent)">{text}</Link>}
            </span>
            })}
    </div>
}