"use client"
import { FormEvent, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link";
import Oval from "react-loading-icons/dist/esm/components/oval"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import AuthInput from "@/components/auth-input";
import { invoicePageRoute, registerPageRoute } from "@/utils/routeMap";

export default function Form(){
    const router = useRouter();

    const [loginData, setLoginData] = useState({ email: '', password: '' })
    const [ viewPassword, setViewPassword ] = useState(false)
    const [ error, setError ] = useState('')
    const [ isLoading, setIsLoading ] = useState(false)

    const handleSubmit = async (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault()
        
        if (loginData.email === "" || loginData.password === ""){
            setError("Please give a valid email and password")
        } else {
            setIsLoading(true)
            try {
                const response = await signIn('credentials', {
                    email: loginData?.email,
                    password: loginData?.password,
                    redirect: false
                })
                console.log(response)
                if (response?.ok){
                    router.push(invoicePageRoute)
                } else if (response?.status === 401){
                    setError("Invalid email or password")
                } else {
                    setError("There was an unexpected error. Please try again.")
                }                
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }
        }
    }

    return(
        <form action="post" className="flex flex-col gap-2 mx-auto w-fit mt-10 space-y-3">
            <h2 className="uppercase mx-auto font-bold text-white text-2xl mt-10">Log In </h2>
            <AuthInput icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.6667 17.5V15.8333C16.6667 14.9493 16.3155 14.1014 15.6903 13.4763C15.0652 12.8512 14.2174 12.5 13.3333 12.5H6.66666C5.78261 12.5 4.93476 12.8512 4.30964 13.4763C3.68452 14.1014 3.33333 14.9493 3.33333 15.8333V17.5" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M10 9.16667C11.841 9.16667 13.3333 7.67428 13.3333 5.83333C13.3333 3.99238 11.841 2.5 10 2.5C8.15906 2.5 6.66667 3.99238 6.66667 5.83333C6.66667 7.67428 8.15906 9.16667 10 9.16667Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>} 
                type="email" placeholder="Email" onChange={e => setLoginData(prev => ({ ...prev, email: e.target.value }))} />
            <div className="flex items-center">
                <AuthInput icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.8333 9.16667H4.16667C3.24619 9.16667 2.5 9.91286 2.5 10.8333V16.6667C2.5 17.5871 3.24619 18.3333 4.16667 18.3333H15.8333C16.7538 18.3333 17.5 17.5871 17.5 16.6667V10.8333C17.5 9.91286 16.7538 9.16667 15.8333 9.16667Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M5.83333 9.16667V5.83333C5.83333 4.72827 6.27232 3.66846 7.05372 2.88706C7.83512 2.10565 8.89493 1.66667 9.99999 1.66667C11.1051 1.66667 12.1649 2.10565 12.9463 2.88706C13.7277 3.66846 14.1667 4.72827 14.1667 5.83333V9.16667" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>} 
                    type={viewPassword ? "text" : "password"} placeholder="Password" onChange={e => setLoginData(prev => ({ ...prev, password: e.target.value }))} />
                <span onClick={() => setViewPassword(prev => !prev)} className="-ml-6 cursor-pointer">
                    { viewPassword ? <FaRegEye /> : <FaRegEyeSlash /> }    
                </span>           
            </div>
            <div className="text-xs">{error}</div>
            {/* <div className="ml-auto">Forgot Password</div> */}
            <button onClick={handleSubmit} type="submit" className={`bg-white shadow-lg rounded-xs mx-auto text-[#2148C0] w-full h-10 font-bold uppercase cursor-pointer flex justify-center items-center`}>{isLoading ? <Oval height={20} width={20} speed={.5} stroke="#2148C0" /> : "Login"}</button>

            <div className="text-xs">Don&apos;t have an account? <Link href={registerPageRoute}>Register here</Link></div>
        </form>
    )
}