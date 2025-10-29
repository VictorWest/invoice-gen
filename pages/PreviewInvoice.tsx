"use client"
import Header from "@/components/header";
import { formatCurrency, formatDateDayMonth, generatePDF } from "@/utils/helpers";
import { DiscountData, InvoiceData, LineItemType, TaxData, UploadedImage } from "@/utils/interfaces/interfaces";
import { invoicePageRoute } from "@/utils/routeMap";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react";
import { Providers } from "@/components/providers";
import { CiPhone, CiMobile1 } from "react-icons/ci";
import { LiaFaxSolid } from "react-icons/lia";
import Button from "@/components/button";
import Link from "next/link";
import { defaultInvoiceData, EMAIL_REGEX } from "@/utils/data";
import Input from "@/components/input";
import { sendInvoiceEmail } from "@/utils/resend";

export default function PreviewInvoice(){
    const params = useParams()
    const id = params?.id;
    const router = useRouter();

    useEffect(() => {
        if (!id) {
            router.replace(invoicePageRoute)
        }
    }, [id, router])

    const [ selectedCurrency, setSelectedCurrency ] = useState({ name: "USD", symbol: "$" })
    const [ invoiceData, setInvoiceData ] = useState<InvoiceData>(defaultInvoiceData)
    const [ lineItems, setLineItems ] = useState<LineItemType[]>([])
    const [ taxData, setTaxData ] = useState<TaxData>({ type: "Deducted", label: "Tax", rate: 0, inclusive: false })
    const [ discountData, setDiscountData ] = useState<DiscountData>({ type: "None", amount: 0, calculatedAmount: 0 })
    const [ templateColour, setTemplateColour ] = useState("")
    const [ uploadedImage, setUploadedImage ] = useState<UploadedImage | null>(null);
    const [ emailToSend, setEmailToSend ] = useState("")

    // UX State Management
    const [ sendToEmailIsActive, setSendToEmailIsActive ] = useState(false)
    const [ inputIsInvalid, setInputIsInvalid ] = useState(false)
    const [ error, setError ] = useState("")

    useEffect(() => {
        (async () => {
            const response = await fetch(`/api/invoice-data/${id}`)

            if (!response.ok){
                router.replace(invoicePageRoute)
                return
            }

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
                    templateColour, notes } = data;
            setSelectedCurrency(selectedCurrency)
            setInvoiceData({ invoiceId, invoiceTitle, fromName, fromEmail, fromAddress, fromPhone, fromBusiness, billToName, billToEmail, billToAddress, billToPhone, billToMobile, billToFax, invoiceNumber, date, terms, lineItems, subtotal, tax, total, balance, signatureUrl, notes})
            setLineItems(lineItems)
            setTaxData(taxData)
            setDiscountData(discountData)
            setTemplateColour(templateColour)
        })()
    }, [])

    useEffect(() => {
        (async () => {
            if (invoiceData?.invoiceId){
                const response = await fetch(`/api/image-upload/${invoiceData?.invoiceId}`)

                if (response.ok){
                    const { imageToDisplay } = await response.json()
                    const { url, fileId, invoiceId } = imageToDisplay
                    setUploadedImage({ url, fileId, invoiceId })
                }
            }
        })()
    }, [invoiceData?.invoiceId])

    useEffect(() => {
        if (emailToSend !== "" && !EMAIL_REGEX.test(emailToSend)){
            setInputIsInvalid(true)
        } else {
            setInputIsInvalid(false)
        }
    }, [emailToSend])

    const invoiceRef = useRef<HTMLDivElement | null>(null)

    const handleSaveAsPDF = () => {
        // Premium will be added
        generatePDF(invoiceData, lineItems, selectedCurrency, discountData, taxData, uploadedImage, templateColour)
    }

    const handleSendEmail = async () => {
        if (!EMAIL_REGEX.test(emailToSend)){
            setError("Please give a correct email")
        } else {
            setError("")
            const data = await generatePDF(invoiceData, lineItems, selectedCurrency, discountData, taxData, uploadedImage, templateColour, true)
            if (data?.filename && data?.buffer){
                sendInvoiceEmail(emailToSend, invoiceData, selectedCurrency, data?.filename, data?.buffer)
            }
        }
    }

    return(
        <Providers>
            <Header />
            <div className={`mt-20 bg-stone-100 text-black ${sendToEmailIsActive && "flex"}`}>
                <div className={`${sendToEmailIsActive && "w-3/4"}`}>
                    <div className="flex gap-1 justify-center">
                        <div className="flex justify-between w-[210mm] pt-5">
                            <Link href={`${invoicePageRoute}/${invoiceData?.invoiceId}/edit`}><Button bgColour="#e7e5e4" title="Edit" className="border border-stone-300" /></Link>
                            <div className="flex items-center gap-5">
                                <div onClick={handleSaveAsPDF}><Button bgColour="#e7e5e4" title="PDF" className="border border-stone-300" /></div>
                                <div onClick={() => setSendToEmailIsActive(true)}><Button bgColour="#000" textColour="#e7e5e4" title="Email Invoice" className="border border-stone-300" /></div>
                            </div>
                        </div>
                    </div>
                    <div className="md:px-15 py-3 flex justify-center gap-10 relative">
                        <div className="w-[210mm]" ref={invoiceRef}> 
                            <div style={{ background: templateColour == "white" ? "#fff" : (templateColour == "black" ? "#000" : templateColour)}} className="h-2"></div>
                            <div className="bg-white py-10 px-5 md:px-15 space-y-10">
                                <div className="flex justify-between">
                                    <div className="flex gap-5">
                                        {uploadedImage?.url && <div className="relative">
                                            <Image src={uploadedImage?.url} width={200} height={200} alt="Logo" />
                                        </div>}
                                        <div className="space-y-3 text-sm">
                                            <h1 className="font-bold mb-5">FROM</h1>
                                            <p className="text-lg font-semibold">{invoiceData?.fromName}</p>
                                            <p>{invoiceData?.fromAddress}</p>
                                            <p>{invoiceData?.fromPhone}</p>
                                            <p>{invoiceData?.fromBusiness}</p>
                                            <p>{invoiceData?.fromEmail}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3 text-end">
                                        <h1 className="font-bold">{invoiceData?.invoiceTitle}</h1>
                                        <p>{invoiceData?.invoiceNumber}</p>
                                        <div>
                                            <p className="text-xs font-semibold">DATE</p>
                                            <p>{formatDateDayMonth(invoiceData?.date || '')}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold">DUE</p>
                                            <p>{invoiceData?.terms}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold">BALANCE DUE</p>
                                            <p>{selectedCurrency?.name} {formatCurrency(invoiceData?.balance ?? 0, selectedCurrency?.symbol)}</p>
                                        </div>
                                    </div>
                                </div>
                                <hr className="text-stone-400" />
                                <div className="space-y-3 text-sm *:flex *:items-center *:gap-1">
                                    <h1 className="font-bold mb-5 text-sm">BILL TO</h1>
                                    <p className="text-lg font-semibold">{invoiceData?.billToName}</p>
                                    {invoiceData?.billToAddress && <p>{invoiceData?.billToAddress}</p>}
                                    {invoiceData?.billToPhone && <p><CiPhone /> {invoiceData?.billToPhone}</p>}
                                    {invoiceData?.billToMobile && <p><CiMobile1 /> {invoiceData?.billToMobile}</p>}
                                    {invoiceData?.billToFax && <p><LiaFaxSolid /> {invoiceData?.billToFax}</p>}
                                    {invoiceData?.billToEmail && <p>{invoiceData?.billToEmail}</p>}
                                </div>
                                <div>
                                    <div className="flex uppercase border-y py-2 px-10 font-bold text-sm">
                                        <p className="w-2/3">Description</p>
                                        <div className="w-1/3 flex justify-between *:w-10">
                                            <p>Rate</p>
                                            <p>Qty</p>
                                            <p className="whitespace-nowrap">Amount ({selectedCurrency?.symbol})</p>
                                        </div>
                                    </div>
                                    {lineItems?.map(item => (
                                        <div key={item.index}>
                                            <div className="flex text-sm px-10 py-2">
                                                <p className="w-2/3">{item.description}</p>
                                                <div className="w-1/3 flex justify-between *:w-10">
                                                    <p>{formatCurrency(item.rate, selectedCurrency?.symbol)}</p>
                                                    <p>{item.quantity}</p>
                                                    <p>{formatCurrency(item.amount, selectedCurrency?.symbol)}</p>
                                                </div>
                                            </div>
                                            <hr className="text-stone-400" />
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-3 text-sm">
                                    <h1 className="font-bold mb-5 text-sm">NOTES</h1>
                                    <p className="wrap-break-word whitespace-pre-wrap">{invoiceData?.notes}</p>
                                </div>
                                <div className="flex flex-col items-end *:flex *:w-80 *:justify-between *:py-1">
                                    <div>
                                        <p className="font-semibold text-sm">SUBTOTAL</p>
                                        <p>{formatCurrency(invoiceData?.subtotal || 0, selectedCurrency?.symbol)}</p>
                                    </div>
                                    {discountData?.type !== "None" && <div>
                                        <p className="font-semibold text-sm">DISCOUNT{discountData?.type === "Percent" && `(${discountData?.amount}%)`}</p>
                                        <p>{formatCurrency(discountData?.calculatedAmount || 0, selectedCurrency?.symbol)}</p>
                                    </div>}
                                    {taxData?.type !== "None" && <div>
                                        <p className="font-semibold text-sm">{taxData?.label.toUpperCase()} ({taxData?.rate}%)</p>
                                        <p>{formatCurrency(invoiceData?.tax || 0, selectedCurrency?.symbol)}</p>
                                    </div>}
                                    <div className="border-y mt-2">
                                        <p className="font-semibold text-sm">TOTAL</p>
                                        <p>{formatCurrency(invoiceData?.total || 0, selectedCurrency?.symbol)}</p>
                                    </div>
                                    <div className="py-5 font-semibold space-y-3 border-b">
                                        <div className="w-full flex flex-col items-end py-5">
                                            <p className="text-xs">BALANCE DUE</p>
                                            <p className="text-xl">{selectedCurrency?.name} {formatCurrency(invoiceData?.balance || 0, selectedCurrency?.symbol)}</p>
                                        </div>
                                    </div>
                                </div>
                                {invoiceData?.signatureUrl &&
                                    <div className="w-full flex flex-col justify-center items-center gap-2">
                                        <Image src={invoiceData?.signatureUrl} width={150} height={150} alt="Signature" />
                                        <p className="text-xs font-semibold">FOR: {invoiceData?.fromName}</p>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center gap-5 pb-20">
                        <div className="w-[210mm] flex justify-between">
                            <Button bgColour="#e7e5e4" title="Close Invoice" className="border border-stone-300" />
                            <Button bgColour="#991B1B" textColour="#fff" title="Delete Invoice" className="" />
                        </div>
                    </div>
                </div>
                {sendToEmailIsActive && <div className="w-1/4 mt-20 mr-10 space-y-5">
                    <div>
                        <h2 className="uppercase font-semibold">SEND INVOICE VIA EMAIL</h2>
                        <hr className="text-stone-300" />                        
                    </div>
                    <div>
                        <Input
                            onChange={(e) => setEmailToSend(e.target.value)} 
                            value={emailToSend} type="email"
                            placeholder="example@example.com" 
                            inputIsInvalid={inputIsInvalid}
                        />
                        <p className="text-xs text-red-600">{error}</p>
                    </div>
                    <div onClick={handleSendEmail}><Button bgColour="#000" textColour="#e7e5e4" title={<p className="w-full flex justify-center items-center font-bold">Send</p>} className="border border-stone-300 " /></div>
                </div>}
            </div>
        </Providers>
    )
}