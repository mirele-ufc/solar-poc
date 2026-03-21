Atualize o protótipo do sistema educacional aplicando as seguintes melhorias de usabilidade, consistência visual e funcionalidade. Todas as alterações devem respeitar o design system existente.

1. Componentes de Interface

Checkbox (Caixa de Seleção)

Quando utilizado sobre background branco, a checkbox deve possuir stroke azul, seguindo a guideline do design system.

Garantir contraste adequado e consistência visual com os demais componentes interativos.

Campos de senha (Tela de Perfil)

Aplicar bordas levemente arredondadas nos inputs de senha.

O estilo deve seguir o mesmo padrão utilizado nos inputs da tela de login.

2. Correções de Funcionalidade

Página /cursos

Corrigir o scroll horizontal, que atualmente não está funcional.

O usuário deve conseguir navegar horizontalmente pelos cursos quando o conteúdo exceder a largura da tela.

Tela /criar-curso/prova

Adicionar funcionalidades de gerenciamento de questões e aulas:

Botão de edição de questão

Atualmente apenas é possível excluir uma questão.

Implementar um botão “Editar questão” para permitir modificar perguntas já adicionadas.

Exclusão de aula

Tornar funcional o botão de excluir aula após a aula ter sido adicionada.

Ao excluir, atualizar a lista automaticamente.

3. Ajustes de Layout

Tela /cursos/power-bi/gerenciar

Aumentar a altura dos botões:

"Editar curso"

"Voltar aos cursos"

Os botões devem ter maior área de clique para melhorar acessibilidade e usabilidade.

4. Navegação

Botão "Editar curso"

Atualizar o redirecionamento.

Ao clicar, o usuário deve ser direcionado para:

/criar-curso/prova

A edição deve permitir somente modificar módulos e aulas.

5. Atualização Estrutural da Página (Baseado no Novo Figma)

Substituir a estrutura atual da página pelo novo layout presente no Figma com as seguintes mudanças:

Remover

Hero section com imagem grande.

Manter / Adicionar

Apenas a imagem representativa do módulo.

Estrutura da página

Criar a seguinte hierarquia:

Imagem do módulo

Nome do módulo

Dropdown com:

Aulas

Provas

Indicador de progresso

Após o usuário visitar uma aula, adicionar um ícone de check ao lado do nome da aula, indicando que o conteúdo já foi visualizado.

Exemplo:

Módulo 1
  ✓ Aula 1 - Introdução
  ✓ Aula 2 - Conceitos Básicos
  Aula 3 - Prática
  Prova do Módulo
6. Objetivo das Alterações

As modificações devem:

Melhorar usabilidade

Corrigir problemas de interação

Garantir consistência com o design system

Melhorar feedback visual de progresso do aluno