# Arquitetura — PoC LLM UFC

## Decisões de Arquitetura

| Decisão             | Escolha                                     |
| ------------------- | ------------------------------------------- |
| Upload de arquivos  | Local no servidor (disco)                   |
| Categorias de curso | Dinâmicas com deduplicação case-insensitive |
| Prova               | Vinculada ao módulo (1:1)                   |
| Conteúdo da aula    | Arquivo + CKEditor coexistem                |
| Pacote raiz         | `br.ufc.llm`                                |

## Entidades e Relacionamentos

```
Usuario (1) ──> (N) Curso            [professor_id FK]
Curso   (1) ──> (N) Modulo           [curso_id FK, ON DELETE CASCADE]
Modulo  (1) ──> (N) Aula             [modulo_id FK, ON DELETE CASCADE]
Modulo  (1) ──> (0..1) Prova         [modulo_id FK UNIQUE, ON DELETE CASCADE]
Prova   (1) ──> (N) Pergunta         [prova_id FK, ON DELETE CASCADE]
Pergunta(1) ──> (N) Alternativa      [pergunta_id FK, ON DELETE CASCADE]
Usuario (1) ──> (N) TokenRecuperacao [usuario_id FK]
```

## Tabelas do Banco (PostgreSQL)

```sql
CREATE TABLE usuarios (
    id          BIGSERIAL PRIMARY KEY,
    nome        VARCHAR(255) NOT NULL,
    cpf         VARCHAR(14)  NOT NULL UNIQUE,
    email       VARCHAR(255) NOT NULL UNIQUE,
    senha       VARCHAR(255) NOT NULL,             -- BCrypt
    perfil      VARCHAR(20)  NOT NULL,             -- PROFESSOR | ALUNO | ADMIN
    status      VARCHAR(10)  NOT NULL DEFAULT 'INATIVO',
    foto_perfil VARCHAR(500),                      -- path local
    criado_em   TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE tokens_recuperacao_senha (
    id         BIGSERIAL    PRIMARY KEY,
    token      VARCHAR(255) NOT NULL UNIQUE,
    expiracao  TIMESTAMP    NOT NULL,
    usado      BOOLEAN      NOT NULL DEFAULT FALSE,
    usuario_id BIGINT       NOT NULL REFERENCES usuarios(id)
);

CREATE TABLE cursos (
    id              BIGSERIAL    PRIMARY KEY,
    titulo          VARCHAR(255) NOT NULL,
    categoria       VARCHAR(100) NOT NULL,
    descricao       TEXT         NOT NULL,
    carga_horaria   VARCHAR(20)  NOT NULL,         -- ex: "30h"
    capa            VARCHAR(500),                  -- path local
    status          VARCHAR(20)  NOT NULL DEFAULT 'RASCUNHO',
    requer_endereco BOOLEAN      NOT NULL DEFAULT FALSE,
    requer_genero   BOOLEAN      NOT NULL DEFAULT FALSE,
    requer_idade    BOOLEAN      NOT NULL DEFAULT FALSE,
    professor_id    BIGINT       NOT NULL REFERENCES usuarios(id),
    criado_em       TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE modulos (
    id       BIGSERIAL   PRIMARY KEY,
    nome     VARCHAR(50) NOT NULL,                 -- "Módulo 01", "Módulo 02"...
    ordem    INT         NOT NULL,
    capa     VARCHAR(500),
    curso_id BIGINT      NOT NULL REFERENCES cursos(id) ON DELETE CASCADE
);

CREATE TABLE aulas (
    id                 BIGSERIAL    PRIMARY KEY,
    nome               VARCHAR(255) NOT NULL,
    ordem              INT          NOT NULL,
    arquivo            VARCHAR(500),               -- path local
    tipo_arquivo       VARCHAR(10),                -- PDF | VIDEO
    conteudo_ck_editor TEXT,                       -- HTML digitado pelo professor
    conteudo_gerado    TEXT,                       -- HTML gerado e confirmado pela IA
    modulo_id          BIGINT       NOT NULL REFERENCES modulos(id) ON DELETE CASCADE
);

CREATE TABLE provas (
    id                         BIGSERIAL PRIMARY KEY,
    modulo_id                  BIGINT    NOT NULL UNIQUE REFERENCES modulos(id) ON DELETE CASCADE,
    mostrar_respostas_erradas  BOOLEAN   NOT NULL DEFAULT FALSE,
    mostrar_respostas_corretas BOOLEAN   NOT NULL DEFAULT FALSE,
    mostrar_valores            BOOLEAN   NOT NULL DEFAULT FALSE
);

CREATE TABLE perguntas (
    id        BIGSERIAL PRIMARY KEY,
    enunciado TEXT      NOT NULL,
    pontos    INT       NOT NULL DEFAULT 1,
    ordem     INT       NOT NULL,
    prova_id  BIGINT    NOT NULL REFERENCES provas(id) ON DELETE CASCADE
);

CREATE TABLE alternativas (
    id          BIGSERIAL PRIMARY KEY,
    texto       TEXT      NOT NULL,
    correta     BOOLEAN   NOT NULL DEFAULT FALSE,
    pergunta_id BIGINT    NOT NULL REFERENCES perguntas(id) ON DELETE CASCADE
);
```

