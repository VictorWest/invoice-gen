"use client"
import Link from "next/link";
import { homePageRoute, invoicePageRoute, loginPageRoute, registerPageRoute } from "@/utils/routeMap";
import Logout from "./logout";
import Button from "./button";
import { UseInvoiceContext } from "@/context/InvoiceContext";

export default function Header({ isHome, isPremium }:{ isHome?: boolean, isPremium?: boolean }){
    const { session } = UseInvoiceContext()

    return(
        <header className="flex items-center justify-between *:w-70 px-10 py-5 w-full fixed top-0 bg-black/90 z-10">
            <Link href={homePageRoute} className="font-bold text-xl">InvoiceGen</Link>
            {isHome && <div className="flex items-center gap-5 text-sm text-stone-200 *:border-b *:border-black *:hover:border-white *:cursor-pointer"> 
                <p>Generate Invoice</p>
                <p>Features</p>
                <p>About</p>
            </div>}
            <div className="flex items-center gap-5 justify-end">
                {isPremium &&
                    <Link href={session ? invoicePageRoute : registerPageRoute}><Button bgColour="#C7F121" title={<p className="font-bold whitespace-nowrap">{session ? "Go to invoices" : "Get Started — For Free!"}</p>} /></Link>
                }
                {session ? 
                    <div className="flex items-center justify-center w-10 h-10 rounded-full text-white border font-bold whitespace-nowrap">{session?.user?.email?.charAt(0).toUpperCase()}</div>
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