"use client"

import { Subscription } from "@/generated/prisma"
import { createContext, useContext, useEffect, useState } from "react"

const UserContext = createContext<any>(null)

export const UserProvider = ({ children }: any) => {
    const [ subscription, setSubscription ] = useState<Subscription | null>(null)
    const [ isSubscribed, setIsSubscribed ] = useState(true)
    const [ reloadSubscription, setReloadSubscription ] = useState(false)

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch('/api/subscription')

                if (response.ok){
                    const { data } = await response.json()
                    setSubscription(data)
                }
            } catch (error) {
                console.log(error)
            }
        })()
    }, [reloadSubscription])

    useEffect(() => {
        setIsSubscribed(subscription?.status === "ACTIVE")
    }, [subscription])
    
    return(
        <UserContext.Provider value={{
                                        subscription, setSubscription,
                                        isSubscribed,
                                        setReloadSubscription
                                    }}>
            { children }
        </UserContext.Provider>
    )
}

export const GetUserContext = () => {
    const context = useContext(UserContext)
    if (!context){
        throw new Error("GetUserContext must be used within a <UserProvider>")
    }
    return context
}