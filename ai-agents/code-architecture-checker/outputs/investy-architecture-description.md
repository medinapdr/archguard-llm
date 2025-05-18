## Convenções de Nomenclatura de Módulos/Classes

### Descrição

Este padrão é observado na forma consistente como os arquivos e classes são nomeados, geralmente utilizando um sufixo que indica a responsabilidade ou o papel arquitetural do módulo. Essa convenção ajuda a identificar rapidamente a função de um arquivo dentro da estrutura do projeto.

### Exemplos

**Segue o padrão:**

*   `LogService.ts`, `AuthService.ts`, `IntegrationService.ts`: Classes que contêm lógica de negócio ou orquestração de tarefas utilizam o sufixo `Service`.
*   `IntegrationRepository.ts`, `UserRepository.ts`, `AssetSyncRepository.ts`: Classes responsáveis pela interação com o banco de dados utilizam o sufixo `Repository`.
*   `NotionIntegrationController.ts`, `UserController.ts`: Classes que lidam com a entrada de requisições HTTP utilizam o sufixo `Controller`.
*   `StatusInvestLib.ts`, `NotionLib.ts`: Classes que encapsulam a interação com bibliotecas ou APIs externas utilizam o sufixo `Lib`.
*   `StringUtil.ts`, `MongooseUtil.ts`: Classes que fornecem funções utilitárias genéricas utilizam o sufixo `Util`.
*   `MongooseRepositoryAdapter.ts`, `NextHttpAdapter.ts`: Classes que adaptam interfaces externas para contratos internos utilizam o sufixo `Adapter`.
*   `AuthMiddleware.ts`, `InfraMiddleware.ts`: Classes que processam requisições antes de chegarem ao controlador utilizam o sufixo `Middleware`.
*   `UserValidation.ts`, `NotionAssetSyncValidation.ts`: Classes que contêm lógica de validação de entrada utilizam o sufixo `Validation`.
*   `IntegrationEntity.ts`, `UserEntity.ts`: Arquivos que definem tipos de entidades de dados utilizam o sufixo `Entity`.
*   `UserSchema.ts`, `AssetSyncSchema.ts`: Arquivos que definem esquemas de banco de dados (Mongoose) utilizam o sufixo `Schema`.
*   `RepositoryContract.ts`, `HttpContract.ts`: Arquivos que definem interfaces ou tipos para contratos utilizam o sufixo `Contract`.
*   `NotionProtocol.ts`, `AuthProtocol.ts`: Arquivos que definem tipos ou interfaces para protocolos de comunicação ou estruturas de dados utilizam o sufixo `Protocol`.
*   `AuthConfig.ts`, `DatabaseConfig.ts`: Arquivos que contêm configurações utilizam o sufixo `Config`.
*   `useDidMount.ts`, `useValidation.ts`: Arquivos que definem React Hooks utilizam o prefixo `use`.
*   `Button/index.tsx`, `Table/index.tsx`: Componentes React são definidos em diretórios com o nome do componente e um arquivo `index.tsx`.
*   `Login/index.tsx`, `Signup/index.tsx`: Páginas Next.js são definidas em diretórios com o nome da página e um arquivo `index.tsx`.
*   `infra/database/index.ts`, `infra/queue/index.ts`: Módulos de infraestrutura são definidos em diretórios específicos dentro de `infra`.
*   `queues/SyncNotionAssetPriceQueue.ts`: Handlers de fila utilizam o sufixo `Queue`.
*   `exceptions/QueueProcessException.ts`: Classes de exceção utilizam o sufixo `Exception`.

**Viola o padrão:**

*   `client/services/api.ts`: Este arquivo define uma instância do Axios e interceptors, mas não segue a convenção de sufixo `Service` ou `Adapter` de forma estrita, embora esteja no diretório `services`.
*   `client/services/auth.ts`: Este arquivo define funções relacionadas à autenticação no lado do cliente, mas não utiliza o sufixo `Service` e é um objeto plano, não uma classe.

