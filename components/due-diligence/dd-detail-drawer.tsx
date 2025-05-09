"use client"

import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import type { DueDiligence, DDRisk, DDStatus } from "@/types/due-diligence"

interface DDDetailDrawerProps {
  item: DueDiligence
  onEdit: () => void
  onDelete: () => void
}

export function DDDetailDrawer({ item, onEdit, onDelete }: DDDetailDrawerProps) {
  // Função para obter ícone de status
  const getStatusColor = (status: DDStatus) => {
    switch (status) {
      case "Pendente":
        return "bg-yellow-100 text-yellow-800"
      case "Em andamento":
        return "bg-blue-100 text-blue-800"
      case "Concluído":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Função para obter cor de risco
  const getRiskColor = (risk: DDRisk) => {
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
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 mb-2">
        <Badge variant="outline" className="bg-gray-100 text-gray-800">
          {item.type}
        </Badge>
        <Badge variant="outline" className={getRiskColor(item.risk)}>
          {item.risk}
        </Badge>
        <Badge variant="outline" className={getStatusColor(item.status)}>
          {item.status}
        </Badge>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">{item.item}</h3>
        <p className="text-sm text-gray-500">Atualizado em {new Date(item.updatedAt).toLocaleDateString("pt-BR")}</p>
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

      {item.regulatoryRequirements && item.regulatoryRequirements.length > 0 && (
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-purple-700 mb-2">Exigências Regulatórias</h4>
          <div className="flex flex-wrap gap-2">
            {item.regulatoryRequirements.map((req, index) => (
              <Badge key={index} variant="outline" className="bg-purple-100 text-purple-800">
                {req}
              </Badge>
            ))}
          </div>
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
          onClick={onDelete}
        >
          Excluir
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="sm" className="h-9 text-xs rounded-full" onClick={onEdit}>
              Editar
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>
    </div>
  )
}
