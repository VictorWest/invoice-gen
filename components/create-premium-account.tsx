"use client"
import Input from "./input";
import Button from "./button";
import { useState } from "react";
import { PaymentDetails } from "@/utils/interfaces/interfaces";
import { countries, defaultPaymentDetails, usStates } from "@/utils/data";

export default function CreatePremiumPage({ onClose, plan }: { onClose: any, plan: string }){
    const [ paymentDetails, setPaymentDetails ] = useState<PaymentDetails>(defaultPaymentDetails)

    const handleSubmitDetails = () => {}

    return(
        <div className="text-black w-full h-120 overflow-y-scroll">
            <h1 className="text-start text-xl font-bold">Edit payment details</h1>
            <div className="mt-7 space-y-3">
                <p className="text-xs">Customer details</p>
                <div className="flex items-center gap-5 *:w-full">
                    <Input value={paymentDetails?.firstName} onChange={(e) => setPaymentDetails((prev: PaymentDetails) => ({...prev, firstName: e.target.value}))} placeholder="First Name" />
                    <Input value={paymentDetails?.lastName} onChange={(e) => setPaymentDetails((prev: PaymentDetails) => ({...prev, lastName: e.target.value}))} placeholder="Last Name" />
                </div>
                <Input placeholder="Email" value={paymentDetails?.email} onChange={(e) => setPaymentDetails((prev: PaymentDetails) => ({...prev, email: e.target.value}))} />
                <Input placeholder="Street Name" value={paymentDetails?.streetName} onChange={(e) => setPaymentDetails((prev: PaymentDetails) => ({...prev, streetName: e.target.value}))} />
                <div className="flex items-center gap-5 *:w-full">
                    <Input placeholder="City" value={paymentDetails?.city} onChange={(e) => setPaymentDetails((prev: PaymentDetails) => ({...prev, city: e.target.value}))} />
                    <div>
                        {
                            paymentDetails?.country === "United States" ? 
                                <div className="flex items-center gap-5 text-xs">
                                    <select name="customerType" id="customerType" className="border border-stone-400 w-full px-2 py-3 outline-0 cursor-pointer rounded-md" 
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
                            <Input placeholder="State" value={paymentDetails?.state} onChange={(e) => setPaymentDetails((prev: PaymentDetails) => ({...prev, state: e.target.value}))} />
                        }

                    </div>
                </div>
                <div className="flex items-center gap-5">
                    <div className="w-3/4">
                        <div className="flex items-center gap-5 text-xs">
                            <select name="customerType" id="customerType" className="border border-stone-400 w-full px-2 py-3 outline-0 cursor-pointer rounded-md" 
                                value={paymentDetails?.country} 
                                onChange={(e) => setPaymentDetails((prev: PaymentDetails) => ({...prev, country: e.target.value}))}
                            >
                                {countries.map((item, idx) => (
                                    <option key={idx} value={item}>{item}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="w-1/4"><Input placeholder="ZIP" value={paymentDetails?.zip} onChange={(e) => setPaymentDetails((prev: PaymentDetails) => ({...prev, zip: e.target.value}))} /></div>
                </div>
                <Input placeholder="Mobile Number" />
                <p className="mt-7 text-xs">Billing details</p>
                <div className="flex items-center gap-3">
                    <div className="w-3/5"><Input placeholder="Billing Address" value={paymentDetails?.billingAddress} onChange={(e) => setPaymentDetails((prev: PaymentDetails) => ({...prev, billingAddress: e.target.value}))} /></div>
                    <p className="text-xs flex items-center gap-2 cursor-pointer"><input type="checkbox" /> Same as above?</p>
                </div>
                <Input placeholder="Billing Name" value={paymentDetails?.billingName} onChange={(e) => setPaymentDetails((prev: PaymentDetails) => ({...prev, billingName: e.target.value}))} />
                <Input placeholder={("0".repeat(4) + ' ').repeat(4)} />
                <div className="flex items-center gap-5 *:w-full">
                    <Input placeholder="Month" value={paymentDetails?.expiryMonth} onChange={(e) => setPaymentDetails((prev: PaymentDetails) => ({...prev, expiryMonth: e.target.value}))} />
                    <Input placeholder="Year" value={paymentDetails?.expiryYear} onChange={(e) => setPaymentDetails((prev: PaymentDetails) => ({...prev, expiryYear: e.target.value}))} />
                </div>
                <div className="mt-7" onClick={handleSubmitDetails}>
                    <Button bgColour="#000" textColour="#fff" title={"Payment"} />
                </div>
            </div>
        </div>
    )
}