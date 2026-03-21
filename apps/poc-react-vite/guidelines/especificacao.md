# Documento de Especificação Técnica: POC Multi-Framework (AVA)

# Documento de Especificação Técnica: POC Multi-Framework (AVA)
Este documento estabelece as especificações técnicas, arquiteturais e funcionais definitivas para a Prova de Conceito (POC) de comparação entre React (Vite), Vue.ts e Next.js. O objetivo é avaliar performance, segurança (OWASP WSTG) e Experiência de Desenvolvimento (DX), forçando o uso dos recursos nativos e idiomáticos de cada ecossistema. O sucesso desta POC definirá a stack oficial do ecossistema multiplataforma.
## 1\. Visão Geral e Paradigma de Usuário Único
Para simplificar o MVP e focar na validação técnica, o sistema adota um paradigma de Perfil Universal:
*   Não existirão perfis distintos (Aluno vs. Professor) a nível de banco de dados ou controle de acesso rígido nesta POC.
## 2\. Abordagem Arquitetural (Layered Architecture)
A POC utilizará uma arquitetura de Monorepo com baixo acoplamento. Não haverá compartilhamento de lógica de negócios ou clientes de API.
O objetivo desta decisão é garantir que a avaliação reflita o verdadeiro potencial do ecossistema de cada framework, testando como cada tecnologia resolve os mesmos problemas à sua própria maneira e como interage com um servidor externo real.
Aqui está a estrutura de diretórios padronizada para as três aplicações e para o pacote de tipagens. Esta organização garante que a lógica de rede, o estado e a interface estejam isolados e sejam fáceis de auditar durante a POC.
### 2.1 Estrutura Geral do Monorepo

```go
/solar-poc
├── /apps
│   ├── /poc-react-vite
│   ├── /poc-next-app
│   └── /poc-vue-ts
├── /packages
│   └── /types
│       ├── index.ts
│       └── package.json
├── package.json
└── turbo.json
```

* * *
### 2.2 Estrutura: React (Vite)

Localizada em `/apps/poc-react-vite/src`

```bash
src/
├── assets/             # Imagens, ícones e SVGs exportados do Figma.
├── components/
│   ├── ui/             # Componentes visuais isolados (Design System: Botões, Inputs).
│   └── shared/         # Componentes compostos e com contexto (CourseCard, Header).
├── hooks/              # Toda a lógica de negócio e data fetching (useQuiz, useUpload).
├── pages/              # Ecrãs principais roteados pelo React Router (Home, Prova).
├── services/           # Configuração do Axios/Fetch e chamadas à API externa.
├── store/              # Gestão de estado global utilizando o Zustand.
├── styles/             # Configurações do Tailwind CSS e ficheiros de estilo globais.
├── App.tsx             # Definição do Router e Providers.
└── main.tsx            # Ponto de entrada (Entry point).
```

### 2.3 Estrutura: Next.js (App Router)

Localizada em `/apps/poc-next-app/src`

```bash
src/
├── app/                # Server Components, Layouts, e roteamento da aplicação.
├── assets/             # Recursos estáticos.
├── components/
│   ├── ui/             # Componentes base puramente visuais (Client ou Server).
│   └── shared/         # Estruturas complexas (ex: Player de Vídeo, Formulários).
├── hooks/              # Custom Hooks para os Client Components (interatividade).
├── services/           # Funções de Fetch (Server-side) e ficheiros de Server Actions.
├── store/              # Zustand para estados estritamente client-side (ex: Quiz).
├── styles/             # Ficheiros globais do Tailwind.
└── middleware.ts       # Gestão de sessão e proteção de rotas privadas.
```

### 2.4 Estrutura: Vue.ts (Vite)

Localizada em `/apps/poc-vue-ts/src`

```php
src/
├── assets/             # Recursos visuais estáticos.
├── components/
│   ├── ui/             # Single File Components (SFCs) de base (Botões, Inputs).
│   └── shared/         # SFCs complexos que agregam múltiplos componentes.
├── composables/        # Toda a reatividade e lógicas de data fetching (useQuizAPI).
├── views/              # Ecrãs mapeados pelo Vue Router (Dashboard, Catalogo).
├── services/           # Instância configurada do Axios/Fetch para a API real.
├── store/              # Lojas do Pinia para gestão de estado da aplicação.
├── router/             # Definição de rotas e Navigation Guards (WSTG-SESS).
├── styles/             # Tailwind CSS global.
├── App.vue             # Componente raiz.
└── main.ts             # Instanciação da aplicação Vue.
```

