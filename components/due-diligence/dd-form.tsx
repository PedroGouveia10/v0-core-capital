"use client"

import type React from "react"

import { useState } from "react"
import { FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import type { DDRisk, DDStatus, DDType, DueDiligence } from "@/types/due-diligence"

interface DDFormProps {
  companies: { id: number; name: string; sector: string; regulated: boolean }[]
  initialData?: Partial<DueDiligence>
  onSubmit: (data: DueDiligence) => void
  onCancel: () => void
}

export function DDForm({ companies, initialData, onSubmit, onCancel }: DDFormProps) {
  const [formData, setFormData] = useState<Partial<DueDiligence>>(
    initialData || {
      type: "Tecnologia" as DDType,
      status: "Pendente" as DDStatus,
      risk: "Médio" as DDRisk,
    },
  )
  const [isRegulated, setIsRegulated] = useState(initialData?.regulatoryRequirements ? true : false)
  const [newRequirement, setNewRequirement] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const handleInputChange = (field: keyof DueDiligence, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCompanyChange = (companyId: string) => {
    const id = Number.parseInt(companyId)
    const company = companies.find((c) => c.id === id)
    if (company) {
      setFormData((prev) => ({
        ...prev,
        companyId: id,
        companyName: company.name,
      }))
      setIsRegulated(company.regulated)
    }
  }

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      const requirements = formData.regulatoryRequirements || []
      setFormData((prev) => ({
        ...prev,
        regulatoryRequirements: [...requirements, newRequirement.trim()],
      }))
      setNewRequirement("")
    }
  }

  const handleRemoveRequirement = (index: number) => {
    const requirements = formData.regulatoryRequirements || []
    setFormData((prev) => ({
      ...prev,
      regulatoryRequirements: requirements.filter((_, i) => i !== index),
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setFormData((prev) => ({
        ...prev,
        document: {
          name: selectedFile.name,
          url: "#", // Simulação de URL
          type: selectedFile.type,
        },
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validação básica
    if (
      !formData.companyId ||
      !formData.type ||
      !formData.item ||
      !formData.status ||
      !formData.risk ||
      !formData.recommendation
    ) {
      alert("Por favor, preencha todos os campos obrigatórios")
      return
    }

    // Criar objeto completo
    const newItem: DueDiligence = {
      id: formData.id || `dd-${Math.floor(Math.random() * 1000)}`,
      type: formData.type as DDType,
      item: formData.item as string,
      status: formData.status as DDStatus,
      risk: formData.risk as DDRisk,
      recommendation: formData.recommendation as string,
      document: formData.document,
      technicalNotes: formData.technicalNotes,
      regulatoryRequirements: isRegulated ? formData.regulatoryRequirements : undefined,
      companyId: formData.companyId as number,
      companyName: formData.companyName as string,
      createdAt: formData.createdAt || new Date(),
      updatedAt: new Date(),
    }

    onSubmit(newItem)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <Label htmlFor="company" className="text-xs text-gray-500">
            Empresa *
          </Label>
          <Select value={formData.companyId?.toString()} onValueChange={handleCompanyChange}>
            <SelectTrigger className="h-9 text-sm border-gray-200 focus:border-gray-300 focus:ring-0 rounded-lg">
              <SelectValue placeholder="Selecione uma empresa" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id.toString()}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="type" className="text-xs text-gray-500">
            Tipo de DD *
          </Label>
          <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value as DDType)}>
            <SelectTrigger className="h-9 text-sm border-gray-200 focus:border-gray-300 focus:ring-0 rounded-lg">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tecnologia">Tecnologia</SelectItem>
              <SelectItem value="Jurídico">Jurídico</SelectItem>
              <SelectItem value="Financeiro">Financeiro</SelectItem>
              <SelectItem value="Regulatório">Regulatório</SelectItem>
              <SelectItem value="Operacional">Operacional</SelectItem>
              <SelectItem value="Comercial">Comercial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="item" className="text-xs text-gray-500">
            Item *
          </Label>
          <Input
            id="item"
            value={formData.item || ""}
            onChange={(e) => handleInputChange("item", e.target.value)}
            placeholder="Ex: Análise de Arquitetura de Software"
            className="h-9 text-sm border-gray-200 focus:border-gray-300 focus:ring-0 rounded-lg"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="status" className="text-xs text-gray-500">
            Status *
          </Label>
          <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value as DDStatus)}>
            <SelectTrigger className="h-9 text-sm border-gray-200 focus:border-gray-300 focus:ring-0 rounded-lg">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Em andamento">Em andamento</SelectItem>
              <SelectItem value="Concluído">Concluído</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="risk" className="text-xs text-gray-500">
            Nível de Risco *
          </Label>
          <Select value={formData.risk} onValueChange={(value) => handleInputChange("risk", value as DDRisk)}>
            <SelectTrigger className="h-9 text-sm border-gray-200 focus:border-gray-300 focus:ring-0 rounded-lg">
              <SelectValue placeholder="Selecione o nível de risco" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Baixo">Baixo</SelectItem>
              <SelectItem value="Médio">Médio</SelectItem>
              <SelectItem value="Alto">Alto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="recommendation" className="text-xs text-gray-500">
            Recomendação *
          </Label>
          <Textarea
            id="recommendation"
            value={formData.recommendation || ""}
            onChange={(e) => handleInputChange("recommendation", e.target.value)}
            placeholder="Descreva a recomendação para este item"
            className="min-h-[100px] p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-gray-300 resize-none"
          />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="document" className="text-xs text-gray-500">
            Documento
          </Label>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
            {file ? (
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-700">{file.name}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={() => {
                    setFile(null)
                    setFormData((prev) => ({
                      ...prev,
                      document: undefined,
                    }))
                  }}
                >
                  <X className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  id="document"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg"
                />
                <label htmlFor="document" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <FileText className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Arraste um arquivo ou clique para selecionar</span>
                    <span className="text-xs text-gray-400 mt-1">Suporta PDF, PNG, JPG (máx. 10MB)</span>
                  </div>
                </label>
              </>
            )}
          </div>
        </div>

        {/* Campos adicionais para empresas reguladas */}
        {formData.companyId && (
          <div className="md:col-span-2 border-t border-gray-100 pt-4 mt-2">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="regulated"
                checked={isRegulated}
                onChange={(e) => setIsRegulated(e.target.checked)}
                className="h-4 w-4 text-[#002147] border-gray-300 rounded focus:ring-[#002147]"
              />
              <label htmlFor="regulated" className="ml-2 text-sm text-gray-700">
                Esta empresa está sujeita a regulamentações específicas
              </label>
            </div>

            {isRegulated && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-gray-500">Exigências Regulatórias</Label>
                  <div className="flex flex-wrap gap-2 border border-gray-200 rounded-lg p-3">
                    {formData.regulatoryRequirements?.map((req, index) => (
                      <Badge key={index} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        {req}
                        <button
                          type="button"
                          className="ml-1 text-purple-400 hover:text-purple-700"
                          onClick={() => handleRemoveRequirement(index)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    <div className="flex-1 min-w-[150px] flex">
                      <Input
                        type="text"
                        value={newRequirement}
                        onChange={(e) => setNewRequirement(e.target.value)}
                        placeholder="Adicionar exigência..."
                        className="flex-1 h-7 text-sm border-0 focus:ring-0 p-0"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddRequirement()
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={handleAddRequirement}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="technicalNotes" className="text-xs text-gray-500">
                    Observações Técnicas
                  </Label>
                  <Textarea
                    id="technicalNotes"
                    value={formData.technicalNotes || ""}
                    onChange={(e) => handleInputChange("technicalNotes", e.target.value)}
                    placeholder="Observações técnicas específicas para regulamentação"
                    className="min-h-[80px] p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-gray-300 resize-none"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
        <Button type="button" variant="outline" size="sm" className="h-9 text-xs rounded-full" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" size="sm" className="h-9 text-xs bg-[#002147] hover:bg-[#00326b] rounded-full">
          {initialData?.id ? "Atualizar Item" : "Salvar Item"}
        </Button>
      </div>
    </form>
  )
}
