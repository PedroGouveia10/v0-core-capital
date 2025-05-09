export type DDType = "Tecnologia" | "Jurídico" | "Financeiro" | "Regulatório" | "Operacional" | "Comercial"
export type DDStatus = "Pendente" | "Em andamento" | "Concluído"
export type DDRisk = "Baixo" | "Médio" | "Alto"

export interface DueDiligence {
  id: string
  companyId: number
  companyName: string
  type: DDType
  item: string
  status: DDStatus
  risk: DDRisk
  recommendation: string
  document?: {
    name: string
    url: string
    type: string
  }
  technicalNotes?: string
  regulatoryRequirements?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface DDFilters {
  companyId: number | null
  type: DDType | null
  status: DDStatus | null
  risk: DDRisk | null
  onlyRegulated: boolean
}
