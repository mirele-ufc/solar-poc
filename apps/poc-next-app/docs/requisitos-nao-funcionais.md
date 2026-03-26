# Requisitos Nao Funcionais — PoC LLM UFC

## Escopo deste ciclo

- Este documento inclui requisitos tecnicos de backend e diretrizes tecnicas de frontend.
- As diretrizes de frontend sao mandatorias para implementacao neste ciclo de refatoracao.

## Plataforma Backend

- **RNF01** – Spring Boot 3.4 com Java 21 (virtual threads habilitados via Tomcat)
- **RNF02** – Autenticação stateless com JWT: access token (curta duração) + refresh token (longa duração)
- **RNF03** – Documentação automática via SpringDoc OpenAPI 3 com suporte a Bearer JWT no Swagger UI
- **RNF04** – Banco PostgreSQL 16+ com controle de schema via Flyway (migrations versionadas)
- **RNF05** – Upload de arquivos local com validação de MIME type real via Apache Tika (não só extensão)
- **RNF06** – Senhas armazenadas com BCrypt (fator de custo padrão Spring Security)
- **RNF07** – HTML do CKEditor sanitizado via OWASP Java HTML Sanitizer antes de persistir (proteção XSS)
- **RNF08** – Listagens de cursos paginadas (Spring Data Pageable)
- **RNF09** – Respostas da API padronizadas: `{ data, message, status }` com códigos HTTP corretos
- **RNF10** – Integração com OpenAI GPT-4o via Spring AI para geração de conteúdo e quiz
- **RNF11** – Extração de texto de PDFs via Apache PDFBox para alimentar o Spring AI
- **RNF12** – Mapeamento Entidade ↔ DTO via MapStruct (sem mapeamento manual)
- **RNF13** – Envio de e-mails transacionais via Spring Mail (recuperação de senha)

## Integracao Frontend-Backend

- **RNF14** - Frontend deve consumir endpoints oficiais sem alterar layout e UX atuais.
- **RNF15** - Contratos de request/response devem ser versionados e consistentes entre documentacao e implementacao.
- **RNF16** - Tratamento de erros HTTP deve ser padronizado no frontend com feedback claro ao usuario.
- **RNF17** - Autenticacao no frontend deve suportar ciclo completo de token (acesso, renovacao e expiracao).
- **RNF18** - Fluxos sem endpoint backend documentado devem ser registrados como pendencia contratual.

## Qualidade de Codigo Frontend (Implementacao Neste Ciclo)

- **RNF19** - Clean Code: funcoes pequenas, responsabilidade unica, baixa duplicacao e baixa complexidade ciclomatica.
- **RNF20** - Componentes com principios SOLID: separar apresentacao, orquestracao de fluxo e acesso a dados.
- **RNF21** - Naming semantico para variaveis, funcoes, handlers e estado derivado.
- **RNF22** - Logica declarativa como padrao: composicao, funcoes puras e isolamento de efeitos colaterais.
- **RNF23** - Regras de negocio devem residir em camada de dominio/use case, evitando duplicacao em componentes de UI.

## Performance Frontend (Implementacao Neste Ciclo)

- **RNF24** - Code splitting por rota e por blocos de alto custo.
- **RNF25** - Lazy loading de paginas e componentes secundarios.
- **RNF26** - Memorizacao seletiva para calculos derivados, callbacks e seletores de estado.
- **RNF27** - Evitar memoizacao indiscriminada; cada otimizacao deve ter justificativa por medicao.
- **RNF28** - Definir e acompanhar orcamento de bundle por rota critica.
- **RNF29** - Reduzir re-render com segmentacao de estado e seletores especificos.

## Observabilidade e Governanca de Entrega

- **RNF30** - Toda mudanca de contrato FE-BE deve ser refletida nos documentos CLAUDE, RF, RN, RNF e User Stories.
- **RNF31** - Publicar checklist de revisao tecnica com criterios de Clean Code, SOLID e performance.
- **RNF32** - Aprovacao de implementacao exige evidencia de nao regressao visual e aderencia contratual.
