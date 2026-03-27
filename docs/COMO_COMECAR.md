# Como Começar: Guia de Onboarding para Refatoração UFC LMS Frontend

**Versão:** 2.1 — Granular com TDD + Autorização Explícita + Contrato Estrito  
**Data:** 24/03/2026  
**Público:** Implementadores (1ª vez ou retomando projeto)

---

## 1. Antes de Tudo (5-10 minutos)

- [ ] Clonar/acessar repositório `ava-poc-react`
- [ ] Garantir Node.js ≥ 18 e `pnpm` instalados
- [ ] Rodar `pnpm install` para instalar dependências
- [ ] Rodar `pnpm build` para validar que projeto compila
- [ ] Rodar `pnpm test` para validar que testes rodam
- [ ] Confirmar backend Spring Boot disponível (ex: http://localhost:8080)
- [ ] Criar `apps/poc-react-vite/.env.local` a partir de `apps/poc-react-vite/.env.example`
- [ ] Configurar `VITE_API_BASE_URL` para o backend da máquina atual

---

## 2. Ler Documentação de Contexto (20-30 minutos)

Na ordem abaixo (tudo em `/docs/`):

1. **REFACTORING_QUICK_REFERENCE.md** (5 min)

- Visão de 7 fases numeradas (0-6) em 1 página
- Endpoints por domínio
- Padrões de implementação
- Dúvidas frequentes

2. **REFACTORING_PLAN_GRANULAR_V2.md** (15-20 min)

- Detalhes de 43 subtarefas (39 originais + 4 novas subtarefas + 1 refactor inline entre os 5 gaps)
- Cada subtarefa tem: duração, testes, commits esperados
- Tabela de endpoints (39 oficiais, somente arquitetura.md)
- Decisões arquiteturais
- Seção "Resumo de 43 Subtarefas" mostra breakdown por fase + gaps

**Esses 2 documentos são sua "biblioteca" — consulte sempre que tiver dúvida específica.**

---

## 3. Validar Contrato com Backend (10-15 minutos)

**Antes de começar Fase 2 (Auth), CONFIRME:**

- [ ] Backend tem `POST /auth/login` documentado?
- [ ] Backend tem `POST /auth/cadastro` documentado?
- [ ] Backend tem `POST /auth/refresh` documentado?
- [ ] Backend retorna JWT com `accessToken` e `refreshToken`?
- [ ] Backend tem `GET /perfil` para sincronizar usuário?
- [ ] Baseline contratual da arquitetura (39 endpoints oficiais) está mapeado?
- [ ] Rotas e serviços planejados refletem somente endpoints de `.claude/commands/doc/arquitetura.md`?

**Gap integrado em Fase 4:**

- `POST /modulos/{moduloId}/prova/gerar-quiz-ia` — Spring AI endpoint para geração automática de quiz (RF35-RF38)

**Se algum endpoint faltar:** remover o fluxo/rota do escopo ativo até formalização no `arquitetura.md`.

**Nota de escopo histórico:** quando houver menções legadas a fluxos de mensageria ou endpoints não contratuais em documentos auxiliares, trate-as apenas como registro histórico. Esses fluxos permanecem fora do escopo ativo até formalização em `.claude/commands/doc/arquitetura.md`.

**Fonte da verdade obrigatória:**

- `CLAUDE.md` + `.claude/commands/doc/arquitetura.md`
- Em conflito entre os dois: parar a execução, confirmar com o usuário e registrar a decisão na documentação.

---

## 4. GitFlow: Hierarquia de Branches

**Leia antes de começar qualquer fase.**

👉 **Documentação completa:** [docs/GITFLOW_STRATEGY.md](GITFLOW_STRATEGY.md)

### Fluxo Padrão para Cada Fase

```bash
# ANTES DE INICIAR:
git status            # Deve estar limpo
git checkout development
git pull origin development

# CRIAR FEATURE BRANCH (uma por fase):
git checkout -b feature/refactor-auth-guard-global

# IMPLEMENTAR (RED→GREEN→REFACTOR):
git commit -m "test: Testes para guarda global de autenticação"
git commit -m "feat: Implementar AuthGuardGlobal"
git commit -m "refactor: Extrair validações para schema"

# VALIDAR:
pnpm type-check && pnpm lint && pnpm test && pnpm build

# PUSH:
git push origin feature/refactor-auth-guard-global
```

**Tipos de Branch (ver [GITFLOW_STRATEGY.md](GITFLOW_STRATEGY.md) para detalhes):**

- `feature/refactor-<dominio>`: Features/refatorações (Fase 0-6)
- `bugfix/fix-<tipo>`: Correções de bugs
- `hotfix/fix-<severidade>`: Urgentes em produção
- `development`: Base para features
- `main`: Produção

---

## 5. Começar Fase 0 (Segurança de Navegação)

**Fase recomendada para começar (não depende do backend).**

### Setup da Sessão

```bash
# 1. Criar branch
git checkout development
git pull origin development
git checkout -b feature/refactor-auth-guard-global

# 2. Criar MEMORY.md da sessão (copiar template)
cp /memories/MEMORY_TEMPLATE.md ./MEMORY.md

# 3. Preencher MEMORY.md com status inicial
# - Fase: 0
# - Subtarefa: 0.1
# - Status: ⏳ TODO
# - Branch: feature/refactor-auth-guard-global
```

## 6. Checklist Cross-Machine (Portável)

Ao iniciar em outra máquina:

- [ ] Confirmar `node -v`, `pnpm -v`, `git --version`
- [ ] Executar `pnpm install`
- [ ] Atualizar `apps/poc-react-vite/.env.local`
- [ ] Validar branch com `git branch --show-current`
- [ ] Ler `MEMORY.md` completo na raiz do projeto
- [ ] Rodar `/start-implementation` antes de escolher a subtarefa

Ao pausar e trocar de máquina:

- [ ] Atualizar `MEMORY.md` com status e próxima ação
- [ ] Commitar mudanças da sessão
- [ ] Fazer push da branch ativa

### Subtarefa 0.1: Criar ProtectedRoute

**Workflow TDD:**

```bash
# STEP 1: RED — Escrever testes falhando
# Criar arquivo: src/__tests__/ProtectedRoute.test.tsx

import { render, screen } from "@testing-library/react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthStore } from "@/store/useAuthStore";

vi.mock("@/store/useAuthStore");

describe("ProtectedRoute", () => {
  it("redireciona para login sem token", () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isLoggedIn: false,
      currentUser: null,
    } as any);

    render(
      <MemoryRouter>
        <ProtectedRoute allowedRoles={["professor"]}>
          <div>Dashboard</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  it("redireciona para unauthorized com role inválido", () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isLoggedIn: true,
      currentUser: { role: "student" },
    } as any);

    render(
      <MemoryRouter>
        <ProtectedRoute allowedRoles={["professor"]}>
          <div>Dashboard</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  it("renderiza conteúdo com role correto", () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isLoggedIn: true,
      currentUser: { role: "professor" },
    } as any);

    render(
      <MemoryRouter>
        <ProtectedRoute allowedRoles={["professor"]}>
          <div>Dashboard</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });
});

# Rodar: npm run test -- ProtectedRoute.test.ts
# Resultado esperado: 3 testes FALHANDO (RED) ❌❌❌
```

```bash
# STEP 2: GREEN — Implementar ProtectedRoute
# Criar arquivo: src/components/ProtectedRoute.tsx

import { useAuthStore } from "@/store/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";

export interface ProtectedRouteProps {
  allowedRoles: string[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isLoggedIn, currentUser } = useAuthStore();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(currentUser?.role || "")) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

# Rodar: npm run test -- ProtectedRoute.test.ts
# Resultado esperado: 3 testes PASSANDO (GREEN) ✅✅✅
```

```bash
# STEP 3: REFACTOR — Código mais limpo
# Extrair lógica de validação

const isUserAuthorized = (role: string | undefined, allowedRoles: string[]): boolean =>
  role ? allowedRoles.includes(role) : false;

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isLoggedIn, currentUser } = useAuthStore();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (!isUserAuthorized(currentUser?.role, allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

# Rodar: npm run test && npm run type-check && npm run lint
# Resultado: tudo OK ✅
```

```bash
# STEP 4: Preparar Commits (Aguardando Autorização)
npm run type-check    # ✅ sem erros
npm run lint         # ✅ sem warnings
npm run test -- --coverage  # ✅ cobertura ✅
npm run build        # ✅ build sucesso

# ⏸️ AGUARDANDO AUTORIZAÇÃO DO USUÁRIO
# Agente ImplementAndCommit pergunta:
# "Deseja autorizar o commit desta mudança?"

# SE USUÁRIO AUTORIZA:
git add .
git commit -m "feat: Criar ProtectedRoute com validação de autenticação"

# Atualizar MEMORY.md
# - Subtarefa 0.1: Status = ✅ DONE
# - Commits: 1/2 (feat feito, falta test)
# - Próxima: 0.2

# SE USUÁRIO NÃO AUTORIZA:
# ⏸️ PARAR — Aguardando nova instrução
```

---

## 5. Continuando Fase 0 (Subtarefas 0.2-0.6)

Após 0.1 concluída, continuar com:

| Subtarefa | Duração | Resumo                                                         | MEMORY.md Atualizar   |
| --------- | ------- | -------------------------------------------------------------- | --------------------- |
| 0.2       | 1.5d    | Integrar routes.ts (24 rotas protegidas)                       | Status → IN_PROGRESS  |
| 0.3       | 2d      | Remover hardcodes role de pages                                | Commits: 2/3          |
| 0.4       | 1d      | Logout seguro local (limpa estado e redireciona, sem endpoint) | Testes: 7/17 passando |
| 0.5       | 0.5d    | UnauthorizedPage com redirect 5s                               | Bloqueadores: nenhum  |
| 0.6       | 0.5d    | Validar rotas públicas não guardadas                           | Próxima: 0.2          |

**Padrão para cada subtarefa:**

1. RED: escrever testes
2. GREEN: implementar
3. REFACTOR: limpar código
4. Commit (com autorização explícita do usuário via agente)
5. Atualizar MEMORY.md

---

## 6. Transição de Fase (Após Fase 0 Completa)

### Checklist Pronto para Fase 0:

- [ ] Todos 6 subtarefas com status ✅ DONE
- [ ] Branch `feature/refactor-auth-guard-global` pronta para PR
- [ ] 6 commits granulares (feat, refactor, test por subtarefa)
- [ ] Cobertura de testes ≥ 80%
- [ ] `npm run build` sucesso
- [ ] MEMORY.md atualizado com "Fase 0 COMPLETE"

### PR e Merge

```bash
# Criar PR em GitHub
# - Título: [REFACTOR] Auth: Segurança de Navegação com ProtectedRoute
# - Descrição: listar 6 subtarefas, 6 commits, testes
# - Atribuir revogador

# Após review aprovado:
git checkout development
git pull origin development
git merge --no-ff feature/refactor-auth-guard-global
git branch -d feature/refactor-auth-guard-global
git push origin development

# Tag de versão (optional):
git tag v0.1.0-refactor-auth
git push origin v0.1.0-refactor-auth
```

### Iniciar Fase 1 em Novo Chat

```bash
# Novo chat, novo implementador lê:
# 1. REFACTORING_QUICK_REFERENCE.md
# 2. Fase 1 seção em REFACTORING_PLAN_GRANULAR_V2.md
# 3. Cópia MEMORY_TEMPLATE.md → /memories/session/MEMORY.md
# 4. Começar feature/refactor-contracts-naming
```

---

## 7. Dúvidas Frequentes (Respostas Rápidas)

**P: Quanto tempo uma fase leva?**  
R: 1-3 semanas dependendo da fase (Fase 0: 1-2 sem; Fase 2-3: 2-3 sem).

**P: Posso trabalhar em paralelo em 2 fases?**  
R: Não recomendado até Fase 1 estar 100% completa. Após Fase 1 OK, Fases 2-4 podem usar branches paralelas.

**P: E se encontrar um bug no backend durante integração?**  
R: Registre em MEMORY.md como "Bloqueador — Endpoint XYZ retorna erro 500" e continue para a próxima subtarefa não bloqueada.

**P: Como validar cobertura de testes?**  
R: `npm run test -- --coverage`. Deve sair lista de cobertura por arquivo.

**P: Branch ficou muito grande. O que fazer?**  
R: Dividir em múltiplas branches (uma por subtarefa). Depois fazer PR de cada uma para development.

**P: Onde encontro endpoints backend documentados?**  
R: `/docs/REFACTORING_QUICK_REFERENCE.md` seção "Endpoints Backend: Resumo por Domínio" ou `/docs/REFACTORING_PLAN_GRANULAR_V2.md` tabela de endpoints.

---

## 8. Documentos de Referência (Sempre Consultáveis)

| Documento                       | Localização                  | Propósito                                          | Quando consultar                 |
| ------------------------------- | ---------------------------- | -------------------------------------------------- | -------------------------------- |
| REFACTORING_QUICK_REFERENCE.md  | `/docs/`                     | Resumo 7 fases numeradas (0-6), endpoints, padrões | Início de cada sessão            |
| REFACTORING_PLAN_GRANULAR_V2.md | `/docs/`                     | Detalhes de 43 subtarefas                          | Ao iniciar subtarefa nova        |
| MEMORY.MD                       | `/memories/session/`         | Progresso de sessão ativa                          | Antes de pausar ou retomar       |
| COMO_COMECAR.md                 | `/docs/`                     | Este arquivo — onboarding                          | 1ª vez ou nova pessoa            |
| CLAUDE.md                       | `root/`                      | Diretrizes obrigatórias (SOLID, Clean Code)        | Quando em dúvida sobre qualidade |
| diagnostico-refatoracao.md      | `.claude/commands/frontend/` | Matriz de riscos consolidada                       | Decisões arquiteturais           |

---

## 9. Checklist de Autorização (Antes de Começar)

- [ ] Backend Spring Boot está rodando em http://localhost:8080?
- [ ] Endpoints `/auth/*`, `/cursos/*`, `/provas/*` estão documentados no Swagger (ou contrato)?
- [ ] CORS está configurado para http://localhost:5173 (Vite dev server)?
- [ ] PostgreSQL 16 + Flyway estão configurados no backend?
- [ ] Você tem acesso de write ao repositório?
- [ ] Git está configurado: `git config user.name` e `git config user.email`?
- [ ] Você leu e entendeu CLAUDE.md (diretrizes obrigatórias)?
- [ ] Você autoriza explicitamente o handoff para `implement-and-commit.agent`, se decidir implementar agora?
- [ ] Você autoriza explicitamente commits git, se a execução for aprovada?
- [ ] Você autoriza explicitamente `git push` e PR, se tudo passar?
- [ ] Você entende que a próxima subtarefa ou fase nunca deve começar automaticamente?

---

## 10. Primeiros Passos (Próximas 2 horas)

```
[14:00] Ler REFACTORING_QUICK_REFERENCE.md (10 min)
[14:10] Ler Fase 0 em REFACTORING_PLAN_GRANULAR_V2.md (15 min)
[14:25] Setup: clone, pnpm install, pnpm build, pnpm test (20 min)
[14:45] /start-implementation → validar contexto (5 min)
[14:50] /status-refactoring → ver próxima subtarefa ready (5 min)
[14:55] Revisar etapa Git de planejamento do executor (branch/commits/publicação) (5 min)
[15:00] Responder: seguir planejamento Git ou realizar ajustes (2 min)
[15:02] Autorizar explicitamente o handoff para o executor, se quiser seguir (2 min)
[15:04] Copiar MEMORY_TEMPLATE.md → /memories/session/MEMORY.MD (5 min)
[15:09] RED: escrever testes para ProtectedRoute (30 min)
[15:39] GREEN: implementar ProtectedRoute (30 min)
[16:09] REFACTOR: código mais limpo (20 min)
[16:29] Autorizar commits git, se quiser registrar a execução (2 min)
[16:31] Atualizar MEMORY.MD — Fase 0.1 DONE (10 min)
[16:34] FIM — Deixar branch em estado limpo para próxima sessão
```

---

**Próximas questões?** Consulte REFACTORING_QUICK_REFERENCE.md seção "Dúvidas Frequentes" ou volte a este documento.

**Boa sorte! 🚀**
