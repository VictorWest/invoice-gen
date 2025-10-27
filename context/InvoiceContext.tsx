"use client"
import { defaultInvoiceData } from "@/utils/data";
import { DiscountData, InvoiceData, LineItemType, TaxData, UploadedImage } from "@/utils/interfaces/interfaces";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

const InvoiceContext = createContext<any>(null)

export const InvoiceProvider = ({ children }: any) => {
    const { data: session } = useSession()

    const [ selectedCurrency, setSelectedCurrency ] = useState({ name: "USD", symbol: "$" })
    const [ invoiceData, setInvoiceData ] = useState<InvoiceData>(defaultInvoiceData)
    const [ lineItems, setLineItems ] = useState<LineItemType[]>([])
    const [ taxData, setTaxData ] = useState<TaxData>({ type: "Deducted", label: "Tax", rate: 0, inclusive: false })
    const [ discountData, setDiscountData ] = useState<DiscountData>({ type: "None", amount: 0, calculatedAmount: 0 })
    const [ calculateTotal, setCalculateTotal ] = useState({subtotal: 0, tax: 0, total: 0})
    const [ templateColour, setTemplateColour ] = useState("white")
    const [ uploadedImage, setUploadedImage ] = useState<UploadedImage | null>(null);
    
    // UX State Management
    const [ lineItemIndex, setLineItemIndex ] = useState(1)
    const [ hasSavedDocument, setHasSavedDocument ] = useState(false)

    useEffect(() => {
        if (invoiceData?.id){
            (async () => {
                const response = await fetch(`/api/invoice-data/${invoiceData?.id}`)
    
                if (response.ok){
                    const data = await response.json()
                    const { selectedCurrency,
                            invoiceId,
                            invoiceTitle,
                            fromName,
                            fromEmail,
                            fromAddress,
                            fromPhone,
                            fromBusiness,
                            billToName,
                            billToEmail,
                            billToAddress,
                            billToPhone,
                            billToMobile,
                            billToFax,
                            invoiceNumber,
                            date,
                            terms,
                            lineItems,
                            taxData,
                            discountData,
                            subtotal,
                            tax,
                            total,
                            balance,
                            signatureUrl,
                            templateColour } = data;
                    setSelectedCurrency(selectedCurrency)
                    setInvoiceData({ id: invoiceId, invoiceTitle, fromName, fromEmail, fromAddress, fromPhone, fromBusiness, billToName, billToEmail, billToAddress, billToPhone, billToMobile, billToFax, invoiceNumber, date, terms, lineItems, subtotal, tax, total, balance, signatureUrl})
                    setLineItems(lineItems)
                    setLineItemIndex(lineItems + 1)
                    setTaxData(taxData)
                    setDiscountData(discountData)
                    setCalculateTotal({ subtotal, tax, total })
                    setTemplateColour(templateColour)
                }
            })()
        }
    }, [invoiceData?.id])

    useEffect(() => {
        (async () => {
            if (invoiceData?.id){
                const response = await fetch(`/api/image-upload/${invoiceData?.id}`)

                if (response.ok){
                    const { imageToDisplay } = await response.json()
                    const { url, fileId, invoiceId } = imageToDisplay
                    setUploadedImage({ url, fileId, invoiceId })
                }
            }
        })()
    }, [invoiceData?.id])
    
    const handleSaveImageToDB = async (data: UploadedImage) => {
        try {
            const response = await fetch(`/api/image-upload/${data.invoiceId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleSaveChangesToDB = async () => {
        try {
            const response = await fetch("/api/invoice-data", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ selectedCurrency, invoiceData, lineItems, taxData, discountData, calculateTotal, templateColour })
            })
            setHasSavedDocument(true)
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <InvoiceContext.Provider value={{ 
                                            session,
                                            selectedCurrency, setSelectedCurrency,
                                            invoiceData, setInvoiceData,
                                            lineItemIndex, setLineItemIndex,
                                            lineItems, setLineItems,
                                            taxData, setTaxData,
                                            discountData, setDiscountData,
                                            calculateTotal, setCalculateTotal,
                                            uploadedImage, setUploadedImage,
                                            templateColour, setTemplateColour,
                                            handleSaveChangesToDB,
                                            handleSaveImageToDB,
                                            hasSavedDocument
                                        }}>
            { children }
        </InvoiceContext.Provider>
    )
}

export const UseInvoiceContext = () => useContext(InvoiceContext)