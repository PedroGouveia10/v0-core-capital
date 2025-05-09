"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Building, ChevronRight, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Breadcrumb } from "@/components/breadcrumb"
import { CompanyDrawer } from "@/components/company-drawer"
import type { Company } from "@/types"
import { mockCompanies, mockDDItems } from "@/data/mock-data"

export default function PipelinePage() {
  const router = useRouter()

  // Estados
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Handlers
  const handleCompanyClick = (company: Company) => {
    setSelectedCompany(company)
    setIsDrawerOpen(true)
  }

  const handleViewDueDiligence = () => {
    if (selectedCompany) {
      router.push(`/due-diligence?company=${selectedCompany.id}`)
    }
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold">Pipeline de Empresas</h1>
                <Breadcrumb items={[{ label: "Dashboard", href: "/" }, { label: "Pipeline" }]} />
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCompanies.map((company) => {
              const companyItems = mockDDItems.filter((item) => item.empresa_id === company.id)
              const highRiskCount = companyItems.filter((item) => item.risco === "Alto").length

              return (
                <Card
                  key={company.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleCompanyClick(company)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-lg font-medium">{company.nome}</h2>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <Building className="h-4 w-4 mr-1" />
                          <span>{company.setor}</span>
                          {company.regulado && (
                            <Badge className="ml-2 bg-purple-100 text-purple-800 border-purple-200">Regulado</Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedCompany(company)
                          handleViewDueDiligence()
                        }}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-gray-500">Due Diligence:</span>{" "}
                        <span className="font-medium">{companyItems.length} itens</span>
                      </div>
                      {highRiskCount > 0 && (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          {highRiskCount} {highRiskCount === 1 ? "risco alto" : "riscos altos"}
                        </Badge>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-4 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    >
                      Ver detalhes
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </main>

        {/* Drawer para detalhes da empresa */}
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerContent className="max-h-[90vh]">
            <div className="max-w-4xl mx-auto w-full">
              {selectedCompany && (
                <CompanyDrawer
                  company={selectedCompany}
                  items={mockDDItems.filter((item) => item.empresa_id === selectedCompany.id)}
                  onViewAll={handleViewDueDiligence}
                />
              )}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </TooltipProvider>
  )
}
