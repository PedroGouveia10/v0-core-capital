"use client"

import { Check, Clock, Download, FileText, RefreshCw } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { DueDiligence } from "@/types/due-diligence"

interface DDTableProps {
  items: DueDiligence[]
  onItemClick: (item: DueDiligence) => void
}

export function DDTable({ items, onItemClick }: DDTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Tipo</TableHead>
            <TableHead>Item</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="w-[100px]">Risco</TableHead>
            <TableHead className="w-[180px]">Empresa</TableHead>
            <TableHead className="w-[200px]">Recomendação</TableHead>
            <TableHead className="w-[80px]">Documento</TableHead>
            <TableHead className="w-[80px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-32 text-center text-gray-500">
                Nenhum item de due diligence encontrado
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id} className="cursor-pointer hover:bg-gray-50" onClick={() => onItemClick(item)}>
                <TableCell>
                  <Badge variant="outline" className="font-normal">
                    {item.type}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{item.item}</TableCell>
                <TableCell>
                  {item.status === "Pendente" && (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50">
                      <Clock className="h-3 w-3 mr-1" />
                      Pendente
                    </Badge>
                  )}
                  {item.status === "Em andamento" && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50">
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Em andamento
                    </Badge>
                  )}
                  {item.status === "Concluído" && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50">
                      <Check className="h-3 w-3 mr-1" />
                      Concluído
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {item.risk === "Baixo" && (
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      <span>Baixo</span>
                    </div>
                  )}
                  {item.risk === "Médio" && (
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                      <span>Médio</span>
                    </div>
                  )}
                  {item.risk === "Alto" && (
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                      <span>Alto</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>{item.companyName}</TableCell>
                <TableCell>
                  <p className="max-w-[200px] truncate text-sm text-gray-600">{item.recommendation}</p>
                </TableCell>
                <TableCell>
                  {item.document ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Simulação de download
                        alert(`Download do documento: ${item.document?.name}`)
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
  )
}