## Endpoints REST

**NOTA IMPORTANTE:** Endpoints em **INGLÊS** (backend Java Spring Boot). Updated 09/04/2026 para refletir implementação real.

### Courses

| Método | Endpoint                     | Descrição                        | Content-Type        |
| ------ | ---------------------------- | -------------------------------- | ------------------- |
| GET    | `/courses`                   | Listar cursos (Professor logado) | application/json    |
| POST   | `/courses`                   | Criar curso (form-data com JSON) | multipart/form-data |
| GET    | `/courses/{courseId}`        | Buscar curso por ID              | application/json    |
| PUT    | `/courses/{courseId}`        | Editar curso                     | multipart/form-data |
| DELETE | `/courses/{courseId}`        | Excluir curso                    | —                   |
| PATCH  | `/courses/{courseId}/status` | Alterar status                   | application/json    |
| GET    | `/courses/search?q=termo`    | Buscar por texto                 | application/json    |

### Modules

| Método | Endpoint                      | Descrição                        | Content-Type        |
| ------ | ----------------------------- | -------------------------------- | ------------------- |
| GET    | `/courses/{courseId}/modules` | Listar módulos de um curso       | application/json    |
| POST   | `/courses/{courseId}/modules` | Criar módulo (form-data)         | multipart/form-data |
| PUT    | `/modules/{moduleId}`         | Editar módulo                    | multipart/form-data |
| DELETE | `/modules/{moduleId}`         | Excluir módulo (renumera demais) | —                   |
| PATCH  | `/modules/{moduleId}/order`   | Reordenar módulo                 | application/json    |

### Lessons

| Método | Endpoint                                         | Descrição                          | Content-Type        |
| ------ | ------------------------------------------------ | ---------------------------------- | ------------------- |
| GET    | `/courses/{courseId}/modules/{moduleId}/lessons` | Listar aulas                       | application/json    |
| POST   | `/modules/{moduleId}/lessons`                    | Criar aula (form-data)             | multipart/form-data |
| PUT    | `/lessons/{lessonId}`                            | Editar aula                        | multipart/form-data |
| DELETE | `/lessons/{lessonId}`                            | Excluir aula                       | —                   |
| PATCH  | `/lessons/{lessonId}/order`                      | Reordenar aula                     | application/json    |
| POST   | `/lessons/{lessonId}/generate-content`           | Spring AI: gera conteúdo (preview) | application/json    |
| POST   | `/lessons/{lessonId}/confirm-content`            | Salvar conteúdo gerado pela IA     | application/json    |

### Quizzes

| Método | Endpoint                                    | Descrição                                 | Content-Type        |
| ------ | ------------------------------------------- | ----------------------------------------- | ------------------- |
| GET    | `/modules/{moduleId}/quiz`                  | Buscar quiz do módulo                     | application/json    |
| POST   | `/modules/{moduleId}/quiz`                  | Criar quiz                                | multipart/form-data |
| PUT    | `/quizzes/{quizId}`                         | Editar configurações                      | application/json    |
| DELETE | `/quizzes/{quizId}`                         | Excluir quiz                              | —                   |
| POST   | `/modules/{moduleId}/quiz/generate-quiz-ia` | Spring AI: gera quiz (preview, não salva) | application/json    |

### Questions

| Método | Endpoint                      | Descrição          | Content-Type     |
| ------ | ----------------------------- | ------------------ | ---------------- |
| GET    | `/quizzes/{quizId}/questions` | Listar perguntas   | application/json |
| POST   | `/quizzes/{quizId}/questions` | Adicionar pergunta | application/json |
| PUT    | `/questions/{questionId}`     | Editar pergunta    | application/json |
| DELETE | `/questions/{questionId}`     | Excluir pergunta   | —                |

### Alternatives

| Método | Endpoint                               | Descrição             | Content-Type     |
| ------ | -------------------------------------- | --------------------- | ---------------- |
| GET    | `/questions/{questionId}/alternatives` | Listar alternativas   | application/json |
| POST   | `/questions/{questionId}/alternatives` | Adicionar alternativa | application/json |
| PUT    | `/alternatives/{alternativeId}`        | Editar alternativa    | application/json |
| DELETE | `/alternatives/{alternativeId}`        | Excluir alternativa   | —                |

### Auth (Se aplicável)

| Método | Endpoint         | Descrição         |
| ------ | ---------------- | ----------------- |
| POST   | `/auth/login`    | Login → JWT token |
| POST   | `/auth/refresh`  | Renovar token     |
| POST   | `/auth/register` | Registrar usuário |

**Nota contratual:** Nenhum endpoint de logout documentado. Logout é exclusivamente local (limpar state + storage).
