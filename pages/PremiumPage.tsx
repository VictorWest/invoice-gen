"use client"
import Button from "@/components/button";
import Footer from "@/components/footer";
import Header from "@/components/header";
import HeaderContent from "@/components/header-content";
// import { UseInvoiceContext } from "@/context/InvoiceContext";
import { PlanStatus } from "@/generated/prisma";
// import { loginPageRoute } from "@/utils/routeMap";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react"

export default function PremiumPage(){   
    // const { data: session } = useSession()
    // const router = useRouter()

    const handleSubscriptionButton = async (plan: PlanStatus) => {
        // if (!session){
        //     router.push(loginPageRoute)
        // } else {
        //     try {
        //         const response = await fetch('/api/subscription/create', {
        //             method: "POST",
        //             headers: {
        //                 "Content-Type": "application/json"
        //             },
        //             body: JSON.stringify({ plan })
        //         })
        //     } catch (error) {
        //         console.log(error)
        //     }
        // }
        console.log(plan)
    }

    return (
        <div>
            <Header isPremium />
            <main className="mt-25 font-sans px-10 py-5 text-white space-y-10">
                <div className="w-full *:flex *:justify-center space-y-3">
                    <div>
                        <h1 className="font-serif text-5xl w-1/4 text-center">Upgrade to <span className="text-[#C6F121]">InvoiceGen+</span></h1>
                    </div>
                    <p className="font-serif text-stone-400 text-xs">Access premium features that save time, boost productivity, and keep your business ahead.</p>
                </div>
                <div className="flex items-center justify-center gap-20 my-20">
                    <div className="flex flex-col justify-between bg-white text-black text-xl px-5 py-9 w-96 h-76 rounded-4xl">
                        <div className="font-bold">
                            <p>Monthly</p>
                            <p className="text-5xl">$9.99</p>
                        </div>
                        <p>Billed Monthly</p>
                        <div onClick={() => handleSubscriptionButton("MONTHLY")}><Button textColour="white" bgColour="black" title="Subscribe Now" /></div>
                    </div>
                    <div className="flex flex-col justify-between bg-[#BCADF9] text-black text-xl px-5 py-9 w-96 h-76 rounded-4xl">
                        <div className="font-bold">
                            <p>Annual</p>
                            <div className="space-y-3">
                                <p className="text-5xl">$99.99</p>
                                <div className="bg-white w-fit px-4 py-1 text-sm rounded-full hover:opacity-90 flex items-center justify-center font-semibold">Save 17%</div>
                            </div>
                        </div>
                        <p>Billed Annually</p>
                        <div onClick={() => handleSubscriptionButton("ANNUAL")}><Button textColour="white" bgColour="black" title="Subscribe Now" /></div>
                    </div>
                </div>
                <HeaderContent />
            </main>
            <Footer />
        </div>
    )
}