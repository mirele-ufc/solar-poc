## Current State Memory Document - Slice C: Exams e Avaliacoes

### Protocolo obrigatorio por story (TDD-first)

1. Escrever testes da story antes de implementar a funcionalidade.
2. Confirmar RED inicial na suite relevante.
3. Implementar o minimo para levar os testes a GREEN.
4. Refatorar com cobertura dos testes existentes.
5. Considerar pronta somente com validacao completa da pipeline.

---

### 1. Fluxo de Avaliacao (Aluno)

Roteamento principal da jornada:

- Instrucoes: routes.ts
- Prova: routes.ts
- Resultado: routes.ts

Jornada implementada hoje:

1. A pagina de instrucoes aplica guarda de matricula e libera inicio da prova em ExamInstructionsPage.tsx.
2. O inicio navega para rota fixa do curso power-bi, sem variacao por id dinamico de curso/modulo, em ExamInstructionsPage.tsx.
3. A pagina de prova carrega perguntas e labels de mock, captura respostas e controla envio em ExamPage.tsx.
4. O envio exige confirmacao em modal antes de navegar para resultado, tambem em ExamPage.tsx.
5. A pagina de resultado normaliza respostas e calcula desempenho integralmente no frontend em ExamResultPage.tsx.

Modelo de progressao de questoes:

- Todas as questoes sao renderizadas em uma unica tela.
- Nao existe paginacao por questao, nem fluxo anterior/proxima.
- Nao existe estado de progresso por secao.

> **Quirk critico:** o fluxo do aluno esta acoplado a rota hardcoded de power-bi, o que reduz reutilizacao para outros cursos sem ajustes adicionais de navegacao.

---

### 2. Estruturas e Contratos de Dados

Fontes de dados ativas no fluxo de prova:

- examMock.ts
- provaData.ts

Contrato pratico da pergunta no runtime atual:

| Campo        | Tipo     | Papel no fluxo                            |
| ------------ | -------- | ----------------------------------------- |
| id           | string   | Chave da pergunta e indexacao da resposta |
| text         | string   | Enunciado exibido                         |
| options      | string[] | Alternativas renderizadas                 |
| correctIndex | number   | Gabarito por indice                       |
| correctLabel | string   | Rotulo textual do gabarito                |

Observacoes de contrato:

- O payload de prova e uma lista de perguntas.
- Labels de alternativas vivem separadas em array proprio.
- Nao ha discriminador de tipo de pergunta (multipla escolha, VF, dissertativa).
- O renderer assume exclusivamente uma resposta unica por indice.

---

### 3. Estado, Tentativa e Submissao

Estado de tentativa na pagina de prova:

- Mapa de respostas por pergunta em ExamPage.tsx, com modelo conceitual pergunta -> indice da alternativa.
- Cada clique em alternativa sobrescreve a resposta anterior da mesma pergunta.
- O envio so e habilitado quando todas as perguntas possuem resposta.

Tabela de comportamento de submissao:

| Evento           | Regra                        | Efeito                                        |
| ---------------- | ---------------------------- | --------------------------------------------- |
| Clique em Enviar | Apenas com todas respondidas | Abre modal de confirmacao                     |
| Confirmar envio  | Modal confirmado             | Navega para resultado com respostas no state  |
| Tempo esgotado   | timer chega a zero           | Autoenvio para resultado com respostas atuais |

Calculo de resultado:

- Correcao feita no frontend em ExamResultPage.tsx.
- Comparacao central: resposta normalizada versus correctIndex.
- Derivacoes locais: total de acertos, percentual, estado de aprovacao visual.

Fallback de armazenamento:

- A pagina de resultado le e remove chave de sessao prova_answers em ExamResultPage.tsx.
- Nao ha escrita correspondente dessa chave no fluxo principal identificado.

> **Quirk critico:** existe caminho de leitura de sessionStorage sem writer claro no fluxo, indicando fallback parcialmente desconectado da origem das respostas.

---

### 4. Fluxo Professor - Criacao de Prova

Entrada do fluxo:

- Rota de criacao/edicao ligada ao passo de prova em routes.ts.
- Implementacao central em CreateExamPage.tsx.

