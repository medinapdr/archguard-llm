## Naming Conventions

Este padrão arquitetural é observado através da aplicação consistente de sufixos específicos para classes e arquivos, indicando claramente seu propósito e responsabilidade dentro da codebase. Essa convenção facilita a identificação rápida do papel de cada componente.

-   **Classes de Serviço (Service):** Classes que encapsulam lógica de negócio ou coordenação de operações são consistentemente nomeadas com o sufixo `Service`.
    -   Exemplos: `LogService` (`examples/investy/server/services/LogService.ts`), `AssetSyncSchedulerService` (`examples/investy/server/services/AssetSyncSchedulerService.ts`), `AuthService` (`examples/investy/server/services/AuthService.ts`).
-   **Classes de Repositório (Repository):** Classes responsáveis pela abstração da camada de persistência de dados são nomeadas com o sufixo `Repository`.
    -   Exemplos: `AssetSyncRepository` (`examples/investy/server/repositories/AssetSyncRepository.ts`), `IntegrationRepository` (`examples/investy/server/repositories/IntegrationRepository.ts`), `UserRepository` (`examples/investy/server/repositories/UserRepository.ts`).
-   **Classes de Controlador (Controller):** Classes que lidam com a lógica de requisição e resposta HTTP, delegando o processamento para outras camadas, são nomeadas com o sufixo `Controller`.
    -   Exemplos: `NotionIntegrationController` (`examples/investy/server/controllers/NotionIntegrationController.ts`), `NotionAssetSyncController` (`examples/investy/server/controllers/NotionAssetSyncController.ts`), `UserController` (`examples/investy/server/controllers/UserController.ts`).
-   **Classes de Utilitário (Util):** Classes que fornecem funções auxiliares e genéricas, sem lógica de negócio específica, são nomeadas com o sufixo `Util`.
    -   Exemplos: `StringUtil` (`examples/investy/server/utils/StringUtil.ts`), `MongooseUtil` (`examples/investy/server/utils/MongooseUtil.ts`), `ValidationUtil` (`examples/investy/server/utils/ValidationUtil.ts`).
-   **Classes de Biblioteca (Lib):** Classes que encapsulam a interação com APIs externas ou bibliotecas de terceiros são nomeadas com o sufixo `Lib`.
    -   Exemplos: `StatusInvestLib` (`examples/investy/server/lib/StatusInvestLib.ts`), `NotionLib` (`examples/investy/server/lib/NotionLib.ts`).
-   **Classes de Adaptador (Adapter):** Classes que adaptam interfaces de bibliotecas externas para as interfaces internas do sistema são nomeadas com o sufixo `Adapter`.
    -   Exemplos: `MongooseRepositoryAdapter` (`examples/investy/server/adapters/MongooseRepositoryAdapter.ts`), `QuirrelQueueAdapter` (`examples/investy/server/adapters/QuirrelQueueAdapter.ts`), `NextHttpAdapter` (`examples/investy/server/adapters/NextHttpAdapter.ts`).
-   **Arquivos de Configuração (Config):** Arquivos que contêm configurações globais ou específicas de módulos são nomeados com o sufixo `Config` ou exportam objetos com esse sufixo.
    -   Exemplos: `AuthConfig` (`examples/investy/server/config/AuthConfig.ts`), `DatabaseConfig` (`examples/investy/server/config/DatabaseConfig.ts`), `apiConfig` (`examples/investy/client/config/api.ts`).
-   **Tipos/Interfaces de Entidade (Entity):** Tipos ou interfaces que representam a estrutura de dados de entidades do domínio são nomeados com o sufixo `Entity`.
    -   Exemplos: `IntegrationEntity` (`examples/investy/server/entities/IntegrationEntity.ts`), `AssetSyncEntity` (`examples/investy/server/entities/AssetSyncEntity.ts`), `UserEntity` (`examples/investy/server/entities/UserEntity.ts`).
-   **Arquivos de Schema (Schema):** Arquivos que definem esquemas de banco de dados (especificamente Mongoose) são nomeados com o sufixo `Schema`.
    -   Exemplos: `IntegrationSchema` (`examples/investy/server/schemas/IntegrationSchema.ts`), `AssetSyncSchema` (`examples/investy/server/schemas/AssetSyncSchema.ts`), `UserSchema` (`examples/investy/server/schemas/UserSchema.ts`).
-   **Classes de Validação (Validation):** Classes que contêm a lógica de validação de dados de entrada são nomeadas com o sufixo `Validation`.
    -   Exemplos: `NotionAssetSyncValidation` (`examples/investy/server/validations/NotionAssetSyncValidation.ts`), `IntegrationValidation` (`examples/investy/server/validations/IntegrationValidation.ts`), `UserValidation` (`examples/investy/server/validations/UserValidation.ts`).
