"use client"

import { Check, Clock, Download, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { DueDiligence } from "@/types/due-diligence"

interface DDDrawerProps {
  item: DueDiligence
  onEdit: () => void
  onClose: () => void
}

export function DDDrawer({ item, onEdit, onClose }: DDDrawerProps) {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Item</h3>
          <p className="text-sm text-gray-700">{item.item}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Status</h3>
          <div>
            {item.status === "Pendente" && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50">
                <Clock className="h-3 w-3 mr-1" />
                Pendente
              </Badge>
            )}
            {item.status === "Em Análise" && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50">
                <RefreshCw className="h-3 w-3 mr-1" />
                Em Análise
              </Badge>
            )}
            {item.status === "Concluído" && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50">
                <Check className="h-3 w-3 mr-1" />
                Concluído
              </Badge>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Nível de Risco</h3>
          <div>
            {item.risk === "Baixo" && (
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm">Baixo</span>
              </div>
            )}
            {item.risk === "Médio" && (
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                <span className="text-sm">Médio</span>
              </div>
            )}
            {item.risk === "Alto" && (
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm">Alto</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Documento</h3>
          {item.documentUrl ? (
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs rounded-full"
              onClick={() => {
                // Simulação de download
                alert(`Download do documento: ${item.documentName}`)
              }}
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              {item.documentName}
            </Button>
          ) : (
            <span className="text-gray-400 text-sm">Nenhum documento anexado</span>
          )}
        </div>

        <div className="md:col-span-2">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Recomendação</h3>
          <p className="text-sm text-gray-700">{item.recommendation}</p>
        </div>

        {/* Campos adicionais para empresas reguladas */}
        {item.regulatoryRequirement && (
          <>
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Exigências Regulatórias</h3>
              <div className="flex flex-wrap gap-2">
                {item.regulatoryRequirement.map((req, index) => (
                  <Badge key={index} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    {req}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Observações Técnicas</h3>
              <p className="text-sm text-gray-700">{item.technicalNotes}</p>
            </div>
          </>
        )}

        <div className="md:col-span-2 border-t border-gray-100 pt-4 mt-2">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <div>Criado em: {item.createdAt.toLocaleDateString()}</div>
            <div>Atualizado em: {item.updatedAt.toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-6">
        <Button variant="outline" size="sm" className="h-9 text-xs rounded-full" onClick={onClose}>
          Fechar
        </Button>
        <Button size="sm" className="h-9 text-xs bg-[#002147] hover:bg-[#00326b] rounded-full" onClick={onEdit}>
          Editar Item
        </Button>
      </div>
    </div>
  )
}
