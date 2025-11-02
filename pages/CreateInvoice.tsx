"use client"
import Input from "@/components/input";
import { DiscountData, LineItemType } from "@/utils/interfaces/interfaces";
import { currencies, discountCategoryOptions, EMAIL_REGEX, invoiceTermsOptions, MOBILE_NUMBER_REGEX, taxCategoryOptions } from "@/utils/data";
import { useEffect, useState } from "react";
import { FaImage, FaPlus } from "react-icons/fa6";
import { IoIosCheckbox } from "react-icons/io";
import { MdCheckBoxOutlineBlank, MdCancel } from "react-icons/md";
import { formatCurrency } from "@/utils/helpers";
import SignaturePad from "@/components/signature-pad";
import Button from "@/components/button";
import Link from "next/link";
import { UseInvoiceContext } from "@/context/InvoiceContext";
import Image from "next/image";
import ColourBlock from "@/components/colour-block";
import Header from "@/components/header";
import { useParams, useRouter } from "next/navigation";
import { invoicePageRoute } from "@/utils/routeMap";
import { Providers } from "@/components/providers";

export default function CreateInvoice(){
    const params = useParams()
    const id = params?.id;
    const router = useRouter();

    useEffect(() => {
        if (!id) {
            router.replace(invoicePageRoute)
        }
    }, [id, router])

    // Data state management
    const { selectedCurrency,
            setSelectedCurrency,
            invoiceData,
            setInvoiceData,
            lineItemIndex,
            setLineItemIndex,
            lineItems,
            setLineItems,
            taxData,
            setTaxData,
            discountData,
            setDiscountData,
            calculateTotal,
            setCalculateTotal,
            uploadedImage, 
            setUploadedImage, 
            templateColour, 
            setTemplateColour,
            handleSaveChangesToDB,
            hasSavedDocument } = UseInvoiceContext()

    // UX state management
    const [ inputIsInvalid, setInputIsInvalid ] = useState({ fromEmail: false, fromPhone: false, fromBusiness: false, billToEmail: false, billToPhone: false, billToMobile: false, billToFax: false, invoiceNumber: false})
    const [ showSignaturePad, setShowSignaturePad ] = useState(false)
    const [ showCurrencyList, setShowCurrencyList ] = useState(false)
    
    useEffect(() => {
        setInvoiceData((prev: any) => ({...prev, invoiceId: id}))
    }, [])

    useEffect(() => {
        if (invoiceData?.fromEmail !== "" && !EMAIL_REGEX.test(invoiceData?.fromEmail)){
            setInputIsInvalid(prev => ({...prev, fromEmail: true}))
        } else {
            setInputIsInvalid(prev => ({...prev, fromEmail: false}))
        }

        if (invoiceData?.billToEmail !== "" && !EMAIL_REGEX.test(invoiceData?.billToEmail)){
            setInputIsInvalid(prev => ({...prev, billToEmail: true}))
        } else {
            setInputIsInvalid(prev => ({...prev, billToEmail: false}))
        }

        if (invoiceData?.fromPhone !== "" && !MOBILE_NUMBER_REGEX.test(invoiceData?.fromPhone)){
            setInputIsInvalid(prev => ({...prev, fromPhone: true}))
        } else {
            setInputIsInvalid(prev => ({...prev, fromPhone: false}))
        }
        
        if (invoiceData?.fromBusiness !== "" && !MOBILE_NUMBER_REGEX.test(invoiceData?.fromBusiness || "")){
            setInputIsInvalid(prev => ({...prev, fromBusiness: true}))
        } else {
            setInputIsInvalid(prev => ({...prev, fromBusiness: false}))
        }

        if (invoiceData?.billToFax !== "" && !MOBILE_NUMBER_REGEX.test(invoiceData?.billToFax || "")){
            setInputIsInvalid(prev => ({...prev, billToFax: true}))
        } else {
            setInputIsInvalid(prev => ({...prev, billToFax: false}))
        }

        if (invoiceData?.billToMobile !== "" && !MOBILE_NUMBER_REGEX.test(invoiceData?.billToMobile || "")){
            setInputIsInvalid(prev => ({...prev, billToMobile: true}))
        } else {
            setInputIsInvalid(prev => ({...prev, billToMobile: false}))
        }

        if (invoiceData?.billToPhone !== "" && !MOBILE_NUMBER_REGEX.test(invoiceData?.billToPhone)){
            setInputIsInvalid(prev => ({...prev, billToPhone: true}))
        } else {
            setInputIsInvalid(prev => ({...prev, billToPhone: false}))
        }

        if (invoiceData?.invoiceNumber === "INV-"){
            setInputIsInvalid(prev => ({...prev, invoiceNumber: true}))
        } else {
            setInputIsInvalid(prev => ({...prev, invoiceNumber: false}))
        }
    }, [invoiceData?.fromEmail, invoiceData?.fromPhone, invoiceData?.fromBusiness, invoiceData?.billToEmail, invoiceData?.billToFax, invoiceData?.billToMobile, invoiceData?.billToPhone, invoiceData?.invoiceNumber])

    useEffect(() => {
        if (taxData?.rate < 0) setTaxData((prev: any) => ({...prev, rate: 0}))
            else if (taxData?.rate > 100) setTaxData((prev: any) => ({...prev, rate: 100}))
    }, [taxData?.rate])

    useEffect(() => {
        if (discountData?.type === "Percent"){
            if (discountData?.amount < 0) setDiscountData((prev: DiscountData) => ({...prev, amount: 0}))
              else if (discountData?.amount > 100) setDiscountData((prev: DiscountData) => ({...prev, amount: 100}))
            
            setDiscountData((prev: DiscountData) => ({...prev, calculatedAmount: (discountData?.amount / 100) * calculateTotal?.subtotal}))
        } else if (discountData?.type === "Flat Amount"){
            setDiscountData((prev: DiscountData) => ({...prev, calculatedAmount: discountData?.amount}))
        } else {
            setDiscountData((prev: DiscountData) => ({...prev, amount: 0, calculatedAmount: 0}))
        }
    }, [discountData?.amount, discountData?.type, calculateTotal?.subtotal])

    useEffect(() => {
        const subtotal = lineItems.reduce((acc: any, item: any) => acc + item.amount, 0)
        let tax = 0

        if (discountData?.type === "Percent"){
            tax = lineItems.filter((item: any) => item.tax).reduce((acc: any, item: any) => acc + ((taxData?.rate / 100) *(item.amount - ((discountData?.amount / 100) * item.amount))), 0)
        } 
        // else if (discountData?.type === "Flat Amount"){
        //     tax = lineItems.filter(item => item.tax).reduce((acc, item) => acc + ((taxData?.rate / 100) * item.amount), 0) - discountData?.amount
        // } 
        else {
            tax = lineItems.filter((item: any) => item.tax).reduce((acc: any, item: any) => acc + ((taxData?.rate / 100) * item.amount), 0)
        }

        if (taxData?.type === "On Total"){
            setCalculateTotal({ subtotal, tax, total: (subtotal - discountData?.calculatedAmount) + tax })
        } else if (taxData?.type === "Deducted"){
            setCalculateTotal({ subtotal, tax, total: (subtotal - discountData?.calculatedAmount) - tax })
        } else {
            setCalculateTotal({ subtotal, tax: 0, total: subtotal - discountData?.calculatedAmount })
        }
    }, [lineItems, taxData?.rate, taxData?.type, discountData?.amount, discountData?.type, discountData?.calculatedAmount])

    useEffect(() => {
        if (taxData?.type === "Per Item" || taxData?.type === "None") setTaxData((prev: any) => ({...prev, rate: 0}))
    }, [taxData?.type])

    const addLineItem = () => {
        setLineItems((prev: any) => ([...prev, { index: lineItemIndex, description: "", rate: 0, quantity: 0, amount: 0, tax: false }]))
        setLineItemIndex((prev: any) => prev + 1)
    }

    const handleItemChange = (index: number, field: keyof LineItemType, value: string | number | boolean) => {
        setLineItems((prev: any) =>
            prev.map((item: any) => 
                item.index === index ? { ...item, [field]: value } : item
            )
        );
        handleCalculateTotal(index)
    }

    const handleCalculateTotal = (index: number) => {
        setLineItems((prev: any) => 
            prev.map((item: any) => {
                if(item.index === index){
                    const amount = item.quantity * item.rate
                    return { ...item, amount }
                }
                return item                
            })
        )
    }

    const removeLineItem = (index: number) => {
        setLineItems((prev: LineItemType[]) => {
            return prev.filter(item => item.index !== index)
        })
    }

    const handleDeleteImage = async(fileId: any) => {
        try {
            const response = await fetch('/api/image-upload/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileId })
            });

            if (response.ok) {
                setUploadedImage(null);
            } else {
                console.log('Delete failed:', await response.text());
            }
        } catch (err) {
            console.log('Error deleting image:', err);
        }
    };

    return (
        <>
            <Header />
            <div className="mt-20 bg-stone-100 px-15 py-10 text-black flex gap-10 relative">
                <div className="w-3/4">
                    <div style={{ background: templateColour }} className="h-2"></div>
                    <div className="bg-white py-10 px-15 space-y-10">
                        <div className="flex items-center justify-between">
                            <Input 
                                onChange={(e) => setInvoiceData((prev: any) => ({...prev, invoiceTitle: e.target.value}))} 
                                value={invoiceData?.invoiceTitle}
                                placeholder="Invoice" className="text-xl" 
                            />
                            <div>
                            {uploadedImage ?
                                    <div className="relative">
                                        <Image src={uploadedImage?.url} width={100} height={100} alt="Logo" className="w-auto h-auto" />
                                        <div onClick={() => handleDeleteImage(uploadedImage?.fileId)}><MdCancel className="absolute -top-3 -right-3 cursor-pointer hover:opacity-80" /></div>
                                    </div>
                                :
                                    <Link href={`/imagekit-upload?invoice-id=${id}`} className="border border-stone-300 rounded-md p-8 text-sm flex items-center gap-3 hover:bg-stone-100">
                                        <FaImage />
                                        <div>Add Logo</div>
                                    </Link> 
                                }
                            </div>
                        </div>
                        <div className="flex *:w-full gap-10 *:space-y-3">
                            <div>
                                <h2 className="text-xl font-bold">From</h2>
                                <Input 
                                    onChange={(e) => setInvoiceData((prev: any) => ({...prev, fromName: e.target.value}))} 
                                    value={invoiceData?.fromName} 
                                    label="Name*" placeholder="Business Name" 
                                />
                                <Input
                                    onChange={(e) => setInvoiceData((prev: any) => ({...prev, fromEmail: e.target.value}))} 
                                    value={invoiceData?.fromEmail} type="email"
                                    label="Email*" placeholder="name@businessname.com" 
                                    inputIsInvalid={inputIsInvalid?.fromEmail}
                                />
                                <Input 
                                    onChange={(e) => setInvoiceData((prev: any) => ({...prev, fromAddress: e.target.value}))} 
                                    value={invoiceData?.fromAddress}
                                    label="Address*" placeholder="Street Name" 
                                />
                                <Input 
                                    onChange={(e) => setInvoiceData((prev: any) => ({...prev, fromPhone: e.target.value}))} 
                                    value={invoiceData?.fromPhone}
                                    label="Phone*" placeholder="(123) 456 789" 
                                    inputIsInvalid={inputIsInvalid?.fromPhone}
                                />
                                <Input 
                                    onChange={(e) => setInvoiceData((prev: any) => ({...prev, fromBusiness: e.target.value}))} 
                                    value={invoiceData?.fromBusiness}
                                    label="Business Number" placeholder="123-45-6789" 
                                    inputIsInvalid={inputIsInvalid?.fromBusiness}
                                />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Bill To</h2>
                                <Input
                                    onChange={(e) => setInvoiceData((prev: any) => ({...prev, billToName: e.target.value}))} 
                                    value={invoiceData?.billToName}
                                    label="Name*" placeholder="Business Name" 
                                />
                                <Input
                                    onChange={(e) => setInvoiceData((prev: any) => ({...prev, billToEmail: e.target.value}))} 
                                    value={invoiceData?.billToEmail} type="email"
                                    label="Email*" placeholder="name@businessname.com" 
                                    inputIsInvalid={inputIsInvalid?.billToEmail}
                                />
                                <Input 
                                    onChange={(e) => setInvoiceData((prev: any) => ({...prev, billToAddress: e.target.value}))} 
                                    value={invoiceData?.billToAddress}
                                    label="Address*" placeholder="Street Name" 
                                />
                                <Input 
                                    onChange={(e) => setInvoiceData((prev: any) => ({...prev, billToPhone: e.target.value}))} 
                                    value={invoiceData?.billToPhone}
                                    label="Phone*" placeholder="(123) 456 789" 
                                    inputIsInvalid={inputIsInvalid?.billToPhone}
                                />
                                <Input 
                                    onChange={(e) => setInvoiceData((prev: any) => ({...prev, billToMobile: e.target.value}))} 
                                    value={invoiceData?.billToMobile}
                                    label="Mobile" placeholder="(123) 456 789" 
                                    inputIsInvalid={inputIsInvalid?.billToMobile}
                                />
                                <Input 
                                    onChange={(e) => setInvoiceData((prev: any) => ({...prev, billToFax: e.target.value}))} 
                                    value={invoiceData?.billToFax}
                                    label="Fax" placeholder="(123) 456 789" 
                                    inputIsInvalid={inputIsInvalid?.billToFax}
                                />
                            </div>
                        </div>
                        <hr className="text-stone-300" />
                        <div className="w-1/2 space-y-3">
                            <Input 
                                onChange={(e) => setInvoiceData((prev: any) => ({...prev, invoiceNumber: `INV-${e.target.value.replace(/\D/g, "")}` }))}
                                value={invoiceData?.invoiceNumber} inputIsInvalid={inputIsInvalid?.invoiceNumber}
                                inputMode="numeric" label="Number" placeholder="INV0001" />
                            <Input 
                                onChange={(e) => setInvoiceData((prev: any) => ({...prev, date: e.target.value}))}
                                value={invoiceData?.date}
                                type="date" label="Date" placeholder="MM/DD/YYYY" />
                            <div className="flex items-center gap-5 text-xs">
                                <p className="w-20">Terms</p>
                                <select name="customerType" id="customerType" className="border border-stone-400 w-full px-2 py-3 outline-0 cursor-pointer rounded-md" 
                                    value={invoiceData?.terms} 
                                    onChange={(e) => setInvoiceData((prev: any) => ({...prev, terms: e.target.value}))}
                                >
                                    {invoiceTermsOptions.map((item, idx) => (
                                        <option key={idx} value={item}>{item}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <hr className="text-stone-300" />
                        <div className="text-xs">
                            <div className="flex *:flex *:gap-5 justify-between uppercase border-y py-2 px-10">
                                <p>Description</p>
                                <div className="*:w-20 *:text-end">
                                    <p>Rate</p>
                                    <p>Qty</p>
                                    <p>Amount ({selectedCurrency?.symbol})</p>
                                    {taxData?.type !== "None" && <p>{taxData?.label !== "" ? taxData?.label : "Tax"}</p>}
                                </div>
                            </div>
                            <div className="mt-5">    
                                {lineItems?.map((item: any, i: any) => (
                                    <div key={i} className="relative">
                                        <div onClick={() => removeLineItem(item.index)} className="absolute top-1/2 -translate-y-1/2 bg-stone-300 text-black px-3 py-2 border border-stone-400 w-fit hover:opacity-85 cursor-pointer rounded-md">
                                            X
                                        </div>
                                        <div className="flex items-center gap-20 py-2 px-10">
                                            <div className="flex-1">
                                                <Input 
                                                    onChange={(e) => handleItemChange(item.index, "description", e.target.value)}
                                                    value={item.description}
                                                    placeholder="Item Description" /> 
                                            </div>
                                            
                                            <div className="flex items-center gap-5 *:w-20 *:text-end">
                                                <Input 
                                                    onChange={(e) => handleItemChange(item.index, "rate", e.target.value.replace(/^0+(?=\d)/, ""))}
                                                    value={item.rate}
                                                    type="number" placeholder="0.00" min={0}
                                                />
                                                <Input 
                                                    onChange={(e) => handleItemChange(item.index, "quantity", e.target.value.replace(/^0+(?=\d)/, ""))}
                                                    value={item.quantity}
                                                    type="number" placeholder="0" min={0}
                                                />
                                                <div className="text-center">{formatCurrency(item.amount, selectedCurrency?.symbol)}</div>
                                                {taxData?.type !== "None" && <div className="text-2xl flex justify-end" onClick={() => handleItemChange(item.index, "tax", !item.tax)}>
                                                    {item.tax ? <IoIosCheckbox /> : <MdCheckBoxOutlineBlank />}
                                                </div>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div onClick={addLineItem} className="p-2 bg-black text-white rounded-md w-fit hover:opacity-85 cursor-pointer">
                                    <FaPlus />
                                </div>
                            </div>
                        </div>
                        <hr className="text-stone-300" />
                        <div className="flex justify-end gap-20 px-20 *:text-end text-sm">
                            <div>
                                <p>Subtotal</p>
                                {discountData?.type !== "None" && <p>Discount {discountData?.type === "Percent" && `(${discountData?.amount}%)`}</p>}
                                {taxData?.type !== "None" && <p>{taxData?.label !== "" ? taxData?.label : "Tax"} ({taxData?.rate ?? 0}%)</p>}
                                <p>Total</p>
                                <p className="font-bold mt-1">Balance Due</p>
                            </div>
                            <div>
                                <p>{formatCurrency(calculateTotal?.subtotal, selectedCurrency?.symbol)}</p>
                                {discountData?.type !== "None" && <p>- {formatCurrency(discountData?.calculatedAmount, selectedCurrency?.symbol)}</p>}
                                {taxData?.type !== "None" && <p>{taxData?.inclusive && "inc "} {formatCurrency(calculateTotal?.tax, selectedCurrency?.symbol)}</p>}
                                <p>{formatCurrency(calculateTotal?.total, selectedCurrency?.symbol)}</p>
                                <p className="font-bold mt-1">{formatCurrency(calculateTotal?.total, selectedCurrency?.symbol)}</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-lg font-bold">Notes</h2>
                            <textarea value={invoiceData?.notes} onChange={(e) => setInvoiceData((prev: any) => ({...prev, notes: e.target.value}))} className="border border-stone-400 rounded-md w-full h-20 resize-none outline-0 p-1"></textarea>
                        </div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold">Signature</h2>
                            {!showSignaturePad && <div onClick={() => setShowSignaturePad(true)} className="p-2 bg-black text-white rounded-md w-fit hover:opacity-85 cursor-pointer">
                                <FaPlus />
                            </div>}
                        </div>
                        {showSignaturePad && <SignaturePad handleSetUrl={(url: string) => setInvoiceData((prev: any) => ({...prev, signatureUrl: url}))} />}
                        {/* <div>
                            <h2 className="text-lg font-bold">Photos</h2>
                            <div className="mt-3 w-fit border border-stone-300 rounded-md p-8 text-sm flex items-center gap-3">
                                <FaImage />
                                <p>Add Logo</p>
                            </div>
                        </div> */}
                    </div>
                    <div className="flex justify-end gap-5 items-center py-5 text-sm">
                        <Link href={invoicePageRoute} className="mr-auto"><Button bgColour="#E8E9ED" title="Back to Invoices" className="border border-stone-300" /></Link>
                        <div  onClick={handleSaveChangesToDB}>
                            <Button bgColour="#E8E9ED" title="Save Changes" className="border border-stone-300" />
                        </div>
                        {hasSavedDocument && <Link href={`/invoices/${id}/preview`} className={`text-white bg-black ${hasSavedDocument ? "hover:opacity-90 cursor-pointer" : "cursor-not-allowed"} border border-stone-300 px-5 py-3 text-sm rounded-full`}>
                            Preview Invoice
                        </Link>}
                    </div>                
                </div>
                <div className="w-1/4 space-y-10">
                    <div className="space-y-3">
                        <div>
                            <h2 className="uppercase font-semibold">Template</h2>
                            <hr className="text-stone-300" />                        
                        </div>
                        <div className="flex flex-wrap gap-1">
                            <ColourBlock onClick={(colour: string) => setTemplateColour(colour)} />
                            <ColourBlock colour="#333333" onClick={(colour: string) => setTemplateColour(colour)} />
                            <ColourBlock colour="#555555" onClick={(colour: string) => setTemplateColour(colour)} />
                            <ColourBlock colour="#455A64" onClick={(colour: string) => setTemplateColour(colour)} />
                            <ColourBlock colour="#C62828" onClick={(colour: string) => setTemplateColour(colour)} />
                            <ColourBlock colour="#D81B60" onClick={(colour: string) => setTemplateColour(colour)} />
                            <ColourBlock colour="#7B1FA2" onClick={(colour: string) => setTemplateColour(colour)} />
                            <ColourBlock colour="#4527A0" onClick={(colour: string) => setTemplateColour(colour)} />
                            <ColourBlock colour="#283593" onClick={(colour: string) => setTemplateColour(colour)} />
                            <ColourBlock colour="#1565C0" onClick={(colour: string) => setTemplateColour(colour)} />
                            <ColourBlock colour="#0277BD" onClick={(colour: string) => setTemplateColour(colour)} />
                            <ColourBlock colour="#00695C" onClick={(colour: string) => setTemplateColour(colour)} />
                            <ColourBlock colour="#2E7D32" onClick={(colour: string) => setTemplateColour(colour)} />
                            <ColourBlock colour="#558B2F" onClick={(colour: string) => setTemplateColour(colour)} />
                        </div>
                    </div>
                    <div>
                        <h2 className="uppercase font-semibold">Tax</h2>
                        <hr className="text-stone-300" />   
                        <div className="space-y-3 mt-5">
                            <div className="flex items-center gap-5 text-xs">
                                <p className="w-20">Type</p>
                                <select name="customerType" id="customerType" className="border border-[#a6a09b] bg-white w-full px-2 py-3 outline-0 cursor-pointer rounded-md" 
                                    value={taxData?.type} 
                                    onChange={(e) => setTaxData((prev: any) => ({...prev, type: e.target.value}))}
                                >
                                    {taxCategoryOptions.map((item, idx) => (
                                        <option key={idx} value={item}>{item}</option>
                                    ))}
                                </select>
                            </div>   
                            {taxData?.type !== "None" && <Input
                                onChange={(e) => setTaxData((prev: any) => ({...prev, label: e.target.value}))} 
                                value={taxData?.label || ""}
                                label="Label" placeholder="Label"  
                            /> }                  
                            {(taxData?.type == "On Total" || taxData?.type === "Deducted") && <div className ="relative">
                                <Input
                                    onChange={(e) => {
                                        let value = e.target.value;

                                        if (/^0+[0-9]+/.test(value)) {
                                            value = value.replace(/^0+/, '');
                                        }
                                        setTaxData((prev: any) => ({ ...prev, rate: Number(value) }));
                                    }}
                                    value={taxData?.rate?.toString()}
                                    type="number" name="percentage" min={0} max={100}
                                    label="Rate" placeholder="Rate"
                                />
                                <span className="absolute top-1/2 -translate-y-1/2 right-5 text-xs">%</span>
                            </div>}
                            {taxData?.type !== "None" && <div className="flex items-center gap-5 text-xs">
                                <p className="">Inclusive? </p>
                                <div className="text-xl flex justify-end" onClick={() => setTaxData((prev: any) => ({ ...prev, inclusive: !prev.inclusive }))}>
                                    {taxData?.inclusive ? <IoIosCheckbox /> : <MdCheckBoxOutlineBlank />}
                                </div>
                            </div>}
                        </div>
                    </div>
                    <div>
                        <h2 className="uppercase font-semibold">Discount</h2>
                        <hr className="text-stone-300" />  
                        <div className="space-y-3 mt-5">
                            <div className="flex items-center gap-5 text-xs">
                                <p className="w-20">Type</p>
                                <select name="discountType" id="discountType" className="border border-[#a6a09b] bg-white w-full px-2 py-3 outline-0 cursor-pointer rounded-md" 
                                    value={discountData?.type} 
                                    onChange={(e) => setDiscountData((prev: any) => ({...prev, type: e.target.value}))}
                                >
                                    {discountCategoryOptions.map((item, idx) => (
                                        <option key={idx} value={item}>{item}</option>
                                    ))}
                                </select>
                            </div> 
                            {discountData?.type !== "None" && <div className="flex items-center gap-5 text-xs">
                                <div className ="relative w-full">
                                    <Input
                                        onChange={(e) => {
                                            let value = e.target.value;

                                            if (/^0+[0-9]+/.test(value)) {
                                                value = value.replace(/^0+/, '');
                                            }
                                            setDiscountData((prev: any) => ({ ...prev, amount: Number(value) }));
                                        }}
                                        value={discountData?.amount?.toString()}
                                        type="number" name="Amount" min={0}
                                        label={discountData?.type === "Percent" ? "Percent" : "Amount"} placeholder="Amount"
                                    />
                                    {discountData?.type === "Percent" && <span className="absolute top-1/2 -translate-y-1/2 right-5 text-xs">%</span>}
                                </div>
                            </div>}
                        </div>
                    </div>
                    <div>
                        <h2 className="uppercase font-semibold">Currency</h2>
                        <hr className="text-stone-300" />  
                        <div className="mt-5 relative">
                            <div onClick={() => setShowCurrencyList(prev => !prev)} className={`flex items-center justify-between border border-[#a6a09b] bg-white w-full py-3 px-5 cursor-pointer ${showCurrencyList ? "rounded-t-md" : "rounded-md"}`}>
                                <span>{selectedCurrency?.name}</span>
                                <span>{selectedCurrency?.symbol}</span>
                            </div>
                            {showCurrencyList && <div className="max-h-96 overflow-y-scroll *:flex *:items-center *:justify-between *:py-2 *:px-5 *:hover:bg-stone-100 border border-[#a6a09b] bg-white w-full cursor-pointer rounded-b-md">
                                {currencies.map((item, index) => (
                                    <div key={index} onClick={() => {
                                        setSelectedCurrency({name: item?.name, symbol: item?.symbol})
                                        setShowCurrencyList(false)
                                    }}>
                                        <span>{item?.name}</span>
                                        <span>{item?.symbol}</span>
                                    </div>
                                ))}
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}