"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileText, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DDTable } from "./dd-table"
import { DDDetailDrawer } from "./dd-detail-drawer"
import type { DueDiligence } from "@/types/due-diligence"

interface DDCrmDrawerProps {
  company: { id: number; name: string; sector: string; regulated: boolean }
  items: DueDiligence[]
  onClose: () => void
}

export function DDCrmDrawer({ company, items, onClose }: DDCrmDrawerProps) {
  const router = useRouter()
  const [selectedItem, setSelectedItem] = useState<DueDiligence | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const handleItemClick = (item: DueDiligence) => {
    setSelectedItem(item)
    setIsDetailsOpen(true)
  }

  const handleViewAll = () => {
    router.push(`/due-diligence?company=${company.id}`)
  }

  const handleAddNew = () => {
    router.push(`/crm/${company.id}/due-diligence`)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">Due Diligence: {company.name}</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs rounded-full border-gray-200"
            onClick={handleViewAll}
          >
            <FileText className="mr-1.5 h-3.5 w-3.5" />
            Ver Todos
          </Button>
          <Button size="sm" className="h-8 text-xs bg-[#002147] hover:bg-[#00326b] rounded-full" onClick={handleAddNew}>
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Novo Item
          </Button>
        </div>
      </div>

      {isDetailsOpen && selectedItem ? (
        <DDDetailDrawer item={selectedItem} onEdit={handleAddNew} onDelete={() => setIsDetailsOpen(false)} />
      ) : (
        <>
          {items.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum item de Due Diligence</h3>
              <p className="text-sm text-gray-500 mb-6">
                Esta empresa ainda não possui itens de due diligence cadastrados.
              </p>
              <Button
                size="sm"
                className="h-9 text-xs bg-[#002147] hover:bg-[#00326b] rounded-full"
                onClick={handleAddNew}
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Adicionar Primeiro Item
              </Button>
            </div>
          ) : (
            <DDTable items={items.slice(0, 5)} showCompany={false} onItemClick={handleItemClick} />
          )}

          {items.length > 5 && (
            <div className="mt-4 text-center">
              <Button variant="link" size="sm" className="text-xs text-[#002147]" onClick={handleViewAll}>
                Ver todos os {items.length} itens
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
