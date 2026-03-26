**Diagnóstico Executivo**

1. O maior risco sistêmico hoje é controle de acesso fragmentado: autenticação sem enforcement de rota, autorização espalhada por página e dependência de convenções de UI.
2. O segundo maior risco é divergência de contrato: tipos e schemas não unificados entre domínio, UI, mocks e serviços.
3. O terceiro é acoplamento em hardcode: ids de curso, rotas fixas, fluxos duplicados (especialmente Python vs Power BI).
4. O quarto é persistência inconsistente: estado crítico em memória/localStorage/sessionStorage, com reset em logout e refresh.
5. O quinto é arquitetura em transição: existe camada de serviços tipada, mas a experiência real ainda roda majoritariamente em mock local.

**Matriz Única de Riscos (Prioridade de Refatoração)**
| Prioridade | Risco Consolidado | Onde aparece | Impacto |
|---|---|---|---|
| P0 | Falta de guard global de autenticação e autorização central | navigation-routing-current.md, auth-profile-current.md, ARCH_BASE.md | Acesso indevido, comportamento inconsistente por rota |
| P0 | Inconsistência de papéis e contratos de sessão | ARCH_BASE.md, auth-profile-current.md, enrollment-flow-current.md | Quebra de regras de negócio por role |
| P0 | Fluxos críticos sem backend real (auth, matrícula, prova) | ARCH_BASE.md, exams-current.md | Estado não confiável, divergência com produção |
| P0 | Fluxo de mensageria fora do contrato de arquitetura | messaging-current.md, navigation-routing-current.md | Escopo indevido no frontend até formalização contratual |
| P1 | Duplicação estrutural Python vs Power BI | python-variant-current.md, module-lessons-current.md | Alto custo de manutenção e regressões cruzadas |
| P1 | Rotas e navegação com hardcodes e drift | navigation-routing-current.md, courses-current.md | Quebra de deep-link e evolução lenta de catálogo |
| P1 | Validações e regras espalhadas em camadas diferentes | auth-profile-current.md, enrollment-flow-current.md, messaging-current.md, exams-current.md | Inconsistência cliente/servidor |
| P2 | Dívida de componente compartilhado e UX inconsistente | navigation-routing-current.md, module-lessons-current.md, python-variant-current.md | Reuso fraco, acessibilidade irregular |
| P2 | Lacunas de documentação funcional remanescente | relatorio-lacunas.md | Risco de refatoração sem rastreabilidade |

**Ordem Prática de Refatoração (Roadmap Único)**

1. Fase 0: Segurança de navegação e sessão.
   Objetivo: travar acesso antes de mexer em feature.
   Entrega: guard global no roteamento, política de role central, logout consistente.
   Base: navigation-routing-current.md, auth-profile-current.md.

2. Fase 1: Contratos canônicos e tipagem.
   Objetivo: eliminar ambiguidade entre domínio, UI e mock.
   Entrega: matriz única de tipos e schemas, mapeamento explícito de role, contratos de payload/resposta por domínio.
   Base: ARCH_BASE.md, relatorio-lacunas.md.

3. Fase 2: Auth + Enrollment integrados ao backend.
   Objetivo: autenticação e matrícula reais.
   Entrega: login/register/forgot integrados, matrícula e cancelamento com persistência, sincronização de courseStudentRole.
   Base: auth-profile-current.md, enrollment-flow-current.md.

4. Fase 3: Exams + conformidade contratual de rotas.
   Objetivo: remover núcleo crítico em mock local e limpar escopo fora de contrato.
   Entrega: submissão/correção de prova server-side e desativação de rotas de mensageria sem endpoint oficial.
   Base: exams-current.md, messaging-current.md, navigation-routing-current.md.

5. Fase 4: Deduplicação por configuração de curso.
   Objetivo: reduzir duplicação Power BI/Python sem perder diferenças de negócio.
   Entrega: estrutura compartilhada de páginas por variante, configuração por curso para conteúdo, tempo, regras e chaves.
   Base: python-variant-current.md, module-lessons-current.md, courses-current.md.

6. Fase 5: Hardening de UX, acessibilidade e governança de documentação.
   Objetivo: estabilizar manutenção.
   Entrega: padronização de breadcrumbs/idioma/acessibilidade, revisão de componentes base, atualização final da documentação por slice.
   Base: navigation-routing-current.md, relatorio-lacunas.md.

**Dependências Críticas Entre Fases**

1. Fase 0 bloqueia todas as outras, pois define segurança de navegação.
2. Fase 1 bloqueia integração backend com baixo retrabalho.
3. Fase 2 deve anteceder Fase 3 para manter coerência de sessão e role.
4. Fase 4 só é segura após Fases 2 e 3 estabilizarem comportamento real.
5. Fase 5 fecha qualidade e governança.

**Checklist Consolidado de Pronto (Definition of Done da Rodada)**

1. Toda rota sensível protegida por regra única de autenticação e role.
2. Sem role hardcoded em páginas.
3. Sem fluxo crítico dependente exclusivamente de mock local.
4. Contratos de tipos e schemas alinhados entre frontend e backend.
5. Variantes de curso com base compartilhada e diferenças declarativas.
6. Documentação de todos os slices atualizada e rastreável aos arquivos reais.

**Protocolo Obrigatorio de Contexto e Autorizacao (antes de qualquer story)**

