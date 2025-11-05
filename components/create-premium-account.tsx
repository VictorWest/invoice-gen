"use client"
import Input from "./input";
import Button from "./button";
import { useEffect, useState } from "react";
import { PaymentDetails } from "@/utils/interfaces/interfaces";
import { CARD_REGEX, countries, defaultPaymentDetails, EMAIL_REGEX, MOBILE_NUMBER_REGEX, months, usStates, years, ZIP_REGEX } from "@/utils/data";
import { FaLongArrowAltRight } from "react-icons/fa";
import { IoCheckbox } from "react-icons/io5";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import Oval from "react-loading-icons/dist/esm/components/oval";

export default function CreatePremiumPage({ onClose, plan }: { onClose: any, plan: string }){
    const [ paymentDetails, setPaymentDetails ] = useState<PaymentDetails>(defaultPaymentDetails)

    const [ error, setError ] = useState("")
    const [ billingIsSame, setBillingIsSame ] = useState(false)
    const [ inputIsInvalid, setInputIsInvalid ] = useState({ firstName: false, lastName: false, email: false, streetName: false, city: false, state: false, country: false, zip: false, mobileNumber: false, billingAddress: false, billingName: false, cardNumber: false, expiryMonth: false, expiryYear: false })
    const [ isLoading, setIsLoading ] = useState(false)

    useEffect(() => {
        if (billingIsSame){
            setPaymentDetails(prev => ({...prev, billingName: `${paymentDetails.firstName} ${paymentDetails.lastName}`, billingAddress: `${paymentDetails.city}, ${paymentDetails.state}, ${paymentDetails.country}`}))
        }
    }, [billingIsSame, paymentDetails.billingAddress, paymentDetails.billingName, paymentDetails.firstName, paymentDetails.lastName, paymentDetails.city, paymentDetails.state, paymentDetails.country])

    const handleSubmitDetails = async () => {
        const newValidationState: any = {}

        Object.entries(paymentDetails).forEach(([key, value]) => {
            newValidationState[key] = !value || value.toString().trim() === ""
        })

        if (paymentDetails.email && !EMAIL_REGEX.test(paymentDetails.email)){
            newValidationState.email = true
        }

        if (paymentDetails.mobileNumber && !MOBILE_NUMBER_REGEX.test(paymentDetails.mobileNumber)){
            newValidationState.mobileNumber = true
        }

        if (paymentDetails.zip && !ZIP_REGEX.test(paymentDetails.zip)){
            newValidationState.zip = true
        }

        if (paymentDetails.cardNumber && !CARD_REGEX.test(paymentDetails.cardNumber)){
            newValidationState.cardNumber = true
        }

        setInputIsInvalid(newValidationState)

        const allValid = !Object.entries(newValidationState).some(([_, value]) => value === true)

        if (allValid) {
            setError("")
            setIsLoading(true)
            try {
                const response = await fetch("/api/subscription", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ paymentDetails, plan })
                })
                if (!response.ok){
                    setError("The card number entered is invalid.")
                }
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }
        } else {
            setError("All inputs must be accurately provided")
            console.log("Theres an error");
        }
    }

    return(
        <div className="text-black w-full h-120 overflow-y-scroll">
            <h1 className="text-start text-xl font-bold">Edit payment details</h1>
            <div className="mt-7 space-y-3">
                <p className="text-xs">Customer details</p>
                <div className="flex items-center gap-5 *:w-full">
                    <Input inputIsInvalid={inputIsInvalid?.firstName} value={paymentDetails?.firstName} onChange={(e) => setPaymentDetails((prev: PaymentDetails) => ({...prev, firstName: e.target.value}))} placeholder="First Name" />
                    <Input inputIsInvalid={inputIsInvalid?.lastName} value={paymentDetails?.lastName} onChange={(e) => setPaymentDetails((prev: PaymentDetails) => ({...prev, lastName: e.target.value}))} placeholder="Last Name" />
                </div>
                <Input inputIsInvalid={inputIsInvalid?.email} placeholder="Email" value={paymentDetails?.email} onChange={(e) => setPaymentDetails((prev: PaymentDetails) => ({...prev, email: e.target.value}))} />
                <Input inputIsInvalid={inputIsInvalid?.streetName} placeholder="Street Name" value={paymentDetails?.streetName} onChange={(e) => setPaymentDetails((prev: PaymentDetails) => ({...prev, streetName: e.target.value}))} />
                <div className="flex items-center gap-5 *:w-full">
                    <Input inputIsInvalid={inputIsInvalid?.city} placeholder="City" value={paymentDetails?.city} onChange={(e) => setPaymentDetails((prev: PaymentDetails) => ({...prev, city: e.target.value}))} />
                    <div>
                        {
                            paymentDetails?.country === "United States" ? 
                                <div className="flex items-center gap-5 text-xs">
                                    <select name="customerType" id="customerType" style={{ borderColor: inputIsInvalid?.state ? "#c00000" : "#a6a09b" }} className="border w-full px-2 py-3 outline-0 cursor-pointer rounded-md" 
                                        value={paymentDetails?.state} 
                                        onChange={(e) => setPaymentDetails((prev: PaymentDetails) => ({...prev, state: e.target.value}))}
                                    >
                                        <option value="" disabled>Select a State</option>
                                        {usStates.map((item, idx) => (
                                            <option key={idx} value={item.abbreviation}>{item.name}</option>
                                        ))}
                                    </select>
                                </div>
                            : 
                            <Input inputIsInvalid={inputIsInvalid?.state} placeholder="State" value={paymentDetails?.state} onChange={(e) => setPaymentDetails((prev: PaymentDetails) => ({...prev, state: e.target.value}))} />
                        }

                    </div>
                </div>
                <div className="flex items-center gap-5">
                    <div className="w-3/4">
                        <div className="flex items-center gap-5 text-xs">
                            <select name="customerType" id="customerType" style={{ borderColor: inputIsInvalid?.country ? "#c00000" : "#a6a09b" }} className="border border-stone-400 w-full px-2 py-3 outline-0 cursor-pointer rounded-md" 
                                value={paymentDetails?.country} 
                                onChange={(e) => setPaymentDetails((prev: PaymentDetails) => ({...prev, country: e.target.value}))}
                            >
                                {countries.map((item, idx) => (
                                    <option key={idx} value={item}>{item}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="w-1/4"><Input inputIsInvalid={inputIsInvalid?.zip} placeholder="ZIP" value={paymentDetails?.zip} onChange={(e) => setPaymentDetails((prev: PaymentDetails) => ({...prev, zip: e.target.value}))} /></div>
                </div>
                <Input inputIsInvalid={inputIsInvalid?.mobileNumber} value={paymentDetails?.mobileNumber} onChange={(e) => setPaymentDetails((prev: PaymentDetails) => ({...prev, mobileNumber: e.target.value}))} placeholder="Mobile Number" />
                <p className="mt-7 text-xs">Billing details</p>
                <div className="flex items-center gap-3">
                    <div className="w-3/5"><Input inputIsInvalid={inputIsInvalid?.billingAddress} placeholder="Billing Address" value={paymentDetails?.billingAddress} onChange={(e) => setPaymentDetails((prev: PaymentDetails) => ({...prev, billingAddress: e.target.value}))} /></div>
                    <div onClick={() => setBillingIsSame(prev => !prev)} className="text-xs flex items-center gap-2 cursor-pointer">{billingIsSame ? <IoCheckbox /> : <MdCheckBoxOutlineBlank />} Same as above?</div>
                </div>
                <Input inputIsInvalid={inputIsInvalid?.billingName} placeholder="Billing Name" value={paymentDetails?.billingName} onChange={(e) => setPaymentDetails((prev: PaymentDetails) => ({...prev, billingName: e.target.value}))} />
                <Input inputIsInvalid={inputIsInvalid?.cardNumber} value={paymentDetails?.cardNumber} onChange={(e) => setPaymentDetails((prev: PaymentDetails) => ({...prev, cardNumber: e.target.value}))} placeholder={("0".repeat(4) + ' ').repeat(4)} />
                <div className="flex items-center gap-5 *:w-full">
                    <div className="flex items-center gap-5 text-xs">
                        <select name="customerType" id="customerType" style={{ borderColor: inputIsInvalid?.expiryMonth ? "#c00000" : "#a6a09b" }} className="border border-stone-400 w-full px-2 py-3 outline-0 cursor-pointer rounded-md" 
                            value={paymentDetails?.expiryMonth} 
                            onChange={(e) => setPaymentDetails((prev: PaymentDetails) => ({...prev, expiryMonth: e.target.value}))}
                        >
                            <option value="" disabled>Month</option>
                            {months.map((item, idx) => (
                                <option key={idx} value={idx + 1}>{item}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-5 text-xs">
                        <select name="customerType" id="customerType" style={{ borderColor: inputIsInvalid?.expiryYear ? "#c00000" : "#a6a09b" }} className="border border-stone-400 w-full px-2 py-3 outline-0 cursor-pointer rounded-md" 
                            value={paymentDetails?.expiryYear} 
                            onChange={(e) => setPaymentDetails((prev: PaymentDetails) => ({...prev, expiryYear: e.target.value}))}
                        >
                            <option value="" disabled>Year</option>
                            {years.map((item, idx) => (
                                <option key={idx} value={item}>{item}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <p className="text-red-500 text-xs">{error}</p>
                <div className="mt-7 " onClick={handleSubmitDetails}>
                    <Button bgColour="#000" title={<p className="flex items-center text-white gap-2 font-semibold">
                        {isLoading ? <Oval height={20} width={20} speed={.5} stroke="#2148C0" /> : <>Make Payment <FaLongArrowAltRight /></>}
                    </p>} />
                </div>
            </div>
        </div>
    )
}