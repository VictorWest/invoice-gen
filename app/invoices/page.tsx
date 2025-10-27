export const dynamic = "force-dynamic"

import InvoicePage from "@/pages/InvoicePage"
import { homePageRoute } from "@/utils/routeMap"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function Page(){
    const session = await getServerSession()
    if (!session){
        redirect(homePageRoute)
    }

    return (
        <InvoicePage />
    )
}