## Organização de Arquivos por Camada/Responsabilidade

### Descrição

Este padrão é evidente na forma como os arquivos são agrupados em diretórios, onde cada diretório corresponde a uma camada arquitetural ou a um tipo específico de responsabilidade. Isso cria uma estrutura de projeto modular e previsível.

### Exemplos

**Segue o padrão:**

*   Todos os arquivos com sufixo `Service` (como `LogService.ts`, `AuthService.ts`) estão localizados no diretório `server/services`.
*   Todos os arquivos com sufixo `Repository` (como `IntegrationRepository.ts`, `UserRepository.ts`) estão localizados no diretório `server/repositories`.
*   Todos os arquivos com sufixo `Controller` (como `NotionIntegrationController.ts`, `UserController.ts`) estão localizados no diretório `server/controllers`.
*   Todos os arquivos com sufixo `Lib` (como `StatusInvestLib.ts`, `NotionLib.ts`) estão localizados no diretório `server/lib`.
*   Todos os arquivos com sufixo `Util` (como `StringUtil.ts`, `MongooseUtil.ts`) estão localizados no diretório `server/utils`.
*   Todos os arquivos com sufixo `Adapter` (como `MongooseRepositoryAdapter.ts`, `NextHttpAdapter.ts`) estão localizados no diretório `server/adapters`.
*   Todos os arquivos com sufixo `Middleware` (como `AuthMiddleware.ts`, `InfraMiddleware.ts`) estão localizados no diretório `server/middlewares`.
*   Todos os arquivos com sufixo `Validation` (como `UserValidation.ts`, `NotionAssetSyncValidation.ts`) estão localizados no diretório `server/validations`.
*   Todos os arquivos com sufixo `Entity` (como `IntegrationEntity.ts`, `UserEntity.ts`) estão localizados no diretório `server/entities`.
*   Todos os arquivos com sufixo `Schema` (como `UserSchema.ts`, `AssetSyncSchema.ts`) estão localizados no diretório `server/schemas`.
*   Todos os arquivos com sufixo `Contract` (como `RepositoryContract.ts`, `HttpContract.ts`) estão localizados no diretório `server/contracts`.
*   Todos os arquivos com sufixo `Protocol` (como `NotionProtocol.ts`, `AuthProtocol.ts`) estão localizados no diretório `server/protocols`.
*   Todos os arquivos com sufixo `Config` (como `AuthConfig.ts`, `DatabaseConfig.ts`) estão localizados no diretório `server/config`.
*   Todos os arquivos que definem React Hooks (com prefixo `use`) estão localizados no diretório `client/hooks`.
*   Todos os diretórios de componentes React (como `Button`, `Table`) estão localizados no diretório `client/components`.
*   Todos os diretórios de páginas Next.js (como `Login`, `Signup`) estão localizados no diretório `client/pages`.
*   Os módulos de infraestrutura (banco de dados, fila) estão localizados no diretório `server/infra`.
*   Os handlers de fila estão localizados no diretório `server/queues`.
*   As classes de exceção estão localizadas no diretório `server/exceptions`.

**Viola o padrão:**

*   `client/app.tsx`: Este arquivo é o ponto de entrada principal da aplicação Next.js (`_app.tsx`) e, por convenção do framework, reside na raiz do diretório `client`, não sendo agrupado em `components` ou `pages`.
*   `client/routes/index.tsx`: Este arquivo define o mapeamento de rotas e reside em um diretório `routes` dedicado, que não se alinha diretamente com os diretórios de camadas ou responsabilidades comuns (como `components` ou `pages`).
*   `pages/api/...`: Os arquivos dentro deste diretório são pontos de entrada para as rotas de API do Next.js e, por convenção do framework, residem neste local, não sendo agrupados nos diretórios de camadas do servidor (como `controllers` ou `middlewares`).

## Arquitetura em Camadas

### Descrição

