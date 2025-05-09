"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Building2, FileText, Filter, Plus, Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

// Modificar os dados de exemplo para empresas para incluir a probabilidade de aquisição e análise
const companies = [
  {
    id: 1,
    name: "TechFlow SaaS",
    sector: "SaaS",
    mrr: 45000,
    growth: 12,
    status: "Em análise",
    ddItems: 3,
    ddHighRisk: 0,
    acquisitionProbability: 8,
    acquisitionAnalysis: {
      fitEstrategico: { score: 9, comment: "Alinhamento perfeito com nossa tese de investimento em SaaS B2B" },
      valuation: {
        score: 7,
        comment: "Múltiplo ligeiramente acima da média do mercado, mas justificável pelo crescimento",
      },
      kpis: { score: 8, comment: "MRR consistente, churn baixo (3.2%) e CAC em queda nos últimos 6 meses" },
      owners: { score: 9, comment: "Fundadores abertos à aquisição total e dispostos a permanecer na transição" },
      marketRisks: { score: 7, comment: "Mercado competitivo, mas com diferencial tecnológico significativo" },
      organization: { score: 8, comment: "Processos bem documentados e equipe técnica sólida" },
      growthPotential: { score: 9, comment: "Alto potencial de cross-sell com nossa base atual de clientes" },
    },
  },
  {
    id: 2,
    name: "DataSync Analytics",
    sector: "Analytics",
    mrr: 78000,
    growth: 8,
    status: "Negociação",
    ddItems: 1,
    ddHighRisk: 0,
    acquisitionProbability: 7,
    acquisitionAnalysis: {
      fitEstrategico: { score: 8, comment: "Complementa nosso portfólio de soluções de dados" },
      valuation: { score: 6, comment: "Expectativa de preço elevada em relação aos múltiplos do setor" },
      kpis: { score: 7, comment: "Bom MRR, mas CAC elevado e tendência de aumento no churn (5.8%)" },
      owners: { score: 8, comment: "Fundadores alinhados com a visão de exit, abertos a earn-out" },
      marketRisks: { score: 7, comment: "Mercado em consolidação com players maiores fazendo aquisições" },
      organization: { score: 6, comment: "Documentação técnica insuficiente, dependência de pessoas-chave" },
      growthPotential: { score: 8, comment: "Oportunidades claras de expansão internacional com nosso suporte" },
    },
  },
  {
    id: 3,
    name: "CloudSecure Solutions",
    sector: "Segurança",
    mrr: 120000,
    growth: -2,
    status: "Due Diligence",
    ddItems: 1,
    ddHighRisk: 1,
    acquisitionProbability: 4,
    acquisitionAnalysis: {
      fitEstrategico: { score: 6, comment: "Alinhamento parcial com nossa estratégia de segurança" },
      valuation: { score: 5, comment: "Expectativas irrealistas considerando o crescimento negativo" },
      kpis: { score: 4, comment: "Preocupação com o churn crescente (8.5%) e CAC elevado" },
      owners: { score: 3, comment: "Divergências entre sócios sobre termos da venda" },
      marketRisks: { score: 5, comment: "Mercado altamente competitivo com grandes players dominantes" },
      organization: { score: 4, comment: "Dívida técnica significativa identificada na DD" },
      growthPotential: { score: 5, comment: "Potencial limitado sem investimentos substanciais em produto" },
    },
  },
  {
    id: 4,
    name: "EduTech Platform",
    sector: "Educação",
    mrr: 65000,
    growth: 15,
    status: "Proposta",
    ddItems: 1,
    ddHighRisk: 0,
    acquisitionProbability: 9,
    acquisitionAnalysis: {
      fitEstrategico: { score: 9, comment: "Perfeito para nossa expansão no setor educacional" },
      valuation: { score: 8, comment: "Valuation justo considerando o crescimento acelerado" },
      kpis: { score: 9, comment: "Excelentes métricas: churn baixo (2.1%), LTV/CAC de 4.2" },
      owners: { score: 9, comment: "Fundadores alinhados e interessados em permanecer pós-aquisição" },
      marketRisks: { score: 8, comment: "Mercado em expansão com barreiras de entrada significativas" },
      organization: { score: 8, comment: "Processos bem documentados e equipe técnica qualificada" },
      growthPotential: { score: 10, comment: "Enorme potencial de expansão com nossos recursos e rede" },
    },
  },
]

// Adicionar o componente de modal para exibir a análise detalhada
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ThumbsUp, ThumbsDown, AlertCircle } from "lucide-react"

