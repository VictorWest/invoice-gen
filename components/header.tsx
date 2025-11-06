"use client"
import Link from "next/link";
import { homePageRoute, invoicePageRoute, loginPageRoute, premiumPageRoute, registerPageRoute } from "@/utils/routeMap";
import Logout from "./logout";
import Button from "./button";
import { useSession } from "next-auth/react";
import { GetUserContext } from "@/context/UserContext";

export default function Header({ isHome, isPremium, isCreatePremium }:{ isHome?: boolean, isPremium?: boolean, isCreatePremium?:boolean }){
    const { data: session } = useSession()
    const { isSubscribed } = GetUserContext()

    return(
        <header className="flex items-center justify-between *:w-70 px-10 py-5 w-full fixed top-0 bg-black/90 z-10">
            <div className="flex items-end gap-2">
                <Link href={homePageRoute} className="font-bold text-xl">InvoiceGen</Link>
                {isSubscribed && <Link href={premiumPageRoute} className="font-bold text-[#d3af37] text-xs mb-auto">Premium</Link>}
            </div>
            {isHome && <div className="flex items-center gap-5 text-sm text-stone-200 *:border-b *:border-black *:hover:border-white *:cursor-pointer"> 
                <p>Generate Invoice</p>
                <p>Features</p>
                <p>About</p>
            </div>}
            <div className="flex items-center gap-5 justify-end">
                {!isSubscribed && !isCreatePremium && <Link href={premiumPageRoute}><Button textColour="black" bgColour="white" title={<div className="font-bold">Upgrade</div>} /></Link>}
                {isPremium &&
                    <Link href={session ? invoicePageRoute : registerPageRoute}><Button bgColour="#C7F121" title={<p className="font-bold whitespace-nowrap">{session ? "Go to invoices" : "Get Started — For Free!"}</p>} /></Link>
                }
                {session ? 
                    <div className="flex items-center justify-center w-10 h-10 rounded-full text-white text-xl font-bold whitespace-nowrap">{session?.user?.email?.charAt(0).toUpperCase()}</div>
                    :
                    <Link href={loginPageRoute} className="font-bold px-5 py-3 text-sm rounded-full cursor-pointer border border-black hover:border-white whitespace-nowrap">
                        Log in
                    </Link>
                }
                <Button textColour="black" bgColour="white" title={<div className="font-bold">{session ? <Logout /> : <Link href={registerPageRoute} className="whitespace-nowrap">Get Started</Link>}</div>} />
            </div>
        </header>
    )
}