"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, FileText, Home, Search, AlertTriangle, CheckCircle, Clock, X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DDForm } from "@/components/due-diligence/dd-form"
import type { DueDiligence, DDStatus, DDRisk } from "@/types/due-diligence"

// Atualizar o tipo Company para incluir os novos campos
type Company = {
  id: number
  name: string
  valuation: string
  kpis: { name: string; value: string; target: string; trend: string }[]
  status: "approved" | "pending" | "rejected"
  summary: string
  risks: string[]
  insights: string
  justification: string
  acquisitionProbability: number
  acquisitionJustification: string
  sector: string
  regulated: boolean
  probability: number
  cnpj?: string
  financialData?: FinancialData[]
  documents?: Document[]
}

// Tipo para dados financeiros
type FinancialData = {
  id: string
  year: number
  grossRevenue: number
  netProfit: number
  ebitdaMargin: number
  netDebt: number
  equity: number
  createdAt: Date
}

// Tipo para documentos
type Document = {
  id: string
  name: string
  url: string
  type: string
  uploadedAt: Date
}

// Dados de exemplo para empresas
const companies = [
  {
    id: 1,
    name: "TechFlow SaaS",
    sector: "SaaS",
    regulated: false,
    valuation: "R$ 4.500.000,00",
    kpis: [
      { name: "MRR", value: "R$ 85.000", target: "R$ 100.000", trend: "up" },
      { name: "Churn", value: "2,4%", target: "1,5%", trend: "down" },
      { name: "CAC", value: "R$ 850", target: "R$ 750", trend: "up" },
    ],
    status: "approved",
    summary: "Produto maduro com crescimento consistente e boa retenção de clientes.",
    risks: ["Competição crescente no mercado", "Dependência de um único fornecedor"],
    insights: "Empresa com potencial de expansão internacional e boa aceitação no mercado.",
    justification: "Equipe experiente e produto validado no mercado.",
    acquisitionProbability: 8,
    acquisitionJustification:
      "A empresa apresenta forte alinhamento com a tese do search fund, com um produto maduro e validado no mercado. O valuation está dentro dos múltiplos aceitáveis para o setor de SaaS B2B. Os KPIs são sólidos, com MRR crescente e churn controlado, embora o CAC esteja ligeiramente acima da meta.\n\nOs fundadores demonstraram abertura para negociação e a empresa possui boa organização interna e documentação. O mercado apresenta competição, mas a empresa tem posicionamento diferenciado.\n\nO potencial de crescimento pós-aquisição é significativo, com possibilidades de expansão internacional e cross-selling para a base atual de clientes.",
    probability: 75,
  },
  {
    id: 2,
    name: "DataSync Analytics",
    sector: "Analytics",
    regulated: false,
    valuation: "R$ 3.200.000,00",
    kpis: [
      { name: "MRR", value: "R$ 45.000", target: "R$ 60.000", trend: "up" },
      { name: "Churn", value: "3,8%", target: "2,5%", trend: "neutral" },
      { name: "CAC", value: "R$ 1.200", target: "R$ 900", trend: "down" },
    ],
    status: "pending",
    summary: "Tecnologia promissora, mas ainda em fase de validação de mercado.",
    risks: ["Alto custo de aquisição", "Mercado em consolidação"],
    insights: "Tecnologia diferenciada com potencial de disrupção no segmento de analytics.",
    justification: "Tecnologia inovadora, mas precisa melhorar métricas de aquisição.",
    acquisitionProbability: 6,
    acquisitionJustification:
      "A empresa apresenta uma solução tecnológica com diferencial competitivo e bom MRR. No entanto, o CAC está elevado (R$1.200 com meta de R$900) e o churn acima do desejado. Além disso, o mercado está em fase de consolidação, o que pode dificultar a entrada via aquisição.\n\nA abertura dos sócios à negociação ainda não está clara, o que representa um ponto de atenção para o processo. A empresa possui documentação razoável, mas alguns processos ainda precisam ser formalizados.\n\nO potencial de crescimento pós-aquisição é moderado, dependendo da capacidade de otimização das métricas de aquisição de clientes e redução do churn.",
    probability: 40,
  },
  {
    id: 3,
    name: "CloudSecure Solutions",
    sector: "Segurança",
    regulated: true,
    valuation: "R$ 2.800.000,00",
    kpis: [
      { name: "MRR", value: "R$ 35.000", target: "R$ 50.000", trend: "down" },
      { name: "Churn", value: "4,2%", target: "3,0%", trend: "up" },
      { name: "CAC", value: "R$ 950", target: "R$ 800", trend: "neutral" },
    ],
    status: "rejected",
    summary: "Mercado saturado e métricas de crescimento abaixo do esperado.",
    risks: ["Alta competição", "Dificuldade de diferenciação", "Churn elevado"],
    insights: "Produto com features interessantes, mas sem diferencial competitivo claro.",
    justification: "Métricas de crescimento e retenção abaixo do benchmark do setor.",
    acquisitionProbability: 3,
    acquisitionJustification:
      "A empresa apresenta baixo alinhamento com a tese do search fund devido ao mercado saturado e à dificuldade de diferenciação. O valuation, embora mais baixo que outras oportunidades, ainda parece elevado considerando as métricas de crescimento estagnadas e o churn crescente.\n\nOs KPIs estão significativamente abaixo das metas, com MRR em queda e churn elevado, sinalizando problemas de retenção de clientes. Os fundadores demonstram interesse em vender, mas isso pode ser reflexo dos desafios enfrentados.\n\nA empresa apresenta organização interna deficiente e o potencial de crescimento pós-aquisição é limitado sem uma reestruturação significativa do produto e da estratégia de mercado.",
    probability: 60,
  },
  {
    id: 4,
    name: "EduTech Platform",
    sector: "Educação",
    regulated: false,
    valuation: "R$ 5.100.000,00",
    kpis: [
      { name: "MRR", value: "R$ 95.000", target: "R$ 120.000", trend: "up" },
      { name: "Churn", value: "1,8%", target: "1,5%", trend: "down" },
      { name: "CAC", value: "R$ 780", target: "R$ 750", trend: "down" },
    ],
    status: "approved",
    summary: "Forte crescimento no setor educacional com excelente retenção.",
    risks: ["Dependência de parcerias institucionais"],
    insights: "Líder emergente no segmento de educação corporativa com alto potencial de expansão.",
    justification: "Excelentes métricas de crescimento e retenção, com modelo de negócio validado.",
    acquisitionProbability: 9,
    acquisitionJustification:
      "A empresa demonstra excelente alinhamento com a tese do search fund, sendo líder emergente em um mercado em expansão. O valuation, embora no limite superior do aceitável, é justificado pelos excelentes KPIs e pelo potencial de crescimento.\n\nOs indicadores de performance são excepcionais, com MRR crescente, churn baixo e CAC próximo da meta. A equipe fundadora é experiente e já sinalizou interesse em uma transição planejada, mantendo-se como consultores durante o período inicial pós-aquisição.\n\nA empresa possui processos bem documentados e uma estrutura organizacional sólida. O potencial de crescimento pós-aquisição é substancial, com oportunidades de expansão para novos segmentos educacionais e mercados internacionais.",
    probability: 85,
  },
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
  {
    id: "dd-003",
    companyId: 1,
    companyName: "TechFlow SaaS",
    type: "Jurídico",
    item: "Análise de Contratos com Clientes",
    status: "Pendente",
    risk: "Alto",
    recommendation: "Revisar cláusulas de SLA e responsabilidade por vazamento de dados",
    document: {
      name: "contratos-clientes.pdf",
      url: "#",
      type: "application/pdf",
    },
    createdAt: new Date("2023-10-20"),
    updatedAt: new Date("2023-10-20"),
  },
  {
    id: "dd-004",
    companyId: 2,
    companyName: "DataSync Analytics",
    type: "Tecnologia",
    item: "Avaliação de Segurança de Dados",
    status: "Em andamento",
    risk: "Alto",
    recommendation: "Implementar criptografia em trânsito e em repouso para todos os dados sensíveis",
    document: {
      name: "avaliacao-seguranca.pdf",
      url: "#",
      type: "application/pdf",
    },
    createdAt: new Date("2023-10-16"),
    updatedAt: new Date("2023-10-21"),
  },
]

