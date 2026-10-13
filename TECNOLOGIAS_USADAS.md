# Tecnologias usadas e porquê

Este documento lista as tecnologias do protótipo e a razão de cada uma. O sistema é uma aplicação web para a defesa de um trabalho de conclusão de curso: uma interface no browser, uma API e uma base de dados. As escolhas favorecem um fluxo que se consegue explicar e executar num computador local.

## Visão geral

| Camada | Tecnologia | Papel |
|---|---|---|
| Interface | React, TypeScript, Vite, Tailwind CSS | Ecrãs da demonstração |
| API | Node.js e Express | Recebe os pedidos e aplica as regras |
| Dados | MySQL e mysql2 | Guarda pacientes, exames, contas e resultados |
| Sessão | JWT, cookie-parser e bcryptjs | Login sem voltar a enviar a senha em cada pedido |
| Ficheiros | Multer | Recebe a imagem do exame |
| Análise | SDK da Anthropic | Pede uma leitura da imagem quando a chave está configurada |
| Configuração | dotenv | Lê a base de dados e a chave fora do código |

## Interface

### React

O ecrã é uma aplicação de página única. Depois do login, o menu troca de painel sem recarregar o documento inteiro. Isso encaixa no fluxo da defesa: o mesmo paciente permanece selecionado enquanto se passa da ficha para a fila de exames e depois para o diagnóstico.

### TypeScript

Os ecrãs partilham o formato de um paciente, de um exame e de um utilizador. O TypeScript descreve esses formatos no código da interface. Um campo em falta aparece ao compilar, antes da apresentação.

### Vite

O Vite serve a interface em desenvolvimento na porta 5175 e reencaminha `/auth`, `/pacientes`, `/exames`, `/resultados`, `/historico`, `/usuarios` e `/logs` para o Express na porta 3000. Assim o browser usa um só endereço e a API continua separada. O arranque é rápido, o que ajuda quando se altera um ecrã pouco antes da defesa.

### Tailwind CSS

O visual vem de classes no próprio componente: cartões, tabelas, modais e o menu. Não foi preciso manter uma folha de estilos separada para cada ecrã. O aspeto fica consistente entre o login, a lista de pacientes e o diagnóstico.

### Lucide React

Os ícones do menu, dos botões e dos avisos vêm desta biblioteca. São ficheiros leves e reconhecíveis, adequados a um painel clínico de demonstração.

## Servidor

### Node.js

O servidor está escrito em JavaScript, a mesma linguagem da interface. Uma pessoa consegue seguir um pedido desde o botão até à consulta SQL sem mudar de linguagem. O Node.js também trata bem muitos pedidos de entrada e saída, como gravar uma imagem e esperar a resposta da análise.

### Express

O Express organiza a API por módulos: autenticação, pacientes, exames, resultados, histórico, utilizadores e logs. Cada módulo tem rotas, um controlador e um modelo. Esse separação deixa claro, na defesa, onde entra um pedido e onde ele é gravado.

O ficheiro `index.js` liga estes módulos, lê JSON, lê o cookie de sessão e devolve erro JSON quando o endereço não existe.

## Dados

### MySQL

Os dados da demonstração precisam de relações: um exame pertence a um paciente e a um utilizador, e um resultado pertence a um exame. Uma base relacional representa isso com tabelas e chaves. O MySQL é comum no ensino, corre na máquina local e chega para o volume de uma apresentação.

A base usada localmente chama-se `medicos`.

### mysql2

O código abre um conjunto de ligações e executa SQL com parâmetros (`?`), o que evita montar a consulta por concatenação de texto. As consultas estão nos ficheiros de `src/models`. O `package.json` também inclui o Sequelize, mas este protótipo não o usa nas consultas: o acesso observável é o SQL escrito com mysql2.

## Sessão e senhas

### bcryptjs

A senha não é guardada em texto. No registo, o bcryptjs gera um hash. No login, compara a senha escrita com esse hash. Mesmo numa demonstração académica, a tabela `users` não fica com a senha legível.

### JSON Web Token

Depois de um login válido, o servidor assina um token com o identificador, o nome e o tipo do utilizador. Os pedidos seguintes apresentam esse token. O servidor confirma a assinatura em vez de voltar a ler a senha.

### cookie-parser

O token viaja num cookie `httpOnly`. O JavaScript da página não o lê, e o browser envia-o sozinho porque a interface usa `credentials: 'include'`. O cookie marca a sessão da defesa durante 8 horas.

## Imagem e análise

### Multer

O exame chega como formulário com ficheiro. O Multer recebe esse ficheiro no `POST /exames` e grava-o em `public/uploads`. O nome do ficheiro fica na tabela `exames`, e a análise vai buscá-lo a essa pasta.

### SDK da Anthropic (`@anthropic-ai/sdk`)

A análise de imagem não é um modelo treinado neste projeto. O serviço `service/iaService.js` envia a imagem e um pedido de texto estruturado (achados, hipóteses, recomendações) ao modelo configurado em `ANTHROPIC_MODEL`. A chave fica em `iafile.env`, fora do Git.

Se a chamada falhar, ou se o ficheiro for DICOM, o mesmo serviço devolve um texto local marcado como resultado de demonstração. A defesa continua mesmo sem rede ou sem quota no serviço externo, e o ecrã avisa que aquele texto não é um diagnóstico.

## Configuração

### dotenv

A palavra-passe da base, a porta e a chave da análise vêm de variáveis de ambiente. O código arranca com valores locais se essas variáveis não existirem, para a apresentação não depender de um ficheiro extra. O exemplo dos nomes está em `.env.example`. O `.gitignore` deixa de fora `.env` e `iafile.env`, para essas chaves não irem para o repositório público.

## O que cada escolha evita

- A interface e a API estão separadas: o ecrã pode mudar sem reescrever o SQL, e a API pode ser mostrada sozinha na defesa.
- A base relacional evita espalhar pacientes e exames por ficheiros soltos.
- O cookie de sessão evita colocar o token no código da página.
- O modo de demonstração da análise evita que a defesa pare quando o serviço externo não responde.

Estas escolhas chegam para explicar e executar o protótipo. Não são uma arquitectura de hospital em produção.
