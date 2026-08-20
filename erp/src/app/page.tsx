import { redirect } from "next/navigation";

/** ERP root — send visitors to login; marketing lives on the separate site app. */
export default function ErpRootPage() {
  redirect("/login");
}