-   **Classes de Middleware (Middleware):** Classes que implementam lógica de middleware para requisições HTTP são nomeadas com o sufixo `Middleware`.
    -   Exemplos: `InfraMiddleware` (`examples/investy/server/middlewares/InfraMiddleware.ts`), `AuthMiddleware` (`examples/investy/server/middlewares/AuthMiddleware.ts`).
-   **Variáveis/Propriedades Booleanas:** Variáveis e propriedades que representam um estado booleano são frequentemente prefixadas com `is`, `has` ou `can`.
    -   Exemplos: `isComposedCode` (`examples/investy/server/lib/StatusInvestLib.ts`), `isValidPassword` (`examples/investy/server/services/AuthService.ts`), `isAuthenticated` (`examples/investy/client/services/auth.ts`), `hasDisplayName` (`examples/investy/client/utils/component.ts`).

## File/Module Organization

Este padrão arquitetural é evidente na forma como os arquivos e módulos são estruturados em diretórios lógicos, refletindo suas responsabilidades e facilitando a navegação e manutenção do projeto.

-   **Organização por Camadas no Servidor:** O diretório `server` é dividido em subdiretórios que correspondem a camadas lógicas da aplicação.
    -   `server/adapters`: Contém adaptadores para frameworks ou bibliotecas externas.
        -   Exemplos: `MongooseRepositoryAdapter.ts`, `NextHttpAdapter.ts`.
    -   `server/config`: Armazena arquivos de configuração.
        -   Exemplos: `AuthConfig.ts`, `DatabaseConfig.ts`.
    -   `server/controllers`: Contém os controladores da API.
        -   Exemplos: `NotionIntegrationController.ts`, `UserController.ts`.
    -   `server/contracts`: Define contratos (interfaces/tipos) para diferentes módulos.
        -   Exemplos: `CacheContract.ts`, `HttpContract.ts`.
    -   `server/entities`: Define as entidades de domínio.
        -   Exemplos: `AssetSyncEntity.ts`, `UserEntity.ts`.
    -   `server/exceptions`: Contém classes de exceção personalizadas.
        -   Exemplos: `QueueProcessException.ts`.
    -   `server/infra`: Agrupa módulos de infraestrutura (banco de dados, fila).
        -   Exemplos: `database/index.ts`, `queue/index.ts`.
    -   `server/lib`: Contém bibliotecas que interagem com serviços externos.
        -   Exemplos: `NotionLib.ts`, `StatusInvestLib.ts`.
    -   `server/middlewares`: Armazena middlewares para requisições HTTP.
        -   Exemplos: `AuthMiddleware.ts`, `InfraMiddleware.ts`.
    -   `server/protocols`: Define tipos e interfaces para protocolos de comunicação ou dados.
        -   Exemplos: `AuthProtocol.ts`, `NotionProtocol.ts`.
    -   `server/queues`: Contém as implementações dos handlers de fila.
        -   Exemplos: `SyncNotionAssetPriceQueue.ts`.
    -   `server/repositories`: Contém os repositórios para acesso a dados.
        -   Exemplos: `AssetSyncRepository.ts`, `UserRepository.ts`.
    -   `server/schemas`: Define os esquemas de banco de dados.
        -   Exemplos: `AssetSyncSchema.ts`, `UserSchema.ts`.
    -   `server/services`: Contém a lógica de negócio e coordenação.
        -   Exemplos: `AuthService.ts`, `IntegrationService.ts`.
    -   `server/utils`: Armazena funções utilitárias genéricas.
        -   Exemplos: `NumberUtil.ts`, `StringUtil.ts`.
    -   `server/validations`: Contém a lógica de validação de dados.
        -   Exemplos: `UserValidation.ts`, `NotionAssetSyncValidation.ts`.
-   **Organização por Tipo no Cliente (Client):** O diretório `client` também segue uma estrutura clara.
    -   `client/assets`: Contém recursos estáticos como imagens e ícones.
        -   Exemplos: `app/app_icon.svg`, `app/app_logo.svg`.
    -   `client/components`: Agrupa componentes de UI reutilizáveis.
        -   Exemplos: `Button/index.tsx`, `Modal/index.tsx`, `Table/index.tsx`.
    -   `client/config`: Armazena configurações específicas do cliente.
        -   Exemplos: `api.ts`, `route.ts`.
    -   `client/hooks`: Contém hooks React personalizados.
        -   Exemplos: `useDidMount.ts`, `useValidation.ts`.
    -   `client/pages`: Contém os componentes de página da aplicação.
        -   Exemplos: `Login/index.tsx`, `AssetSyncs/Notion/index.tsx`.
    -   `client/protocols`: Define tipos e interfaces para dados do cliente.
        -   Exemplos: `asset-sync.ts`, `notion.ts`.
    -   `client/routes`: Define as rotas da aplicação.
        -   Exemplos: `index.tsx`.
    -   `client/services`: Contém serviços de cliente (e.g., API, autenticação).
        -   Exemplos: `api.ts`, `auth.ts`.
    -   `client/styles`: Contém estilos globais.
        -   Exemplos: `globals.css`.
    -   `client/utils`: Armazena funções utilitárias genéricas para o cliente.
        -   Exemplos: `api.ts`, `style.ts`.
