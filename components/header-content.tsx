"use client"
import { invoicePageRoute, registerPageRoute } from "@/utils/routeMap";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { FaFileInvoice, FaLongArrowAltRight } from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import { MdCallToAction } from "react-icons/md";

export default function HeaderContent(){
    const { data: session } = useSession()

    return (
        <div>
            <div className="w-full flex justify-center gap-20 items-center mt-30">
                <div className="space-y-3 w-96">
                    <h2 className="font-bold text-2xl">Online Invoice Generator</h2>
                    <p className="text-sm">Create and manage invoices easily from any device, anytime. Your account stays synced, and your data is securely stored at all times.</p>
                    <Link href={invoicePageRoute} className="uppercase text-lg hover:underline text-[#C7F121] flex items-center gap-2 cursor-pointer">Use invoicegen now <span><FaLongArrowAltRight /></span></Link>
                </div>
                <Image src="/images/invoice-user.jpg" width={550} height={300} alt="Person using invoice" className="rounded-4xl w-auto h-auto" />
            </div>
            <div className="my-30 space-y-30 *:w-full *:flex *:justify-center *:gap-20">
                <div>
                    <div className="flex flex-col justify-between bg-[#BCADF9] text-black text-4xl px-5 py-9 w-lg h-76 rounded-4xl">
                        <FaFileInvoice className="text-5xl" />
                        <p>Why Choose Our <span className="font-bold">Invoice Generator?</span></p>
                    </div>
                    <div className="w-120 *:flex *:flex-col *:items-start *:justify-center space-y-3 my-auto">
                        <div>
                            <span className="font-bold">1. Quick & Easy</span>
                            <p>Create invoices instantly with our intuitive editor — no templates to wrestle with.</p>
                        </div>
                        <div>
                            <span className="font-bold">2. Fully Customizable</span>
                            <p>Add your logo, set tax rates, and personalize invoice fields to fit your brand.</p>
                        </div>
                        <div>
                            <span className="font-bold">3. Save & Download</span>
                            <p>Export your invoices as PDF or share them directly via email.</p>
                        </div>
                        <div>
                            <span className="font-bold">4. Secure & Private</span>
                            <p>Your data stays with you — no unwanted uploads or tracking.</p>
                        </div>
                    </div>
                </div>

                <div className="">
                    <div className="w-120 *:flex *:flex-col *:items-end *:justify-center space-y-3 my-auto">
                        <div>
                            <span className="font-bold">1. Enter Your Details</span>
                            <p>Add your company, client, and invoice info.</p>
                        </div>
                        <div>
                            <span className="font-bold">2. Customize & Preview</span>
                            <p>Adjust layout, taxes, and currency.</p>
                        </div>
                        <div>
                            <span className="font-bold">3. Download & Send</span>
                            <p>Export a professional PDF or share via link.</p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between bg-[#2AC9A3] text-black text-4xl px-5 py-9 w-lg h-76 rounded-4xl">
                        <MdCallToAction className="text-5xl" />
                        <p>Create Your Invoice in <span className="font-bold">3 Simple Steps</span></p>
                    </div>
                </div>
            </div>
            <div className="bg-[#C6F121] text-black h-96 flex flex-col items-center justify-center gap-5 rounded-4xl mb-30">
                <p className="text-3xl font-bold">{session ? "This is InvoiceGen" :"Get started for free"}</p>
                <p className="text-xl">Send your next invoice and keep business moving.</p>
                <Link href={session ? invoicePageRoute : registerPageRoute} className="uppercase px-5 py-3 cursor-pointer hover:opacity-90 bg-white font-bold flex justify-center items-center rounded-md gap-2 hover:bg-black hover:text-white">
                    <span className="truncate">{session ? "Go to invoices" : "Get Started"}</span>
                    <FaArrowTrendUp className="shrink-0" />
                </Link>
            </div>
        </div>
    )
}