1. Ler `CLAUDE.md` como diretriz principal de autorizacoes, escopo e padrao de execucao.
2. Ler os contratos da pasta docs: `.claude/commands/doc/requisitos-funcionais.md`, `.claude/commands/doc/regras-negocio.md`, `.claude/commands/doc/requisitos-nao-funcionais.md`, `.claude/commands/doc/arquitetura.md`, `.claude/commands/doc/user-stories.md`.
3. Em caso de conflito, aplicar esta precedencia: `CLAUDE.md` para governanca de autorizacao e fluxo de trabalho; docs para contrato funcional e tecnico.
4. Qualquer divergencia entre codigo e documentacao deve ser registrada antes da implementacao.

**Politica de Auto-Commit por Story (obrigatoria)**

1. Toda mudanca concluida em uma etapa da story deve ser commitada automaticamente pelo agente sem aguardar comando adicional.
2. O commit deve seguir o padrao do `CLAUDE.md`: tipo em minusculo + descricao no imperativo em portugues (ex.: `test: Criar testes da story 0.1.2`, `refactor: Aplicar guard global no roteamento`).
3. A ordem minima de commit por story deve respeitar TDD:
   1. Commit RED (testes criados e falhando como esperado).
   2. Commit GREEN (implementacao minima para testes passarem).
   3. Commit REFACTOR (melhoria estrutural sem mudar comportamento).
4. Nao realizar commit quando nao houver alteracao de arquivo.
5. Nao iniciar nova story sem commits da story atual e evidencias registradas.

**Plano de Execucao Semanal (Sprint 1 a Sprint 4) com Evidencia por Story**

Sprint 1 (Fase 0): seguranca de navegacao e sessao.

| Story | Objetivo | Escopo | Risco principal | Criterio de aceite | Evidencia de teste criado | Evidencia RED inicial |
|---|---|---|---|---|---|---|
| 0.1.1 | Guard global de autenticacao | `ProtectedRoute` + roteamento | Regressao de acesso publico | rota privada redireciona anonimo | `apps/poc-react-vite/src/__tests__/unit/routes/ProtectedRoute.test.tsx` (2 cenarios) | RED registrado antes da implementacao: erro de guard ausente ao acessar rota privada |
| 0.1.2 | Politica central de role | regra unica para professor/aluno | role hardcoded em paginas | regra unica aplicada em rotas sensiveis | link do arquivo de teste da story | print/log da suite com falha esperada |
| 0.1.3 | Logout consistente | limpeza de sessao e estados criticos | estado residual apos logout | sessao limpa e sem residuos | link do arquivo de teste da story | print/log da suite com falha esperada |

Sprint 2 (Fase 1): contratos canonicos e tipagem.

| Story | Objetivo | Escopo | Risco principal | Criterio de aceite | Evidencia de teste criado | Evidencia RED inicial |
|---|---|---|---|---|---|---|
| 1.1.1 | Matriz de tipos por dominio | alinhar `@ava-poc/types` e app | drift de contratos FE-BE | tipos canonicos e sem duplicacao critica | link do arquivo de teste da story | print/log da suite com falha esperada |
| 1.1.2 | Schemas canonicos de validacao | consolidar validacoes por dominio | regra divergente entre telas | schemas centralizados e reutilizados | link do arquivo de teste da story | print/log da suite com falha esperada |
| 1.1.3 | Mapeamento de role canonico | padronizar role de sessao | quebra em autorizacao por papel | mapeamento unico aplicado no app | link do arquivo de teste da story | print/log da suite com falha esperada |

Sprint 3 (Fase 2 + Fase 3): integracoes criticas com backend.

| Story | Objetivo | Escopo | Risco principal | Criterio de aceite | Evidencia de teste criado | Evidencia RED inicial |
|---|---|---|---|---|---|---|
| 2.1.1 | Integrar login/register/forgot | auth pages + service | sessao inconsistente | fluxo auth usando endpoint real | link do arquivo de teste da story | print/log da suite com falha esperada |
| 2.1.2 | Integrar enrollment | fluxo de inscricao/cancelamento | matricula perdida em refresh | matricula persistida e sincronizada | link do arquivo de teste da story | print/log da suite com falha esperada |
| 3.1.1 | Integrar exams e resultado | submissao/correcao server-side | resultado divergente do backend | prova e resultado baseados em resposta real | link do arquivo de teste da story | print/log da suite com falha esperada |
| 3.1.2 | Integrar messaging | envio/listagem persistentes | perda de historico na sessao | mensagens persistentes por usuario | link do arquivo de teste da story | print/log da suite com falha esperada |

Sprint 4 (Fase 4 + Fase 5): deduplicacao e hardening.

| Story | Objetivo | Escopo | Risco principal | Criterio de aceite | Evidencia de teste criado | Evidencia RED inicial |
|---|---|---|---|---|---|---|
| 4.1.1 | Deduplicar variante Python/Power BI | base compartilhada por configuracao | regressao cruzada entre variantes | variantes com base unica e comportamento preservado | link do arquivo de teste da story | print/log da suite com falha esperada |
| 5.1.1 | Hardening de navegacao e UX | acessibilidade, breadcrumbs, consistencia | degradacao de UX no ajuste tecnico | UX preservada com checklist tecnico aprovado | link do arquivo de teste da story | print/log da suite com falha esperada |
| 5.1.2 | Governanca documental final | atualizar docs por slice | baixa rastreabilidade de mudanca | docs alinhadas a implementacao final | link do arquivo de teste da story | print/log da suite com falha esperada |

**Regra de preenchimento de evidencia por story**

1. `Evidencia de teste criado`: caminho do arquivo de teste e caso(s) adicionados.
2. `Evidencia RED inicial`: saida da suite mostrando falha antes da implementacao.
3. Sem as duas evidencias, a story permanece em status `IN_PROGRESS`.

Se quiser, já monto a próxima entrega em formato de plano de execução semanal (Sprint 1 a Sprint 4), com objetivo, escopo, risco e critério de aceite por sprint.
