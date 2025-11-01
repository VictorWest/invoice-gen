"use client"
import { RiDeleteBin6Line } from "react-icons/ri";
import Button from "./button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { invoicePageRoute } from "@/utils/routeMap";

export default function ConfirmDelete({ onClose, invoiceId }: { onClose: any, invoiceId: string }){
    const router = useRouter()

    const [ isLoading, setIsLoading ] = useState(false)

    const handleDeleteInvoice = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`/api/invoice-data/${invoiceId}`, {
                method: "DELETE"
            })

            if (response.ok){
                onClose()
                window.location.reload()
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-3 items-center justify-center">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center"><RiDeleteBin6Line className="text-red-500 text-xl" /></div>
            <h2 className="font-bold text-xl">Delete</h2>
            <p>Are you sure you want to delete?</p>
            <div className="flex items-center gap-5">
                <div onClick={onClose}><Button textColour="black" bgColour="#e7e5e4" title="Cancel" /></div>
                <div onClick={handleDeleteInvoice}><Button textColour="white" bgColour="#9f0712" title="Confirm" isLoading={isLoading} /></div>
            </div>
        </div>
    )
}