-   **Organização de Rotas da API (pages/api):** As rotas da API são organizadas em arquivos que espelham a estrutura da URL.
    -   Exemplos: `pages/api/asset-syncs/notion.ts`, `pages/api/users/login.ts`, `pages/api/integrations/notion/database.ts`.

## Layered Architecture

Este padrão arquitetural é claramente implementado na aplicação, com responsabilidades bem definidas para cada camada lógica.

-   **Camada de Apresentação/Controladores:**
    -   Os controladores (e.g., `NotionAssetSyncController`, `UserController`, `IntegrationController`) são responsáveis por receber requisições HTTP, validar os dados de entrada (delegando para a camada de validação), e formatar as respostas. Eles não contêm lógica de negócio complexa, delegando-a para a camada de serviço.
    -   Exemplos:
        -   Em `examples/investy/server/controllers/NotionAssetSyncController.ts`, o método `create` recebe `request` e `response`, valida a entrada com `NotionAssetSyncValidation.validateNotionData`, e então coordena a criação de um `AssetSync` usando `AssetSyncRepository.create` e o agendamento com `AssetSyncSchedulerService.scheduleNotionAssetSync`.
        -   Em `examples/investy/server/controllers/UserController.ts`, o método `signup` valida os dados com `UserValidation.validateSignupData`, delega a criação do hash da senha para `AuthService.makeHashedPassword` e a criação do usuário para `UserRepository.create`, e a geração do token para `AuthService.generateAuthToken`.
-   **Camada de Serviço (Business Logic):**
    -   As classes de serviço (e.g., `AuthService`, `IntegrationService`, `AssetSyncSchedulerService`) contêm a lógica de negócio principal da aplicação. Elas orquestram operações entre diferentes repositórios, bibliotecas e outros serviços, garantindo que as regras de negócio sejam aplicadas.
    -   Exemplos:
        -   Em `examples/investy/server/services/AuthService.ts`, os métodos `makeHashedPassword`, `isValidPassword`, `decodeAuthToken` e `generateAuthToken` encapsulam a lógica de autenticação e hashing, utilizando `HashService` e `CryptService`.
        -   Em `examples/investy/server/services/AssetSyncSchedulerService.ts`, o método `scheduleNotionAssetSync` contém a lógica para agendar uma tarefa na fila, importando e utilizando `QueueModule` da camada de infraestrutura.
-   **Camada de Acesso a Dados (Data Access/Repositories):**
    -   As classes de repositório (e.g., `AssetSyncRepository`, `IntegrationRepository`, `UserRepository`) são responsáveis exclusivamente pela interação com o banco de dados. Elas abstraem os detalhes da persistência, fornecendo métodos para criar, recuperar, atualizar e deletar entidades.
    -   Exemplos:
        -   Em `examples/investy/server/repositories/AssetSyncRepository.ts`, `IntegrationRepository.ts` e `UserRepository.ts`, todas as classes estendem `MongooseRepositoryAdapter`, que por sua vez implementa `RepositoryContract`, fornecendo métodos como `create`, `retrieveOne`, `retrieveAll`, `updateOneById`, etc., para interagir com o MongoDB via Mongoose.
        -   O `MongooseRepositoryAdapter` (`examples/investy/server/adapters/MongooseRepositoryAdapter.ts`) é um exemplo claro desta camada, contendo a lógica de formatação de queries e interação direta com o `mongoose.Model`.
-   **Camada de Infraestrutura (Infra):**
    -   Módulos dentro de `server/infra` (e.g., `DatabaseModule`, `QueueModule`) são responsáveis por inicializar e gerenciar recursos de infraestrutura, como a conexão com o banco de dados ou a configuração de filas.
    -   Exemplos:
        -   `examples/investy/server/infra/database/index.ts` (`DatabaseModule`) é responsável por iniciar a conexão com o MongoDB.
        -   `examples/investy/server/infra/queue/index.ts` (`QueueModule`) é responsável por configurar e gerenciar as filas.
        -   `examples/investy/server/infra/index.ts` (`Infra`) orquestra a inicialização de todos os módulos de infraestrutura.

## Separation of Concerns

Este padrão arquitetural é amplamente aplicado, garantindo que cada módulo ou componente tenha uma única e bem definida responsabilidade, minimizando o acoplamento e aumentando a manutenibilidade.

