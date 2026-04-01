## Current State Memory Document — Slice H: Python Variant

### Protocolo obrigatorio por story (TDD-first)

1. Criar testes da story antes da implementacao.
2. Confirmar RED inicial na suite de testes.
3. Implementar apenas o minimo para chegar em GREEN.
4. Refatorar sem regressao comportamental.
5. Marcar como done apenas apos pipeline completa em sucesso.

### 1. Escopo do Slice H e Espelhamento de Rotas

O fluxo Python cobre 7 rotas espelho dentro de cursos:

1. Detalhe: routes.ts
2. Inscrição: routes.ts
3. Módulos: routes.ts
4. Aula por módulo: routes.ts
5. Instruções da prova: routes.ts
6. Prova: routes.ts
7. Resultado: routes.ts

Comparativo direto: Power BI possui também rota de gestão dedicada, Python não:

1. Gestão Power BI: routes.ts
2. Não há equivalente python/manage.

---

### 2. Fluxo Funcional Python (Navegação de ponta a ponta)

Fluxo principal observado:

1. PythonDetailPage.tsx decide entre acesso direto aos módulos ou ida para inscrição conforme matrícula.
2. PythonEnrollmentPage.tsx valida e chama matrícula local com courseId python.
3. PythonModulesPage.tsx controla progresso, declarações e transição para prova.
4. PythonLessonsPage.tsx apresenta conteúdo e direciona para instruções.
5. PythonExamInstructionsPage.tsx inicia prova.
6. PythonExamPage.tsx coleta respostas e envia para resultado.
7. PythonExamResultPage.tsx calcula desempenho localmente.

---

### 3. Guardas e Controle de Acesso no Variant

As cinco páginas de estudo/avaliação Python usam guard de matrícula:

1. PythonModulesPage.tsx
2. PythonLessonsPage.tsx
3. PythonExamInstructionsPage.tsx
4. PythonExamPage.tsx
5. PythonExamResultPage.tsx

Dependência transversal:

1. O comportamento professor-como-aluno continua herdado do guard comum em useEnrollmentGuard.ts.

---

### 4. Dados, Mocks e Contratos do Variant

Existem dois artefatos Python de prova com o mesmo domínio:

1. Mock assíncrono usado pelas páginas de prova: pythonExamMock.ts
2. Dados estáticos paralelos com interface local PythonQuestion: pythonProvaData.ts

Observação crítica de uso:

1. As páginas Python de prova consumem fetchPythonExamQuestions do mock assíncrono: PythonExamPage.tsx e PythonExamResultPage.tsx.
2. O arquivo pythonProvaData não aparece como fonte ativa de páginas no fluxo atual, funcionando como duplicação de dataset.

Par espelho em Power BI:

1. Mock assíncrono: examMock.ts
2. Dataset estático paralelo: provaData.ts

---

### 5. Duplicação Estrutural com Power BI (e divergências reais)

Duplicação estrutural forte:

1. Pages de detalhe, inscrição, módulos, aula, instruções, prova e resultado repetem a mesma arquitetura de fluxo mudando curso, conteúdo textual e id.
2. Módulos Python replica padrões de progresso e documentos em localStorage, inclusive geração de código e modais de declaração:
   - Key de progresso Python: PythonModulesPage.tsx
   - Modal matrícula: PythonModulesPage.tsx
   - Modal conclusão: PythonModulesPage.tsx

Divergências relevantes entre variantes:

1. Duração da prova:
   - Python: 20 minutos em PythonExamPage.tsx
   - Power BI: 3600 segundos em ExamPage.tsx
2. Instruções de prova:
   - Python: 3 questões e 20 minutos em PythonExamInstructionsPage.tsx
   - Power BI: 10 questões e 60 minutos em ExamInstructionsPage.tsx
3. Linguagem de navegação (i18n inconsistente) no Python:
   - Breadcrumb com Courses e Python Beginner em PythonLessonsPage.tsx
   - Título Instructions em PythonExamInstructionsPage.tsx
4. Pequeno desvio de acessibilidade no formulário de inscrição:
   - Python adiciona aria-invalid no campo de texto em PythonEnrollmentPage.tsx
   - Variante Power BI equivalente não apresenta essa marcação.

---

### 6. Estado, Persistência e Chaves Específicas do Variant

Chaves específicas no resultado da prova:

1. Python usa python_prova_answers em sessionStorage:
   - leitura: PythonExamResultPage.tsx
   - remoção: PythonExamResultPage.tsx
2. Power BI usa prova_answers:
   - leitura: ExamResultPage.tsx
   - remoção: ExamResultPage.tsx

Chaves de progresso no módulo:

1. Python: solar_visited_python_lessons em PythonModulesPage.tsx
2. Power BI: solar_visited_lessons em ModulesPage.tsx

---

### 7. Riscos e Dívida Técnica do Slice H

Riscos críticos:

1. Duplicação elevada de páginas e lógica, com grande área de manutenção paralela.
2. Contratos de prova duplicados em dois serviços Python, com risco de divergência silenciosa.
3. Variante Python sem rota de gestão equivalente, criando assimetria funcional do domínio curso.

Riscos médios:

1. Inconsistência de idioma em labels de breadcrumb/título no variant Python.
2. Diferenças pontuais de acessibilidade entre variantes aparentemente equivalentes.
3. Proliferação de chaves de storage por variante sem política centralizada.

Risco de refatoração:

1. Deduplicar sem preservar diferenças de negócio legítimas (tempo, quantidade de questões, conteúdo) pode quebrar comportamento esperado.

---

### 8. Critérios de Deduplicação Recomendados para Próxima Etapa

1. Separar estrutura compartilhada de fluxo do conteúdo específico de cada curso.
2. Externalizar configuração por curso:
   - courseId, títulos, breadcrumb labels, tempo de prova, contagem de questões, textos de instrução, datasets.
3. Unificar contratos de dados de prova em uma fonte por curso.
4. Padronizar i18n e acessibilidade entre variantes.
5. Manter keys de storage sob namespace consistente por curso, derivado de configuração.

---

### 9. Checklist de Integração e Refatoração (Slice H)

1. Inventariar tudo que é estruturalmente igual entre Python e Power BI.
2. Marcar diferenças de negócio que devem permanecer distintas.
3. Eliminar dataset duplicado não utilizado por curso.
4. Definir contrato único de mock ou serviço para prova por curso.
5. Uniformizar breadcrumbs e idioma da experiência Python.
6. Garantir paridade de acessibilidade entre formulários equivalentes.
7. Validar que guard de matrícula mantém regra professor-como-aluno após qualquer deduplicação.
