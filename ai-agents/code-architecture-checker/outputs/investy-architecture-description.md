## Padrão: "Naming Conventions"

### Descrição

Este padrão é observado na forma consistente como os arquivos e classes são nomeados em todo o codebase. Nomes seguem formatos previsíveis e significativos, geralmente indicando a responsabilidade ou o tipo do módulo.

### Exemplos

- Classes e arquivos que contêm lógica de negócio ou de aplicação são nomeados com o sufixo `Service`:
  - `examples/investy/server/services/LogService.ts`
  - `examples/investy/server/services/AuthService.ts`
  - `examples/investy/server/services/IntegrationService.ts`
- Classes e arquivos responsáveis pela interação com o banco de dados são nomeados com o sufixo `Repository`:
  - `examples/investy/server/repositories/UserRepository.ts`
  - `examples/investy/server/repositories/IntegrationRepository.ts`
  - `examples/investy/server/repositories/AssetSyncRepository.ts`
- Classes e arquivos que atuam como manipuladores de requisições HTTP (API) são nomeados com o sufixo `Controller`:
  - `examples/investy/server/controllers/UserController.ts`
  - `examples/investy/server/controllers/IntegrationController.ts`
  - `examples/investy/server/controllers/NotionIntegrationController.ts`
- Classes e arquivos que fornecem funcionalidades utilitárias são nomeados com o sufixo `Util`:
  - `examples/investy/server/utils/StringUtil.ts`
  - `examples/investy/server/utils/NumberUtil.ts`
  - `examples/investy/server/utils/ValidationUtil.ts`
- Classes e arquivos que implementam adaptadores para tecnologias externas são nomeados com o sufixo `Adapter`:
  - `examples/investy/server/adapters/MongooseRepositoryAdapter.ts`
  - `examples/investy/server/adapters/NextHttpAdapter.ts`
  - `examples/investy/server/adapters/QuirrelQueueAdapter.ts`
- Classes e arquivos que definem middleware são nomeados com o sufixo `Middleware`:
  - `examples/investy/server/middlewares/AuthMiddleware.ts`
  - `examples/investy/server/middlewares/InfraMiddleware.ts`
- Classes e arquivos que contêm lógica de validação são nomeados com o sufixo `Validation`:
  - `examples/investy/server/validations/UserValidation.ts`
  - `examples/investy/server/validations/IntegrationValidation.ts`
  - `examples/investy/server/validations/NotionAssetSyncValidation.ts`
- Classes e arquivos que definem entidades de dados são nomeados com o sufixo `Entity`:
  - `examples/investy/server/entities/UserEntity.ts`
  - `examples/investy/server/entities/IntegrationEntity.ts`
  - `examples/investy/server/entities/AssetSyncEntity.ts`
- Classes e arquivos que definem schemas de banco de dados são nomeados com o sufixo `Schema`:
  - `examples/investy/server/schemas/UserSchema.ts`
  - `examples/investy/server/schemas/IntegrationSchema.ts`
  - `examples/investy/server/schemas/AssetSyncSchema.ts`
- Hooks React personalizados são nomeados com o prefixo `use`:
  - `examples/investy/client/hooks/useDidMount.ts`
  - `examples/investy/client/hooks/useValidation.ts`
  - `examples/investy/client/hooks/useConstantId.ts`
- Variáveis booleanas são frequentemente prefixadas com `is` ou `has`:
  - `examples/investy/server/lib/StatusInvestLib.ts` (`isComposedCode`)
  - `examples/investy/client/services/auth.ts` (`isAuthenticated`)

## Padrão: "File/Module Organization"

### Descrição

O codebase demonstra uma organização consistente de arquivos e diretórios, agrupando módulos com responsabilidades semelhantes em pastas dedicadas. Esta estrutura facilita a localização e o gerenciamento de diferentes partes da aplicação.

### Exemplos

- Módulos de infraestrutura (banco de dados, fila) são agrupados sob o diretório `/infra`:
  - `examples/investy/server/infra/database/index.ts`
  - `examples/investy/server/infra/queue/index.ts`
  - `examples/investy/server/infra/index.ts`
