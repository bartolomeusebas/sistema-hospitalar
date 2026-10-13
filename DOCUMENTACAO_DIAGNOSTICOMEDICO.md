# Sistema Hospitalar de Apoio ao Diagnóstico por Imagem

## 1. Finalidade deste documento

Este documento reúne a descrição técnica do sistema web desenvolvido para gestão de pacientes, exames de imagem e resultados de análise assistida por Inteligência Artificial. Serve como base de trabalho para a elaboração da monografia e como contexto para um assistente de escrita académica.

A descrição deve ser usada com rigor: o sistema integra um serviço externo da Anthropic para produzir uma análise textual, mas essa análise não substitui a avaliação de um profissional de saúde. O sistema é uma ferramenta de apoio e pré-análise.

Não devem ser apresentados como resultados científicos dados que não estejam registados no projecto, nos testes ou em documentos fornecidos pelos autores.

## 2. Identificação do projecto

**Nome provisório:** Sistema Hospitalar de Apoio ao Diagnóstico por Imagem

**Área:** sistemas de informação em saúde, gestão clínica e apoio computacional à análise de exames de imagem.

**Problema abordado:** profissionais de saúde precisam de consultar dados de pacientes, registar exames, armazenar imagens e visualizar uma análise preliminar num fluxo único. O sistema procura centralizar esse processo e reduzir a dispersão das informações.

**Solução proposta:** aplicação web com autenticação, gestão de pacientes, registo de exames, upload de imagens, integração com a API da Anthropic e apresentação do resultado para posterior revisão médica.

**Formulação adequada do contributo:** foi desenvolvido um sistema computacional de apoio ao diagnóstico que integra um serviço externo de Inteligência Artificial para análise de exames de imagem. Não se deve afirmar que foi treinado um modelo CNN próprio, pois não existe no projecto uma etapa de treino de modelo do zero.

## 3. Tecnologias utilizadas

### Backend

- Node.js.
- Express.
- MySQL.
- mysql2 para acesso à base de dados.
- Sequelize aparece como dependência, mas o acesso observado neste fluxo é feito directamente com `mysql2`.
- Multer para upload de ficheiros.
- JSON Web Token para autenticação.
- `bcryptjs` para verificação de palavras-passe.
- `cookie-parser` para leitura do cookie de sessão.
- `dotenv` para carregamento das variáveis de ambiente.
- SDK oficial `@anthropic-ai/sdk` para comunicação com a Anthropic.

### Frontend

- React.
- TypeScript.
- Vite.
- Tailwind CSS.
- Lucide React para ícones.
- Motion está listado nas dependências do frontend.

## 4. Organização do projecto

```text
Atendimento medico/
├── index.js                         Entrada do servidor Express
├── package.json                     Dependências e scripts do backend
├── iafile.env                       Configuração local da integração de IA
├── service/
│   ├── database.js                  Pool de conexões MySQL
│   └── iaService.js                 Serviço de análise com Anthropic
├── src/
│   ├── controllers/                 Regras dos endpoints
│   ├── middlewares/                 Upload e logging
│   ├── models/                      Consultas à base de dados
│   └── routes/                      Rotas da API
├── public/
│   ├── src/                         Aplicação React/TypeScript
│   ├── uploads/                     Imagens armazenadas pelo backend
│   └── users/                       Páginas HTML auxiliares
└── scripts/                         Scripts de preparação e actualização
```

## 5. Arquitectura geral

A solução é composta por três camadas principais:

1. **Interface web:** permite autenticar o utilizador, escolher um paciente, registar o exame, enviar uma imagem e consultar a análise.
2. **API Express:** valida a sessão, recebe os dados, guarda a imagem, cria o registo do exame, encaminha a análise e persiste o resultado.
3. **Serviços externos e persistência:** o MySQL armazena os dados clínicos e o SDK da Anthropic é utilizado para solicitar a análise textual do exame.

Fluxo lógico:

```text
Utilizador
   │
   ▼
React/Vite ── HTTP ──► API Express
                         │
                         ├── MySQL: pacientes, exames e resultados
                         ├── public/uploads: ficheiro enviado
                         └── Anthropic API: análise textual da imagem
```

O servidor principal é iniciado por `index.js` e, por padrão, utiliza a porta `3000`. O frontend Vite utiliza um proxy de desenvolvimento para encaminhar as chamadas da API para o backend.

## 6. Autenticação e sessão

O login é realizado por `POST /auth/login`, com `email` e `senha`. Após a validação do utilizador, o backend cria um JWT com validade de oito horas e envia-o num cookie HTTP-only chamado `token`.

O middleware de autenticação lê esse cookie, valida a assinatura e coloca os dados do utilizador em `req.user`. A rota de resultados de IA utiliza esse middleware antes de permitir qualquer operação.