// Adicionar o componente AcquisitionProbabilityModal
function AcquisitionProbabilityModal({
  isOpen,
  onClose,
  company,
}: {
  isOpen: boolean
  onClose: () => void
  company: (typeof companies)[0] | null
}) {
  if (!company) return null

  const analysis = company.acquisitionAnalysis

  const getScoreIcon = (score: number) => {
    if (score >= 8) return <ThumbsUp className="h-4 w-4 text-green-500" />
    if (score >= 5) return <AlertCircle className="h-4 w-4 text-amber-500" />
    return <ThumbsDown className="h-4 w-4 text-red-500" />
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Probabilidade de Aquisição: {company.acquisitionProbability}/10
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="text-sm text-gray-500 mb-4">
            Análise qualitativa dos fatores que influenciaram esta avaliação:
          </div>

          <div className="space-y-3">
            <div className="flex items-start">
              {getScoreIcon(analysis.fitEstrategico.score)}
              <div className="ml-2">
                <div className="font-medium text-sm">Fit Estratégico com a tese do fundo</div>
                <div className="text-sm text-gray-600">{analysis.fitEstrategico.comment}</div>
              </div>
            </div>

            <div className="flex items-start">
              {getScoreIcon(analysis.valuation.score)}
              <div className="ml-2">
                <div className="font-medium text-sm">Valuation vs. múltiplos do mercado</div>
                <div className="text-sm text-gray-600">{analysis.valuation.comment}</div>
              </div>
            </div>

            <div className="flex items-start">
              {getScoreIcon(analysis.kpis.score)}
              <div className="ml-2">
                <div className="font-medium text-sm">Qualidade dos KPIs (MRR, churn, CAC)</div>
                <div className="text-sm text-gray-600">{analysis.kpis.comment}</div>
              </div>
            </div>

            <div className="flex items-start">
              {getScoreIcon(analysis.owners.score)}
              <div className="ml-2">
                <div className="font-medium text-sm">Perfil e intenção dos donos</div>
                <div className="text-sm text-gray-600">{analysis.owners.comment}</div>
              </div>
            </div>

            <div className="flex items-start">
              {getScoreIcon(analysis.marketRisks.score)}
              <div className="ml-2">
                <div className="font-medium text-sm">Riscos do mercado/setor</div>
                <div className="text-sm text-gray-600">{analysis.marketRisks.comment}</div>
              </div>
            </div>

            <div className="flex items-start">
              {getScoreIcon(analysis.organization.score)}
              <div className="ml-2">
                <div className="font-medium text-sm">Grau de organização da empresa</div>
                <div className="text-sm text-gray-600">{analysis.organization.comment}</div>
              </div>
            </div>

            <div className="flex items-start">
              {getScoreIcon(analysis.growthPotential.score)}
              <div className="ml-2">
                <div className="font-medium text-sm">Potencial de crescimento pós-aquisição</div>
                <div className="text-sm text-gray-600">{analysis.growthPotential.comment}</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function CRMPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompany, setSelectedCompany] = useState<(typeof companies)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filtrar empresas
  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.sector.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Função para abrir o modal com a empresa selecionada
  const openProbabilityModal = (company: (typeof companies)[0], e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedCompany(company)
    setIsModalOpen(true)
  }

  // Função para obter a cor de fundo com base na probabilidade
  const getProbabilityBgColor = (probability: number) => {
    if (probability >= 8) return "bg-green-100 text-green-800"
    if (probability >= 5) return "bg-amber-100 text-amber-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-100 h-[76px] flex items-center">
        <div className="max-w-6xl w-full mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/images/logo.png" alt="CORE CAPITAL" width={120} height={48} className="h-8 w-auto" />
          </div>

          <div className="relative mx-auto">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar empresas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 pl-8 pr-4 w-[280px] md:w-[340px] text-sm border-0 bg-gray-50 focus:ring-0 focus:border-b focus:border-gray-200 rounded-lg"
            />
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="h-9 text-xs font-normal rounded-full px-4">
              <Filter className="mr-1.5 h-3.5 w-3.5" />
              Filtros
            </Button>
            <Button
              size="sm"
              className="h-9 text-xs bg-[#002147] hover:bg-[#00326b] rounded-full"
              onClick={() => router.push("/due-diligence/cadastro")}
            >
              <FileText className="mr-1.5 h-3.5 w-3.5" />
              Due Diligence
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-medium text-gray-900">CRM</h1>
          <Button size="sm" className="h-9 text-xs bg-[#002147] hover:bg-[#00326b] rounded-full">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Nova Empresa
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompanies.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma empresa encontrada</h3>
              <p className="text-sm text-gray-500 mb-6">Tente ajustar os filtros ou adicione uma nova empresa.</p>
              <Button size="sm" className="h-9 text-xs bg-[#002147] hover:bg-[#00326b] rounded-full">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Adicionar Empresa
              </Button>
            </div>
          ) : (
            filteredCompanies.map((company) => (
              <Card
                key={company.id}
                className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/crm/${company.id}`)}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="outline" className="bg-gray-100 text-gray-800">
                      {company.sector}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      {company.status}
                    </Badge>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-3">{company.name}</h3>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <div className="text-xs text-gray-500">MRR</div>
                      <div className="font-medium">R$ {company.mrr.toLocaleString()}</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <div className="text-xs text-gray-500">Crescimento</div>
                      <div className={`font-medium ${company.growth >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {company.growth >= 0 ? "+" : ""}
                        {company.growth}%
                      </div>
                    </div>
                  </div>

                  {/* Novo campo de Probabilidade de Aquisição */}
                  <div className="bg-gray-50 p-2 rounded-lg mb-3">
                    <div className="text-xs text-gray-500">Probabilidade de Aquisição</div>
                    <div
                      className={`inline-flex items-center justify-center font-medium text-sm rounded-full w-7 h-7 cursor-pointer ${getProbabilityBgColor(company.acquisitionProbability)}`}
                      onClick={(e) => openProbabilityModal(company, e)}
                    >
                      {company.acquisitionProbability}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div className="flex items-center">
                      <FileText className="h-3.5 w-3.5 text-gray-400 mr-1" />
                      <span className="text-xs text-gray-500">Due Diligence:</span>
                      <Badge className="ml-1 bg-gray-100 text-gray-800 text-xs">{company.ddItems}</Badge>
                      {company.ddHighRisk > 0 && (
                        <Badge className="ml-1 bg-red-100 text-red-800 text-xs">{company.ddHighRisk}</Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/crm/${company.id}/due-diligence`)
                      }}
                    >
                      <SlidersHorizontal className="h-3.5 w-3.5 text-gray-500" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </main>

      {/* Modal de Probabilidade de Aquisição */}
      <AcquisitionProbabilityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        company={selectedCompany}
      />
    </div>
  )
}
