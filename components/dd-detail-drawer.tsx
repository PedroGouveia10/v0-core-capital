"use client"

import { Check, Clock, Download, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { DueDiligenceItem } from "@/types"

interface DDDetailDrawerProps {
  item: DueDiligenceItem
  onEdit: () => void
  onDelete: () => void
}

export function DDDetailDrawer({ item, onEdit, onDelete }: DDDetailDrawerProps) {
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
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Empresa</h3>
          <p className="text-base font-medium">{item.empresa_nome}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Tipo de DD</h3>
          <Badge variant="outline" className="font-normal">
            {item.tipo_de_dd}
          </Badge>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Item</h3>
          <p className="text-base">{item.item}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
          {renderStatus(item.status)}
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Nível de Risco</h3>
          {renderRisco(item.risco)}
        </div>

        <div className="md:col-span-2">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Recomendação</h3>
          <p className="text-sm text-gray-700">{item.recomendacao}</p>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Documento</h3>
          {item.documento ? (
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-sm"
              onClick={() => {
                // Simulação de download
                alert(`Download do documento: ${item.documento?.nome}`)
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              {item.documento.nome}
            </Button>
          ) : (
            <span className="text-gray-400 text-sm">Nenhum documento anexado</span>
          )}
        </div>

        {item.observacoes_tecnicas && (
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Observações Técnicas</h3>
            <p className="text-sm text-gray-700">{item.observacoes_tecnicas}</p>
          </div>
        )}

        {item.exigencias_regulatorias && item.exigencias_regulatorias.length > 0 && (
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Exigências Regulatórias</h3>
            <div className="flex flex-wrap gap-2">
              {item.exigencias_regulatorias.map((req, index) => (
                <Badge key={index} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {req}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="md:col-span-2 border-t border-gray-200 pt-4 mt-2">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <div>Criado em: {item.data_criacao.toLocaleDateString()}</div>
            <div>Atualizado em: {item.data_atualizacao.toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
        <Button variant="outline" size="sm" onClick={onDelete}>
          Excluir
        </Button>
        <Button size="sm" onClick={onEdit}>
          Editar
        </Button>
      </div>
    </div>
  )
}
