## Padrão de Organização por Camadas (Server)

### Descrição

O código do lado do servidor segue um padrão de organização por camadas, onde as responsabilidades são separadas em diretórios distintos. Cada diretório tende a conter módulos com um propósito específico dentro da arquitetura da aplicação.

### Exemplos

*   **Seguindo o padrão:**
    *   `server/controllers/`: Contém a lógica para lidar com requisições HTTP. Ex: `NotionIntegrationController.ts`.
    *   `server/services/`: Contém a lógica de negócio e orquestração. Ex: `AuthService.ts`.
    *   `server/repositories/`: Contém a lógica de acesso a dados. Ex: `UserRepository.ts`.
    *   `server/lib/`: Contém wrappers para APIs externas. Ex: `NotionLib.ts`.
    *   `server/adapters/`: Contém wrappers para bibliotecas externas. Ex: `MongooseRepositoryAdapter.ts`.
    *   `server/middlewares/`: Contém lógica para pré-processar requisições. Ex: `AuthMiddleware.ts`.
    *   `server/utils/`: Contém funções utilitárias genéricas. Ex: `StringUtil.ts`.
    *   `server/config/`: Contém configurações da aplicação. Ex: `DatabaseConfig.ts`.
    *   `server/entities/`: Contém definições de entidades de dados. Ex: `UserEntity.ts`.
    *   `server/schemas/`: Contém definições de schemas de banco de dados. Ex: `UserSchema.ts`.
    *   `server/protocols/`: Contém definições de tipos e interfaces. Ex: `HttpContract.ts`.
    *   `server/exceptions/`: Contém definições de exceções customizadas. Ex: `QueueProcessException.ts`.
    *   `server/queues/`: Contém handlers para processamento de filas. Ex: `SyncNotionAssetPriceQueue.ts`.
    *   `server/infra/`: Contém módulos para inicialização de infraestrutura. Ex: `DatabaseModule.ts`.

*   **Violando o padrão:** Não há violações óbvias deste padrão na estrutura de diretórios fornecida.

## Padrão de Nomenclatura por Responsabilidade (Server)

### Descrição

No lado do servidor, os arquivos e classes são nomeados com um sufixo que indica sua principal responsabilidade ou camada na arquitetura.

### Exemplos

*   **Seguindo o padrão:**
    *   `*Controller`: `UserController`, `NotionIntegrationController`.
    *   `*Service`: `AuthService`, `LogService`, `IntegrationService`.
    *   `*Repository`: `UserRepository`, `IntegrationRepository`, `AssetSyncRepository`.
    *   `*Lib`: `NotionLib`, `StatusInvestLib`.
    *   `*Adapter`: `MongooseRepositoryAdapter`, `NextHttpAdapter`, `QuirrelQueueAdapter`.
    *   `*Middleware`: `AuthMiddleware`, `InfraMiddleware`.
    *   `*Util`: `StringUtil`, `MongooseUtil`, `ValidationUtil`.
    *   `*Config`: `AuthConfig`, `DatabaseConfig`.
    *   `*Entity`: `UserEntity`, `IntegrationEntity`.
    *   `*Schema`: `UserSchema`, `IntegrationSchema`.
    *   `*Protocol`: `HttpContract`, `RepositoryContract`.
    *   `*Exception`: `QueueProcessException`.
    *   `*Queue`: `SyncNotionAssetPriceQueue`.

*   **Violando o padrão:** Não há violações óbvias deste padrão na nomenclatura dos arquivos fornecidos.

## Padrão de Módulos Singleton

### Descrição

Muitos módulos são implementados como classes e exportados como uma única instância padrão (`export default new ClassName()`). Isso garante que haja apenas uma instância desses módulos em toda a aplicação, funcionando de forma semelhante ao padrão Singleton.

### Exemplos

*   **Seguindo o padrão:**
    *   `export default new DatabaseModule()` em `server/infra/database/index.ts`.
    *   `export default new LogService()` em `server/services/LogService.ts`.
    *   `export default new UserRepository(UserSchema)` em `server/repositories/UserRepository.ts`.
    *   `export default new NextHttpAdapter()` em `server/adapters/NextHttpAdapter.ts`.

*   **Violando o padrão:**
    *   `export default NotionLib` em `server/lib/NotionLib.ts` (exporta a classe, não uma instância).
    *   `export default NodeCacheAdapter` em `server/adapters/NodeCacheAdapter.ts` (exporta a classe, que é instanciada em `InMemoryCacheService`).

## Padrão Repository

### Descrição

A lógica de acesso a dados para entidades específicas é encapsulada em classes dedicadas (`*Repository`), que abstraem os detalhes da implementação do banco de dados (neste caso, Mongoose) do restante da aplicação. Essas classes geralmente estendem um adaptador genérico de repositório.

### Exemplos

*   **Seguindo o padrão:**
    *   `class IntegrationRepository extends MongooseRepositoryAdapter<IntegrationEntity> {}` em `server/repositories/IntegrationRepository.ts`.
    *   `class UserRepository extends MongooseRepositoryAdapter<UserEntity> {}` em `server/repositories/UserRepository.ts`.
    *   `class AssetSyncRepository extends MongooseRepositoryAdapter<AssetSyncEntity> {}` em `server/repositories/AssetSyncRepository.ts`.