* * *
### 2.5 Estrutura Padronizada de Pastas
Ao aceder à pasta `src/` de qualquer um dos projetos, a seguinte hierarquia deverá ser respeitada (com as devidas adaptações de roteamento de cada framework):
*   `assets/`: Imagens, ícones e recursos estáticos.
*   `components/ui/`: Componentes visuais isolados, simples e reutilizáveis (Design System). Não possuem lógica de API.
*   `components/shared/`: Componentes compostos e com contexto (ex: `CourseCard`, Player de Vídeo, Formulários) que podem estar ligados a estados globais ou hooks.
*   `hooks/` (ou `composables/` no Vue): Onde fica toda a lógica de manipulação de dados, reatividade e estados de carregamento.
*   `services/`: Onde se localiza a configuração da conexão com a API e chamadas externas. No Next.js, abrigará os ficheiros de Server Actions. Os erros HTTP são tratados antes de chegarem à UI, garantindo também que formatos de arquivo inesperados retornados pelo backend sejam interceptados e validados preventivamente nesta camada.
*   `store/`: Gestão de estado global (Zustand ou Pinia) utilizada para dados que precisam persistir entre trocas de páginas.
*   `pages/` (React), `views/` (Vue), ou `app/` (Next): Telas principais e roteamento da aplicação.
Dica de Arquitetura:
> "Caso encontre um arquivo com mais de 200 linhas, isso indica que é necessário mover a lógica para a pasta `hooks` / `composables` ou fatiar o componente em `components/shared`."
## 3\. Contratos de Dados Globais (TypeScript)
Para padronizar o domínio de software, a nomenclatura será inteiramente em inglês. Estes contratos estarão disponíveis no pacote `@ava-poc/types` e devem ser consumidos por todas as frentes para garantir paridade.

```typescript
export interface ICourse {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  modules: IModule[];
}

export interface IModule {
  id: string;
  courseId: string;
  title: string;
  lessons: ILesson[];
}

export interface ILesson {
  id: string;
  moduleId: string;
  title: string;
  content: string; 
  mediaUrl?: string; 
}

export interface IQuiz {
  id: string;
  courseId: string;
  title: string;
  questions: IQuestion[];
}

export interface IQuestion {
  id: string;
  quizId: string;
  text: string; 
  type: 'multiple_choice' | 'true_false' | 'open_ended';
  options?: string[]; 
  correctAnswer?: string; 
}

export interface IStudentSubmission {
  quizId: string;
  studentId: string;
  answers: Record<string, string>; 
}

export interface IUserSession {
  id: string;
  name: string;
  email: string;
  enrolledCourseIds: string[]; 
}
```

## 4\. Mapa de Rotas e Telas (Nomenclatura Padrão)
### 4.1 Public Routes (Deslogado)
*   `/login` : Autenticação.
*   `/register` : Cadastro.
*   `/forgot-password` : Recuperação de credenciais.
### 4.2 Core & Catalog (Privado)
*   `/courses` : Catálogo Principal.
*   `/my-courses` : Cursos matriculados (`enrolledCourseIds`).
### 4.3 Consumo do Curso (antiga visão como aluno)
*   `/courses/:courseId` : Detalhes do Curso (Ementa).
*   `/courses/:courseId/enroll` : Efetivação da matrícula.
*   `/courses/:courseId/modules` : Listagem de módulos.
*   `/courses/:courseId/modules/:moduleId/lessons/:lessonId` : Sala de aula virtual.
*   `/courses/:courseId/quiz/instructions` : Regras da avaliação.
*   `/courses/:courseId/quiz` : Execução do Quiz interativo.
*   `/courses/:courseId/quiz/results` : Nota e feedback final.
### 4.4 Creator Journey (Produção Linear e Upload)
*   `/create-course` : Criação/Edição de curso base.
*   `/courses/:courseId/modules/create` : Criação/Edição de módulo.
*   `/courses/:courseId/modules/:moduleId/lessons/create` : Criação/Edição de aula.
*   `/courses/:courseId/quiz/create` : Formulário de envio do material de base do curso para a API externa processar e devolver o Quiz.
## 5\. Escopo Funcional (MVP da POC)
As três aplicações devem implementar exatamente as mesmas interfaces e fluxos, garantindo a paridade visual e funcional:
*   **Landing Page**: Listagem dinâmica dos cursos disponíveis (consumindo dados da API, caso aplicável, ou local para a estrutura base).
*   **Visualização de Curso:** Estrutura de navegação contendo módulos. Dentro dos módulos ficarão as aulas.
*   **Sistema de Quiz Interativo:** Todo módulo encerra com um quiz.
*   **Jornada do Criador (Upload & Geração de Quiz via API)**:
    *   Formulário de cadastro de curso.
    *   Componente de upload com suporte a múltiplos formatos de mídia, incluindo documentos (PDF, DOCX), imagens (JPG, PNG) e vídeos (MP4).
    *   Integração: Os arquivos de mídia devem ser enviados via requisição HTTP (`multipart/form-data`) para a API.
    *   O frontend deve aguardar o processamento do backend, capturar o JSON retornado com as perguntas do quiz, tratar possíveis erros de timeout/status da API, e injetar os dados no estado da aplicação para serem consumidos pelos alunos.
