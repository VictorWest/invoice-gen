"use client"
import { FormEvent, useEffect, useState } from "react"
import Link from "next/link"
import Oval from "react-loading-icons/dist/esm/components/oval"
import { useRouter } from "next/navigation"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import AuthInput from "@/components/auth-input"
import { loginPageRoute } from "@/utils/routeMap"
import { EMAIL_REGEX, PASSWORD_REGEX } from "@/utils/data"

export default function Form(){
    const router = useRouter()
    const [ registerData, setRegisterData ] = useState({ email: '', password: '', confirmPassword: '' })
    const [ viewPassword, setViewPassword ] = useState({ password: false, confirmPassword: false })
    const [ error, setError ] = useState('')
    const [ inputIsAccurate, setInputIsAccurate ] = useState(false)
    const [ isLoading, setIsLoading ] = useState(false)

    useEffect(() => {
        if (!EMAIL_REGEX.test(registerData.email)){
            setError("Please give an accurate email address")
            setInputIsAccurate(false)
        } else if(!PASSWORD_REGEX.test(registerData.password)){
            setError("Password must be at least 8 characters long.")
            setInputIsAccurate(false)
        } else if (registerData.password !== registerData.confirmPassword){
            setError("Passwords must be the same")
            setInputIsAccurate(false)
        } else {
            setError("")
            setInputIsAccurate(true)
        }
    }, [registerData.email, registerData.password, registerData.confirmPassword, EMAIL_REGEX, PASSWORD_REGEX])

    const handleSubmit = async (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault()

        setIsLoading(true)
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                body: JSON.stringify({
                    email: registerData.email,
                    password: registerData.password
                })
            })
            
            const data = await response.json()

            if (!response.ok){
                console.error(data.message)
                setError(data.message)
                return
            }
            router.push(loginPageRoute)
            setError("")
        } catch (error) {
            console.error("Network error:", error);
            // setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false)
        }
    }

    return(
        <form action="post" className="flex flex-col gap-2 mx-auto w-fit mt-10 space-y-3">
            <h2 className="uppercase mx-auto font-bold text-white text-2xl mt-10">Register</h2>
            <AuthInput icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.6667 17.5V15.8333C16.6667 14.9493 16.3155 14.1014 15.6903 13.4763C15.0652 12.8512 14.2174 12.5 13.3333 12.5H6.66666C5.78261 12.5 4.93476 12.8512 4.30964 13.4763C3.68452 14.1014 3.33333 14.9493 3.33333 15.8333V17.5" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M10 9.16667C11.841 9.16667 13.3333 7.67428 13.3333 5.83333C13.3333 3.99238 11.841 2.5 10 2.5C8.15906 2.5 6.66667 3.99238 6.66667 5.83333C6.66667 7.67428 8.15906 9.16667 10 9.16667Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>} 
                type="email" placeholder="Email" onChange={e => setRegisterData(prev => ({ ...prev, email: e.target.value }))} />

            <div className="flex items-center">
                <AuthInput icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.8333 9.16667H4.16667C3.24619 9.16667 2.5 9.91286 2.5 10.8333V16.6667C2.5 17.5871 3.24619 18.3333 4.16667 18.3333H15.8333C16.7538 18.3333 17.5 17.5871 17.5 16.6667V10.8333C17.5 9.91286 16.7538 9.16667 15.8333 9.16667Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M5.83333 9.16667V5.83333C5.83333 4.72827 6.27232 3.66846 7.05372 2.88706C7.83512 2.10565 8.89493 1.66667 9.99999 1.66667C11.1051 1.66667 12.1649 2.10565 12.9463 2.88706C13.7277 3.66846 14.1667 4.72827 14.1667 5.83333V9.16667" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>} 
                    type={viewPassword.password ? "text" : "password"} placeholder="Password" onChange={e => setRegisterData(prev => ({ ...prev, password: e.target.value }))} />
                <span onClick={() => setViewPassword(prev => ({ ...prev, password: !prev.password }))} className="-ml-6 cursor-pointer">
                    { viewPassword.password ? <FaRegEye /> : <FaRegEyeSlash /> }    
                </span>           
            </div>

            <div className="flex items-center">
                <AuthInput icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.8333 9.16667H4.16667C3.24619 9.16667 2.5 9.91286 2.5 10.8333V16.6667C2.5 17.5871 3.24619 18.3333 4.16667 18.3333H15.8333C16.7538 18.3333 17.5 17.5871 17.5 16.6667V10.8333C17.5 9.91286 16.7538 9.16667 15.8333 9.16667Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M5.83333 9.16667V5.83333C5.83333 4.72827 6.27232 3.66846 7.05372 2.88706C7.83512 2.10565 8.89493 1.66667 9.99999 1.66667C11.1051 1.66667 12.1649 2.10565 12.9463 2.88706C13.7277 3.66846 14.1667 4.72827 14.1667 5.83333V9.16667" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>} 
                    type={viewPassword.confirmPassword ? "text" : "password"} placeholder="Confirm Password" onChange={e => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))} />

                <span onClick={() => setViewPassword(prev => ({ ...prev, confirmPassword: !prev.confirmPassword }))} className="-ml-6 cursor-pointer">
                    { viewPassword.confirmPassword ? <FaRegEye /> : <FaRegEyeSlash /> }    
                </span>                
            </div>

            <div className="text-xs">{error}</div>

            <button disabled={!inputIsAccurate} onClick={handleSubmit} type="submit" className={`bg-white shadow-lg rounded-xs mx-auto text-[#2148C0] w-full h-10 font-bold uppercase cursor-pointer flex justify-center items-center`}>{isLoading ? <Oval height={20} width={20} speed={.5} stroke="#2148C0" /> : "Register"}</button>
            <div className="text-xs">Already have an account? <Link href={loginPageRoute} className="">Login here</Link></div>
        </form>
    )
}