- Módulos que interagem com serviços externos (bibliotecas) são agrupados sob o diretório `/lib`:
  - `examples/investy/server/lib/StatusInvestLib.ts`
  - `examples/investy/server/lib/NotionLib.ts`
- Módulos de acesso a dados (repositórios) são agrupados sob o diretório `/repositories`:
  - `examples/investy/server/repositories/UserRepository.ts`
  - `examples/investy/server/repositories/IntegrationRepository.ts`
  - `examples/investy/server/repositories/AssetSyncRepository.ts`
- Módulos de lógica de negócio/aplicação (serviços) são agrupados sob o diretório `/services`:
  - `examples/investy/server/services/AuthService.ts`
  - `examples/investy/server/services/IntegrationService.ts`
  - `examples/investy/server/services/AssetSyncSchedulerService.ts`
- Módulos de manipulação de requisições HTTP (controladores) são agrupados sob o diretório `/controllers`:
  - `examples/investy/server/controllers/UserController.ts`
  - `examples/investy/server/controllers/IntegrationController.ts`
  - `examples/investy/server/controllers/NotionAssetSyncController.ts`
- Módulos utilitários são agrupados sob o diretório `/utils`:
  - `examples/investy/server/utils/StringUtil.ts`
  - `examples/investy/server/utils/NumberUtil.ts`
  - `examples/investy/server/utils/ValidationUtil.ts`
- Módulos de validação são agrupados sob o diretório `/validations`:
  - `examples/investy/server/validations/UserValidation.ts`
  - `examples/investy/server/validations/IntegrationValidation.ts`
  - `examples/investy/server/validations/NotionAssetSyncValidation.ts`
- Módulos de definição de tipos/interfaces (protocolos e contratos) são agrupados sob `/protocols` e `/contracts`:
  - `examples/investy/server/protocols/NotionProtocol.ts`
  - `examples/investy/server/contracts/RepositoryContract.ts`
- Componentes de UI reutilizáveis são agrupados sob o diretório `/client/components`:
  - `examples/investy/client/components/Button/index.tsx`
  - `examples/investy/client/components/Modal/index.tsx`
  - `examples/investy/client/components/Table/index.tsx`
- Hooks React personalizados são agrupados sob o diretório `/client/hooks`:
  - `examples/investy/client/hooks/useDidMount.ts`
  - `examples/investy/client/hooks/useValidation.ts`
- Páginas da aplicação são agrupadas sob o diretório `/client/pages`:
  - `examples/investy/client/pages/Login/index.tsx`
  - `examples/investy/client/pages/Signup/index.tsx`
  - `examples/investy/client/pages/AssetSyncs/Notion/index.tsx`

## Padrão: "Layered Architecture"

### Descrição

O código demonstra uma separação de responsabilidades em camadas lógicas distintas. A camada de apresentação (API Routes/Controllers) lida com a entrada e saída de dados, delegando a lógica de negócio para a camada de serviço, que por sua vez interage com a camada de acesso a dados (Repositories) e bibliotecas externas (Libs).

### Exemplos

- Controladores (`server/controllers`) recebem requisições HTTP, realizam validações básicas (delegando para módulos de validação) e chamam serviços para executar a lógica principal, formatando a resposta:
  - Em `examples/investy/server/controllers/UserController.ts`, o método `signup` recebe a requisição, valida os dados (`UserValidation.validateSignupData`), chama um serviço para fazer o hash da senha (`AuthService.makeHashedPassword`), chama um repositório para criar o usuário (`UserRepository.create`) e um serviço para gerar o token (`AuthService.generateAuthToken`), retornando a resposta.
  - Em `examples/investy/server/controllers/NotionAssetSyncController.ts`, o método `create` valida a entrada (`NotionAssetSyncValidation.validateNotionData`), obtém dados de um serviço (`IntegrationService.getNotionIntegration`), cria uma entidade via repositório (`AssetSyncRepository.create`) e agenda uma tarefa via serviço (`AssetSyncSchedulerService.scheduleNotionAssetSync`).
