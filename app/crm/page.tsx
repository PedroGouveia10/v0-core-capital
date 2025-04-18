import Link from "next/link"
import Image from "next/image"
import { Construction } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CRM() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <div className="max-w-md space-y-8">
        <div className="flex justify-center mb-2">
          <Image src="/images/logo.png" alt="CORE CAPITAL" width={70} height={28} className="h-auto w-auto" />
        </div>
        <Construction className="mx-auto h-12 w-12 text-[#002147]" />
        <h1 className="text-xl font-normal tracking-tight text-gray-900">Em Construção</h1>
        <p className="text-xs text-gray-600 max-w-xs mx-auto">
          Essa página está em construção. Em breve você poderá acessar o seu painel de oportunidades SaaS!
        </p>
        <p className="text-[10px] text-gray-500 max-w-xs mx-auto">
          Estamos trabalhando para oferecer a melhor experiência de acompanhamento de oportunidades de aquisição SaaS.
        </p>
        <Link href="/" className="block max-w-xs mx-auto">
          <Button
            variant="outline"
            className="w-full h-8 text-xs border-[#002147] text-[#002147] hover:bg-[#f0f5fa] hover:text-[#002147]"
          >
            Voltar para página inicial
          </Button>
        </Link>
      </div>
    </div>
  )
}
