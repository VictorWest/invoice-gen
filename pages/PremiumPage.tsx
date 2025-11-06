"use client"
import Button from "@/components/button";
import Footer from "@/components/footer";
import Header from "@/components/header";
import HeaderContent from "@/components/header-content";
import { PlanStatus } from "@/generated/prisma";
import { invoicePageRoute, loginPageRoute } from "@/utils/routeMap";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"
import { GetUserContext } from "@/context/UserContext";
import Link from "next/link";
import Modal from "@/components/modal";
import CreatePremiumPage from "@/components/create-premium-account";
import { useState } from "react";
import ConfirmCancelPremium from "@/components/confirm-cancel-premium";

export default function PremiumPage(){   
    const { data: session } = useSession()
    const router = useRouter()

    const { isSubscribed } = GetUserContext()

    const [ plan, setPlan ] = useState<PlanStatus>("MONTHLY")
    const [ createModalIsOpen, setCreateModalIsOpen ] = useState(false)
    const [ confirmModalIsOpen, setConfirmModalIsOpen ] = useState(false)

    const openCreateModal = () => setCreateModalIsOpen(true)
    const closeCreateModal = () => setCreateModalIsOpen(false)

    const openConfirmModal = () => setConfirmModalIsOpen(true)
    const closeConfirmModal = () => setConfirmModalIsOpen(false)

    const handleSubscriptionButton = async (plan: PlanStatus) => {
        if (!session){
            router.push(loginPageRoute)
        } else {
            setPlan(plan)
            openCreateModal()
        }
    }
 
    return (
        <div>
            <Header isPremium />
            <main className="mt-25 font-sans px-10 py-5 text-white space-y-10">
                <div className="w-full *:flex *:justify-center space-y-3">
                    <div>
                        <h1 className="font-serif text-5xl w-1/4 text-center">
                            {session && isSubscribed ? <>♡ You are subscribed to <span className="text-[#C6F121]">InvoiceGen+</span></> : <>Upgrade to <span className="text-[#C6F121]">InvoiceGen+</span></>}
                        </h1>
                    </div>
                    <p className="font-serif text-stone-400 text-xs">{isSubscribed ? "As a premium subscriber, you’re equipped with advanced tools that help you save time, stay productive, and keep your business ahead." : "Access premium features that save time, boost productivity, and keep your business ahead."}</p>
                    {session && isSubscribed && <div className="mt-5 space-x-3 flex flex-row-reverse items-center gap-5">
                        <Link href={invoicePageRoute}><Button bgColour="#C7F121" title={<p className="font-bold">Go to invoices</p>} /></Link>
                        <div onClick={() => openConfirmModal()}><Button bgColour="#fff" className="opacity-80" title={<p className="font-bold">Cancel Premium</p>} /></div>
                    </div>}
                </div>
                {!isSubscribed && <div className="flex items-center justify-center gap-20 my-20">
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
                        <div onClick={() => handleSubscriptionButton("ANNUALLY")}><Button textColour="white" bgColour="black" title="Subscribe Now" /></div>
                    </div>
                    <Modal key="create" isOpen={createModalIsOpen} onClose={closeCreateModal}>
                        <CreatePremiumPage plan={plan} />
                    </Modal>
                </div>}
                <Modal key="confirm" isOpen={confirmModalIsOpen} onClose={closeConfirmModal}>
                    <ConfirmCancelPremium onClose={closeConfirmModal} />
                </Modal>
                <HeaderContent />
            </main>
            <Footer />
        </div>
    )
}