"use client"

import { ArrowRight, Building, Calendar, CheckCircle, Clock, FileText, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { Company, DueDiligenceItem } from "@/types"
import { getDDStatsByCompany } from "@/data/mock-data"

interface CompanyDrawerProps {
  company: Company
  items: DueDiligenceItem[]
  onViewAll: () => void
}

export function CompanyDrawer({ company, items, onViewAll }: CompanyDrawerProps) {
  const stats = getDDStatsByCompany(company.id)

  // Encontrar itens de alto risco
  const highRiskItems = items.filter((item) => item.risco === "Alto")

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">{company.nome}</h2>
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <Building className="h-4 w-4 mr-1" />
            <span>{company.setor}</span>
            {company.regulado && (
              <Badge className="ml-2 bg-purple-100 text-purple-800 border-purple-200">Regulado</Badge>
            )}
          </div>
        </div>
        <Button onClick={onViewAll}>
          <FileText className="h-4 w-4 mr-2" />
          Ver Due Diligence
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Status</h3>
            <span className="text-xs text-gray-500">{stats.total} itens</span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                  Concluídos
                </span>
                <span>{stats.concluidos}</span>
              </div>
              <Progress value={(stats.concluidos / stats.total) * 100} className="h-1.5 bg-gray-200" />
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center">
                  <Clock className="h-3 w-3 text-amber-500 mr-1" />
                  Em Análise
                </span>
                <span>{stats.emAnalise}</span>
              </div>
              <Progress value={(stats.emAnalise / stats.total) * 100} className="h-1.5 bg-gray-200" />
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center">
                  <AlertTriangle className="h-3 w-3 text-red-500 mr-1" />
                  Pendentes
                </span>
                <span>{stats.pendentes}</span>
              </div>
              <Progress value={(stats.pendentes / stats.total) * 100} className="h-1.5 bg-gray-200" />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-2">Riscos Identificados</h3>
          {highRiskItems.length > 0 ? (
            <div className="space-y-2">
              {highRiskItems.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-start">
                  <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 mr-2 flex-shrink-0"></div>
                  <div className="text-xs">
                    <p className="font-medium">{item.item}</p>
                    <p className="text-gray-500 mt-0.5 line-clamp-1">{item.recomendacao}</p>
                  </div>
                </div>
              ))}
              {highRiskItems.length > 3 && (
                <div className="text-xs text-blue-600 mt-1">+ {highRiskItems.length - 3} outros riscos</div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-500">Nenhum item de alto risco identificado</div>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-2">Informações</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Total de Itens</span>
              <span className="font-medium">{stats.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Itens de Alto Risco</span>
              <span className="font-medium">{stats.altosRiscos}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Última Atualização</span>
              <span className="font-medium flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
                {stats.ultimaAtualizacao ? stats.ultimaAtualizacao.toLocaleDateString() : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <Button variant="outline" className="w-full" onClick={onViewAll}>
          Ver Due Diligence Completa
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
