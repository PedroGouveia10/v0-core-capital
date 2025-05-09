"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Download, FileText, Filter, Home, Plus, Search, X, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { useToast } from "@/components/ui/use-toast"
import { DDForm } from "@/components/due-diligence/dd-form"
import type { DDFilters, DueDiligence, DDStatus, DDRisk, DDType } from "@/types/due-diligence"

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
    companyId: 2,
    companyName: "DataSync Analytics",
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
    companyId: 3,
    companyName: "CloudSecure Solutions",
    type: "Regulatório",
    item: "Conformidade com LGPD",
    status: "Pendente",
    risk: "Alto",
    recommendation: "Necessário implementar medidas de proteção de dados sensíveis",
    regulatoryRequirements: ["LGPD", "ISO 27001", "PCI DSS"],
    createdAt: new Date("2023-10-20"),
    updatedAt: new Date("2023-10-20"),
  },
  {
    id: "dd-004",
    companyId: 1,
    companyName: "TechFlow SaaS",
    type: "Tecnologia",
    item: "Avaliação de Escalabilidade",
    status: "Em andamento",
    risk: "Médio",
    recommendation: "Identificados gargalos potenciais em alta carga. Recomendado implementar cache distribuído.",
    technicalNotes: "Testes de carga revelaram degradação de performance acima de 10k usuários simultâneos.",
    createdAt: new Date("2023-10-22"),
    updatedAt: new Date("2023-10-25"),
  },
  {
    id: "dd-005",
    companyId: 4,
    companyName: "EduTech Platform",
    type: "Jurídico",
    item: "Análise de Termos de Uso",
    status: "Concluído",
    risk: "Baixo",
    recommendation: "Termos de uso adequados, apenas sugestões menores de clareza.",
    document: {
      name: "analise-termos.pdf",
      url: "#",
      type: "application/pdf",
    },
    createdAt: new Date("2023-10-10"),
    updatedAt: new Date("2023-10-15"),
  },
]

