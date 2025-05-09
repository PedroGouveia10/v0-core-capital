"use client"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { DDFilters, DDRisk, DDStatus, DDType } from "@/types"
import { mockCompanies } from "@/data/mock-data"

interface DDFiltersSidebarProps {
  filters: DDFilters
  onFiltersChange: (filters: DDFilters) => void
  onClearFilters: () => void
}

export function DDFiltersSidebar({ filters, onFiltersChange, onClearFilters }: DDFiltersSidebarProps) {
  const handleEmpresaChange = (value: string) => {
    onFiltersChange({
      ...filters,
      empresa_id: value ? Number(value) : null,
    })
  }

  const handleTipoChange = (value: string) => {
    onFiltersChange({
      ...filters,
      tipo_de_dd: (value as DDType) || null,
    })
  }

  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      status: (value as DDStatus) || null,
    })
  }

  const handleRiscoChange = (value: string) => {
    onFiltersChange({
      ...filters,
      risco: (value as DDRisk) || null,
    })
  }

  const handleReguladasChange = (checked: boolean) => {
    onFiltersChange({
      ...filters,
      apenas_reguladas: checked,
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </h3>
        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={onClearFilters}>
          <X className="h-3.5 w-3.5 mr-1" />
          Limpar
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="empresa" className="text-xs">
            Empresa
          </Label>
          <Select value={filters.empresa_id?.toString() || ""} onValueChange={handleEmpresaChange}>
            <SelectTrigger id="empresa" className="h-9">
              <SelectValue placeholder="Todas as empresas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as empresas</SelectItem>
              {mockCompanies.map((company) => (
                <SelectItem key={company.id} value={company.id.toString()}>
                  {company.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tipo" className="text-xs">
            Tipo de DD
          </Label>
          <Select value={filters.tipo_de_dd || ""} onValueChange={handleTipoChange}>
            <SelectTrigger id="tipo" className="h-9">
              <SelectValue placeholder="Todos os tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Técnica">Técnica</SelectItem>
              <SelectItem value="Jurídica">Jurídica</SelectItem>
              <SelectItem value="Financeira">Financeira</SelectItem>
              <SelectItem value="Regulatória">Regulatória</SelectItem>
              <SelectItem value="Operacional">Operacional</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="status" className="text-xs">
            Status
          </Label>
          <Select value={filters.status || ""} onValueChange={handleStatusChange}>
            <SelectTrigger id="status" className="h-9">
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Em Análise">Em Análise</SelectItem>
              <SelectItem value="Concluído">Concluído</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="risco" className="text-xs">
            Nível de Risco
          </Label>
          <Select value={filters.risco || ""} onValueChange={handleRiscoChange}>
            <SelectTrigger id="risco" className="h-9">
              <SelectValue placeholder="Todos os níveis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Baixo">Baixo</SelectItem>
              <SelectItem value="Médio">Médio</SelectItem>
              <SelectItem value="Alto">Alto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Checkbox id="apenas-reguladas" checked={filters.apenas_reguladas} onCheckedChange={handleReguladasChange} />
          <Label htmlFor="apenas-reguladas" className="text-xs font-normal cursor-pointer">
            Apenas empresas reguladas
          </Label>
        </div>
      </div>
    </div>
  )
}