- Serviços (`server/services`) contêm a lógica de negócio e orquestram operações entre repositórios e bibliotecas:
  - Em `examples/investy/server/services/AuthService.ts`, a lógica de autenticação (fazer hash, validar hash, gerar/decodificar token) é encapsulada, utilizando serviços de hash e criptografia.
  - Em `examples/investy/server/services/AssetSyncSchedulerService.ts`, a lógica de agendamento de sincronização é implementada, chamando o módulo de fila (`QueueModule`).
- Repositórios (`server/repositories`) são responsáveis exclusivamente pela interação com o banco de dados, abstraindo a lógica de queries:
  - `examples/investy/server/repositories/UserRepository.ts` estende `MongooseRepositoryAdapter`, indicando que sua responsabilidade é apenas fornecer métodos CRUD para a entidade `User` usando Mongoose.
  - `examples/investy/server/repositories/AssetSyncRepository.ts` e `examples/investy/server/repositories/IntegrationRepository.ts` seguem o mesmo padrão.
- Bibliotecas (`server/lib`) encapsulam a lógica de comunicação com APIs externas:
  - `examples/investy/server/lib/NotionLib.ts` contém métodos para interagir com a API do Notion (`searchDatabases`, `getDatabase`, `getDatabaseRows`, `updateDatabaseRow`).
  - `examples/investy/server/lib/StatusInvestLib.ts` contém métodos para interagir com a API do StatusInvest (`getAsset`, `searchAssets`).
- As rotas da API (`pages/api`) atuam como a camada de entrada, utilizando adaptadores (`NextHttpAdapter`) e middleware (`AuthMiddleware`, `InfraMiddleware`) para preparar o contexto da requisição antes de delegar para os controladores:
  - `examples/investy/pages/api/users/login.ts` define a rota `/api/users/login` que usa o `NextHttpAdapter` para adaptar middlewares e o método `login` do `UserController`.

## Padrão: "Separation of Concerns"

### Descrição

Diferentes partes do código são projetadas para ter responsabilidades únicas e bem definidas. Isso é evidente na divisão de módulos por tipo (controladores, serviços, repositórios, utilitários, validações, etc.) e na forma como a lógica é distribuída entre eles.

### Exemplos

- Controladores (`server/controllers`) focam em lidar com a requisição HTTP (extrair dados, chamar validação, chamar serviço) e formatar a resposta, sem conter lógica de negócio complexa:
  - Em `examples/investy/server/controllers/UserController.ts`, o método `signup` chama `UserValidation.validateSignupData` para validar e `AuthService.makeHashedPassword` para a lógica de hash, em vez de implementar a validação ou o hash diretamente.
- Repositórios (`server/repositories`) são estritamente responsáveis pela persistência de dados, utilizando um adaptador (`MongooseRepositoryAdapter`) para abstrair a complexidade do ORM:
  - `examples/investy/server/repositories/UserRepository.ts` não contém lógica de negócio ou validação, apenas estende o adaptador para operações de banco de dados.
- Módulos de validação (`server/validations`) são dedicados a verificar a integridade e o formato dos dados de entrada:
  - `examples/investy/server/validations/UserValidation.ts` contém métodos como `validateSignupData` e `validateLoginData` que usam um utilitário de validação (`ValidationUtil`) e lógica específica (`isUserEmailAvailable`).
- Módulos utilitários (`server/utils`) fornecem funções genéricas e reutilizáveis que não pertencem a uma camada específica:
  - `examples/investy/server/utils/StringUtil.ts` lida apenas com operações de string.
  - `examples/investy/server/utils/NumberUtil.ts` lida apenas com formatação de números.
  - `examples/investy/server/utils/MongooseUtil.ts` lida apenas com funcionalidades específicas do Mongoose.
- Componentes de UI no cliente (`client/components`) focam na apresentação visual e interações básicas, delegando lógica complexa para hooks ou serviços:
  - Componentes como `TextInput` ou `SelectInput` lidam com a renderização do input e a emissão de eventos de mudança, mas a lógica de validação e exibição de erros é gerenciada por um hook (`useValidation`) na página ou componente pai.
  - Componentes compostos como `Modal`, `Table`, `Dropdown`, `SelectInput` utilizam sub-componentes (`Modal.Trigger`, `Table.Head`, `Dropdown.Item`, `SelectInput.Option`) para dividir a responsabilidade de renderização de partes específicas da UI.
