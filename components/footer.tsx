import Link from "next/link";
import Button from "./button";
import { FaFacebook, FaLinkedin, FaTwitter ,FaYoutube } from "react-icons/fa";
import { MdArrowOutward } from "react-icons/md";
import { loginPageRoute, registerPageRoute } from "@/utils/routeMap";
import { getServerSession } from "next-auth";
import Logout from "./logout";

export default async function Footer(){
    const session = await getServerSession()

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
                <div className="flex gap-10 *:space-y-3 **:cursor-pointer *:*:hover:underline">
                    <div>
                        <p>Home</p>
                        <p>About</p>
                        <p>Contact</p>
                    </div>
                    <div> 
                        <p>Generate Invoice</p>
                        <p>Features</p>
                        <Link href={loginPageRoute} className="flex items-center gap-1">Login <MdArrowOutward /></Link>
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