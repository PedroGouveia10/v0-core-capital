"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, FileText, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DDCompanyDrawer } from "@/components/due-diligence/dd-company-drawer"
import type { DueDiligence } from "@/types/due-diligence"

// Dados de exemplo para empresas
const companies = [
  { id: 1, name: "TechFlow SaaS", sector: "SaaS", regulated: false },
  { id: 2, name: "DataSync Analytics", sector: "Analytics", regulated: false },
  { id: 3, name: "CloudSecure Solutions", sector: "Segurança", regulated: true },
  { id: 4, name: "EduTech Platform", sector: "Educação", regulated: false },
]

// Dados de exemplo para itens de due diligence
const initialDueDiligenceItems: DueDiligence[] = [
  {
    id: "dd-001",
    companyId: 1,
    companyName: "TechFlow SaaS",
    type: "Tecnologia",
    item: "Análise de Arquitetura de Software",
    status: "Concluído",
    risk: "Baixo",
    recommendation: "Arquitetura bem estruturada, recomendado apenas documentação adicional",
    document: {
      name: "arquitetura-analise.pdf",
      url: "#",
      type: "application/pdf",
    },
    technicalNotes:
      "Stack tecnológica moderna com React, Node.js e MongoDB. Infraestrutura em AWS com CI/CD implementado.",
    createdAt: new Date("2023-10-15"),
    updatedAt: new Date("2023-10-20"),
  },
  {
    id: "dd-002",
    companyId: 1,
    companyName: "TechFlow SaaS",
    type: "Financeiro",
    item: "Auditoria de Demonstrações Financeiras",
    status: "Em andamento",
    risk: "Médio",
    recommendation: "Pendente revisão de inconsistências no balanço patrimonial",
    document: {
      name: "demonstracoes-financeiras.xlsx",
      url: "#",
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
    createdAt: new Date("2023-10-18"),
    updatedAt: new Date("2023-10-22"),
  },
  // ... outros itens
]

export default function CompanyDueDiligencePage() {
  const params = useParams()
  const router = useRouter()
  const companyId = Number.parseInt(params.id as string)

  const [company, setCompany] = useState<(typeof companies)[0] | null>(null)
  const [dueDiligenceItems, setDueDiligenceItems] = useState<DueDiligence[]>(initialDueDiligenceItems)

  // Efeito para carregar dados da empresa
  useEffect(() => {
    const foundCompany = companies.find((c) => c.id === companyId)
    if (foundCompany) {
      setCompany(foundCompany)
    } else {
      router.push("/crm")
    }
  }, [companyId, router])

  // Filtrar itens de due diligence para a empresa atual
  const companyItems = dueDiligenceItems.filter((item) => item.companyId === companyId)

  // Função para adicionar novo item
  const handleAddItem = (item: DueDiligence) => {
    setDueDiligenceItems((prev) => [item, ...prev])
  }

  // Função para editar item
  const handleEditItem = (updatedItem: DueDiligence) => {
    setDueDiligenceItems((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
  }

  if (!company) {
    return null // Ou um componente de loading
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-100 h-[76px] flex items-center">
        <div className="max-w-6xl w-full mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/images/logo.png" alt="CORE CAPITAL" width={120} height={48} className="h-8 w-auto" />
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-9 text-xs font-normal rounded-full px-4"
            onClick={() => router.push("/crm")}
          >
            <ChevronLeft className="mr-1.5 h-3.5 w-3.5" />
            Voltar para CRM
          </Button>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-2">
          <div className="flex items-center text-xs text-gray-500">
            <Link href="/" className="hover:text-gray-700 flex items-center">
              <Home className="h-3.5 w-3.5 mr-1" />
              <span>Home</span>
            </Link>
            <span className="mx-2">/</span>
            <Link href="/crm" className="hover:text-gray-700">
              CRM
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/crm/${company.id}`} className="hover:text-gray-700">
              {company.name}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Due Diligence</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-medium text-gray-900">Due Diligence: {company.name}</h1>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs rounded-full border-gray-200"
            onClick={() => router.push("/due-diligence?company=" + company.id)}
          >
            <FileText className="mr-1.5 h-3.5 w-3.5" />
            Ver Todos os Itens
          </Button>
        </div>

        <Card className="border-0 shadow-sm overflow-hidden">
          <DDCompanyDrawer
            company={company}
            items={companyItems}
            onAddItem={handleAddItem}
            onEditItem={handleEditItem}
            onClose={() => {}}
          />
        </Card>
      </main>
    </div>
  )
}
