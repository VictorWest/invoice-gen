import Button from "@/components/button";
import Footer from "@/components/footer";
import Header from "@/components/header";
import HeaderContent from "@/components/header-content";
import { invoicePageRoute, loginPageRoute, registerPageRoute } from "@/utils/routeMap";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { FaFileInvoice, FaLongArrowAltRight } from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import { MdCallToAction } from "react-icons/md";

export default async function HomePage(){
    const session = await getServerSession()
    
    return (
        <div>
            <Header isHome />
            <main className="mt-25 font-sans px-10 py-5 text-white space-y-10">
                <div className="w-full *:flex *:justify-center space-y-3">
                    <div>
                        <h1 className="font-serif text-6xl w-1/2 text-center">Make Simple. Fast. Professional Invoices.</h1>
                    </div>
                    <p className="font-serif text-stone-400 text-md">Generate, customize, and send invoices in minutes</p>
                    <div className="mt-5 space-x-3">
                        <Link href={session ? invoicePageRoute : registerPageRoute}><Button bgColour="#C7F121" title={<p className="font-bold">{session ? "Go to invoices" : "Get Started — For Free!"}</p>} /></Link>
                        {!session && <Link href={loginPageRoute} className="font-bold px-5 py-3 text-sm rounded-full cursor-pointer border border-white hover:bg-white hover:text-black">
                            Log in
                        </Link>}
                    </div>
                </div>
                <HeaderContent />
            </main>
            <Footer />
        </div>
    )
}