*   **Violando o padrão:** Não há violações óbvias deste padrão no código fornecido, pois todas as interações com o Mongoose (além da conexão inicial na infraestrutura) parecem ocorrer dentro dos adaptadores ou repositórios.

## Padrão Adapter

### Descrição

Bibliotecas externas ou frameworks são encapsulados em classes `*Adapter` localizadas no diretório `server/adapters/`. Isso cria uma camada de abstração, isolando o código principal dos detalhes específicos dessas dependências.

### Exemplos

*   **Seguindo o padrão:**
    *   `MongooseRepositoryAdapter` encapsula a interação com modelos Mongoose.
    *   `QuirrelQueueAdapter` encapsula a interação com a biblioteca Quirrel.
    *   `NextHttpAdapter` encapsula a interação com os objetos de requisição e resposta do Next.js API.
    *   `NodeCacheAdapter` encapsula a interação com a biblioteca node-cache.

*   **Violando o padrão:** Uso direto de APIs de bibliotecas externas (como `mongoose.connect`, `new Queue(...)`, `new Client(...)` do `@notionhq/client`, `axios.create`, `new NodeCache(...)`) fora dos diretórios `adapters/`, `infra/` ou `lib/`. `StatusInvestLib` usa `axios.create` diretamente, o que poderia ser considerado uma violação se o padrão fosse "tudo que não é lógica de negócio vai para adapters", mas aqui `axios` é usado dentro de uma `Lib`, que é outra forma de encapsulamento para APIs externas. O padrão de `adapters/` parece focado em encapsular tecnologias de infraestrutura ou frameworks usados em várias camadas.

## Padrão de Resposta Padronizada (Server API)

### Descrição

Os controladores de API utilizam consistentemente os métodos definidos na interface `ApiHandlerResponse` (fornecida pelo `NextHttpAdapter`) para construir e enviar respostas HTTP. Isso garante um formato de resposta uniforme em toda a API.

### Exemplos

*   **Seguindo o padrão:**
    *   `return response.ok(databases)` em `NotionIntegrationController.ts`.
    *   `return response.badRequest(validation.fieldErrors)` em `UserController.ts`.
    *   `return response.noContent()` em `NotionAssetSyncController.ts`.
    *   `return response.unauthorized()` em `AuthMiddleware.ts`.

*   **Violando o padrão:** Não há violações óbvias deste padrão no código fornecido; todos os controladores e middlewares utilizam os métodos do objeto `response`.

## Padrão de Composição de Componentes com Sub-Componentes (Client)

### Descrição

Alguns componentes React no lado do cliente utilizam um padrão específico para gerenciar e renderizar seus sub-componentes. Eles definem sub-componentes e os anexam ao componente principal usando `attachSubComponents`, e então utilizam o hook `useSubComponents` para extrair e renderizar esses sub-componentes a partir dos `children`.

### Exemplos

*   **Seguindo o padrão:**
    *   O componente `Table` define `TableBody`, `TableColumn`, `TableHead`, `TableRow` como sub-componentes e os anexa. Ele usa `useSubComponents` para acessar `subComponents.Body`, `subComponents.Head`.
    *   O componente `Modal` define `ModalContent` e `ModalTrigger` como sub-componentes e os anexa. Ele usa `useSubComponents` para acessar `subComponents.Content` e `subComponents.Trigger`.
    *   O componente `Dropdown` define `DropdownItem` e `DropdownTrigger` como sub-componentes e os anexa. Ele usa `useSubComponents` para acessar `subComponents.Item` e `subComponents.Trigger`.
    *   O componente `SelectInput` define `SelectInputOption` como sub-componente e o anexa. Ele usa `useSubComponents` para acessar `subComponents.Option`.

*   **Violando o padrão:**
    *   O componente `ApplicationLayout` renderiza seus componentes filhos (`AsideMenu`, `Breadcrumb`, `Divider`, `Link`, `MenuItem`) diretamente usando composição padrão do React, sem definir ou usar o mecanismo `attachSubComponents`/`useSubComponents`.

## Padrão de Cadeia de Middlewares e Controller (Server API)

### Descrição

As rotas de API no Next.js (`pages/api/`) são definidas como uma cadeia de handlers (middlewares e o controller final) utilizando o método `createApiHandlerRoute` do `NextHttpAdapter`. Isso permite a aplicação sequencial de lógica (como autenticação, inicialização de infraestrutura) antes de chegar ao controlador principal.

### Exemplos

*   **Seguindo o padrão:**
    *   `pages/api/asset-syncs/notion.ts` define handlers `InfraMiddleware.setup`, `AuthMiddleware.requireAuth` e `NotionAssetSyncController.create` (para POST) e `NotionAssetSyncController.retrieveAll` (para GET) em uma cadeia.
    *   `pages/api/users/login.ts` define handlers `InfraMiddleware.setup` e `UserController.login` em uma cadeia.

*   **Violando o padrão:** Não há violações óbvias deste padrão no código fornecido; todas as rotas de API parecem seguir essa estrutura.
