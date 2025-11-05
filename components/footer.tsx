"use client"
import Link from "next/link";
import Button from "./button";
import { FaFacebook, FaLinkedin, FaTwitter ,FaYoutube } from "react-icons/fa";
import { MdArrowOutward } from "react-icons/md";
import { invoicePageRoute, loginPageRoute, premiumPageRoute, registerPageRoute } from "@/utils/routeMap";
import Logout from "./logout";
import { useSession } from "next-auth/react";

export default function Footer(){
    const { data: session } = useSession()

    return (
        <div className="bg-[#FFFFFF] h-72 text-black p-10 relative">
            <div className="flex justify-between items-center">
                <div className="flex flex-col items-center justify-between *:w-70 px-10 py-5 space-y-5">
                    <p className="font-bold text-2xl">InvoiceGen</p>
                    <div className="flex items-center gap-2 *:text-xl">
                        <FaFacebook />
                        <FaLinkedin />
                        <FaTwitter />
                        <FaYoutube />
                    </div>
                    <div className="flex gap-2">
                        {!session && <Link href={loginPageRoute} className="font-bold px-5 py-3 text-sm rounded-full cursor-pointer bg-[#C6F121]">
                            Log in
                        </Link>}
                        <Button textColour="white" bgColour="black" title={<div className="font-bold">{session ? <Logout /> : <Link href={registerPageRoute}>Get Started</Link>}</div>} />
                    </div>
                </div>
                <div className="flex gap-10 *:space-y-3 *:flex *:flex-col **:cursor-pointer *:*:hover:underline">
                    <div>
                        <p>Home</p>
                        <p>About</p>
                        <p>Contact</p>
                    </div>
                    <div> 
                        <Link href={invoicePageRoute}>Generate Invoice</Link>
                        <p>Features</p>
                        {session ? 
                            <Logout />
                            :
                            <Link href={loginPageRoute} className="flex items-center gap-1">Login <MdArrowOutward /></Link>
                        }
                    </div>
                    <div>
                        <Link href={premiumPageRoute}>Go to Premium Page</Link>
                    </div>
                </div>
                <div></div>
                <div></div>
            </div>
            <div className="flex gap-5 absolute bottom-0 text-sm *:cursor-pointer *:hover:underline">
                <p>© {new Date().getFullYear()} InvoiceGen.</p>
                <p>Privacy Policy</p>
                <p>Terms of Service</p>
            </div>
        </div>
    )
}