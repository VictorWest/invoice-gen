"use client"
import { signOut } from "next-auth/react"

export default function Logout(){
    return <p onClick={() => signOut()}>Logout</p>
}