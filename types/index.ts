export type DDType = "Técnica" | "Jurídica" | "Financeira" | "Regulatória" | "Operacional"
export type DDStatus = "Pendente" | "Em Análise" | "Concluído"
export type DDRisk = "Baixo" | "Médio" | "Alto"

export interface Company {
  id: number
  nome: string
  setor: string
  regulado: boolean
}

export interface DueDiligenceItem {
  id: string
  empresa_id: number
  empresa_nome: string
  tipo_de_dd: DDType
  item: string
  status: DDStatus
  risco: DDRisk
  recomendacao: string
  documento?: {
    nome: string
    url: string
    tipo: string
  }
  observacoes_tecnicas?: string
  exigencias_regulatorias?: string[]
  data_criacao: Date
  data_atualizacao: Date
}

export interface DDFilters {
  empresa_id: number | null
  tipo_de_dd: DDType | null
  status: DDStatus | null
  risco: DDRisk | null
  apenas_reguladas: boolean
}
