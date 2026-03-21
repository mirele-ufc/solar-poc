Implemente na página do curso /cursos/power-bi/modulos duas funcionalidades relacionadas à emissão de declarações acadêmicas para o usuário estudante: Declaração de Matrícula e Declaração de Conclusão do Curso.

O objetivo é permitir que o aluno gere documentos oficiais que comprovem sua matrícula ou conclusão do curso, com validação de autenticidade e registro no histórico acadêmico.

Funcionalidade 1 — Botão de Declaração de Matrícula
Localização

Adicionar um botão "Declaração de Matrícula" no topo da página, acima da listagem de módulos do curso.

Estrutura esperada:

Título do curso
Botão: Declaração de Matrícula

Lista de módulos
- Módulo 1
- Módulo 2
- Módulo 3
Comportamento do botão

Ao clicar no botão:

O sistema deve gerar uma declaração de matrícula do aluno no curso.

A declaração deve conter:

Nome do aluno

Nome do curso

Data de matrícula

Status da matrícula (ativa)

Data de emissão

Código único de validação

O documento pode ser exibido em visualização ou download (PDF).

O código de validação deve permitir verificar a autenticidade da declaração.

Funcionalidade 2 — Botão de Declaração de Conclusão
Localização

Adicionar um botão "Declaração de Conclusão" no final da página, abaixo da listagem de módulos, no bottom da interface.

Estrutura esperada:

Lista de módulos

- Módulo 1
- Módulo 2
- Módulo 3

Botão: Declaração de Conclusão
Regra de Validação para Conclusão

Antes de emitir a declaração, o sistema deve validar se o aluno cumpriu os requisitos mínimos de conclusão do curso.

Exemplos de critérios de validação:

Todas as aulas obrigatórias foram concluídas

Todas as provas obrigatórias foram realizadas

Nota mínima exigida foi alcançada

Status do curso marcado como concluído

Se os requisitos NÃO forem atendidos

Exibir mensagem:

"Você ainda não cumpriu todos os requisitos necessários para concluir este curso."

O documento não deve ser gerado.

Emissão da Declaração de Conclusão

Se os requisitos forem atendidos, gerar um documento contendo:

Nome do aluno

Nome do curso

Data de conclusão

Carga horária do curso

Nota final (se aplicável)

Data de emissão

Código único de validação

Código de Validação

Toda declaração emitida deve possuir um código único de validação, utilizado para:

garantir autenticidade do documento

permitir verificação futura da declaração

Histórico Acadêmico

Após a conclusão do curso, o sistema deve:

armazenar permanentemente o registro acadêmico do aluno

salvar:

curso concluído

notas

status de conclusão

data de conclusão

declarações emitidas

Isso permitirá que o aluno consulte posteriormente suas notas ou comprovantes mesmo que perca a declaração emitida.

Requisitos de UX

Os botões devem ser claramente visíveis e acessíveis

Utilizar o padrão visual do design system

Ações devem exibir feedback visual ao usuário

Garantir boa experiência em desktop e mobile