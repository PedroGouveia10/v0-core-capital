import type { Company, DueDiligenceItem } from "@/types"

export const mockCompanies: Company[] = [
  { id: 1, nome: "TechFlow Solutions", setor: "Tecnologia", regulado: false },
  { id: 2, nome: "HealthCare Plus", setor: "Saúde", regulado: true },
  { id: 3, nome: "FinTech Capital", setor: "Financeiro", regulado: true },
  { id: 4, nome: "EnergyGrid", setor: "Energia", regulado: true },
  { id: 5, nome: "RetailMaster", setor: "Varejo", regulado: false },
  { id: 6, nome: "LogisticsPro", setor: "Logística", regulado: false },
  { id: 7, nome: "EduTech Learning", setor: "Educação", regulado: false },
  { id: 8, nome: "AgriTech Solutions", setor: "Agricultura", regulado: false },
]

export const mockDDItems: DueDiligenceItem[] = [
  {
    id: "dd-001",
    empresa_id: 1,
    empresa_nome: "TechFlow Solutions",
    tipo_de_dd: "Técnica",
    item: "Análise de Arquitetura de Software",
    status: "Concluído",
    risco: "Baixo",
    recomendacao:
      "A arquitetura de software está bem estruturada, com padrões de design adequados e escalabilidade. Recomenda-se apenas documentação adicional para facilitar a manutenção futura.",
    documento: {
      nome: "analise-arquitetura.pdf",
      url: "#",
      tipo: "application/pdf",
    },
    observacoes_tecnicas:
      "Stack tecnológica moderna com React, Node.js e MongoDB. Infraestrutura em AWS com CI/CD implementado.",
    data_criacao: new Date("2023-05-15"),
    data_atualizacao: new Date("2023-05-20"),
  },
  {
    id: "dd-002",
    empresa_id: 2,
    empresa_nome: "HealthCare Plus",
    tipo_de_dd: "Regulatória",
    item: "Conformidade com LGPD e regulamentações de saúde",
    status: "Em Análise",
    risco: "Alto",
    recomendacao:
      "Identificados pontos críticos de não conformidade com a LGPD e regulamentações específicas do setor de saúde. Necessário implementar medidas de proteção de dados sensíveis e obter consentimento explícito dos pacientes.",
    observacoes_tecnicas:
      "Sistema atual armazena dados sensíveis sem criptografia adequada. Necessário refatoração urgente.",
    exigencias_regulatorias: ["LGPD", "CFM Resolução 1821/07", "ANS RN 305"],
    data_criacao: new Date("2023-06-10"),
    data_atualizacao: new Date("2023-06-15"),
  },
  {
    id: "dd-003",
    empresa_id: 3,
    empresa_nome: "FinTech Capital",
    tipo_de_dd: "Financeira",
    item: "Análise de Demonstrações Financeiras",
    status: "Concluído",
    risco: "Médio",
    recomendacao:
      "Demonstrações financeiras apresentam consistência, porém com ressalvas quanto ao reconhecimento de receitas futuras. Recomenda-se ajuste na metodologia de projeção e provisionamento adequado.",
    documento: {
      nome: "analise-financeira.xlsx",
      url: "#",
      tipo: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
    observacoes_tecnicas: "Utiliza sistema ERP SAP com customizações específicas para o setor financeiro.",
    exigencias_regulatorias: ["Bacen Circular 3.978", "CVM Instrução 617"],
    data_criacao: new Date("2023-04-05"),
    data_atualizacao: new Date("2023-04-10"),
  },
  {
    id: "dd-004",
    empresa_id: 4,
    empresa_nome: "EnergyGrid",
    tipo_de_dd: "Operacional",
    item: "Avaliação de Processos Operacionais",
    status: "Pendente",
    risco: "Médio",
    recomendacao:
      "Processos operacionais precisam ser documentados e otimizados. Identificadas redundâncias e gargalos que impactam a eficiência.",
    observacoes_tecnicas: "Utiliza sistema legado para controle operacional com integrações manuais.",
    exigencias_regulatorias: ["ANEEL Resolução 414", "ISO 50001"],
    data_criacao: new Date("2023-07-01"),
    data_atualizacao: new Date("2023-07-01"),
  },
  {
    id: "dd-005",
    empresa_id: 5,
    empresa_nome: "RetailMaster",
    tipo_de_dd: "Jurídica",
    item: "Análise de Contratos com Fornecedores",
    status: "Concluído",
    risco: "Baixo",
    recomendacao:
      "Contratos bem estruturados e com cláusulas de proteção adequadas. Recomenda-se apenas revisão periódica para atualização conforme mudanças na legislação.",
    documento: {
      nome: "analise-contratos.pdf",
      url: "#",
      tipo: "application/pdf",
    },
    observacoes_tecnicas: "Utiliza sistema de gestão de contratos com alertas automáticos para renovações.",
    data_criacao: new Date("2023-03-20"),
    data_atualizacao: new Date("2023-03-25"),
  },
  {
    id: "dd-006",
    empresa_id: 1,
    empresa_nome: "TechFlow Solutions",
    tipo_de_dd: "Financeira",
    item: "Análise de Fluxo de Caixa",
    status: "Em Análise",
    risco: "Médio",
    recomendacao:
      "Fluxo de caixa apresenta sazonalidade significativa e dependência de poucos clientes grandes. Recomenda-se diversificação da carteira e constituição de reserva para períodos de baixa.",
    observacoes_tecnicas: "Utiliza sistema financeiro Netsuite com dashboards personalizados.",
    data_criacao: new Date("2023-06-05"),
    data_atualizacao: new Date("2023-06-10"),
  },
  {
    id: "dd-007",
    empresa_id: 3,
    empresa_nome: "FinTech Capital",
    tipo_de_dd: "Regulatória",
    item: "Conformidade com Normas do Banco Central",
    status: "Pendente",
    risco: "Alto",
    recomendacao:
      "Necessário adequação urgente às novas normas do Banco Central sobre prevenção à lavagem de dinheiro e financiamento ao terrorismo. Processos atuais não atendem aos requisitos mínimos.",
    observacoes_tecnicas: "Sistema atual não possui módulos de KYC e AML adequados às novas exigências.",
    exigencias_regulatorias: ["Bacen Circular 3.978", "Resolução BCB 119/2021", "PLD/FT"],
    data_criacao: new Date("2023-07-10"),
    data_atualizacao: new Date("2023-07-10"),
  },
  {
    id: "dd-008",
    empresa_id: 6,
    empresa_nome: "LogisticsPro",
    tipo_de_dd: "Operacional",
    item: "Avaliação de Eficiência Logística",
    status: "Concluído",
    risco: "Baixo",
    recomendacao:
      "Processos logísticos bem estruturados com uso eficiente de tecnologia. Recomenda-se apenas implementação de KPIs adicionais para monitoramento contínuo.",
    documento: {
      nome: "avaliacao-logistica.pdf",
      url: "#",
      tipo: "application/pdf",
    },
    observacoes_tecnicas: "Utiliza sistema WMS integrado com ERP e rastreamento em tempo real.",
    data_criacao: new Date("2023-05-01"),
    data_atualizacao: new Date("2023-05-05"),
  },
  {
    id: "dd-009",
    empresa_id: 2,
    empresa_nome: "HealthCare Plus",
    tipo_de_dd: "Técnica",
    item: "Análise de Segurança de Dados",
    status: "Em Análise",
    risco: "Alto",
    recomendacao:
      "Identificadas vulnerabilidades críticas na segurança de dados sensíveis de pacientes. Necessário implementação urgente de criptografia, controle de acesso e auditoria.",
    observacoes_tecnicas:
      "Sistema atual não possui logs de auditoria adequados e armazena senhas em formato não seguro.",
    exigencias_regulatorias: ["LGPD", "ISO 27001", "HIPAA"],
    data_criacao: new Date("2023-06-20"),
    data_atualizacao: new Date("2023-06-25"),
  },
  {
    id: "dd-010",
    empresa_id: 7,
    empresa_nome: "EduTech Learning",
    tipo_de_dd: "Jurídica",
    item: "Análise de Propriedade Intelectual",
    status: "Concluído",
    risco: "Médio",
    recomendacao:
      "Identificada ausência de registro de marcas e patentes para tecnologias proprietárias. Recomenda-se regularização imediata para evitar disputas futuras.",
    documento: {
      nome: "analise-propriedade-intelectual.pdf",
      url: "#",
      tipo: "application/pdf",
    },
    observacoes_tecnicas: "Empresa possui conteúdo educacional proprietário sem proteção adequada.",
    data_criacao: new Date("2023-04-15"),
    data_atualizacao: new Date("2023-04-20"),
  },
  {
    id: "dd-011",
    empresa_id: 4,
    empresa_nome: "EnergyGrid",
    tipo_de_dd: "Técnica",
    item: "Avaliação de Infraestrutura Tecnológica",
    status: "Concluído",
    risco: "Médio",
    recomendacao:
      "Infraestrutura tecnológica parcialmente obsoleta, com necessidade de atualização gradual. Recomenda-se plano de modernização em fases para minimizar impacto operacional.",
    documento: {
      nome: "avaliacao-infraestrutura.pdf",
      url: "#",
      tipo: "application/pdf",
    },
    observacoes_tecnicas: "Sistemas de controle de rede elétrica utilizam tecnologia legada com suporte limitado.",
    exigencias_regulatorias: ["ANEEL Resolução 414", "ISO 27001"],
    data_criacao: new Date("2023-03-10"),
    data_atualizacao: new Date("2023-03-15"),
  },
  {
    id: "dd-012",
    empresa_id: 8,
    empresa_nome: "AgriTech Solutions",
    tipo_de_dd: "Financeira",
    item: "Análise de Estrutura de Custos",
    status: "Pendente",
    risco: "Baixo",
    recomendacao:
      "Estrutura de custos bem distribuída, mas com oportunidades de otimização em despesas operacionais. Recomenda-se revisão de contratos com fornecedores e implementação de controles mais granulares.",
    observacoes_tecnicas: "Utiliza sistema de gestão financeira com módulo de controle de custos básico.",
    data_criacao: new Date("2023-07-05"),
    data_atualizacao: new Date("2023-07-05"),
  },
]

// Função para obter estatísticas de DD por empresa
export function getDDStatsByCompany(companyId: number) {
  const companyItems = mockDDItems.filter((item) => item.empresa_id === companyId)

  return {
    total: companyItems.length,
    pendentes: companyItems.filter((item) => item.status === "Pendente").length,
    emAnalise: companyItems.filter((item) => item.status === "Em Análise").length,
    concluidos: companyItems.filter((item) => item.status === "Concluído").length,
    altosRiscos: companyItems.filter((item) => item.risco === "Alto").length,
    ultimaAtualizacao:
      companyItems.length > 0
        ? new Date(Math.max(...companyItems.map((item) => item.data_atualizacao.getTime())))
        : null,
  }
}