O frontend envia `credentials: 'include'` nas chamadas que precisam do cookie. O logout é realizado por `POST /auth/logout`, que limpa o cookie.

## 7. Gestão de pacientes e exames

O utilizador autenticado selecciona um paciente na interface e abre a fila de exames. Para registar um exame, o frontend envia um `FormData` para `POST /exames` com:

- `paciente_id`;
- `tipo`;
- `descricao`;
- `data_exame`;
- `imagem`.

O middleware Multer grava o ficheiro em `public/uploads` com um nome baseado no timestamp. O tamanho máximo configurado é de 50 MB.

O modelo de exames relaciona o exame com o paciente e com o utilizador responsável, armazenando o tipo, o nome do ficheiro e a data. O controller devolve o identificador do exame criado, que será usado na etapa de análise.

## 8. Integração com a Anthropic

### 8.1 Configuração

O serviço `service/iaService.js` cria um cliente da Anthropic com `ANTHROPIC_API_KEY`. O modelo é lido de `ANTHROPIC_MODEL`; quando essa variável não está definida, o código utiliza o valor padrão configurado no serviço.

As credenciais devem existir apenas no ambiente local ou no mecanismo seguro de configuração. Não devem ser incluídas na monografia, no código publicado ou no controlo de versões.

### 8.2 Análise com imagem

Quando o exame possui uma imagem, o controller procura o ficheiro em `public/uploads` e chama `iaService.analisarExame`. O serviço:

1. lê o ficheiro do disco;
2. converte o conteúdo para Base64;
3. identifica o tipo MIME para JPEG, PNG, GIF ou WebP;
4. constrói uma mensagem multimodal com um bloco de imagem e um bloco de texto;
5. envia a mensagem através de `client.messages.create`;
6. extrai o texto devolvido pela resposta;
7. devolve o diagnóstico textual e o modelo utilizado.

A instrução enviada à IA pede uma resposta organizada em quatro grupos:

- achados principais;
- possíveis diagnósticos com confiança em percentagem;
- recomendações;
- observações relevantes.

O pedido deve ser interpretado como apoio à leitura e não como diagnóstico definitivo. A decisão clínica pertence ao profissional de saúde.

### 8.3 Análise sem imagem

Se o exame não possui imagem, o controller chama `iaService.analisarDescricao`. Nesse caso, o serviço envia à Anthropic apenas o tipo e a descrição do exame. Este caminho permite analisar informação textual, mas não equivale à análise directa de uma radiografia.

### 8.4 Resposta e persistência

O resultado retornado pela Anthropic é actualmente tratado como texto livre. O backend guarda esse texto na tabela `resultados_ia`, associado ao `exame_id`.

O registo inclui:

- `exame_id`;
- `diagnostico`;
- `probabilidade`;
- `observacao`;
- data de criação, conforme o esquema da base de dados.

O endpoint de análise devolve o diagnóstico, o modelo utilizado e um indicador de demonstração quando o fallback local foi accionado.

## 9. Fallback e modo de demonstração

O serviço possui um resultado demonstrativo para situações em que a análise online não está disponível ou em que o formato DICOM não é processado directamente pelo fluxo actual. Quando isso acontece, o resultado contém uma indicação de demonstração e uma mensagem de que não representa diagnóstico médico real.

Esse comportamento é importante para a continuidade da demonstração da aplicação, mas deve ser distinguido de uma resposta efectivamente gerada pela Anthropic. A monografia deve indicar a existência do fallback e explicar como a aplicação sinaliza esse estado.

## 10. Endpoints relevantes

### Autenticação

| Método | Endpoint | Finalidade |
|---|---|---|
| POST | `/auth/login` | Autenticar utilizador e criar cookie JWT |
| POST | `/auth/logout` | Encerrar sessão |

### Exames

| Método | Endpoint | Finalidade |
|---|---|---|
| POST | `/exames` | Criar exame e guardar imagem |
| GET | `/exames` | Listar exames |
| GET | `/exames/:id` | Consultar exame |
| DELETE | `/exames/:id` | Remover exame |

### Resultados de IA

Todas as rotas de resultados são protegidas pelo middleware de autenticação.

| Método | Endpoint | Finalidade |
|---|---|---|
| POST | `/resultados/analisar` | Executar a análise associada a um exame |
| GET | `/resultados/exame/:exame_id` | Consultar resultados de um exame |
| POST | `/resultados` | Guardar resultado manual |
| GET | `/resultados` | Listar resultados |
| GET | `/resultados/:id` | Consultar resultado específico |
| DELETE | `/resultados/:id` | Remover resultado |

Exemplo conceptual do pedido de análise:

```json
{
  "exame_id": 123,
  "tipoExame": "X-Ray (CR/DX)",
  "descricao": "Indicação clínica do exame"
}
```

Exemplo conceptual da resposta:

```json
{
  "mensagem": "Exame analisado com sucesso!",
  "exame_id": 123,
  "diagnostico": "Texto devolvido pelo serviço de IA",
  "modelo": "modelo configurado no ambiente",
  "demonstracao": false
}
```

## 11. Fluxo completo de utilização

1. O profissional abre a aplicação.
2. Informa email e palavra-passe.
3. O backend valida as credenciais e cria a sessão JWT.
4. O frontend carrega a lista de pacientes.
5. O profissional selecciona um paciente.
6. Abre o registo de novo exame.
7. Selecciona a modalidade, a data, a hora e a indicação clínica.
8. Selecciona uma imagem e envia o formulário.
9. O backend grava a imagem e cria o exame.
10. O frontend chama `POST /resultados/analisar`.
11. O backend lê a imagem e envia a solicitação à Anthropic.
12. O texto recebido é guardado na base de dados.
13. A tela de diagnóstico consulta o resultado por `GET /resultados/exame/:exame_id`.
14. O profissional consulta a análise como apoio e deve revê-la antes de qualquer decisão clínica.

## 12. Interface frontend

As principais telas React são:

- `LoginView`: autenticação do utilizador.
- `DoctorDashboard`: área principal do profissional.
- `PatientRecords`: pesquisa e listagem de pacientes.
- `PatientDetail`: detalhe do paciente e acesso aos exames.
- `ImagingQueue`: registo, upload e envio do exame.
- `AiDiagnostics`: consulta do texto de análise associado ao exame.
- `Reporting`: área de laudo e apresentação do resultado.
- `AdminDashboard` e `AdminConsole`: funções administrativas.

O estado de navegação é controlado por `App.tsx`. O identificador do paciente e o identificador do exame seleccionado são mantidos no estado da aplicação para ligar as telas do fluxo clínico.

## 13. Avaliação recomendada para a monografia

A avaliação deve concentrar-se no sistema e na integração, e não em métricas de treino de uma CNN que não foi desenvolvida. Podem ser avaliados:

- funcionamento do login e controlo de sessão;
- criação e consulta de pacientes;
- upload e armazenamento dos exames;
- comunicação entre frontend e backend;
- envio da imagem ao serviço de IA;
- persistência e consulta dos resultados;
- comportamento perante erro ou indisponibilidade do serviço;
- tempo de resposta observado nos testes;
- clareza da apresentação do resultado ao profissional;
- distinção entre resultado online e modo de demonstração;
- limitações de formatos, segurança, privacidade e dependência externa.

As métricas, quantidade de testes, tempos e conclusões devem ser preenchidos apenas com valores efectivamente medidos:

- `[NÚMERO REAL DE TESTES]`;
- `[TEMPO REAL DE RESPOSTA]`;
- `[MODELO REAL CONFIGURADO]`;
- `[VERSÃO REAL DA API OU SDK]`;
- `[QUANTIDADE REAL DE EXAMES]`;
- `[RESULTADOS OBSERVADOS]`.

Não declarar acurácia, sensibilidade, especificidade, F1-score, matriz de confusão ou desempenho clínico sem um protocolo de avaliação e dados reais que sustentem essas métricas.

## 14. Limitações técnicas a considerar

- A Anthropic é um serviço externo; a análise depende de conectividade, credenciais, disponibilidade e limites da API.
- O sistema guarda a resposta como texto livre, sem parser estruturado para separar achados, probabilidades e recomendações.
- O campo de probabilidade persistido pelo controller é inicializado com `0`; percentagens que apareçam no texto não são convertidas automaticamente para esse campo.
- O caminho DICOM não é convertido para um formato de imagem antes do envio à Anthropic.
- O fallback local permite demonstrar o fluxo, mas não fornece uma avaliação clínica real.
- Algumas telas utilizam dados visuais de demonstração para o visualizador e para o laudo; esses dados não devem ser descritos como resultados produzidos pela API sem confirmação do código e do teste correspondente.
- O sistema deve ser reforçado antes de uma utilização clínica real com autorização por função e por paciente, auditoria, protecção de dados, validação de uploads, gestão segura de segredos e políticas de retenção.
- A integração externa não deve ser apresentada como modelo treinado pela equipa do projecto.

## 15. Estrutura sugerida para a monografia

### Capítulo I - Introdução

- contexto da gestão digital de exames;
- problema de investigação;
- justificativa;
- objectivo geral;
- objectivos específicos;
- delimitação do estudo;
- estrutura do trabalho.

### Capítulo II - Fundamentação teórica

