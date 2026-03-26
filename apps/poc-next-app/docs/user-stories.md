# User Stories — PoC LLM UFC

Cada story deve gerar um ou mais testes antes da implementacao (TDD).

## Fluxo obrigatorio por story (TDD)

1. Escrever os testes da story e validar falha inicial (RED).
2. Implementar o minimo necessario para os testes passarem (GREEN).
3. Refatorar com cobertura mantida (REFACTOR).
4. Executar validacao final da story com test, type-check, lint e build.
5. Nao iniciar nova story sem concluir o ciclo acima na story atual.

## Governanca obrigatoria de execucao

1. Ler `GEMINI.md` antes de iniciar qualquer story; ele e a diretriz principal para autorizacoes e fluxo de trabalho.
2. Ler e aplicar tambem os contratos da pasta docs (`requisitos-funcionais`, `regras-negocio`, `requisitos-nao-funcionais`, `arquitetura`, `user-stories`).
3. Sugerir commit por etapa da story (RED, GREEN e REFACTOR) seguindo o padrao de commit definido no `GEMINI.md`.

## Escopo deste ciclo

- Foco atual: criação de uma aplicação robusta com Next.js (App Router) e alinhamento FE-BE.
- Implementação de funcionalidades seguindo o paradigma Server-First e Server Actions.
- Garantir a integridade da arquitetura em camadas e padrões de segurança/acessibilidade (WCAG 2.1/2.2 AA).
- Preservar layout/UX existente durante a implementação das novas funcionalidades.

## ADMIN

- **US-A01**: Como admin, quero listar todos os usuarios para gerenciar acessos a plataforma.
  - Criterios observaveis: lista paginada com status de conta e identificacao do perfil.
- **US-A02**: Como admin, quero ativar uma conta inativa para liberar o acesso do usuario.
  - Criterios observaveis: apos ativacao, usuario passa a autenticar com sucesso.
- **US-A03**: Como admin, quero desativar uma conta ativa para revogar o acesso.
  - Criterios observaveis: apos desativacao, autenticacao e bloqueada com mensagem adequada.

## PROFESSOR

### Acesso

- **US-P01**: Como professor, quero me cadastrar informando nome, CPF, email, senha e perfil.
  - Criterios observaveis: conta criada como INATIVO e pendente de ativacao admin.
- **US-P02**: Como professor, quero fazer login com email e senha e receber JWT valido.
  - Criterios observaveis: access e refresh token emitidos e sessao autenticada.
- **US-P03**: Como professor, quero recuperar minha senha via email quando esqueca-la.
  - Criterios observaveis: envio de token e orientacao de expiracao.
- **US-P04**: Como professor, quero redefinir minha senha usando token recebido por email.
  - Criterios observaveis: token de uso unico e rejeicao de token expirado.

### Perfil

- **US-P05**: Como professor, quero fazer upload da minha foto de perfil.
  - Criterios observaveis: valida formato e dimensao minima antes da persistencia.
- **US-P06**: Como professor, quero visualizar meus dados com CPF e email somente leitura.
  - Criterios observaveis: campos bloqueados para edicao no frontend.
- **US-P07**: Como professor, quero alterar minha senha com senha atual e nova senha.
  - Criterios observaveis: backend valida senha atual e confirma alteracao.

### Cursos

- **US-P08**: Como professor, quero criar curso com capa, titulo, categoria, descricao e carga horaria.
  - Criterios observaveis: curso criado com status inicial RASCUNHO.
- **US-P09**: Como professor, quero configurar dados adicionais da matricula (endereco, genero, idade).
  - Criterios observaveis: regras de matricula salvas no curso.
- **US-P10**: Como professor, quero listar meus cursos separados por ativos e arquivados.
  - Criterios observaveis: separacao por status sem alterar layout atual de listagem.
- **US-P11**: Como professor, quero buscar meus cursos por texto.
  - Criterios observaveis: busca por titulo e categoria com retorno aderente ao backend.
- **US-P12**: Como professor, quero editar dados de um curso existente.
  - Criterios observaveis: formulario pre-preenchido com dados atuais.
- **US-P13**: Como professor, quero publicar um curso para torna-lo visivel a alunos.
  - Criterios observaveis: curso PUBLICADO aparece no fluxo de aluno.
- **US-P14**: Como professor, quero arquivar curso para remove-lo da listagem ativa.
  - Criterios observaveis: curso movido para listagem de arquivados.
- **US-P15**: Como professor, quero excluir curso sem alunos matriculados.
  - Criterios observaveis: bloqueio de exclusao quando regra de negocio impedir.

### Modulos

