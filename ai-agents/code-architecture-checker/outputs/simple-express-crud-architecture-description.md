## Naming Conventions

As classes de serviço são consistentemente nomeadas com o sufixo `Service` (ex: `UserService`). As classes de repositório são nomeadas com o sufixo `Repository` (ex: `UserRepository`, `AccountRepository`). As classes de controlador são nomeadas com o sufixo `Controller` (ex: `UserController`). As classes de validação são nomeadas com o sufixo `Validation` (ex: `UserValidation`). As classes de utilidade são nomeadas com o sufixo `Util` (ex: `ValidatorUtil`). Os arquivos de rota são nomeados com o sufixo `Route` (ex: `UserRoute`). Métodos que recuperam dados são consistentemente prefixados com `get` (ex: `getAll`, `getById`, `getAllUsers`). Métodos que criam dados são consistentemente prefixados com `create` (ex: `create`, `createUser`).

## File/Module Organization

Os arquivos são organizados em diretórios baseados em sua responsabilidade funcional. Controladores são agrupados em `/src/Controllers` (ex: `UserController.js`). Repositórios são agrupados em `/src/Repositories` (ex: `UserRepository.js`, `AccountRepository.js`). Rotas são agrupadas em `/src/Routes` (ex: `UserRoute.js`). Serviços são agrupados em `/src/Services` (ex: `UserService.js`). Validações são agrupadas em `/src/Validations` (ex: `UserValidation.js`). Utilitários são agrupados em `/src/Utils` (ex: `ValidatorUtil.js`).

## Layered Architecture

A aplicação demonstra uma separação clara de responsabilidades em camadas lógicas. A camada de Roteamento (`UserRoute.js`) é responsável por definir os endpoints da API e delegar as requisições para a camada de Controlador. A camada de Controlador (`UserController.js`) lida com a lógica de requisição e resposta HTTP, validação de entrada (delegando para `UserValidation`) e delega a lógica de negócio para a camada de Serviço. A camada de Serviço (`UserService.js`) contém a lógica de negócio e coordena as operações, delegando o acesso a dados para a camada de Repositório. A camada de Repositório (`UserRepository.js`, `AccountRepository.js`) é responsável exclusivamente pelo acesso e manipulação de dados.

## Separation of Concerns

Cada módulo ou componente possui uma responsabilidade única e bem definida. Os controladores (`UserController.js`) são responsáveis por receber requisições HTTP, chamar validações (`UserValidation.js`), invocar serviços (`UserService.js`) e enviar respostas HTTP, sem conter lógica de negócio complexa ou acesso direto a dados. Os serviços (`UserService.js`) encapsulam a lógica de negócio e orquestram as operações, sem lidar com detalhes de requisição/resposta HTTP ou acesso direto ao banco de dados. Os repositórios (`UserRepository.js`, `AccountRepository.js`) são dedicados exclusivamente à manipulação de dados, sem lógica de negócio ou de apresentação. As validações (`UserValidation.js`) são responsáveis apenas por validar os dados de entrada, utilizando um utilitário genérico (`ValidatorUtil.js`).
