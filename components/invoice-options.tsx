"use client"

import { UseInvoiceContext } from "@/context/InvoiceContext"
import { invoicePageRoute } from "@/utils/routeMap"
import Link from "next/link"
import DeleteModal from "./modal"
import ConfirmDelete from "./confirm-delete"

export default function InvoiceOptions({ invoiceData } : { invoiceData: any }){
    const { lineItems, selectedCurrency, discountData, taxData, uploadedImage, templateColour, ...originalInvoiceData } = invoiceData

    const { handleSaveAsPDF, isDeleteModalOpen, openDeleteModal, closeDeleteModal } = UseInvoiceContext()

    const handleDeleteInvoice = () => {
        openDeleteModal()
    }
    return (
        <>
            <div className="*:flex *:items-center *:gap-1 *:cursor-pointer *:hover:opacity-75 uppercase border border-stone-300 py-2 bg-white w-25 space-y-2 shadow-lg flex flex-col items-center justify-center text-xs rounded-lg">
                <Link href={`${invoicePageRoute}/${invoiceData.invoiceId}/edit`}>Edit</Link>
                <hr className="border border-stone-200 w-full" />
                <Link href={`${invoicePageRoute}/${invoiceData.invoiceId}/preview`}>Preview</Link>
                <hr className="border border-stone-200 w-full" />
                <p onClick={() => handleSaveAsPDF(originalInvoiceData, lineItems, selectedCurrency, discountData, taxData, uploadedImage, templateColour)}>
                    Print
                </p>
                <hr className="border border-stone-200 w-full" />
                <p className="text-red-600" onClick={handleDeleteInvoice}>DELETE</p>
            </div>
            <DeleteModal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
                <ConfirmDelete onClose={closeDeleteModal} invoiceId={invoiceData?.invoiceId} />
            </DeleteModal>
        </>
    )
}