O código demonstra uma intenção de seguir uma arquitetura em camadas, onde as dependências geralmente fluem de camadas superiores para inferiores. As camadas observadas incluem pontos de entrada da API, middlewares, controladores, serviços, repositórios, bibliotecas e módulos de infraestrutura.

### Exemplos

**Segue o padrão:**

*   Os arquivos em `pages/api` (ponto de entrada) importam `middlewares` e `adapters`.
*   Os `middlewares` (como `AuthMiddleware.ts`) importam `config` e `services`.
*   Os `controllers` (como `UserController.ts`) importam `services`, `validations` e `repositories`.
*   Os `services` (como `AuthService.ts`) importam outros `services`, `config`, `utils` e `protocols`.
*   Os `repositories` (como `UserRepository.ts`) importam `adapters`, `entities`, `schemas`, `contracts` e `utils`.
*   As `libs` (como `NotionLib.ts`) importam `protocols`, `utils` e bibliotecas externas.
*   Os módulos de `infra` (como `DatabaseModule.ts`) importam `config`, `services` e bibliotecas externas.
*   Os `queues` (como `SyncNotionAssetPriceQueue.ts`) importam `repositories`, `services`, `lib`, `utils`, `exceptions` e `contracts`.

**Viola o padrão:**

*   O `AssetSyncSchedulerService` (camada de Serviço) importa o `@server/infra/queue` (camada de Infraestrutura) através de uma importação lazy. Em uma arquitetura em camadas estrita, as camadas de Serviço não deveriam depender diretamente de módulos de Infraestrutura; a dependência deveria ser invertida ou mediada por um contrato. A importação lazy é uma solução técnica para evitar um ciclo de dependência, mas a dependência arquitetural de uma camada superior para uma inferior ainda existe.

## Separação de Responsabilidades

### Descrição

O código demonstra uma forte separação de responsabilidades, onde diferentes tipos de lógica são encapsulados em módulos ou classes distintas. Controladores lidam com requisições, serviços orquestram a lógica de negócio, repositórios gerenciam o acesso a dados, bibliotecas encapsulam interações externas, utilitários fornecem funções auxiliares, validações lidam com a verificação de entrada e módulos de infraestrutura cuidam da inicialização de recursos externos.

### Exemplos

**Segue o padrão:**

*   `UserController.ts` lida com as requisições de signup e login, delegando a validação para `UserValidation.ts` e a lógica de criação/autenticação para `AuthService.ts` e `UserRepository.ts`.
*   `AuthService.ts` lida especificamente com a lógica de autenticação (hashing de senha, geração/decodificação de token), utilizando `HashService.ts` e `CryptService.ts` para tarefas criptográficas.
*   `UserRepository.ts` lida apenas com operações de persistência para a entidade `User`, utilizando o `MongooseRepositoryAdapter.ts`.
*   `StatusInvestLib.ts` encapsula a lógica de interação com a API do Status Invest, sem misturar lógica de negócio ou persistência.
*   `ValidationUtil.ts` fornece utilitários genéricos para validação, enquanto `UserValidation.ts` contém as regras de validação específicas para usuários.
*   `Infra.ts` é responsável apenas por inicializar os módulos de infraestrutura (`DatabaseModule`, `QueueModule`).

**Viola o padrão:**

*   O `SyncNotionAssetPriceQueue.ts` (handler de fila) atualiza diretamente o status da sincronização no `AssetSyncRepository.ts` em seus métodos de ciclo de vida (`onActive`, `onCompleted`, `onError`). Embora essas atualizações estejam relacionadas à tarefa da fila, a responsabilidade de atualizar o estado da entidade no banco de dados poderia ser argumentada como pertencente à camada de Serviço ou a um método específico no Repositório chamado por um Serviço, em vez de ser realizada diretamente pelo handler da fila. Isso representa uma pequena sobreposição da responsabilidade de orquestração da fila com a responsabilidade de acesso a dados.
