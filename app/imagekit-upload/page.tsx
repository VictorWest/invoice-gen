export const dynamic = "force-dynamic"

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ImageUpload from "./image-upload";

export default async function Page(){
    const session = await getServerSession()
    if(!session){
        redirect("/auth/login")
    }

    return <ImageUpload />
}