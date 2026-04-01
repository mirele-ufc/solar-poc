## Current State Memory Document — Slice F: Messaging

<<<<<<< HEAD
=======
<<<<<<< HEAD
### Status Contratual (Patch Incremental 1)

1. De acordo com `.claude/commands/doc/arquitetura.md`, não há endpoints de mensageria documentados.
2. Portanto, o slice de mensageria está classificado como fora do escopo ativo de implementação FE-BE.
3. As rotas `/message`, `/messages` e `/received-messages` devem ser tratadas como legado transitório e removidas do escopo ativo até formalização contratual.
=======
>>>>>>> 091524b0dc18fc2a8f2a0912653958b45d76bd77
### Protocolo obrigatorio por story (TDD-first)

1. Criar testes da story antes de iniciar implementacao.
2. Confirmar RED inicial e registrar criterio de aceite.
3. Implementar apenas o necessario para GREEN.
4. Refatorar apos GREEN com comportamento preservado.
5. Fechar story somente com validacoes tecnicas concluidas.
<<<<<<< HEAD
### Status Contratual (Patch Incremental 1)

1. De acordo com `.claude/commands/doc/arquitetura.md`, não há endpoints de mensageria documentados.
2. Portanto, o slice de mensageria está classificado como fora do escopo ativo de implementação FE-BE.
3. As rotas `/message`, `/messages` e `/received-messages` devem ser tratadas como legado transitório e removidas do escopo ativo até formalização contratual.
=======
>>>>>>> 81c2a527e7d58755bbbcee50355f9e429550c47f
>>>>>>> 091524b0dc18fc2a8f2a0912653958b45d76bd77

### 1. Fluxo de Mensagens e Navegação

Entradas do slice no roteamento:

1. Composição de mensagem: routes.ts
2. Mensagens enviadas (professor): routes.ts
3. Mensagens recebidas (estudante): routes.ts

Pontos de entrada via menu compartilhado:

1. Acesso de professor para lista de mensagens enviadas: AuthLayout.tsx
2. Acesso de estudante para mensagens recebidas: AuthLayout.tsx

Grafo funcional observado:

1. Professor abre lista em /messages.
2. A partir de /messages, cria nova mensagem em /message.
3. Envio grava no store local e volta a refletir em /messages imediatamente.
4. Estudante abre /received-messages e enxerga mensagens filtradas por all ou por cursos em que está matriculado.

---

### 2. Contrato de Dados e Store de Mensageria

Fonte central de estado:

1. useAuthStore.ts

Tipos relevantes:

1. SentMessage com id, recipientId, recipientLabel, subject, body e sentAt: useAuthStore.ts
2. Ação sendMessage no contrato do store: useAuthStore.ts
3. Implementação que prependa nova mensagem em memória: useAuthStore.ts

Comportamentos críticos:

1. O estado inicial já nasce com MOCK_MESSAGES: useAuthStore.ts
2. No logout, mensagens voltam para MOCK_MESSAGES, descartando envios da sessão: useAuthStore.ts

Quirk crítico:

1. Mensageria é totalmente client-side e reinicializada por sessão, sem persistência real.
2. O fluxo não possui cobertura contratual em arquitetura.md, portanto não deve evoluir para integração backend neste ciclo.

---

### 3. Schema de Validação de Mensagem

Arquivo de validação:

1. messageSchema.ts

Regras:

1. recipient obrigatório: messageSchema.ts
2. subject obrigatório e máximo 200 caracteres: messageSchema.ts
3. message obrigatória e máximo 2000 caracteres: messageSchema.ts

Tipo inferido:

1. ComposeMessageFormValues: messageSchema.ts

---

### 4. MessagePage (Composição e Envio)

Arquivo:

1. MessagePage.tsx

Fluxo técnico:

1. Form com React Hook Form + Zod.
2. onSubmitValid monta recipientLabel e chama sendMessage: MessagePage.tsx
3. Após envio: sucesso visual, reset de campos e auto-hide em 3s: MessagePage.tsx

Controle de papel:

1. isTeacher é derivado de currentUser.role: MessagePage.tsx
2. Usuário não professor recebe alerta visual de acesso restrito: MessagePage.tsx

Risco de integração:

1. O alerta de acesso restrito é apenas visual; não há bloqueio funcional explícito no submit para impedir envio por papel inadequado caso a rota seja acessada diretamente.

---

### 5. MessagesPage (Mensagens Enviadas)

Arquivo:

1. MessagesPage.tsx

Comportamento principal:

1. Lista usa sentMessages do store.
2. Expansão por cartão com estado expandedId.
3. Helpers locais formatam datas curta e completa no próprio arquivo.

Quirk crítico:

1. Flag de autorização está hardcoded como falso: MessagesPage.tsx
2. Com isso, a tela entra continuamente no estado Acesso restrito a professores e oculta a lista funcional de envio.

Impacto:

1. Divergência entre intenção de produto e comportamento real de UI.
2. Se não corrigido em refatoração, o slice pode parecer quebrado mesmo com store de mensagens operante.

---

### 6. StudentMessagesPage (Mensagens Recebidas)

Arquivo:

1. StudentMessagesPage.tsx

Regra de recebimento:

1. Filtro por recipientId igual a all ou por curso matriculado: StudentMessagesPage.tsx

Comportamentos de UX:

1. Controle de não lidas via readIds em memória local.
2. Badge de não lidas no avatar e no título.
3. Formatação de data replicada com os mesmos helpers da página de professor.

Inconsistências estáticas aparentes no estado atual:

1. Uso de useCourseStore sem import explícito no topo: StudentMessagesPage.tsx
2. Uso de variável user, enquanto a desestruturação traz currentUser: StudentMessagesPage.tsx e StudentMessagesPage.tsx

Risco:

1. Esse trecho indica dívida técnica relevante no slice de recebimento e deve ser tratado como ponto de atenção obrigatório na refatoração.

---

### 7. Padrões e Dívida Técnica Cross-cutting

Padrões repetidos:

1. Helpers de data duplicados em páginas de mensagens enviadas e recebidas.
2. Header visual e estrutura de navegação quase idênticos entre páginas do slice.
3. Regras de autorização parcialmente aplicadas no front (mais UX do que segurança real).

Dívidas centrais:

1. Dependência forte de mocks e estado volátil de sessão.
2. Falta de política única de autorização por papel no front.
3. Mistura de lógica de domínio com lógica visual dentro das páginas.

---

### 8. Riscos de Integração Backend para Slice F

1. Risco principal é manter fluxo não contratual ativo e criar dívida de produto fora da fonte de verdade.
2. Manter telas e stores de mensageria pode induzir implementação acidental de endpoint inexistente.
3. Dependências de role/menu para mensageria geram ruído na navegação autenticada.

---

### 9. Checklist de Riscos de Refatoração (Slice F)

1. Remover mensageria do escopo ativo de rotas e navegação até formalização em arquitetura.md.
2. Retirar referências de menu/role que apontam para rotas de mensageria.
3. Manter este slice apenas como registro histórico de estado atual (legado).
4. Bloquear novas integrações backend para mensagens enquanto não houver contrato oficial.