## 6\. Matriz de Avaliação e Segurança (OWASP WSTG)
Cada stack será avaliada na forma como implementa as defesas contra vulnerabilidades comuns e como lida com o tráfego de dados reais:

| Pilar OWASP | Vetor de Teste na POC | Requisito de Implementação Nativa |  |
| ---| ---| ---| --- |
| WSTG-INPV-001 | Validação de Input (Upload Multi-formato) | React/Vue: Implementar validação estrita no Client-Side antes de acionar a API.<br><br><br>Next.js: Implementar dupla validação (Client-Side e via Server Actions) antes de repassar o stream/buffer para a API externa.<br><br><br>React/Vue e Next.js: Implementação de uma Whitelist (lista de permissões) de MIME types e limites de tamanho dinâmicos baseados no tipo do arquivo (ex: 5MB para documentos, 50MB para vídeos). É obrigatório o uso de bibliotecas de validação de schema (como o Zod) para centralizar essas regras. |  |
| WSTG-CLNT-001 | Prevenção de DOM-based XSS | Como cada framework impede que o JSON do Quiz retornado pela API real injete scripts. É proibido o uso de `dangerouslySetInnerHTML` e `v-html`. |  |
| WSTG-SESS-002 | Gestão de Estado e Sessão | React/Vue: Avaliar armazenamento seguro de tokens JWT (fornecidos pela API) utilizando Zustand/Pinia ou HTTPOnly Cookies (via interceptors).<br><br><br>Next.js: Implementar Middleware utilizando Cookies HttpOnly/Secure de forma nativa. |  |
| WSTG-CONF-012 | Content Security Policy (CSP) | Comparar o esforço de configuração de headers e meta tags restritivos, permitindo conexões apenas para o domínio da API real (`connect-src`). |  |

## 7\. Métricas de Comparação e DX (Developer Experience)
O sucesso e o veredito da POC se basearão na coleta comparativa de três categorias de métricas em ambiente de produção:
1. **Performance e UX:**
    *   Comparação de LCP (Largest Contentful Paint) e FCP (First Contentful Paint) aferidos via Lighthouse.
    *   Tratamento de Assincronicidade: Como cada interface se comporta (esqueletos de carregamento, feedback visual) enquanto aguarda o retorno pesado do processamento de média pela API.
2. **Eficiência de Rede (Data Fetching):**
    *   Comparação entre chamadas baseadas em Axios/Fetch no lado do cliente (React/Vue) vs. requisições nativas estendidas no servidor (Next.js Server Components e Server Actions).
3. **Ergonomia e Manutenibilidade:**
    *   Tamanho final do bundle JavaScript gerado.
    *   Tratamento de exceções e erros HTTP (4xx, 5xx) retornados pela API.
## 8\. Fluxo de Desenvolvimento Assistido por IA (Gemini)
*   **Configuração e fluxo de trabalho para React.ts**
    *   Private ([https://app.clickup.com/90171026138/docs/2kz9tapu-1717/2kz9tapu-317](https://app.clickup.com/90171026138/docs/2kz9tapu-1717/2kz9tapu-317))
    *   Private ([https://app.clickup.com/90171026138/docs/2kz9tapu-1717/2kz9tapu-337](https://app.clickup.com/90171026138/docs/2kz9tapu-1717/2kz9tapu-337))
    
*   **Configuração e fluxo de trabalho para Next.js**
    *   Private ([https://app.clickup.com/90171026138/docs/2kz9tapu-1697/2kz9tapu-277](https://app.clickup.com/90171026138/docs/2kz9tapu-1697/2kz9tapu-277))
    *   Private ([https://app.clickup.com/90171026138/docs/2kz9tapu-1697/2kz9tapu-297](https://app.clickup.com/90171026138/docs/2kz9tapu-1697/2kz9tapu-297))
    
*   **Configuração e fluxo de trabalho para Vue.ts**
    *   
* * *

Critério de Conclusão: A POC será considerada finalizada quando as três aplicações estiverem em ambiente de _build_ funcional, consumindo e processando os dados da API real com sucesso, e o relatório comparativo de performance, DX e auditoria OWASP estiver consolidado.