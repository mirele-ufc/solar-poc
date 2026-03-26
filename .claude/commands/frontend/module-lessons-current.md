## Current State Memory Document — Slice B: Modulos e Aulas

### Protocolo obrigatorio por story (TDD-first)

1. Escrever testes antes de qualquer mudanca de implementacao.
2. Executar e validar RED como passo inicial da story.
3. Implementar o menor incremento para atingir GREEN.
4. Refatorar somente com cobertura de testes ativa.
5. Concluir story com pipeline de qualidade em sucesso.

---

### 1. Hierarquia de Conteudo e Navegacao

Encadeamento funcional atual:

1. Lista de modulos por curso.
2. Expansao/retracao de cada modulo para listar itens.
3. Clique em item de aula ou prova.
4. Aula navega com estado de indice.
5. Prova navega para instrucoes de avaliacao.

Estrutura de dominio implementada no frontend:

- A hierarquia curso -> modulo -> item existe como estrutura hardcoded na camada de pagina.
- Itens de modulo usam tipagem funcional de aula ou prova.
- A resolucao da aula depende de params de rota combinados com estado de navegacao.

Tabela de transicao de item:

| Tipo de item | Acao de clique                       | Destino                       |
| ------------ | ------------------------------------ | ----------------------------- |
| aula         | resolve modulo + indice da aula      | pagina de aula                |
| prova        | redireciona para fluxo de instrucoes | pagina de instrucoes da prova |

> **Quirk critico:** a navegacao para aula depende de estado de rota (aulaIndex) em vez de apenas identificadores canonicos, o que aumenta fragilidade em refresh direto e links compartilhados.

---

### 2. Estruturas de Dados e Entrega de Conteudo

Modelo de conteudo no estado atual:

- Modulos e itens sao definidos localmente na pagina de modulos.
- Conteudo textual de aulas e definido localmente por id de modulo.
- Existe variante paralela de fluxo para Python com base estatica propria.

Tabela de origem de conteudo:

| Tipo de dado        | Origem atual         | Persistencia                    |
| ------------------- | -------------------- | ------------------------------- |
| lista de modulos    | hardcoded em pagina  | memoria da sessao de runtime    |
| conteudo de aula    | hardcoded por modulo | memoria da sessao de runtime    |
| progresso de visita | localStorage         | persistencia local no navegador |

Observacoes de contrato:

- Embora exista nocao de tipo de item (aula/prova), a renderizacao de aula opera como texto.
- Nao ha branch de renderer por formato de midia no consumo final da aula.
- O contrato funcional para video, arquivo e texto ainda nao esta materializado no delivery principal.

---

### 3. Estado, Sincronizacao e Progresso

Sincronizacao de progresso:

- O progresso de visita e compartilhado entre lista de modulos e pagina de aula por chave de localStorage comum.
- Essa estrategia preserva estado entre navegacoes sem backend.

Escopo de estado por area:

| Area                         | Fonte de estado                       | Cobertura                                     |
| ---------------------------- | ------------------------------------- | --------------------------------------------- |
| progresso de aulas visitadas | localStorage + estado local de pagina | modulos e aulas                               |
| autoria de modulos/aulas     | estado local da pagina de criacao     | fluxo professor                               |
| store global de curso        | store de cursos                       | matricula e papeis, sem arvore de modulo/aula |

Lacuna de sincronizacao:

- A store global nao centraliza dados aninhados de modulo e aula.
- O fluxo de criacao e o fluxo de consumo coexistem sem camada unificada de verdade.

> **Quirk critico:** a consistencia entre autoria e consumo depende de passagem de estado por rota e memoria local, sem contrato de persistencia unico.

---

### 4. Fluxo Professor — Criacao de Modulos e Aulas

Capacidades de autoria atuais:

1. Adicionar modulo.
2. Remover modulo.
3. Adicionar aula em modulo.
4. Remover aula.
5. Alterar rotulo/arquivo de aula via input local.
6. Avancar para etapa de prova carregando estado da estrutura atual.

Tabela de operacoes do editor:

| Operacao               | Resultado funcional            | Persistencia         |
| ---------------------- | ------------------------------ | -------------------- |
| adicionar modulo       | nova entrada na lista          | local (estado React) |
| remover modulo         | exclusao da entrada            | local (estado React) |
| adicionar/remover aula | mutacao da lista do modulo     | local (estado React) |
| anexar arquivo/rotulo  | atualiza referencia visual     | local (estado React) |
| avancar para prova     | envia estado para proxima rota | estado de navegacao  |

Observacao arquitetural:

- O fluxo de criacao implementa comportamento de editor completo, mas sem persistencia remota.
- O transporte para etapa seguinte depende de state de rota, nao de entidade persistida.

---

### 5. Arquivos, Validacao e Restricoes de Upload

Regras de validacao centralizadas:

- Limite de tamanho: 5MB.
- Imagem de modulo: somente JPG/PNG.
- Arquivo de aula: JPG/PNG/PDF.

Aplicacao das regras:

- Validacao de imagem de modulo por schema dedicado.
- Validacao de arquivo de aula por schema de upload.
- Inputs usam atributo accept para reforcar tipos permitidos.

Tabela de politica de arquivos:

| Contexto         | Tipos permitidos | Regra adicional   |
| ---------------- | ---------------- | ----------------- |
| imagem de modulo | jpg, png         | limite de tamanho |
| anexo de aula    | jpg, png, pdf    | limite de tamanho |

Comportamento de armazenamento local de arquivo:

- Preview de imagem de modulo como DataURL no estado.
- Referencia de arquivo de aula como nome/string no estado.

> **Quirk critico:** nao existe ciclo de upload real (progresso, retry, erro de transferencia), apenas validacao e referencia local.

---

### 6. UI Compartilhada e Composicao de Componentes

Dependencias de interface no escopo de modulos/aulas:

- Uso consistente de cabecalho compartilhado para titulo, retorno e trilha.
- Componentes de interacao principal (accordion, uploader, progresso) foram implementados localmente nas paginas, em vez de camada compartilhada dedicada.

Impacto de composicao atual:

| Aspecto                     | Estado atual        | Consequencia                          |
| --------------------------- | ------------------- | ------------------------------------- |
| header                      | compartilhado       | consistencia de navegacao             |
| controles de lista/expansao | implementacao local | duplicacao de padroes                 |
| upload/arquivo              | implementacao local | variacao de comportamento entre telas |

Leitura funcional:

- A base visual e coerente no topo da pagina.
- A camada de componentes de dominio ainda nao foi consolidada em primitives reaproveitaveis para modulo/aula.

---

### 7. Padroes, Riscos e Dividas Tecnicas

Padroes consolidados no slice:

- Forte presenca de conteudo hardcoded no consumo.
- Autorias e entregas desacopladas da store global.
- Persistencia de progresso no navegador sem backend.
- Fluxo Python paralelo com estrutura semelhante, mas independente.

Matriz de riscos:

| Risco                                 | Impacto                                           |
| ------------------------------------- | ------------------------------------------------- |
| dependencia de dados hardcoded        | baixa escalabilidade de catalogo de cursos        |
| navegacao baseada em state de rota    | fragilidade em deep-link e refresh                |
| duplicacao de fluxo Python            | custo maior de manutencao e divergencia funcional |
| ausencia de persistencia canonica     | perda de consistencia entre criacao e consumo     |
| ausencia de renderer por tipo de aula | limitacao de formatos educacionais no runtime     |

> **Quirk critico:** o slice funciona bem como prototipo navegavel, mas a falta de fonte unica de verdade para modulo/aula cria uma fronteira instavel para evolucao de features e integracao de backend.
