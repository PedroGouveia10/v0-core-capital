"use client"

import { useState } from "react"
import { ArrowUpDown, Check, Clock, Download, FileText, RefreshCw } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { DueDiligenceItem } from "@/types"

interface DDTableProps {
  items: DueDiligenceItem[]
  onItemClick: (item: DueDiligenceItem) => void
}

export function DDTable({ items, onItemClick }: DDTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const sortedItems = [...items].sort((a, b) => {
    if (!sortColumn) return 0

    let valueA, valueB

    switch (sortColumn) {
      case "tipo":
        valueA = a.tipo_de_dd
        valueB = b.tipo_de_dd
        break
      case "item":
        valueA = a.item
        valueB = b.item
        break
      case "status":
        valueA = a.status
        valueB = b.status
        break
      case "risco":
        valueA = a.risco
        valueB = b.risco
        break
      case "empresa":
        valueA = a.empresa_nome
        valueB = b.empresa_nome
        break
      default:
        return 0
    }

    if (valueA < valueB) {
      return sortDirection === "asc" ? -1 : 1
    }
    if (valueA > valueB) {
      return sortDirection === "asc" ? 1 : -1
    }
    return 0
  })

  const renderStatus = (status: string) => {
    switch (status) {
      case "Pendente":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <Clock className="h-3 w-3 mr-1" />
            Pendente
          </Badge>
        )
      case "Em Análise":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <RefreshCw className="h-3 w-3 mr-1" />
            Em Análise
          </Badge>
        )
      case "Concluído":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Check className="h-3 w-3 mr-1" />
            Concluído
          </Badge>
        )
      default:
        return null
    }
  }

  const renderRisco = (risco: string) => {
    switch (risco) {
      case "Baixo":
        return (
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
            <span>Baixo</span>
          </div>
        )
      case "Médio":
        return (
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
            <span>Médio</span>
          </div>
        )
      case "Alto":
        return (
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
            <span>Alto</span>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">
                <Button variant="ghost" size="sm" className="h-8 p-0 font-medium" onClick={() => handleSort("tipo")}>
                  Tipo de DD
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" className="h-8 p-0 font-medium" onClick={() => handleSort("item")}>
                  Item
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="w-[120px]">
                <Button variant="ghost" size="sm" className="h-8 p-0 font-medium" onClick={() => handleSort("status")}>
                  Status
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="w-[100px]">
                <Button variant="ghost" size="sm" className="h-8 p-0 font-medium" onClick={() => handleSort("risco")}>
                  Risco
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="w-[180px]">
                <Button variant="ghost" size="sm" className="h-8 p-0 font-medium" onClick={() => handleSort("empresa")}>
                  Empresa
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="w-[200px]">Recomendação</TableHead>
              <TableHead className="w-[80px]">Documento</TableHead>
              <TableHead className="w-[80px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-gray-500">
                  Nenhum item de due diligence encontrado
                </TableCell>
              </TableRow>
            ) : (
              sortedItems.map((item) => (
                <TableRow key={item.id} className="cursor-pointer hover:bg-gray-50" onClick={() => onItemClick(item)}>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {item.tipo_de_dd}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{item.item}</TableCell>
                  <TableCell>{renderStatus(item.status)}</TableCell>
                  <TableCell>{renderRisco(item.risco)}</TableCell>
                  <TableCell>{item.empresa_nome}</TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="max-w-[200px] truncate text-sm text-gray-600">{item.recomendacao}</p>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-md">
                          <p className="text-sm">{item.recomendacao}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    {item.documento ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Simulação de download
                          alert(`Download do documento: ${item.documento?.nome}`)
                        }}
                      >
                        <Download className="h-4 w-4 text-gray-500" />
                      </Button>
                    ) : (
                      <span className="text-gray-400 text-xs">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        onItemClick(item)
                      }}
                    >
                      <FileText className="h-4 w-4 text-gray-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
