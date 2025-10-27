import { invoicePageRoute } from "@/utils/routeMap";
import { redirect } from "next/navigation";

export default function Home() {
  redirect(invoicePageRoute)
}
