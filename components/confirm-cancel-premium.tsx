"use client"

import { GetUserContext } from "@/context/UserContext"
import Button from "./button"
import { useState } from "react"
import { sendSubscriptionEmail } from "@/utils/resend"

export default function ConfirmCancelPremium({ onClose }: { onClose: any }){
    const { setReloadSubscription } = GetUserContext()

    const [ isLoading, setIsLoading ] = useState(false)
    const handleCancelPremium = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/subscription', {
                method: "DELETE"
            })

            if (response.ok){
                const { email, customerName, planName } = await response.json()
                
                setReloadSubscription((prev: boolean) => !prev)
                await sendSubscriptionEmail(email, customerName, planName, "termination")
                onClose()
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full flex flex-col items-center justify-center gap-6 text-center h-72 text-gray-800">
            <h2 className="text-xl font-semibold">Cancel Premium Plan</h2>
            <p className="max-w-sm text-sm text-gray-600">
                Are you sure you want to cancel your <span className="font-bold text-[#d3af37]">InvoiceGen+</span> subscription?
                You’ll lose access to all premium features immediately after cancellation.
            </p>

            <div className="flex items-center justify-center gap-4 mt-4">
                <div onClick={onClose}><Button bgColour="#9f0712" textColour="white" title="Keep Premium" /></div>
                <div onClick={handleCancelPremium}><Button bgColour="#e5e7eb" textColour="#1e2939" title={isLoading ? 'Cancelling...' : 'Confirm Cancel'} /></div>
            </div>
        </div>
    )
}