Capacidades do editor atual:

1. Adicionar e remover alternativas dinamicamente.
2. Definir alternativa correta por id.
3. Definir pontuacao por questao.
4. Adicionar/remover questoes da prova.
5. Salvar prova por modulo em estrutura local de estado.
6. Editar nome de aula e remover itens de modulo no contexto da mesma tela (estado local).

Tabela de persistencia do fluxo professor:

| Acao                   | Destino               | Persistencia real     |
| ---------------------- | --------------------- | --------------------- |
| Adicionar questao      | estado local da tela  | Temporaria em memoria |
| Salvar prova de modulo | mapa local por modulo | Temporaria em memoria |
| Remover modulo/aula    | lista local da tela   | Temporaria em memoria |

> **Quirk critico:** o fluxo do professor concentra multiplas responsabilidades de edicao estrutural e prova na mesma pagina, sem fronteira clara de persistencia por dominio.

---

### 5. UI, Feedback e Acessibilidade

Componentes e composicao visual:

- Cabecalho compartilhado via PageHeader.tsx nas paginas de aluno.
- Controles do aluno com radio nativo estilizado em ExamPage.tsx.
- Modal de confirmacao custom com role dialog na mesma pagina.
- No fluxo professor, componentes locais internos na pagina de criacao, em CreateExamPage.tsx.

Restricoes de tempo e feedback:

- Timer total de 60 minutos.
- Alertas de marcos finais em 5 minutos, 1 minuto e 30 segundos.
- Encerramento automatico ao fim do tempo.

Tabela de UX operacional:

| Mecanismo                   | Objetivo                    | Estado atual |
| --------------------------- | --------------------------- | ------------ |
| Botao de envio desabilitado | Garantir prova completa     | Ativo        |
| Confirmacao antes do envio  | Evitar envio acidental      | Ativo        |
| Alertas de tempo restante   | Pressao temporal controlada | Ativo        |
| Pagina unica de questoes    | Visao global da prova       | Ativo        |

---

### 6. Validacao e Regras de Negocio

Fonte de validacao do autor de prova:

- examSchema.ts

Regras da criacao de questao:

| Campo           | Regra                      | Intencao de negocio           |
| --------------- | -------------------------- | ----------------------------- |
| questionText    | obrigatorio nao vazio      | Impedir questao sem enunciado |
| options         | lista de objetos id e text | Estruturar alternativas       |
| correctOptionId | obrigatorio                | Garantir gabarito definido    |
| points          | minimo 1 e maximo 10       | Limitar peso da questao       |

Regras cruzadas relevantes:

1. Minimo de 2 alternativas preenchidas.
2. Alternativa correta deve existir entre as alternativas preenchidas.

Cobertura de validacao no aluno:

- O fluxo de resposta do aluno nao usa schema de validacao formal.
- As regras de submissao sao controladas por condicao de completude no estado da tela.

---

### 7. Padroes, Riscos e Dividas Tecnicas

Padroes identificados:

- Correcao e resultado calculados no frontend.
- Forte dependencia de mocks no fluxo do aluno.
- Fluxo de prova do professor com estado local sem persistencia backend.
- Contrato de API de quiz existente, mas nao consumido pelo fluxo principal.

Arquivos de referencia para gap de integracao:

- API de quiz disponivel em quizService.ts
- Fluxo atual baseado em mock em examMock.ts e provaData.ts

Riscos de comportamento:

| Risco                              | Impacto                                                 |
| ---------------------------------- | ------------------------------------------------------- |
| Rota hardcoded de curso no aluno   | Reuso limitado para multiplos cursos                    |
| Correcao totalmente client-side    | Superficie maior para divergencia com backend           |
| Fallback de sessionStorage parcial | Possivel inconsistenca em cenarios de refresh/navegacao |
| Persistencia local no professor    | Perda de dados ao sair/recarregar                       |

> **Quirk critico:** ha dissociacao entre contrato de servico de quiz e experiencia real do aluno, o que sinaliza arquitetura em transicao entre mock funcional e integracao final de API.