-   **Controladores focados em HTTP e delegação:** Os controladores (e.g., `NotionAssetSyncController`, `UserController`) são estritamente responsáveis por lidar com a requisição HTTP, validar os dados de entrada e formatar a resposta. Eles delegam a lógica de negócio e acesso a dados para as camadas de serviço e repositório.
    -   Exemplos:
        -   Em `examples/investy/server/controllers/NotionAssetSyncController.ts`, o método `create` chama `NotionAssetSyncValidation.validateNotionData` para validação, `IntegrationService.getNotionIntegration` para obter dados de integração, `AssetSyncRepository.create` para persistência e `AssetSyncSchedulerService.scheduleNotionAssetSync` para agendamento. Nenhuma lógica de negócio complexa ou manipulação direta de banco de dados é realizada no controlador.
        -   Em `examples/investy/pages/api/asset-syncs/notion.ts`, a rota é definida como uma sequência de middlewares e o controlador, onde cada um tem uma responsabilidade clara: `InfraMiddleware.setup` (infraestrutura), `AuthMiddleware.requireAuth` (autenticação), `NotionAssetSyncController.create` (lógica de API).
-   **Serviços focados em lógica de negócio:** As classes de serviço (e.g., `AuthService`, `IntegrationService`, `AssetSyncSchedulerService`) contêm a lógica de negócio e orquestração, sem se preocupar com detalhes de HTTP ou persistência de dados.
    -   Exemplos:
        -   `examples/investy/server/services/AuthService.ts` lida exclusivamente com hashing de senhas e geração/decodificação de tokens de autenticação, utilizando `HashService` e `CryptService` para as operações criptográficas, sem conhecimento de requisições HTTP ou modelos de banco de dados.
        -   `examples/investy/server/services/AssetSyncSchedulerService.ts` foca apenas em agendar tarefas de sincronização, delegando a funcionalidade de fila para `QueueModule`.
-   **Repositórios focados em acesso a dados:** As classes de repositório (e.g., `AssetSyncRepository`, `IntegrationRepository`, `UserRepository`) são responsáveis unicamente pela interação com o banco de dados, abstraindo os detalhes da persistência.
    -   Exemplos:
        -   `examples/investy/server/repositories/AssetSyncRepository.ts` estende `MongooseRepositoryAdapter`, que contém os métodos genéricos para operações CRUD com Mongoose, sem lógica de negócio ou validação.
-   **Utilitários focados em funções genéricas:** As classes de utilitário (e.g., `StringUtil`, `NumberUtil`, `ValidationUtil`) fornecem funções genéricas e reutilizáveis que não pertencem a nenhuma camada específica de negócio ou infraestrutura.
    -   Exemplos:
        -   `examples/investy/server/utils/StringUtil.ts` contém métodos para manipulação de strings (`areSimilar`, `getMostSimilarIndex`), sem qualquer dependência de lógica de negócio ou acesso a dados.
        -   `examples/investy/server/utils/ValidationUtil.ts` fornece um método genérico `validate` para aplicar validações a dados, sem conhecimento do contexto de negócio específico dos dados.
-   **Componentes de UI focados em apresentação:** Os componentes React (e.g., `Button`, `Modal`, `Table`) são responsáveis por renderizar a interface do usuário e gerenciar seu próprio estado interno, mas delegam a lógica de negócio e chamadas de API para serviços ou hooks.
    -   Exemplos:
        -   `examples/investy/client/components/Button/index.tsx` lida apenas com a renderização de um botão, seus estilos e estados visuais (loading, disabled), sem qualquer lógica de negócio.
        -   `examples/investy/client/pages/Login/index.tsx` gerencia o estado local do formulário e a interação do usuário, mas delega a chamada à API para `api.post` e a lógica de autenticação para `loginAndRedirect` do serviço `auth.ts`.
-   **Adapters para isolamento de dependências externas:** As classes de adaptador (e.g., `MongooseRepositoryAdapter`, `NextHttpAdapter`, `QuirrelQueueAdapter`) isolam a aplicação de detalhes de frameworks ou bibliotecas externas, permitindo que a lógica de negócio permaneça agnóstica a essas implementações.
    -   Exemplos:
        -   `examples/investy/server/adapters/MongooseRepositoryAdapter.ts` encapsula a interação com o Mongoose, implementando o `RepositoryContract`, o que significa que os repositórios que o utilizam não precisam conhecer os detalhes específicos do Mongoose.
        -   `examples/investy/server/adapters/NextHttpAdapter.ts` adapta as requisições e respostas do Next.js para um formato genérico (`ApiHandlerInput`, `ApiHandlerResponse`), isolando os controladores dos detalhes do framework Next.js.
