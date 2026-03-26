# Requisitos Funcionais — PoC LLM UFC

## Autenticação e Usuários

- **RF01** – Cadastro com nome, CPF, e-mail, senha, perfil (PROFESSOR ou ALUNO)
- **RF02** – Login com e-mail ou nome de usuário + senha → retorna JWT (access + refresh token)
- **RF03** – Recuperação de senha via e-mail (token expira em 30 min)
- **RF04** – Admin ativa ou desativa contas de usuários
- **RF05** – Usuário com status INATIVO não consegue autenticar

**Critério de alinhamento FE-BE:**

- O frontend deve consumir os endpoints de auth sem alterar layout de login, cadastro e recuperacao.

## Perfil

- **RF06** – Upload de foto de perfil (JPG, PNG ou GIF — mín. 200×200px)
- **RF07** – CPF e e-mail são exibidos como somente leitura no perfil
- **RF08** – Alteração de senha requer senha atual + nova senha + confirmação da nova senha

**Critério de alinhamento FE-BE:**

- O frontend deve refletir dados reais de perfil e respeitar imutabilidade de CPF/email.

## Cursos

- **RF09** – Professor realiza CRUD de cursos; gerencia apenas os seus próprios
- **RF10** – Upload de imagem de capa do curso
- **RF11** – Categoria salva com deduplicação case-insensitive
- **RF12** – Carga horária é texto livre (ex: "30h", "20 horas")
- **RF13** – Curso configura quais dados adicionais o aluno deve informar na matrícula: Endereço / Gênero / Idade
- **RF14** – Status do curso: RASCUNHO (padrão) / PUBLICADO / ARQUIVADO
- **RF15** – Listagem de cursos separada por status (ativos e arquivados)
- **RF16** – Editar curso carrega os dados atuais (wizard pré-preenchido)
- **RF17** – Busca de cursos por texto (título ou categoria)

**Critério de alinhamento FE-BE:**

- O frontend deve manter o mesmo fluxo visual de criacao/edicao e passar a consumir contratos reais de cursos.

## Módulos

- **RF18** – CRUD de módulos dentro de um curso
- **RF19** – Nome do módulo gerado automaticamente e de forma incremental (Módulo 01, Módulo 02...)
- **RF20** – Ao deletar módulo, os demais são renumerados automaticamente
- **RF21** – Upload de imagem de capa do módulo

**Critério de alinhamento FE-BE:**

- O frontend deve preservar a experiencia atual e refletir ordem/numeracao retornada pelo backend.

## Aulas

- **RF22** – CRUD de aulas dentro de um módulo
- **RF23** – Upload de arquivo da aula (PDF ou vídeo)
- **RF24** – Campo de conteúdo rich text (HTML via CKEditor), sanitizado antes de persistir
- **RF25** – Arquivo e rich text coexistem na mesma aula

**Critério de alinhamento FE-BE:**

- O frontend deve suportar o mesmo fluxo visual e persistir via endpoints oficiais de aulas.

## Conteúdo Dinâmico via IA (por aula)

- **RF26** – `POST /aulas/{id}/gerar-conteudo`: lê PDF e/ou CKEditor, retorna HTML formatado pela IA
- **RF27** – O conteúdo gerado não é salvo automaticamente — professor confirma, regenera ou edita
- **RF28** – Ao confirmar, HTML é persistido no campo `conteudo_gerado` da aula

**Critério de alinhamento FE-BE:**

- O frontend deve exibir preview do conteudo gerado antes da confirmacao de persistencia.

## Provas (por módulo)

- **RF29** – Criação de prova vinculada a um módulo (opcional — um módulo pode não ter prova)
- **RF30** – Prova organizada em 3 abas: Perguntas / Respostas / Configurações
- **RF31** – Cada pergunta: enunciado + mínimo de 2 alternativas + exatamente 1 marcada como correta
- **RF32** – Pontuação configurável por pergunta (padrão: 1 ponto)
- **RF33** – Aba Configurações: checkboxes independentes — Respostas erradas / Respostas corretas / Valores
- **RF34** – Aba Respostas: estatísticas de respostas dos alunos (leitura — visível após publicação)

**Critério de alinhamento FE-BE:**

- O frontend deve manter a estrutura visual atual da prova e aderir as validacoes contratuais do backend.

## Quiz via IA (por módulo)

- **RF35** – `POST /modulos/{id}/prova/gerar-quiz-ia`: lê todo conteúdo legível do módulo e retorna JSON com perguntas, alternativas e resposta correta sugerida
- **RF36** – O JSON retornado não é persistido — enviado ao front para revisão e edição
- **RF37** – Se não houver conteúdo legível no módulo: retorna 422 com mensagem clara
- **RF38** – Professor edita o resultado e submete ao endpoint padrão de criação da prova

**Critério de alinhamento FE-BE:**

- O frontend deve exibir erro funcional quando receber 422 e permitir revisao completa antes do salvamento.

## Requisitos Funcionais de Integracao e Preservacao de UX

- **RF39** - Integracao frontend-backend deve preservar layout, navegacao e hierarquia visual atuais.
- **RF40** - Fluxos de tela devem usar contratos oficiais de request/response definidos no backend.
- **RF41** - Qualquer fluxo frontend sem endpoint backend documentado deve ser registrado como pendencia contratual.
- **RF42** - Mensagens de erro da API devem ser exibidas de forma compreensivel, sem quebrar a jornada visual.
- **RF43** - Guardas de autenticacao/autorizacao devem existir no frontend sem alterar rotas existentes.
- **RF44** - Estados de carregamento e vazio devem ser tratados em cada fluxo integrado.
