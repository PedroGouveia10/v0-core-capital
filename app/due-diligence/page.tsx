"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Download, FileText, Filter, Home, Plus, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { useToast } from "@/components/ui/use-toast"
import { DDTable } from "@/components/due-diligence/dd-table"
import { DDForm } from "@/components/due-diligence/dd-form"
import { DDDetailDrawer } from "@/components/due-diligence/dd-detail-drawer"
import type { DDFilters, DueDiligence } from "@/types/due-diligence"

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
]

export default function DueDiligencePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
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

  // Efeito para carregar filtros da URL
  useEffect(() => {
    const companyId = searchParams.get("company")
    if (companyId) {
      setFilters((prev) => ({ ...prev, companyId: Number.parseInt(companyId) }))
    }
  }, [searchParams])

  // Filtrar itens
  const filteredItems = items.filter((item) => {
    // Filtro por termo de busca
    if (
      searchTerm &&
      !item.item.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !item.recommendation.toLowerCase().includes(searchTerm.toLowerCase())
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
    setIsEditing(true)
    setIsDetailOpen(false)
    setIsFormOpen(true)
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
    if (isEditing) {
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
            <span className="text-gray-900 font-medium">Due Diligence</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-medium text-gray-900">Due Diligence</h1>
          <div className="flex space-x-2">
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

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar com filtros */}
          <div className="col-span-12 md:col-span-3">
            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="p-5 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </h3>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={handleClearFilters}>
                    <X className="h-3.5 w-3.5 mr-1" />
                    Limpar
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="company" className="text-xs">
                      Empresa
                    </Label>
                    <Select
                      value={filters.companyId?.toString() || "null"}
                      onValueChange={(value) =>
                        handleFiltersChange("companyId", value === "null" ? null : Number.parseInt(value))
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
                      value={filters.type || "null"}
                      onValueChange={(value) => handleFiltersChange("type", value === "null" ? null : value)}
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
                      value={filters.status || "null"}
                      onValueChange={(value) => handleFiltersChange("status", value === "null" ? null : value)}
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
                      value={filters.risk || "null"}
                      onValueChange={(value) => handleFiltersChange("risk", value === "null" ? null : value)}
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
              </div>
            </Card>
          </div>

          {/* Conteúdo principal */}
          <div className="col-span-12 md:col-span-9">
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
                  <DDTable items={filteredItems} onItemClick={handleItemClick} />
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
                          className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handleItemClick(item)}
                        >
                          <div className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center">
                                {item.risk === "Baixo" && (
                                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                                )}
                                {item.risk === "Médio" && (
                                  <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                                )}
                                {item.risk === "Alto" && <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>}
                                <span className="text-xs font-medium bg-gray-100 px-2 py-0.5 rounded-full">
                                  {item.type}
                                </span>
                              </div>
                              <div className="text-xs">
                                {item.status === "Pendente" && <span className="text-amber-600">Pendente</span>}
                                {item.status === "Em andamento" && <span className="text-blue-600">Em andamento</span>}
                                {item.status === "Concluído" && <span className="text-green-600">Concluído</span>}
                              </div>
                            </div>
                            <h3 className="font-medium text-gray-900 mb-1">{item.item}</h3>
                            <p className="text-xs text-gray-500 mb-3">{item.companyName}</p>
                            <p className="text-xs text-gray-600 line-clamp-2">{item.recommendation}</p>
                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                              <span className="text-xs text-gray-500">
                                {new Date(item.updatedAt).toLocaleDateString()}
                              </span>
                              {item.document && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 rounded-full"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    // Simulação de download
                                    alert(`Download do documento: ${item.document?.name}`)
                                  }}
                                >
                                  <Download className="h-3.5 w-3.5 text-gray-500" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
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
              initialData={isEditing ? selectedItem || undefined : undefined}
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
            {selectedItem && <DDDetailDrawer item={selectedItem} onEdit={handleEditItem} onDelete={handleDeleteItem} />}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