- sistemas de informação em saúde;
- imagens médicas e radiografia;
- apoio computacional ao diagnóstico;
- modelos de linguagem multimodais e análise de imagens;
- integração com serviços externos de IA;
- segurança, privacidade e responsabilidade em saúde;
- trabalhos relacionados.

### Capítulo III - Metodologia

- tipo de investigação;
- levantamento de requisitos;
- tecnologias utilizadas;
- arquitectura da solução;
- preparação e envio das imagens;
- integração da Anthropic;
- definição do prompt de análise;
- critérios de teste;
- critérios de avaliação da resposta;
- limitações metodológicas.

### Capítulo IV - Desenvolvimento e implementação

- arquitectura backend e frontend;
- autenticação;
- gestão de pacientes;
- registo e upload de exames;
- comunicação com a API;
- persistência dos resultados;
- apresentação do resultado ao profissional;
- fallback e modo de demonstração.

### Capítulo V - Testes e resultados

- casos de teste funcionais;
- testes de upload;
- testes de autenticação;
- testes de integração com a IA;
- comportamento em falhas;
- resultados reais observados;
- análise crítica dos resultados;
- limitações e riscos.

### Capítulo VI - Conclusões e recomendações

- síntese do trabalho realizado;
- resposta aos objectivos;
- contributos do sistema;
- limitações;
- melhorias futuras;
- possibilidades de validação clínica futura.

## 16. Prompt de trabalho para o Claude

Use o texto abaixo como instrução inicial, anexando este documento e os materiais reais do projecto:

> Actua como orientador e redactor académico especializado em sistemas de informação em saúde. Usa a documentação do projecto fornecida para construir a monografia capítulo a capítulo, em português de Portugal, com linguagem académica clara e tecnicamente rigorosa.
>
> O projecto é um sistema web hospitalar de apoio ao diagnóstico por imagem. A aplicação permite autenticação, gestão de pacientes, registo e upload de exames, armazenamento em MySQL e integração com um serviço externo da Anthropic para produzir uma análise textual assistida por IA. A equipa desenvolveu a aplicação e a integração; não treinou uma CNN própria do zero.
>
> Descreve a integração como integração de um serviço externo de IA: envio da imagem codificada em Base64, utilização de um prompt multimodal, recepção de texto, persistência do resultado e apresentação para revisão profissional. Explica também o fallback de demonstração, a dependência da disponibilidade da API, o suporte limitado a formatos e as limitações de segurança e validação.
>
> Não inventes resultados, métricas, entrevistas, número de pacientes, instituições, tempos de resposta, versões de modelos, protocolos clínicos, aprovação ética ou conclusões experimentais. Sempre que uma informação não estiver nos ficheiros fornecidos, escreve `[INFORMAÇÃO A FORNECER]` e lista exactamente o que os autores precisam de confirmar.
>
> Não afirmes que a equipa treinou uma CNN, que possui matriz de confusão, que obteve acurácia clínica ou que validou diagnósticos se esses elementos não forem comprovados por dados reais. Distingue sempre entre: (a) funcionalidade implementada; (b) resultado observado num teste; (c) dado demonstrativo/mock; (d) proposta de trabalho futuro.
>
> Não trates uma análise da Anthropic como diagnóstico médico definitivo. Usa expressões como “análise assistida”, “pré-análise”, “resultado textual para apoio à decisão” e “revisão obrigatória por profissional de saúde”.
>
> Antes de redigir cada capítulo, apresenta uma lista curta das informações confirmadas, das informações em falta e das afirmações que não podem ser feitas. Depois redige apenas o que for sustentado pela documentação. Inclui referências científicas reais e verificáveis; não inventes autores, títulos, DOI ou páginas. Quando não puderes verificar uma referência, marca `[REFERÊNCIA A VALIDAR]`.
>
> Mantém coerência terminológica entre “serviço de IA”, “Anthropic”, “análise assistida por IA”, “resultado demonstrativo” e “profissional de saúde”. Produz o texto com citações no formato solicitado pela instituição e termina cada capítulo com uma breve verificação de consistência factual.

## 17. Informações que os autores devem confirmar antes da versão final

- nome oficial do projecto;
- instituição, curso e grau académico;
- nomes dos autores e orientador;
- versão efectiva do modelo Anthropic configurado no ambiente;
- período e ambiente dos testes;
- base de dados de teste utilizada;
- tipos e quantidade de imagens efectivamente analisadas;
- se as chamadas à API foram realizadas com sucesso em cada teste;
- tempos de resposta observados;
- comportamento real do fallback;
- requisitos funcionais e não funcionais aprovados;
- normas de formatação e citação da instituição;
- regras de privacidade, consentimento e anonimização aplicáveis ao projecto.

Este documento descreve o código observado e deve ser actualizado quando a implementação, a configuração ou os resultados dos testes forem alterados.
