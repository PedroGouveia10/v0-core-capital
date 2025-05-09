"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DDTable } from "./dd-table"
import { DDForm } from "./dd-form"
import { DDDetailDrawer } from "./dd-detail-drawer"
import type { DueDiligence } from "@/types/due-diligence"

interface DDCompanyDrawerProps {
  company: { id: number; name: string; sector: string; regulated: boolean }
  items: DueDiligence[]
  onAddItem: (item: DueDiligence) => void
  onEditItem: (item: DueDiligence) => void
  onClose: () => void
}

export function DDCompanyDrawer({ company, items, onAddItem, onEditItem, onClose }: DDCompanyDrawerProps) {
  const [activeTab, setActiveTab] = useState("items")
  const [selectedItem, setSelectedItem] = useState<DueDiligence | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [localItems, setLocalItems] = useState<DueDiligence[]>(items)

  const handleItemClick = (item: DueDiligence) => {
    setSelectedItem(item)
    setIsDetailsOpen(true)
  }

  const handleAddNewClick = () => {
    setSelectedItem(null)
    setIsFormOpen(true)
    setActiveTab("form")
  }

  const handleEditClick = () => {
    setIsDetailsOpen(false)
    setIsFormOpen(true)
    setActiveTab("form")
  }

  const handleFormSubmit = (item: DueDiligence) => {
    if (selectedItem) {
      onEditItem(item)
    } else {
      onAddItem(item)
    }
    setIsFormOpen(false)
    setSelectedItem(null)
    setActiveTab("items")
  }

  const handleFormCancel = () => {
    setIsFormOpen(false)
    setActiveTab("items")
    if (selectedItem) {
      setIsDetailsOpen(true)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">Due Diligence: {company.name}</h2>
        <Button
          size="sm"
          className="h-8 text-xs bg-[#002147] hover:bg-[#00326b] rounded-full"
          onClick={handleAddNewClick}
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Novo Item
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-100 p-0.5 h-8 mb-4 rounded-lg">
          <TabsTrigger
            value="items"
            className="text-xs h-7 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
            disabled={isFormOpen}
          >
            Itens de Due Diligence
          </TabsTrigger>
          <TabsTrigger
            value="form"
            className="text-xs h-7 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
            disabled={!isFormOpen}
          >
            {selectedItem ? "Editar Item" : "Novo Item"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="m-0">
          {isDetailsOpen && selectedItem ? (
            <DDDetailDrawer
              item={selectedItem}
              onEdit={handleEditClick}
              onDelete={() => {
                setLocalItems(localItems.filter((item) => item.id !== selectedItem.id))
                setIsDetailsOpen(false)
                setSelectedItem(null)
              }}
            />
          ) : (
            <DDTable items={items} showCompany={false} onItemClick={handleItemClick} />
          )}
        </TabsContent>

        <TabsContent value="form" className="m-0">
          <DDForm
            companies={[company]}
            initialData={selectedItem ? { ...selectedItem } : { companyId: company.id, companyName: company.name }}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
