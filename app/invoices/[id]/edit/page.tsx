export const dynamic = "force-dynamic"

import CreateInvoice from "@/pages/CreateInvoice";
import { homePageRoute } from "@/utils/routeMap";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page(){
    const session = await getServerSession()

    if (!session){
        redirect(homePageRoute)
    } 

    return <CreateInvoice />
}