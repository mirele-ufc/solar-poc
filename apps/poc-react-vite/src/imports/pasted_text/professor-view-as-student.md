Implemente uma funcionalidade que permita que um usuário com perfil de professor visualize um curso específico utilizando permissões de aluno, sem possuir acesso de edição ao curso.

O sistema já possui:

perfil de Professor

curso Python

estrutura de perfis no sistema

Portanto, a tarefa é adaptar as permissões de acesso e criar conteúdo de teste dentro do curso existente, sem recriar esses elementos.

1. Contexto do Sistema de Perfis

O sistema deve permitir que um mesmo usuário possua múltiplos perfis, mediante autorização administrativa.

Perfis disponíveis no sistema:

Administrador Geral

Administrador Tenant (por instituição)

Gerente / Editor

Professor

Aluno

Os perfis devem estar associados ao usuário dentro de um contexto específico, seguindo o princípio de privilégio mínimo.

Exemplo de regra de uso:

Um usuário pode ser professor em um curso e aluno em outro curso, mesmo sendo a mesma conta.

Quando acessa um curso onde possui papel de aluno, o sistema deve aplicar apenas as permissões de aluno, mesmo que o usuário possua perfil de professor no sistema.

2. Curso Existente

Utilizar o curso de Python já existente no sistema.

Dentro deste curso, criar conteúdo mínimo para teste:

Módulo

Criar 1 módulo no curso de Python:

Módulo 1 — Introdução ao Python

Aula

Adicionar uma aula dentro do módulo:

Aula 1 — O que é Python

Prova

Adicionar 1 prova ao final do módulo contendo 3 perguntas de múltipla escolha sobre conceitos básicos de Python.

3. Implementação de Permissões para o Professor

O usuário com perfil de professor deve receber permissão adicional de aluno apenas no curso de Python, para que possa testar a experiência do estudante.

Nesse contexto, o professor deve poder:

visualizar módulos

acessar aulas

realizar provas

acompanhar progresso do curso

Porém, não deve possuir permissões de edição nesse curso específico.

4. Restrições de Edição

Ao acessar o curso de Python, o professor não deve visualizar funcionalidades de edição, como:

editar curso

editar módulos

editar aulas

editar provas

excluir conteúdo

publicar conteúdo

A interface deve se comportar exatamente como a interface de um aluno.

5. Comportamento Esperado

Ao acessar a página do curso:

/cursos/python

O sistema deve:

identificar que o usuário possui perfil de Professor no sistema

verificar que, neste curso específico, ele possui permissão de aluno

aplicar apenas as permissões do perfil aluno

Resultado esperado:

interface exibida como aluno

conteúdo acessível para estudo

ausência de controles administrativos

6. Regra de Privilégio Mínimo

O sistema deve garantir que:

cada perfil tenha apenas as permissões necessárias

as permissões sejam definidas por contexto de curso

perfis diferentes não compartilhem automaticamente privilégios