// Função para determinar o nível de risco da empresa
const getCompanyRiskLevel = (company: any) => {
  // Calcular com base em múltiplos fatores
  const riskFactors = [
    // Quanto menor a probabilidade de aquisição, maior o risco
    company.acquisitionProbability < 5 ? 3 : company.acquisitionProbability < 7 ? 2 : 1,

    // Quanto mais riscos listados, maior o risco
    company.risks.length > 2 ? 3 : company.risks.length > 0 ? 2 : 1,

    // KPIs negativos aumentam o risco
    company.kpis.filter((kpi) => kpi.trend === "down").length > 1
      ? 3
      : company.kpis.filter((kpi) => kpi.trend === "down").length > 0
        ? 2
        : 1,
  ]

  // Calcular média dos fatores de risco
  const avgRisk = riskFactors.reduce((sum, factor) => sum + factor, 0) / riskFactors.length

  // Classificar o risco
  if (avgRisk > 2.3) return { level: "Alto", color: "red" }
  if (avgRisk > 1.6) return { level: "Médio", color: "yellow" }
  return { level: "Baixo", color: "green" }
}

export default function CompanyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const companyId = Number.parseInt(params.id as string)

  const [company, setCompany] = useState<(typeof companies)[0] | null>(null)
  const [dueDiligenceItems, setDueDiligenceItems] = useState<DueDiligence[]>(initialDueDiligenceItems)
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<DDStatus | "Todos">("Todos")
  const [riskFilter, setRiskFilter] = useState<DDRisk | "Todos">("Todos")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<DueDiligence | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  // Estados para dados financeiros
  const [financialData, setFinancialData] = useState<FinancialData[]>([])
  const [newFinancialData, setNewFinancialData] = useState<Partial<FinancialData>>({
    year: new Date().getFullYear() - 1,
    grossRevenue: 0,
    netProfit: 0,
    ebitdaMargin: 0,
    netDebt: 0,
    equity: 0,
  })

  // Estados para documentos
  const [documents, setDocuments] = useState<Document[]>([])
  const [uploadingFile, setUploadingFile] = useState<File | null>(null)

  const [isAcquisitionModalOpen, setIsAcquisitionModalOpen] = useState(false)

  // Função para obter texto de critérios com base na empresa
  const getCriteriaText = (company: any, criteria: string) => {
    switch (criteria) {
      case "fit":
        if (company.acquisitionProbability >= 7) {
          return "Forte alinhamento com a tese do fundo"
        } else if (company.acquisitionProbability >= 4) {
          return "Alinhamento moderado com a tese"
        } else {
          return "Baixo alinhamento estratégico"
        }
      case "valuation":
        if (company.acquisitionProbability >= 7) {
          return "Múltiplos adequados para o setor"
        } else if (company.acquisitionProbability >= 4) {
          return "Valuation no limite aceitável"
        } else {
          return "Valuation acima do mercado"
        }
      case "kpis":
        const positiveKPIs = company.kpis.filter((kpi) => kpi.trend === "up").length
        const totalKPIs = company.kpis.length
        if (positiveKPIs / totalKPIs > 0.6) {
          return "Métricas sólidas e em crescimento"
        } else if (positiveKPIs / totalKPIs > 0.3) {
          return "Métricas com potencial de melhoria"
        } else {
          return "Métricas abaixo do benchmark"
        }
      default:
        return ""
    }
  }

  // Efeito para carregar dados da empresa
  useEffect(() => {
    const foundCompany = companies.find((c) => c.id === companyId)
    if (foundCompany) {
      setCompany(foundCompany)

      // Carregar dados financeiros se existirem
      if (foundCompany.financialData) {
        setFinancialData(foundCompany.financialData)
      } else {
        // Dados de exemplo para demonstração
        const exampleFinancialData: FinancialData[] = [
          {
            id: "fin-001",
            year: 2023,
            grossRevenue: 1250000,
            netProfit: 320000,
            ebitdaMargin: 28.5,
            netDebt: 150000,
            equity: 850000,
            createdAt: new Date("2023-12-15"),
          },
          {
            id: "fin-002",
            year: 2022,
            grossRevenue: 980000,
            netProfit: 240000,
            ebitdaMargin: 25.2,
            netDebt: 220000,
            equity: 620000,
            createdAt: new Date("2022-12-20"),
          },
        ]

        // Apenas para empresas com ID 1 e 4 (para demonstração)
        if (foundCompany.id === 1 || foundCompany.id === 4) {
          setFinancialData(exampleFinancialData)
        }
      }

      // Carregar documentos se existirem
      if (foundCompany.documents) {
        setDocuments(foundCompany.documents)
      } else {
        // Documentos de exemplo para demonstração
        const exampleDocuments: Document[] = [
          {
            id: "doc-001",
            name: "Contrato Social.pdf",
            url: "#",
            type: "application/pdf",
            uploadedAt: new Date("2023-10-15"),
          },
          {
            id: "doc-002",
            name: "Demonstrações Financeiras 2023.xlsx",
            url: "#",
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            uploadedAt: new Date("2023-12-10"),
          },
        ]

        // Apenas para empresas com ID 1 e 3 (para demonstração)
        if (foundCompany.id === 1 || foundCompany.id === 3) {
          setDocuments(exampleDocuments)
        }
      }
    } else {
      router.push("/crm")
    }
  }, [companyId, router])

  // Filtrar itens de due diligence para a empresa atual
  const companyItems = dueDiligenceItems.filter((item) => item.companyId === companyId)

  // Aplicar filtros de busca e status
  const filteredItems = companyItems.filter((item) => {
    const matchesSearch =
      searchTerm === "" ||
      item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.recommendation.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "Todos" || item.status === statusFilter
    const matchesRisk = riskFilter === "Todos" || item.risk === riskFilter

    return matchesSearch && matchesStatus && matchesRisk
  })

  // Calcular estatísticas
  const totalItems = companyItems.length
  const highRiskItems = companyItems.filter((item) => item.risk === "Alto").length
  const pendingItems = companyItems.filter((item) => item.status === "Pendente").length
  const inProgressItems = companyItems.filter((item) => item.status === "Em andamento").length

  // Função para adicionar novo dado financeiro
  const handleAddFinancialData = (e: React.FormEvent) => {
    e.preventDefault()

    const newData: FinancialData = {
      id: `fin-${Date.now()}`,
      year: newFinancialData.year || new Date().getFullYear(),
      grossRevenue: newFinancialData.grossRevenue || 0,
      netProfit: newFinancialData.netProfit || 0,
      ebitdaMargin: newFinancialData.ebitdaMargin || 0,
      netDebt: newFinancialData.netDebt || 0,
      equity: newFinancialData.equity || 0,
      createdAt: new Date(),
    }

    setFinancialData((prev) => [newData, ...prev])

    // Resetar o formulário
    setNewFinancialData({
      year: new Date().getFullYear(),
      grossRevenue: 0,
      netProfit: 0,
      ebitdaMargin: 0,
      netDebt: 0,
      equity: 0,
    })
  }

  // Função para atualizar campo do novo dado financeiro
  const handleFinancialInputChange = (field: keyof FinancialData, value: any) => {
    setNewFinancialData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Função para simular upload de documento
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setUploadingFile(file)

      // Simular upload (em um ambiente real, isso seria uma chamada de API)
      setTimeout(() => {
        const newDocument: Document = {
          id: `doc-${Date.now()}`,
          name: file.name,
          url: "#",
          type: file.type,
          uploadedAt: new Date(),
        }

        setDocuments((prev) => [newDocument, ...prev])
        setUploadingFile(null)

        // Limpar o input de arquivo
        if (e.target) {
          e.target.value = ""
        }
      }, 1500)
    }
  }

  // Função para formatar valor monetário
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  // Função para formatar percentual
  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  // Função para renderizar o status com ícone e cor
  const renderStatus = (status: any) => {
    switch (status) {
      case "approved":
        return (
          <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-50 text-green-600 border border-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            <span>Aprovado</span>
          </div>
        )
      case "pending":
        return (
          <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-amber-50 text-amber-600 border border-amber-100">
            <Clock className="h-3 w-3 mr-1" />
            <span>Em Avaliação</span>
          </div>
        )
      case "rejected":
        return (
          <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-red-50 text-red-600 border border-red-100">
            <X className="h-3 w-3 mr-1" />
            <span>Não Aprovado</span>
          </div>
        )
      default:
        return null
    }
  }

  // Função para adicionar novo item
  const handleAddItem = (item: DueDiligence) => {
    setDueDiligenceItems((prev) => [item, ...prev])
    setIsAddDialogOpen(false)
  }

  // Função para editar item
  const handleEditItem = (updatedItem: DueDiligence) => {
    setDueDiligenceItems((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
    setIsDetailDialogOpen(false)
    setSelectedItem(null)
  }

  // Função para excluir item
  const handleDeleteItem = (id: string) => {
    setDueDiligenceItems((prev) => prev.filter((item) => item.id !== id))
    setIsDetailDialogOpen(false)
    setSelectedItem(null)
  }

  // Função para obter ícone de status
  const getStatusIcon = (status: DDStatus) => {
    switch (status) {
      case "Pendente":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "Em andamento":
        return <AlertTriangle className="h-4 w-4 text-blue-500" />
      case "Concluído":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  // Função para obter cor de risco
  const getRiskColor = (risk: DDRisk) => {
    switch (risk) {
      case "Baixo":
        return "bg-green-50 border-green-200 hover:bg-green-100"
      case "Médio":
        return "bg-yellow-50 border-yellow-200 hover:bg-yellow-100"
      case "Alto":
        return "bg-red-50 border-red-200 hover:bg-red-100"
      default:
        return "bg-gray-50 border-gray-200 hover:bg-gray-100"
    }
  }

  // Função para obter cor de badge de risco
  const getRiskBadgeColor = (risk: DDRisk) => {
    switch (risk) {
      case "Baixo":
        return "bg-green-100 text-green-800"
      case "Médio":
        return "bg-yellow-100 text-yellow-800"
      case "Alto":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderStatusOld = (status: string) => {
    switch (status) {
      case "Em negociação":
        return <Badge className="bg-blue-100 text-blue-800">Em Negociação</Badge>
      case "Qualificado":
        return <Badge className="bg-green-100 text-green-800">Qualificado</Badge>
      case "Em prospecção":
        return <Badge className="bg-yellow-100 text-yellow-800">Em Prospecção</Badge>
      case "Contato inicial":
        return <Badge className="bg-gray-100 text-gray-800">Contato Inicial</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  if (!company) {
    return null // Ou um componente de loading
  }

  // Modal de análise detalhada de probabilidade de aquisição
  const AcquisitionProbabilityModal = () => {
    if (!company) return null

    // Função para obter a cor baseada na nota
    const getScoreColor = (score: number) => {
      if (score >= 7) return "text-green-600"
      if (score >= 4) return "text-yellow-600"
      return "text-red-600"
    }

    // Função para obter o ícone baseado na nota
    const getScoreIcon = (score: number) => {
      if (score >= 7) return "✅"
      if (score >= 4) return "⚠️"
      return "❌"
    }

    // Critérios de avaliação
    const criteria = [
      {
        title: "Fit Estratégico com a tese do fundo",
        score: company.acquisitionProbability >= 7 ? 8 : company.acquisitionProbability >= 4 ? 6 : 3,
        description:
          company.acquisitionProbability >= 7
            ? "Forte alinhamento com a tese do search fund, com produto maduro e validado no mercado."
            : company.acquisitionProbability >= 4
              ? "Alinhamento moderado com a tese, mas com alguns pontos de atenção."
              : "Baixo alinhamento com a tese do search fund devido ao mercado saturado e à dificuldade de diferenciação.",
      },
      {
        title: "Valuation vs. múltiplos do mercado",
        score: company.acquisitionProbability >= 7 ? 7 : company.acquisitionProbability >= 4 ? 5 : 4,
        description:
          company.acquisitionProbability >= 7
            ? "Valuation dentro dos múltiplos aceitáveis para o setor."
            : company.acquisitionProbability >= 4
              ? "Valuation no limite superior do aceitável para o setor."
              : "Valuation elevado considerando as métricas de crescimento estagnadas.",
      },
      {
        title: "Qualidade dos KPIs (MRR, churn, CAC)",
        score: company.kpis.some((kpi) => kpi.trend === "up")
          ? 8
          : company.kpis.some((kpi) => kpi.trend === "neutral")
            ? 6
            : 3,
        description: company.kpis.some((kpi) => kpi.trend === "up")
          ? "KPIs sólidos, com MRR crescente e churn controlado."
          : company.kpis.some((kpi) => kpi.trend === "neutral")
            ? "KPIs com potencial de melhoria, mas alguns indicadores preocupantes."
            : "KPIs significativamente abaixo das metas, com MRR em queda e churn elevado.",
      },
      {
        title: "Perfil e intenção dos donos",
        score: company.acquisitionProbability >= 7 ? 9 : company.acquisitionProbability >= 4 ? 5 : 7,
        description:
          company.acquisitionProbability >= 7
            ? "Fundadores demonstraram abertura para negociação e transição planejada."
            : company.acquisitionProbability >= 4
              ? "Abertura dos sócios à negociação ainda não está clara."
              : "Fundadores demonstram interesse em vender, possivelmente devido aos desafios enfrentados.",
      },
      {
        title: "Riscos do mercado/setor",
        score: company.risks.length <= 1 ? 8 : company.risks.length <= 2 ? 6 : 4,
        description:
          company.risks.length <= 1
            ? "Mercado em expansão com riscos controlados."
            : company.risks.length <= 2
              ? "Mercado em fase de consolidação, com alguns riscos a monitorar."
              : "Mercado saturado com alta competição e dificuldade de diferenciação.",
      },
      {
        title: "Grau de organização da empresa",
        score: company.acquisitionProbability >= 7 ? 8 : company.acquisitionProbability >= 4 ? 6 : 3,
        description:
          company.acquisitionProbability >= 7
            ? "Empresa com boa organização interna e documentação."
            : company.acquisitionProbability >= 4
              ? "Documentação razoável, mas alguns processos precisam ser formalizados."
              : "Organização interna deficiente, necessitando reestruturação significativa.",
      },
      {
        title: "Potencial de crescimento pós-aquisição",
        score: company.acquisitionProbability >= 7 ? 9 : company.acquisitionProbability >= 4 ? 6 : 4,
        description:
          company.acquisitionProbability >= 7
            ? "Potencial de crescimento significativo, com possibilidades de expansão internacional."
            : company.acquisitionProbability >= 4
              ? "Potencial de crescimento moderado, dependendo da otimização de métricas."
              : "Potencial de crescimento limitado sem reestruturação significativa.",
      },
    ]

    return (
      <Dialog open={isAcquisitionModalOpen} onOpenChange={setIsAcquisitionModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Probabilidade de Aquisição: {company.acquisitionProbability}/10
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-6">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  company.acquisitionProbability >= 7
                    ? "bg-green-500"
                    : company.acquisitionProbability >= 4
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${(company.acquisitionProbability / 10) * 100}%` }}
              ></div>
            </div>

            <div className="space-y-4">
              {criteria.map((criterion, index) => (
                <div key={index} className="border border-gray-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{criterion.title}</h3>
                    <div className={`font-bold ${getScoreColor(criterion.score)}`}>
                      {getScoreIcon(criterion.score)} {criterion.score}/10
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{criterion.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Análise Geral</h3>
              <p className="text-sm text-gray-700 whitespace-pre-line">{company.acquisitionJustification}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Modal de análise detalhada */}
      <AcquisitionProbabilityModal />

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
            <span className="text-gray-900 font-medium">{company.name}</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-medium text-gray-900">{company.name}</h1>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs rounded-full border-gray-200"
              onClick={() => router.push(`/crm/${company.id}/due-diligence`)}
            >
              <FileText className="mr-1.5 h-3.5 w-3.5" />
              Due Diligence
            </Button>
          </div>
        </div>

        <Card className="border-0 shadow-sm overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b border-gray-100">
              <div className="px-6">
                <TabsList className="bg-transparent h-12 p-0">
                  <TabsTrigger
                    value="overview"
                    className="text-sm h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-[#002147] data-[state=active]:text-[#002147] px-4"
                  >
                    Visão Geral
                  </TabsTrigger>
                  <TabsTrigger
                    value="due-diligence"
                    className="text-sm h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-[#002147] data-[state=active]:text-[#002147] px-4 flex items-center"
                  >
                    Due Diligence
                    {totalItems > 0 && <Badge className="ml-2 bg-gray-100 text-gray-800">{totalItems}</Badge>}
                    {highRiskItems > 0 && <Badge className="ml-1 bg-red-100 text-red-800">{highRiskItems}</Badge>}
                  </TabsTrigger>
                  <TabsTrigger
                    value="financials"
                    className="text-sm h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-[#002147] data-[state=active]:text-[#002147] px-4"
                  >
                    Financeiro
                  </TabsTrigger>
                  <TabsTrigger
                    value="documents"
                    className="text-sm h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-[#002147] data-[state=active]:text-[#002147] px-4"
                  >
                    Documentos
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <TabsContent value="overview" className="m-0 p-6">
              {/* Termômetro de aquisição no topo */}
              <div className="mb-6 bg-white rounded-lg border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-medium text-gray-900">Termômetro de Aquisição</h2>
                  <Badge
                    className={`${
                      company.acquisitionProbability >= 7
                        ? "bg-green-100 text-green-800"
                        : company.acquisitionProbability >= 4
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {company.acquisitionProbability >= 7
                      ? "Alta Probabilidade"
                      : company.acquisitionProbability >= 4
                        ? "Média Probabilidade"
                        : "Baixa Probabilidade"}
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-gray-900">{company.acquisitionProbability}/10</div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          company.acquisitionProbability >= 7
                            ? "bg-green-500"
                            : company.acquisitionProbability >= 4
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${(company.acquisitionProbability / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 text-xs rounded-full"
                    onClick={() => setIsAcquisitionModalOpen(true)}
                  >
                    Ver análise completa
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Coluna 1: Panorama Financeiro */}
                <div className="space-y-6">
                  <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                      <h2 className="text-base font-medium text-gray-900">📊 Panorama Financeiro</h2>
                    </div>
                    <div className="p-5">
                      <div className="space-y-5">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <div className="text-sm font-medium text-gray-700">Valuation</div>
                            <div className="text-xs text-gray-500">Setor: {company.sector}</div>
                          </div>
                          <div className="text-xl font-semibold text-gray-900">{company.valuation}</div>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                          <div className="text-sm font-medium text-gray-700 mb-3">KPIs</div>
                          <div className="space-y-4">
                            {company.kpis.map((kpi, index) => (
                              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex justify-between items-center mb-1">
                                  <div className="text-xs font-medium text-gray-700">{kpi.name}</div>
                                  <div className="flex items-center">
                                    {kpi.trend === "up" && (
                                      <span className="flex items-center text-green-500 text-xs">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-3 w-3 mr-1"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                        Crescendo
                                      </span>
                                    )}
                                    {kpi.trend === "down" && (
                                      <span className="flex items-center text-red-500 text-xs">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-3 w-3 mr-1"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M12 13a1 1 0 110 2H7a1 1 0 01-1-1v-5a1 1 0 112 0v2.586l4.293-4.293a1 1 0 011.414 0L16 9.586V7a1 1 0 112 0v5a1 1 0 01-1 1h-5z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                        Caindo
                                      </span>
                                    )}
                                    {kpi.trend === "neutral" && (
                                      <span className="flex items-center text-gray-400 text-xs">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-3 w-3 mr-1"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M7 10a1 1 0 011-1h9a1 1 0 110 2H8a1 1 0 01-1-1z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                        Estável
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex justify-between items-center mb-1">
                                  <div className="text-base font-semibold text-gray-900">{kpi.value}</div>
                                  <div className="text-xs text-gray-500">Meta: {kpi.target}</div>
                                </div>

                                {/* Barra de progresso comparativa */}
                                <div className="relative pt-1">
                                  <div className="flex mb-2 items-center justify-between">
                                    <div>
                                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-200">
                                        Progresso
                                      </span>
                                    </div>
                                  </div>
                                  <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-gray-200">
                                    <div
                                      style={{
                                        width: (() => {
                                          try {
                                            // Extract numeric values from strings (removing currency symbols, etc.)
                                            const valueStr = kpi.value.replace(/[^0-9.-]+/g, "")
                                            const targetStr = kpi.target.replace(/[^0-9.-]+/g, "")

                                            // Convert to numbers
                                            const value = Number.parseFloat(valueStr)
                                            const target = Number.parseFloat(targetStr)

                                            // Check if both are valid numbers
                                            if (isNaN(value) || isNaN(target) || target === 0) {
                                              return "50%" // Default fallback if calculation isn't possible
                                            }

                                            // Calculate percentage with upper limit of 100%
                                            return Math.min((value / target) * 100, 100) + "%"
                                          } catch (e) {
                                            return "50%" // Fallback in case of any errors
                                          }
                                        })(),
                                      }}
                                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                                        kpi.trend === "up"
                                          ? "bg-green-500"
                                          : kpi.trend === "down"
                                            ? "bg-red-500"
                                            : "bg-yellow-500"
                                      }`}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                          <div className="text-sm font-medium text-gray-700 mb-2">Status</div>
                          <div>{renderStatus(company.status)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coluna 2: Riscos e Oportunidades */}
                <div className="space-y-6">
                  <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                      <h2 className="text-base font-medium text-gray-900">⚠️ Riscos e Oportunidades</h2>
                    </div>
                    <div className="p-5">
                      <div className="space-y-5">
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-3">Classificação de Risco</div>
                          {(() => {
                            const risk = getCompanyRiskLevel(company)
                            return (
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                  <div className={`w-4 h-4 rounded-full mr-2 bg-${risk.color}-500`}></div>
                                  <span className="text-lg font-semibold text-gray-900">{risk.level}</span>
                                </div>
                                <Badge className={`bg-${risk.color}-100 text-${risk.color}-800`}>
                                  {risk.level === "Baixo"
                                    ? "Favorável"
                                    : risk.level === "Médio"
                                      ? "Atenção"
                                      : "Cautela"}
                                </Badge>
                              </div>
                            )
                          })()}

                          {/* Fatores de risco */}
                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Fatores de Risco</h3>
                            {company.risks.length > 0 ? (
                              <ul className="space-y-2">
                                {company.risks.map((risk, index) => (
                                  <li key={index} className="flex items-start">
                                    <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 mr-2 flex-shrink-0"></div>
                                    <span className="text-sm text-gray-700">{risk}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-gray-500">Nenhum risco significativo identificado.</p>
                            )}
                          </div>

                          {/* Insights */}
                          <div className="bg-blue-50 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-blue-700 mb-2">Insights</h3>
                            <div className="text-sm text-blue-800">
                              {company.insights.split("\n").map((paragraph, idx) => (
                                <p key={idx} className="mb-2">
                                  {paragraph}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coluna 3: Análise de Aquisição */}
                <div className="space-y-6">
                  <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                      <h2 className="text-base font-medium text-gray-900">📈 Análise de Aquisição</h2>
                    </div>
                    <div className="p-5">
                      <div className="space-y-5">
                        {/* Fit Estratégico */}
                        <div className="mb-4">
                          <h3 className="text-sm font-medium text-gray-700 mb-3">Fit Estratégico</h3>
                          <div className="space-y-3 text-sm">
                            <div className="flex items-start">
                              <div
                                className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-2 mt-0.5 ${
                                  company.acquisitionProbability >= 7
                                    ? "bg-green-100 text-green-600"
                                    : company.acquisitionProbability >= 4
                                      ? "bg-yellow-100 text-yellow-600"
                                      : "bg-red-100 text-red-600"
                                }`}
                              >
                                {company.acquisitionProbability >= 7
                                  ? "✓"
                                  : company.acquisitionProbability >= 4
                                    ? "!"
                                    : "✕"}
                              </div>
                              <div>
                                <span className="font-medium">Fit Estratégico:</span> {getCriteriaText(company, "fit")}
                              </div>
                            </div>

                            <div className="flex items-start">
                              <div
                                className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-2 mt-0.5 ${
                                  company.acquisitionProbability >= 7
                                    ? "bg-green-100 text-green-600"
                                    : company.acquisitionProbability >= 4
                                      ? "bg-yellow-100 text-yellow-600"
                                      : "bg-red-100 text-red-600"
                                }`}
                              >
                                {company.acquisitionProbability >= 7
                                  ? "✓"
                                  : company.acquisitionProbability >= 4
                                    ? "!"
                                    : "✕"}
                              </div>
                              <div>
                                <span className="font-medium">Valuation:</span> {getCriteriaText(company, "valuation")}
                              </div>
                            </div>

                            <div className="flex items-start">
                              <div
                                className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-2 mt-0.5 ${
                                  company.kpis.some((kpi) => kpi.trend === "up")
                                    ? "bg-green-100 text-green-600"
                                    : company.kpis.some((kpi) => kpi.trend === "neutral")
                                      ? "bg-yellow-100 text-yellow-600"
                                      : "bg-red-100 text-red-600"
                                }`}
                              >
                                {company.kpis.some((kpi) => kpi.trend === "up")
                                  ? "✓"
                                  : company.kpis.some((kpi) => kpi.trend === "neutral")
                                    ? "!"
                                    : "✕"}
                              </div>
                              <div>
                                <span className="font-medium">KPIs:</span> {getCriteriaText(company, "kpis")}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Análise Qualitativa */}
                        <div className="pt-4 border-t border-gray-100">
                          <h3 className="text-sm font-medium text-gray-700 mb-3">Análise Qualitativa</h3>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="text-sm text-gray-700 whitespace-pre-line">
                              {company.acquisitionJustification.split("\n\n").map((paragraph, idx) => (
                                <p key={idx} className="mb-3">
                                  {paragraph}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-5">
                      <div className="flex flex-col space-y-3">
                        <Button
                          className="w-full bg-[#002147] hover:bg-[#00326b]"
                          onClick={() => setIsAcquisitionModalOpen(true)}
                        >
                          Ver Análise Completa
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => router.push(`/crm/${company.id}/due-diligence`)}
                        >
                          <FileText className="mr-1.5 h-3.5 w-3.5" />
                          Ver Due Diligence
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="due-diligence" className="m-0 p-6">
              {/* Cabeçalho com estatísticas */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-2">Due Diligence</h2>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-gray-100">
                      Total: {totalItems}
                    </Badge>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      <Clock className="h-3 w-3 mr-1" />
                      Pendentes: {pendingItems}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Em andamento: {inProgressItems}
                    </Badge>
                    {highRiskItems > 0 && (
                      <Badge variant="outline" className="bg-red-100 text-red-800">
                        Risco Alto: {highRiskItems}
                      </Badge>
                    )}
                  </div>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="h-9 text-xs bg-[#002147] hover:bg-[#00326b] rounded-full mt-4 md:mt-0">
                      Adicionar Item de DD
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Adicionar Item de Due Diligence</DialogTitle>
                    </DialogHeader>
                    <DDForm
                      companies={[company]}
                      initialData={{ companyId: company.id, companyName: company.name }}
                      onSubmit={handleAddItem}
                      onCancel={() => setIsAddDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              {/* Filtros */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar itens..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-9 text-sm border-gray-200 focus:border-gray-300 focus:ring-0 rounded-lg"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as DDStatus | "Todos")}
                    className="h-9 text-sm border-gray-200 focus:border-gray-300 focus:ring-0 rounded-lg px-3 pr-8"
                  >
                    <option value="Todos">Todos os Status</option>
                    <option value="Pendente">Pendente</option>
                    <option value="Em andamento">Em andamento</option>
                    <option value="Concluído">Concluído</option>
                  </select>
                  <select
                    value={riskFilter}
                    onChange={(e) => setRiskFilter(e.target.value as DDRisk | "Todos")}
                    className="h-9 text-sm border-gray-200 focus:border-gray-300 focus:ring-0 rounded-lg px-3 pr-8"
                  >
                    <option value="Todos">Todos os Riscos</option>
                    <option value="Baixo">Baixo</option>
                    <option value="Médio">Médio</option>
                    <option value="Alto">Alto</option>
                  </select>
                </div>
              </div>

              {/* Lista de itens */}
              {filteredItems.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum item encontrado</h3>
                  <p className="text-sm text-gray-500 mb-6">
                    {companyItems.length === 0
                      ? "Esta empresa ainda não possui itens de due diligence cadastrados."
                      : "Nenhum item corresponde aos filtros aplicados."}
                  </p>
                  {companyItems.length === 0 && (
                    <Button
                      size="sm"
                      className="h-9 text-xs bg-[#002147] hover:bg-[#00326b] rounded-full"
                      onClick={() => setIsAddDialogOpen(true)}
                    >
                      Adicionar Primeiro Item
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredItems.map((item) => (
                    <Dialog
                      key={item.id}
                      open={isDetailDialogOpen && selectedItem?.id === item.id}
                      onOpenChange={(open) => {
                        if (!open) {
                          setIsDetailDialogOpen(false)
                          setSelectedItem(null)
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <div
                          className={`cursor-pointer border rounded-lg p-4 ${getRiskColor(item.risk)}`}
                          onClick={() => {
                            setSelectedItem(item)
                            setIsDetailDialogOpen(true)
                          }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="outline" className="bg-gray-100 text-gray-800">
                              {item.type}
                            </Badge>
                            <Badge variant="outline" className={getRiskBadgeColor(item.risk)}>
                              {item.risk}
                            </Badge>
                          </div>
                          <h3 className="font-medium text-gray-900 mb-2">{item.item}</h3>
                          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.recommendation}</p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center text-xs text-gray-500">
                              {getStatusIcon(item.status)}
                              <span className="ml-1">{item.status}</span>
                            </div>
                            <div className="text-xs text-gray-400">
                              {new Date(item.updatedAt).toLocaleDateString("pt-BR")}
                            </div>
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Detalhes do Item de Due Diligence</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="outline" className="bg-gray-100 text-gray-800">
                              {item.type}
                            </Badge>
                            <Badge variant="outline" className={getRiskBadgeColor(item.risk)}>
                              {item.risk}
                            </Badge>
                            <Badge variant="outline" className="bg-blue-100 text-blue-800">
                              {getStatusIcon(item.status)}
                              <span className="ml-1">{item.status}</span>
                            </Badge>
                          </div>

                          <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">{item.item}</h3>
                            <p className="text-sm text-gray-500">
                              Atualizado em {new Date(item.updatedAt).toLocaleDateString("pt-BR")}
                            </p>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Recomendação</h4>
                            <p className="text-sm text-gray-600">{item.recommendation}</p>
                          </div>

                          {item.technicalNotes && (
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <h4 className="text-sm font-medium text-blue-700 mb-2">Observações Técnicas</h4>
                              <p className="text-sm text-blue-600">{item.technicalNotes}</p>
                            </div>
                          )}

                          {item.document && (
                            <div className="border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                              <div className="flex items-center">
                                <FileText className="h-5 w-5 text-gray-500 mr-2" />
                                <span className="text-sm text-gray-700">{item.document.name}</span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs rounded-full"
                                onClick={() => window.open(item.document?.url, "_blank")}
                              >
                                Visualizar
                              </Button>
                            </div>
                          )}

                          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-9 text-xs rounded-full text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              Excluir
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button type="button" variant="outline" size="sm" className="h-9 text-xs rounded-full">
                                  Editar
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl">
                                <DialogHeader>
                                  <DialogTitle>Editar Item de Due Diligence</DialogTitle>
                                </DialogHeader>
                                <DDForm
                                  companies={[company]}
                                  initialData={item}
                                  onSubmit={handleEditItem}
                                  onCancel={() => {}}
                                />
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="financials" className="m-0 p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Informações Financeiras</h2>
                  {company.cnpj && (
                    <div className="text-sm text-gray-500">CNPJ: {company.cnpj || "XX.XXX.XXX/0001-XX"}</div>
                  )}
                </div>

                {/* Formulário para adicionar dados financeiros */}
                <Card className="border-0 shadow-sm overflow-hidden">
                  <div className="p-5">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Adicionar Dados Financeiros</h3>
                    <form onSubmit={handleAddFinancialData} className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                        <div>
                          <label htmlFor="year" className="block text-xs text-gray-500 mb-1">
                            Ano
                          </label>
                          <input
                            type="number"
                            id="year"
                            value={newFinancialData.year}
                            onChange={(e) => handleFinancialInputChange("year", Number.parseInt(e.target.value))}
                            className="w-full h-9 text-sm border-gray-200 rounded-lg px-3"
                            min="2000"
                            max="2100"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="grossRevenue" className="block text-xs text-gray-500 mb-1">
                            Receita Bruta
                          </label>
                          <input
                            type="number"
                            id="grossRevenue"
                            value={newFinancialData.grossRevenue}
                            onChange={(e) =>
                              handleFinancialInputChange("grossRevenue", Number.parseFloat(e.target.value))
                            }
                            className="w-full h-9 text-sm border-gray-200 rounded-lg px-3"
                            min="0"
                            step="1000"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="netProfit" className="block text-xs text-gray-500 mb-1">
                            Lucro Líquido
                          </label>
                          <input
                            type="number"
                            id="netProfit"
                            value={newFinancialData.netProfit}
                            onChange={(e) => handleFinancialInputChange("netProfit", Number.parseFloat(e.target.value))}
                            className="w-full h-9 text-sm border-gray-200 rounded-lg px-3"
                            step="1000"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="ebitdaMargin" className="block text-xs text-gray-500 mb-1">
                            Margem EBITDA (%)
                          </label>
                          <input
                            type="number"
                            id="ebitdaMargin"
                            value={newFinancialData.ebitdaMargin}
                            onChange={(e) =>
                              handleFinancialInputChange("ebitdaMargin", Number.parseFloat(e.target.value))
                            }
                            className="w-full h-9 text-sm border-gray-200 rounded-lg px-3"
                            min="0"
                            max="100"
                            step="0.1"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="netDebt" className="block text-xs text-gray-500 mb-1">
                            Dívida Líquida
                          </label>
                          <input
                            type="number"
                            id="netDebt"
                            value={newFinancialData.netDebt}
                            onChange={(e) => handleFinancialInputChange("netDebt", Number.parseFloat(e.target.value))}
                            className="w-full h-9 text-sm border-gray-200 rounded-lg px-3"
                            step="1000"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="equity" className="block text-xs text-gray-500 mb-1">
                            Patrimônio Líquido
                          </label>
                          <input
                            type="number"
                            id="equity"
                            value={newFinancialData.equity}
                            onChange={(e) => handleFinancialInputChange("equity", Number.parseFloat(e.target.value))}
                            className="w-full h-9 text-sm border-gray-200 rounded-lg px-3"
                            min="0"
                            step="1000"
                            required
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          size="sm"
                          className="h-9 text-xs bg-[#002147] hover:bg-[#00326b] rounded-full"
                        >
                          Adicionar Dados
                        </Button>
                      </div>
                    </form>
                  </div>
                </Card>

                {/* Tabela de dados financeiros */}
                <Card className="border-0 shadow-sm overflow-hidden">
                  <div className="p-5">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Histórico Financeiro</h3>

                    {financialData.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Sem dados financeiros cadastrados ainda.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ano
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Receita Bruta
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Lucro Líquido
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Margem EBITDA
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Dívida Líquida
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Patrimônio Líquido
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {financialData.map((data) => (
                              <tr key={data.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{data.year}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{formatCurrency(data.grossRevenue)}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{formatCurrency(data.netProfit)}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{formatPercent(data.ebitdaMargin)}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{formatCurrency(data.netDebt)}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{formatCurrency(data.equity)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="m-0 p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Documentos</h2>
                </div>

                {/* Componente de upload */}
                <Card className="border-0 shadow-sm overflow-hidden">
                  <div className="p-5">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Upload de Documentos</h3>
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        id="document-upload"
                        className="hidden"
                        onChange={handleFileUpload}
                        accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg"
                      />
                      <label htmlFor="document-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center">
                          <FileText className="h-8 w-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">Arraste um arquivo ou clique para selecionar</span>
                          <span className="text-xs text-gray-400 mt-1">Suporta PDF, DOCX, XLSX, PNG, JPG</span>
                        </div>
                      </label>

                      {uploadingFile && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 text-blue-500 mr-2" />
                              <span className="text-sm text-blue-700">{uploadingFile.name}</span>
                            </div>
                            <div className="text-xs text-blue-600">Enviando...</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Lista de documentos */}
                <Card className="border-0 shadow-sm overflow-hidden">
                  <div className="p-5">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Documentos Enviados</h3>

                    {documents.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Nenhum documento enviado até o momento.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {documents.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 text-gray-500 mr-2" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                                <div className="text-xs text-gray-500">
                                  Enviado em {doc.uploadedAt.toLocaleDateString("pt-BR")}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs rounded-full"
                              onClick={() => window.open(doc.url, "_blank")}
                            >
                              <Download className="h-3.5 w-3.5 mr-1.5" />
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </main>
    </div>
  )
}
