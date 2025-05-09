"use client"

import type React from "react"

import { useState, useRef } from "react"
import { AlertCircle, FileText, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { DDRisk, DDStatus, DDType, DueDiligenceItem } from "@/types"
import { mockCompanies } from "@/data/mock-data"

interface DDFormProps {
  initialData?: Partial<DueDiligenceItem>
  onSubmit: (data: DueDiligenceItem) => void
  onCancel: () => void
}

export function DDForm({ initialData, onSubmit, onCancel }: DDFormProps) {
  const [formData, setFormData] = useState<Partial<DueDiligenceItem>>(
    initialData || {
      tipo_de_dd: "Técnica" as DDType,
      status: "Pendente" as DDStatus,
      risco: "Médio" as DDRisk,
    },
  )
  const [selectedCompany, setSelectedCompany] = useState(
    mockCompanies.find((c) => c.id === formData.empresa_id) || null,
  )
  const [file, setFile] = useState<File | null>(null)
  const [newRequirement, setNewRequirement] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (field: keyof DueDiligenceItem, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCompanyChange = (companyId: string) => {
    const id = Number.parseInt(companyId)
    const company = mockCompanies.find((c) => c.id === id)
    if (company) {
      setSelectedCompany(company)
      setFormData((prev) => ({
        ...prev,
        empresa_id: id,
        empresa_nome: company.nome,
      }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setFormData((prev) => ({
        ...prev,
        documento: {
          nome: selectedFile.name,
          url: "#", // Simulação de URL
          tipo: selectedFile.type,
        },
      }))
    }
  }

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      const requirements = formData.exigencias_regulatorias || []
      setFormData((prev) => ({
        ...prev,
        exigencias_regulatorias: [...requirements, newRequirement.trim()],
      }))
      setNewRequirement("")
    }
  }

  const handleRemoveRequirement = (index: number) => {
    const requirements = formData.exigencias_regulatorias || []
    setFormData((prev) => ({
      ...prev,
      exigencias_regulatorias: requirements.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validação básica
    if (
      !formData.empresa_id ||
      !formData.tipo_de_dd ||
      !formData.item ||
      !formData.status ||
      !formData.risco ||
      !formData.recomendacao
    ) {
      alert("Por favor, preencha todos os campos obrigatórios")
      return
    }

    // Criar objeto completo
    const newItem: DueDiligenceItem = {
      id: formData.id || `dd-${Math.floor(Math.random() * 1000)}`,
      empresa_id: formData.empresa_id as number,
      empresa_nome: formData.empresa_nome as string,
      tipo_de_dd: formData.tipo_de_dd as DDType,
      item: formData.item as string,
      status: formData.status as DDStatus,
      risco: formData.risco as DDRisk,
      recomendacao: formData.recomendacao as string,
      documento: formData.documento,
      observacoes_tecnicas: formData.observacoes_tecnicas,
      exigencias_regulatorias: formData.exigencias_regulatorias,
      data_criacao: formData.data_criacao || new Date(),
      data_atualizacao: new Date(),
    }

    onSubmit(newItem)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <Label htmlFor="empresa" className="text-sm">
            Empresa *
          </Label>
          <Select value={formData.empresa_id?.toString()} onValueChange={handleCompanyChange}>
            <SelectTrigger id="empresa" className="h-10">
              <SelectValue placeholder="Selecione uma empresa" />
            </SelectTrigger>
            <SelectContent>
              {mockCompanies.map((company) => (
                <SelectItem key={company.id} value={company.id.toString()}>
                  {company.nome} {company.regulado && "(Regulada)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tipo" className="text-sm">
            Tipo de DD *
          </Label>
          <Select
            value={formData.tipo_de_dd}
            onValueChange={(value) => handleInputChange("tipo_de_dd", value as DDType)}
          >
            <SelectTrigger id="tipo" className="h-10">
              <SelectValue placeholder="Selecione o tipo" />
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

        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="item" className="text-sm">
            Item *
          </Label>
          <Input
            id="item"
            value={formData.item || ""}
            onChange={(e) => handleInputChange("item", e.target.value)}
            placeholder="Ex: Análise de Arquitetura de Software"
            className="h-10"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="status" className="text-sm">
            Status *
          </Label>
          <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value as DDStatus)}>
            <SelectTrigger id="status" className="h-10">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Em Análise">Em Análise</SelectItem>
              <SelectItem value="Concluído">Concluído</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="risco" className="text-sm">
            Nível de Risco *
          </Label>
          <Select value={formData.risco} onValueChange={(value) => handleInputChange("risco", value as DDRisk)}>
            <SelectTrigger id="risco" className="h-10">
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
          <Label htmlFor="recomendacao" className="text-sm">
            Recomendação *
          </Label>
          <Textarea
            id="recomendacao"
            value={formData.recomendacao || ""}
            onChange={(e) => handleInputChange("recomendacao", e.target.value)}
            placeholder="Descreva a recomendação para este item"
            className="min-h-[100px] resize-none"
          />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="documento" className="text-sm">
            Documento
          </Label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              file ? "border-gray-200 bg-gray-50" : "border-gray-200 hover:border-gray-300"
            }`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const droppedFile = e.dataTransfer.files[0]
                setFile(droppedFile)
                setFormData((prev) => ({
                  ...prev,
                  documento: {
                    nome: droppedFile.name,
                    url: "#", // Simulação de URL
                    tipo: droppedFile.type,
                  },
                }))
              }
            }}
          >
            {file || formData.documento ? (
              <div className="flex items-center justify-between bg-white p-3 rounded-lg border">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm">{file?.name || formData.documento?.nome}</span>
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
                      documento: undefined,
                    }))
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ""
                    }
                  }}
                >
                  <X className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  id="documento"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg,.docx"
                />
                <label htmlFor="documento" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <FileText className="h-10 w-10 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600 font-medium">
                      Arraste um arquivo ou clique para selecionar
                    </span>
                    <span className="text-xs text-gray-400 mt-1">Suporta PDF, JPG, PNG, DOCX (máx. 10MB)</span>
                  </div>
                </label>
              </>
            )}
          </div>
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="observacoes" className="text-sm">
            Observações Técnicas
          </Label>
          <Textarea
            id="observacoes"
            value={formData.observacoes_tecnicas || ""}
            onChange={(e) => handleInputChange("observacoes_tecnicas", e.target.value)}
            placeholder="Observações técnicas adicionais"
            className="min-h-[80px] resize-none"
          />
        </div>

        {/* Campos adicionais para empresas reguladas */}
        {selectedCompany?.regulado && (
          <div className="md:col-span-2 space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
              <h3 className="text-sm font-medium">Campos adicionais para empresa regulada</h3>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm">Exigências Regulatórias</Label>
              <div className="flex flex-wrap gap-2 border bg-white rounded-lg p-3">
                {formData.exigencias_regulatorias?.map((req, index) => (
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
                    className="flex-1 h-8 text-sm border-0 focus:ring-0 p-0"
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
                    className="h-8 px-2 text-xs"
                    onClick={handleAddRequirement}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Campos específicos por setor */}
            {selectedCompany.setor === "Saúde" && (
              <div className="space-y-1.5">
                <Label className="text-sm">Checklist Regulatório - Saúde</Label>
                <div className="space-y-2 bg-white p-3 rounded-lg border">
                  <div className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 mr-2" />
                    <span className="text-sm">ANVISA - Registro de Produto</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 mr-2" />
                    <span className="text-sm">CFM - Resolução 1821/07</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 mr-2" />
                    <span className="text-sm">LGPD - Dados Sensíveis</span>
                  </div>
                </div>
              </div>
            )}

            {selectedCompany.setor === "Financeiro" && (
              <div className="space-y-1.5">
                <Label className="text-sm">Checklist Regulatório - Financeiro</Label>
                <div className="space-y-2 bg-white p-3 rounded-lg border">
                  <div className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 mr-2" />
                    <span className="text-sm">Bacen - Circular 3.978</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 mr-2" />
                    <span className="text-sm">CVM - Instrução 617</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 mr-2" />
                    <span className="text-sm">PLD/FT - Prevenção à Lavagem de Dinheiro</span>
                  </div>
                </div>
              </div>
            )}

            {selectedCompany.setor === "Energia" && (
              <div className="space-y-1.5">
                <Label className="text-sm">Checklist Regulatório - Energia</Label>
                <div className="space-y-2 bg-white p-3 rounded-lg border">
                  <div className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 mr-2" />
                    <span className="text-sm">ANEEL - Resolução 414</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 mr-2" />
                    <span className="text-sm">ISO 50001 - Gestão de Energia</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">{initialData?.id ? "Atualizar Item" : "Salvar Item"}</Button>
      </div>
    </form>
  )
}
