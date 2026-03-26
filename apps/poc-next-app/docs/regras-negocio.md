# Regras de Negocio — PoC LLM UFC

Use este arquivo para orientar implementacao de services, validacoes, testes e integracao FE-BE.

## Escopo

- Frontend deve aplicar essas regras sem alterar layout e sem duplicar regra de dominio quando o backend ja valida.
- Neste ciclo, o objetivo e executar a refatoracao com rastreabilidade por fluxo e validacao de aderencia FE-BE.

## Regras Mandatorias

### RN01 - Ativacao de conta

Conta criada com status INATIVO; somente ADMIN pode ativar. Usuario INATIVO nao acessa plataforma.

### RN02 - Propriedade de curso

PROFESSOR gerencia apenas cursos que criou. Operacoes de editar/publicar/arquivar/excluir respeitam ownership.

### RN03 - Imutabilidade de CPF e email

CPF e email sao imutaveis apos cadastro. Frontend exibe esses campos como somente leitura.

### RN04 - Renumeracao de modulos

Ao excluir modulo, demais modulos do curso sao renumerados automaticamente. Interface reflete ordem retornada pelo backend.

### RN05 - Consistencia de pergunta

Pergunta com minimo de 2 alternativas e exatamente 1 correta. Formulario bloqueia combinacoes invalidas.

### RN06 - Visibilidade de curso

Curso em RASCUNHO nao e visivel para alunos. Somente cursos PUBLICADOS aparecem.

### RN07 - Tipos de arquivo de aula

Formatos aceitos: PDF, MP4, AVI, MOV, WebM. Tipos fora da regra sao rejeitados com mensagem clara.

### RN08 - Foto de perfil

Formatos JPG, PNG, GIF com dimensao minima 200x200. Feedback imediato para arquivo invalido.

### RN09 - Token de recuperacao

Token expira em 30 minutos e uso unico. Telas tratam token expirado/usado com orientacao clara.

### RN10 - Deduplicacao de categoria

Categoria case-insensitive (IA, ia, Ia equivalentes). UI exibe categoria normalizada conforme retorno backend.

### RN11 - Configuracoes da prova independentes

Exibir respostas erradas, corretas e valores sao opcoes independentes e podem ser ligadas/desligadas sem dependencia.

### RN12 - Confirmacao explicita de conteudo IA

Conteudo gerado por IA nao persiste automaticamente. Salvar ocorre apenas apos acao explicita do professor.

## Rastreabilidade no Frontend

- Guardas de autenticacao e autorizacao devem respeitar regras de negocio sem alterar navegacao existente.
- Quando houver divergencia entre comportamento da tela e regra de negocio, priorizar regra backend e registrar ajuste contratual.