export default function DueDiligenceCadastroPage() {
  const router = useRouter()
  const { toast } = useToast()

  // Estados
  const [items, setItems] = useState<DueDiligence[]>(initialDueDiligenceItems)
  const [filters, setFilters] = useState<DDFilters>({
    companyId: null,
    type: null,
    status: null,
    risk: null,
    onlyRegulated: false,
  })
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<DueDiligence | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("table")
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)

  // Filtrar itens
  const filteredItems = items.filter((item) => {
    // Filtro por termo de busca
    if (
      searchTerm &&
      !item.item.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !item.recommendation.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !item.companyName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !item.type.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    // Filtro por empresa
    if (filters.companyId !== null && item.companyId !== filters.companyId) {
      return false
    }

    // Filtro por tipo
    if (filters.type !== null && item.type !== filters.type) {
      return false
    }

    // Filtro por status
    if (filters.status !== null && item.status !== filters.status) {
      return false
    }

    // Filtro por risco
    if (filters.risk !== null && item.risk !== filters.risk) {
      return false
    }

    // Filtro por empresas reguladas
    if (filters.onlyRegulated) {
      const company = companies.find((c) => c.id === item.companyId)
      if (!company?.regulated) {
        return false
      }
    }

    return true
  })

  // Estatísticas
  const totalItems = items.length
  const pendingItems = items.filter((item) => item.status === "Pendente").length
  const inProgressItems = items.filter((item) => item.status === "Em andamento").length
  const completedItems = items.filter((item) => item.status === "Concluído").length
  const highRiskItems = items.filter((item) => item.risk === "Alto").length
  const mediumRiskItems = items.filter((item) => item.risk === "Médio").length
  const lowRiskItems = items.filter((item) => item.risk === "Baixo").length

  // Handlers
  const handleItemClick = (item: DueDiligence) => {
    setSelectedItem(item)
    setIsDetailOpen(true)
  }

  const handleAddItem = () => {
    setSelectedItem(null)
    setIsEditing(false)
    setIsFormOpen(true)
  }

  const handleEditItem = () => {
    if (selectedItem) {
      setIsEditing(true)
      setIsDetailOpen(false)
      setIsFormOpen(true)
    }
  }

  const handleDeleteItem = () => {
    if (selectedItem) {
      setItems(items.filter((item) => item.id !== selectedItem.id))
      setIsDetailOpen(false)
      setSelectedItem(null)

      toast({
        title: "Item excluído",
        description: "O item de due diligence foi excluído com sucesso.",
      })
    }
  }

  const handleFormSubmit = (item: DueDiligence) => {
    if (isEditing && selectedItem) {
      // Atualizar item existente
      setItems(items.map((i) => (i.id === item.id ? item : i)))
      toast({
        title: "Item atualizado",
        description: "O item de due diligence foi atualizado com sucesso.",
      })
    } else {
      // Adicionar novo item
      setItems([item, ...items])
      toast({
        title: "Item adicionado",
        description: "O item de due diligence foi adicionado com sucesso.",
      })
    }

    setIsFormOpen(false)
    setSelectedItem(null)
  }

  const handleFiltersChange = (field: keyof DDFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleClearFilters = () => {
    setFilters({
      companyId: null,
      type: null,
      status: null,
      risk: null,
      onlyRegulated: false,
    })
    setSearchTerm("")
  }

  const handleExportReport = () => {
    toast({
      title: "Exportando relatório",
      description: "O relatório será gerado e baixado em breve.",
    })
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
              placeholder="Buscar itens de DD..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 pl-8 pr-4 w-[280px] md:w-[340px] text-sm border-0 bg-gray-50 focus:ring-0 focus:border-b focus:border-gray-200 rounded-lg"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-9 text-xs font-normal rounded-full px-4"
            onClick={() => router.push("/crm")}
          >
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
            <span className="text-gray-900 font-medium">Cadastro de Due Diligence</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-medium text-gray-900">Cadastro de Due Diligence</h1>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs rounded-full"
              onClick={() => setIsFilterDrawerOpen(true)}
            >
              <Filter className="mr-1.5 h-3.5 w-3.5" />
              Filtros
            </Button>
            <Button variant="outline" size="sm" className="h-9 text-xs rounded-full" onClick={handleExportReport}>
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Exportar Relatório
            </Button>
            <Button
              size="sm"
              className="h-9 text-xs bg-[#002147] hover:bg-[#00326b] rounded-full"
              onClick={handleAddItem}
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Novo Item
            </Button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border-0 shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Status</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-yellow-50 rounded-lg p-3 text-center">
                <Clock className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
                <div className="text-lg font-semibold text-yellow-700">{pendingItems}</div>
                <div className="text-xs text-yellow-600">Pendentes</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <AlertTriangle className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                <div className="text-lg font-semibold text-blue-700">{inProgressItems}</div>
                <div className="text-xs text-blue-600">Em andamento</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <CheckCircle className="h-5 w-5 text-green-500 mx-auto mb-1" />
                <div className="text-lg font-semibold text-green-700">{completedItems}</div>
                <div className="text-xs text-green-600">Concluídos</div>
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Nível de Risco</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-red-50 rounded-lg p-3 text-center">
                <div className="h-2 w-2 rounded-full bg-red-500 mx-auto mb-1"></div>
                <div className="text-lg font-semibold text-red-700">{highRiskItems}</div>
                <div className="text-xs text-red-600">Alto</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3 text-center">
                <div className="h-2 w-2 rounded-full bg-yellow-500 mx-auto mb-1"></div>
                <div className="text-lg font-semibold text-yellow-700">{mediumRiskItems}</div>
                <div className="text-xs text-yellow-600">Médio</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="h-2 w-2 rounded-full bg-green-500 mx-auto mb-1"></div>
                <div className="text-lg font-semibold text-green-700">{lowRiskItems}</div>
                <div className="text-xs text-green-600">Baixo</div>
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Empresas</h3>
            <div className="space-y-2">
              {companies.map((company) => {
                const companyItems = items.filter((item) => item.companyId === company.id)
                const companyHighRisk = companyItems.filter((item) => item.risk === "Alto").length

                return (
                  <div key={company.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium">{company.name}</div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-gray-100 text-gray-800">{companyItems.length}</Badge>
                      {companyHighRisk > 0 && <Badge className="bg-red-100 text-red-800">{companyHighRisk}</Badge>}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        <Card className="border-0 shadow-sm overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b border-gray-100">
              <div className="px-6">
                <TabsList className="bg-transparent h-12 p-0">
                  <TabsTrigger
                    value="table"
                    className="text-sm h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-[#002147] data-[state=active]:text-[#002147] px-4"
                  >
                    Tabela
                  </TabsTrigger>
                  <TabsTrigger
                    value="cards"
                    className="text-sm h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-[#002147] data-[state=active]:text-[#002147] px-4"
                  >
                    Cards
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <TabsContent value="table" className="m-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Empresa
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Risco
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Atualizado
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">
                          Nenhum item de due diligence encontrado
                        </td>
                      </tr>
                    ) : (
                      filteredItems.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleItemClick(item)}
                        >
                          <td className="px-4 py-3 text-sm text-gray-900">{item.companyName}</td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className="font-normal">
                              {item.type}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.item}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              {getStatusIcon(item.status)}
                              <span className="ml-1 text-sm">{item.status}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className={getRiskBadgeColor(item.risk)}>
                              {item.risk}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {new Date(item.updatedAt).toLocaleDateString("pt-BR")}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 rounded-full"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleItemClick(item)
                              }}
                            >
                              <FileText className="h-4 w-4 text-gray-500" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="cards" className="m-0 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum item encontrado</h3>
                    <p className="text-sm text-gray-500 mb-6">
                      Tente ajustar os filtros ou adicione um novo item de due diligence.
                    </p>
                    <Button
                      size="sm"
                      className="h-9 text-xs bg-[#002147] hover:bg-[#00326b] rounded-full"
                      onClick={handleAddItem}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      Adicionar Item
                    </Button>
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <Card
                      key={item.id}
                      className={`overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${getRiskColor(item.risk)}`}
                      onClick={() => handleItemClick(item)}
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="outline" className="bg-gray-100 text-gray-800">
                            {item.type}
                          </Badge>
                          <Badge variant="outline" className={getRiskBadgeColor(item.risk)}>
                            {item.risk}
                          </Badge>
                        </div>
                        <h3 className="font-medium text-gray-900 mb-1">{item.item}</h3>
                        <p className="text-xs text-gray-500 mb-3">{item.companyName}</p>
                        <p className="text-xs text-gray-600 line-clamp-2">{item.recommendation}</p>
                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center text-xs text-gray-500">
                            {getStatusIcon(item.status)}
                            <span className="ml-1">{item.status}</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(item.updatedAt).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </main>

      {/* Botão flutuante para adicionar (mobile) */}
      <div className="md:hidden fixed bottom-6 right-6">
        <Button
          size="icon"
          className="h-12 w-12 rounded-full bg-[#002147] hover:bg-[#00326b] shadow-md"
          onClick={handleAddItem}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Modal para formulário */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden rounded-xl">
          <DialogHeader className="px-6 py-4 border-b border-gray-100">
            <DialogTitle className="text-lg font-medium">
              {isEditing ? "Editar Item de Due Diligence" : "Novo Item de Due Diligence"}
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            <DDForm
              companies={companies}
              initialData={isEditing && selectedItem ? selectedItem : undefined}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Drawer para detalhes */}
      <Drawer open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DrawerContent className="max-h-[90vh]">
          <div className="max-w-4xl mx-auto w-full">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Detalhes do Item de Due Diligence</h2>
            </div>
            {selectedItem && (
              <div className="p-6 space-y-6">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline" className="bg-gray-100 text-gray-800">
                    {selectedItem.type}
                  </Badge>
                  <Badge variant="outline" className={getRiskBadgeColor(selectedItem.risk)}>
                    {selectedItem.risk}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    {getStatusIcon(selectedItem.status)}
                    <span className="ml-1">{selectedItem.status}</span>
                  </Badge>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{selectedItem.item}</h3>
                  <p className="text-sm text-gray-500">Empresa: {selectedItem.companyName}</p>
                  <p className="text-sm text-gray-500">
                    Atualizado em {new Date(selectedItem.updatedAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Recomendação</h4>
                  <p className="text-sm text-gray-600">{selectedItem.recommendation}</p>
                </div>

                {selectedItem.technicalNotes && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-700 mb-2">Observações Técnicas</h4>
                    <p className="text-sm text-blue-600">{selectedItem.technicalNotes}</p>
                  </div>
                )}

                {selectedItem.document && (
                  <div className="border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700">{selectedItem.document.name}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs rounded-full"
                      onClick={() => window.open(selectedItem.document?.url, "_blank")}
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
                    onClick={handleDeleteItem}
                  >
                    Excluir
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 text-xs rounded-full"
                    onClick={handleEditItem}
                  >
                    Editar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      {/* Drawer para filtros (mobile) */}
      <Drawer open={isFilterDrawerOpen} onOpenChange={setIsFilterDrawerOpen}>
        <DrawerContent className="max-h-[90vh]">
          <div className="max-w-4xl mx-auto w-full">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Filtros</h2>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={handleClearFilters}>
                  <X className="h-3.5 w-3.5 mr-1" />
                  Limpar
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="company" className="text-xs">
                    Empresa
                  </Label>
                  <Select
                    value={filters.companyId?.toString() || " "}
                    onValueChange={(value) =>
                      handleFiltersChange("companyId", value === " " ? null : Number.parseInt(value))
                    }
                  >
                    <SelectTrigger id="company" className="h-9">
                      <SelectValue placeholder="Todas as empresas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas as empresas</SelectItem>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id.toString()}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="type" className="text-xs">
                    Tipo de DD
                  </Label>
                  <Select
                    value={filters.type || " "}
                    onValueChange={(value) => handleFiltersChange("type", value === " " ? null : (value as DDType))}
                  >
                    <SelectTrigger id="type" className="h-9">
                      <SelectValue placeholder="Todos os tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os tipos</SelectItem>
                      <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                      <SelectItem value="Jurídico">Jurídico</SelectItem>
                      <SelectItem value="Financeiro">Financeiro</SelectItem>
                      <SelectItem value="Regulatório">Regulatório</SelectItem>
                      <SelectItem value="Operacional">Operacional</SelectItem>
                      <SelectItem value="Comercial">Comercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="status" className="text-xs">
                    Status
                  </Label>
                  <Select
                    value={filters.status || " "}
                    onValueChange={(value) => handleFiltersChange("status", value === " " ? null : (value as DDStatus))}
                  >
                    <SelectTrigger id="status" className="h-9">
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os status</SelectItem>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                      <SelectItem value="Em andamento">Em andamento</SelectItem>
                      <SelectItem value="Concluído">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="risk" className="text-xs">
                    Nível de Risco
                  </Label>
                  <Select
                    value={filters.risk || " "}
                    onValueChange={(value) => handleFiltersChange("risk", value === " " ? null : (value as DDRisk))}
                  >
                    <SelectTrigger id="risk" className="h-9">
                      <SelectValue placeholder="Todos os níveis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os níveis</SelectItem>
                      <SelectItem value="Baixo">Baixo</SelectItem>
                      <SelectItem value="Médio">Médio</SelectItem>
                      <SelectItem value="Alto">Alto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="only-regulated"
                    checked={filters.onlyRegulated}
                    onCheckedChange={(checked) => handleFiltersChange("onlyRegulated", !!checked)}
                  />
                  <Label htmlFor="only-regulated" className="text-xs font-normal cursor-pointer">
                    Apenas empresas reguladas
                  </Label>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  {filteredItems.length} {filteredItems.length === 1 ? "item encontrado" : "itens encontrados"}
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  size="sm"
                  className="h-9 text-xs bg-[#002147] hover:bg-[#00326b] rounded-full"
                  onClick={() => setIsFilterDrawerOpen(false)}
                >
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
