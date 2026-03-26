# MVP Implementation Plan — PoC LLM UFC

Este plano detalha as etapas granulares para a entrega do MVP, seguindo as diretrizes de **Next.js (App Router)**, **Server-First**, **Segurança (OWASP)** e **Acessibilidade (WCAG)**.

## 🛠️ Fase 0: Infraestrutura e Base Técnica
- [ ] **0.1 Setup de Tipagem:** Sincronizar `@ava-poc/types` com os modelos do backend e criar schemas **Zod** iniciais dentro de `src/modules/{feature}/schemas/`.
- [ ] **0.2 Camada de Rede (API):** Implementar cliente **Axios** em `src/shared/lib/axios.ts` com suporte a interceptores para Refresh Token (JWT).
- [ ] **0.3 Estado Global (Zustand):** Criar `src/modules/auth/store/auth.store.ts` para gerenciar tokens e estado de autenticação local.
- [ ] **0.4 Middlewares:** Configurar `src/middleware.ts` para proteção de rotas (Guest, Autenticado, Admin).

## 🔐 Fase 1: Autenticação e Gestão de Usuários (US-P01 a US-P04, US-A01 a US-A03)
- [ ] **1.1 Cadastro (TDD):** Implementar Server Action em `src/modules/auth/actions/register-action.ts`. Validar input com **Zod**. Validar status inicial `INATIVO`.
- [ ] **1.2 Login:** Implementar Server Action em `src/modules/auth/actions/login-action.ts`. Armazenar tokens via **Axios interceptors** ou Cookies.
- [ ] **1.3 Recuperação de Senha:** Fluxo de esqueci senha e redefinição com token em `src/modules/auth/actions/password-action.ts`.
- [ ] **1.4 Painel Admin:** Implementar listagem e ações em `src/modules/admin/actions/`.

## 👤 Fase 2: Perfil e Configurações (US-P05 a US-P07)
- [ ] **2.1 Visualização de Perfil:** Garantir RN03 (CPF e Email Read-only).
- [ ] **2.2 Upload de Foto:** Implementar Server Action em `src/modules/user/actions/upload-photo.ts` com validação MIME type (Apache Tika no BE).
- [ ] **2.3 Alteração de Senha:** Validar senha atual antes da troca via Server Action.

## 📚 Fase 3: Gestão de Cursos e Conteúdo (US-P08 a US-P15)
- [ ] **3.1 CRUD de Cursos:** Implementar criação/edição via `src/modules/course/actions/` com status `RASCUNHO`.
- [ ] **3.2 Upload de Capa:** Integração com serviço de storage local em `src/modules/course/actions/upload-cover.ts`.
- [ ] **3.3 Configuração de Matrícula:** Checkboxes para requisitos de endereço, gênero e idade.
- [ ] **3.4 Listagem e Filtros:** Implementar busca por texto e separação Ativos/Arquivados via `src/modules/course/actions/get-courses.ts`.

## 📦 Fase 4: Estrutura Pedagógica (Módulos e Aulas) (US-P16 a US-P24)
- [ ] **4.1 Gestão de Módulos:** Criação automática (Módulo 01, 02...) e reordenação (RN04).
- [ ] **4.2 Editor de Aulas:** Integrar CKEditor (Rich Text) e Upload de PDF/Vídeo (RN07).
- [ ] **4.3 Coexistência de Conteúdo:** Garantir que uma aula suporte arquivo + texto simultaneamente.

## 🤖 Fase 5: Inteligência Artificial (Conteúdo e Quiz) (US-P25 a US-P28, US-P35 a US-P37)
- [ ] **5.1 Geração de Aula:** Fluxo de `gerar-conteudo` -> Preview -> `confirmar-conteudo` (RN12).
- [ ] **5.2 Geração de Quiz:** Ler conteúdo do módulo via IA e retornar JSON para revisão do professor.

## ✍️ Fase 6: Avaliações (Provas) (US-P29 a US-P34)
- [ ] **6.1 Estrutura da Prova:** Implementar abas de Perguntas, Respostas e Configurações.
- [ ] **6.2 Editor de Perguntas:** Garantir RN05 (Mín. 2 alternativas, 1 correta).
- [ ] **6.3 Configurações de Feedback:** Checkboxes independentes para respostas e valores (RN11).

## 🚀 Fase 7: Homologação e Deploy
- [ ] **7.1 Auditoria de Acessibilidade:** Validar WCAG 2.1 AA em todos os fluxos críticos.
- [ ] **7.2 Testes E2E:** Validar fluxos completos (Cadastro -> Aprovação Admin -> Criação de Curso -> Publicação).
- [ ] **7.3 Build de Produção:** Otimização de bundle e verificação de Server Actions.

---
**Legenda de Prioridade:**
- 🔴 Bloqueante (Infra/Auth)
- 🟡 Essencial (Cursos/Aulas)
- 🟢 Diferencial (IA/UX)
