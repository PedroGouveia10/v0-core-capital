import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <div className="max-w-md space-y-10">
        <div className="flex justify-center">
          <Image src="/images/logo.png" alt="CORE CAPITAL" width={80} height={32} className="h-auto w-auto" />
        </div>
        <p className="text-gray-600 text-sm">Gerencie suas oportunidades de aquisição SaaS de maneira eficiente.</p>
        <Link href="/login" className="block">
          <Button className="h-10 w-full rounded-md bg-[#002147] px-6 text-sm font-normal text-white hover:bg-[#00326b] transition-colors">
            Entrar no CRM
          </Button>
        </Link>
      </div>
    </div>
  )
}
