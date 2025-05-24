## Padrão: "Naming Conventions"

Classes são nomeadas com sufixos que indicam seu papel ou responsabilidade, como `Repository` (ex: `UserRepository`, `AccountRepository`), `Service` (ex: `UserService`), `Controller` (ex: `UserController`), `Validation` (ex: `UserValidation`) e `Util` (ex: `ValidatorUtil`). Métodos para operações comuns, como recuperar todos os itens (`getAll`) e criar um item (`create`), utilizam nomes consistentes em diferentes classes de repositório e serviço.

## Padrão: "File/Module Organization"

Os arquivos são agrupados em diretórios sob a pasta `src` com base em seu tipo ou responsabilidade. Exemplos incluem `src/Controllers` para controladores, `src/Services` para serviços, `src/Repositories` para repositórios, `src/Routes` para definições de rota, `src/Validations` para lógica de validação e `src/Utils` para utilitários gerais.

## Padrão: "Layered Architecture"

A estrutura do código demonstra uma organização em camadas lógicas. As rotas (em `src/Routes`) definem os endpoints e delegam o processamento aos controladores. Os controladores (em `src/Controllers`) recebem as requisições HTTP, utilizam validações (em `src/Validations`) para verificar a entrada e delegam a execução da lógica de negócio aos serviços. Os serviços (em `src/Services`) contêm a lógica de negócio e interagem com os repositórios (em `src/Repositories`) para acesso a dados. Os repositórios são responsáveis exclusivamente pelas operações de persistência de dados.

## Padrão: "Separation of Concerns"

Cada módulo ou tipo de arquivo tem uma responsabilidade única e bem definida. Controladores (`UserController`) lidam com a interface HTTP (requisição/resposta). Serviços (`UserService`) contêm a lógica de negócio. Repositórios (`UserRepository`, `AccountRepository`) gerenciam o acesso a dados. Validações (`UserValidation`) lidam com a validação de entrada. Rotas (`UserRoute`) definem o mapeamento de URLs. Utilitários (`ValidatorUtil`) fornecem funcionalidades genéricas reutilizáveis.
