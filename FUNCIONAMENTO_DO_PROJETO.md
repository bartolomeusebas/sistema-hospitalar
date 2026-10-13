# Funcionamento do projeto

Este documento explica como o protótipo funciona. O sistema foi feito para a defesa de um trabalho de conclusão de curso. Serve para mostrar o fluxo de um consultório de imagiologia: entrar, consultar pacientes, registar um exame e ver uma análise assistida por inteligência artificial. Não é um produto para uso clínico real. Nenhum resultado mostrado substitui a avaliação de um médico.

## O que o sistema faz

Um utilizador autenticado pode:

1. Entrar com uma conta de médico ou de administrador.
2. Ver o painel correspondente ao seu perfil.
3. Consultar e registar pacientes.
4. Enviar uma imagem de exame associada a um paciente.
5. Pedir uma análise dessa imagem.
6. Ler o texto da análise no ecrã de diagnóstico e abrir um modelo de laudo.

As contas de exemplo no ecrã de login existem só para a apresentação. Preenchem o e-mail e a senha para não ser preciso escrevê-los durante a defesa.

## As três partes

O programa está dividido em três partes que conversam entre si.

```text
Browser (React, porta 5175)
        |
        |  pedidos /auth, /pacientes, /exames, /resultados, ...
        v
Servidor (Express, porta 3000)
        |
        +--> MySQL (base medicos)
        |
        +--> Serviço de análise (Anthropic, ou texto local de demonstração)
```

Durante o desenvolvimento, o frontend corre à parte, na porta 5175. O Vite reencaminha os endereços da API para o Express na porta 3000. O browser fala sempre com o mesmo endereço, e o servidor de desenvolvimento entrega o pedido ao backend.

## Como arrancar

O MySQL tem de estar ligado antes do backend.

Num terminal, na pasta do projeto:

```bash
npm start
```

Noutro terminal:

```bash
cd public
npm run dev
```

Abre-se depois [http://localhost:5175/](http://localhost:5175/). O backend fica em [http://localhost:3000](http://localhost:3000).

## Entrada no sistema

O ecrã inicial envia o e-mail e a senha para `POST /auth/login`. O servidor procura o utilizador na tabela `users`, compara a senha com o hash guardado e, se coincidir, cria um token JWT. Esse token vai num cookie `httpOnly` chamado `token`, válido por 8 horas.

O tipo da conta decide o primeiro ecrã:

- `admin` abre o painel do sistema.
- qualquer outro tipo, na prática o médico, abre a visão médica.

Sair chama `POST /auth/logout`, que apaga o cookie.

As rotas de pacientes, exames, utilizadores, histórico, logs e resultados exigem esse cookie. Sem sessão, a API responde `Não autenticado`. Só o login e o logout são públicos.

## Ecrãs depois do login

O menu lateral muda de ecrã sem recarregar a página. O estado fica no React.

| Ecrã | Função na demonstração |
|---|---|
| Painel do sistema | Conta pacientes, exames, resultados e médicos a partir da API |
| Visão médica | Lista os pacientes reais e os exames que ainda não têm análise |
| Registos de pacientes | Pesquisa, filtra e abre o perfil; permite criar um paciente |
| Fila de exames | Envia a imagem, grava o exame e pede a análise |
| Diagnóstico por IA | Mostra o texto devolvido para o exame escolhido |
| Laudos | Modelo de laudo para a apresentação |
| Administração | Ecrã ilustrativo de definições e auditoria |

O perfil do paciente lê os exames desse paciente em `GET /exames` e mostra só os que lhe pertencem.

## Registar um paciente

O formulário envia `POST /pacientes` com nome, sexo, data de nascimento, telefone, endereço, tipo sanguíneo, alergias, médico responsável e condições. O sexo é guardado como `M`, `F` ou `O`. Quando a lista volta da base, o servidor traduz esses códigos para Masculino, Feminino ou Outro, e calcula a idade a partir da data de nascimento.

O estado mostrado no ecrã, quando a base não tem outro valor, é `Ativo`.

## Registar um exame e pedir a análise

Este é o fluxo principal da defesa.

1. Na fila de exames, escolhe-se o paciente já aberto, a modalidade, a data e uma imagem.
2. O browser envia `POST /exames` com `FormData` (dados e ficheiro).
3. O Multer guarda a imagem em `public/uploads`.
4. O modelo grava na tabela `exames` o paciente, o utilizador da sessão, o tipo, o nome do ficheiro e a data.
5. O browser chama `POST /resultados/analisar` com o id do exame, o tipo e a descrição clínica.
6. O serviço de IA lê a imagem. Se a chave da Anthropic responder, o texto vem desse serviço. Se a chamada falhar, ou se o ficheiro for DICOM, o sistema devolve um texto marcado como resultado de demonstração.
7. Esse texto é gravado na tabela de resultados e o ecrã de diagnóstico mostra-o.

O aviso no ecrã deixa claro que um resultado de demonstração não é um diagnóstico médico.

## O que fica na base de dados

A base chama-se `medicos`. As tabelas usadas pelo código são:

- `users` — contas, com senha já transformada em hash.
- `pacientes` — ficha do paciente.
- `exames` — exame, ligação ao paciente e ao utilizador, e nome da imagem.
- resultados de IA — texto da análise ligado a um exame.
- histórico clínico.
- logs — registo automático de operações `POST`, `PUT` e `DELETE` que terminam com sucesso.

A ligação usa os valores de `DB_HOST`, `DB_USER`, `DB_PASSWORD` e `DB_NAME`. Se essas variáveis não existirem, o servidor assume `localhost`, o utilizador `root`, senha vazia e a base `medicos`, que é o ambiente local da defesa.

## Organização do código

```text
index.js                  arranque do Express e montagem das rotas
service/database.js       ligações ao MySQL
service/iaService.js      análise da imagem ou texto de demonstração
src/routes                endereços da API
src/controllers           o que cada pedido faz
src/models                consultas SQL
src/middlewares           upload da imagem e registo de logs
public/src                interface React
scripts                   preparação de utilizadores de demonstração
```

Cada pedido segue o mesmo caminho: a rota recebe o endereço, o controlador aplica a regra e o modelo fala com o MySQL. A interface não escreve SQL. Só chama estes endereços:

- `/auth`
- `/pacientes`
- `/exames`
- `/resultados`
- `/historico`
- `/usuarios`
- `/logs`

## O que este protótipo não faz

Não treina um modelo de visão próprio. A análise, quando a chave está disponível, é pedida a um serviço externo. Vários controlos visuais do ecrã de diagnóstico (zoom, mapa de calor, caixas) ilustram a interface; o conteúdo clínico que vem da base é o texto guardado no resultado. A agenda do dia e parte da consola de administração também são ilustrativas, para a defesa mostrar a organização do ecrã.