- **US-P16**: Como professor, quero adicionar modulos com nomes gerados automaticamente.
  - Criterios observaveis: nomenclatura incremental consistente apos criacao.
- **US-P17**: Como professor, quero fazer upload de capa de modulo.
  - Criterios observaveis: arquivo valido persistido e exibido na interface.
- **US-P18**: Como professor, quero excluir modulo e renumerar os demais automaticamente.
  - Criterios observaveis: ordem de modulos atualizada apos exclusao.
- **US-P19**: Como professor, quero reordenar modulos de um curso.
  - Criterios observaveis: ordem persistida e refletida na visualizacao.

### Aulas

- **US-P20**: Como professor, quero adicionar aula a um modulo informando nome.
  - Criterios observaveis: aula criada e listada na ordem correta.
- **US-P21**: Como professor, quero fazer upload de PDF ou video para uma aula.
  - Criterios observaveis: validacao de tipo e persistencia com feedback de sucesso.
- **US-P22**: Como professor, quero digitar conteudo rich text em uma aula.
  - Criterios observaveis: conteudo sanitizado e salvo sem quebrar visualizacao.
- **US-P23**: Como professor, quero ter arquivo e rich text na mesma aula.
  - Criterios observaveis: coexistencia dos dois formatos em uma unica aula.
- **US-P24**: Como professor, quero reordenar aulas dentro de um modulo.
  - Criterios observaveis: ordem refletida no consumo da trilha.

### Conteudo via IA

- **US-P25**: Como professor, quero que a IA gere conteudo formatado de aula.
  - Criterios observaveis: resposta em HTML com preview para revisao.
- **US-P26**: Como professor, quero visualizar preview antes de salvar.
  - Criterios observaveis: conteudo nao persistido enquanto nao houver confirmacao.
- **US-P27**: Como professor, quero confirmar o conteudo gerado para salvar.
  - Criterios observaveis: persistencia ocorre apenas apos confirmacao explicita.
- **US-P28**: Como professor, quero pedir nova geracao se nao gostar do resultado.
  - Criterios observaveis: nova resposta substitui preview sem salvar automaticamente.

### Provas

- **US-P29**: Como professor, quero criar prova vinculada a um modulo.
  - Criterios observaveis: modulo pode ter no maximo uma prova ativa.
- **US-P30**: Como professor, quero adicionar perguntas com alternativas e resposta correta.
  - Criterios observaveis: validacao de minimo 2 alternativas e uma correta.
- **US-P31**: Como professor, quero configurar pontuacao por pergunta.
  - Criterios observaveis: total da prova considera pesos configurados.
- **US-P32**: Como professor, quero configurar exibicao de respostas erradas ao aluno.
  - Criterios observaveis: comportamento respeita checkbox independente.
- **US-P33**: Como professor, quero configurar exibicao de respostas corretas.
  - Criterios observaveis: comportamento respeita checkbox independente.
- **US-P34**: Como professor, quero configurar exibicao de valores de pontuacao.
  - Criterios observaveis: comportamento respeita checkbox independente.

### Quiz via IA

- **US-P35**: Como professor, quero que a IA gere perguntas lendo conteudo do modulo.
  - Criterios observaveis: retorno em JSON com perguntas, alternativas e sugestao de correta.
- **US-P36**: Como professor, quero revisar e editar perguntas geradas antes de salvar.
  - Criterios observaveis: fluxo de revisao nao persiste automaticamente.
- **US-P37**: Como professor, quero salvar perguntas editadas na prova do modulo.
  - Criterios observaveis: persistencia final ocorre via endpoint padrao de prova.

## Diretrizes Tecnicas para Implementacao

- **Stories:** Aplicar Clean Code, SOLID, naming semantico e logica declarativa ao implementar stories.
- **Paradigma Server-First:** Priorizar React Server Components (RSC). Usar `"use client"` apenas quando necessário para interatividade.
- **Mutações:** Utilizar exclusivamente Server Actions (`"use server"`) na pasta `src/services/` para envio de dados.
- **Data Fetching:** Utilizar `fetch` nativo do Next.js diretamente nos Server Components para carregamento inicial.
- **Estado Global:** Utilizar Zustand para gerenciar o estado interativo no lado do cliente (ex: Quiz).
- **Segurança (OWASP):** Implementar validações rigorosas (Zod), sanitização e evitar exposição de dados sensíveis.
- **Acessibilidade:** Garantir que todos os componentes e fluxos sigam rigorosamente os padrões WCAG 2.1/2.2 AA.
- **Arquitetura:** Manter a separação entre Camada de Rede (API), Camada de Estado e Camada de UI.
- **Layout:** É estritamente proibido alterar classes Tailwind que afetem o posicionamento ou design visual existente.
