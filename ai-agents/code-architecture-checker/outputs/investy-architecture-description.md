## Padrão: "Naming Conventions"

### Descrição

O código demonstra um uso consistente de convenções de nomenclatura para arquivos, classes e variáveis, indicando o propósito ou a camada do componente. Essa padronização facilita a identificação rápida da função de um arquivo ou módulo dentro da arquitetura do projeto.

### Exemplos

- Arquivos e classes de repositório seguem o padrão `[Nome da Entidade]Repository`:
    - `examples/investy/server/repositories/UserRepository.ts` define a classe `UserRepository`.
    - `examples/investy/server/repositories/IntegrationRepository.ts` define a classe `IntegrationRepository`.
    - `examples/investy/server/repositories/AssetSyncRepository.ts` define a classe `AssetSyncRepository`.
- Arquivos e classes de serviço seguem o padrão `[Propósito]Service`:
    - `examples/investy/server/services/AuthService.ts` define a classe `AuthService`.
    - `examples/investy/server/services/IntegrationService.ts` define a classe `IntegrationService`.
    - `examples/investy/server/services/AssetSyncSchedulerService.ts` define a classe `AssetSyncSchedulerService`.
- Arquivos e classes de controlador seguem o padrão `[Recurso]Controller`:
    - `examples/investy/server/controllers/UserController.ts` define a classe `UserController`.
    - `examples/investy/server/controllers/NotionAssetSyncController.ts` define a classe `NotionAssetSyncController`.
- Arquivos e classes utilitárias seguem o padrão `[Propósito]Util`:
    - `examples/investy/server/utils/StringUtil.ts` define a classe `StringUtil`.
    - `examples/investy/server/utils/ValidationUtil.ts` define a classe `ValidationUtil`.
- Arquivos e classes de validação seguem o padrão `[Recurso]Validation`:
    - `examples/investy/server/validations/UserValidation.ts` define a classe `UserValidation`.
    - `examples/investy/server/validations/IntegrationValidation.ts` define a classe `IntegrationValidation`.

## Padrão: "File/Module Organization"

### Descrição

O código organiza arquivos e módulos em diretórios específicos com base em suas responsabilidades e tipos. Essa estrutura de diretórios consistente ajuda a manter a base de código organizada e previsível, facilitando a localização de componentes específicos.

### Exemplos

- Módulos de infraestrutura (como banco de dados e fila) são agrupados em `/infra`:
    - `examples/investy/server/infra/database/index.ts`
    - `examples/investy/server/infra/queue/index.ts`
- Lógica de acesso a dados é centralizada em `/repositories`:
    - `examples/investy/server/repositories/UserRepository.ts`
    - `examples/investy/server/repositories/IntegrationRepository.ts`
- Lógica de negócio e serviços de aplicação são agrupados em `/services`:
    - `examples/investy/server/services/AuthService.ts`
    - `examples/investy/server/services/IntegrationService.ts`
- Controladores que lidam com requisições HTTP são agrupados em `/controllers`:
    - `examples/investy/server/controllers/UserController.ts`
    - `examples/investy/server/controllers/NotionAssetSyncController.ts`
- Componentes de UI reutilizáveis no lado do cliente são agrupados em `/client/components`:
    - `examples/investy/client/components/Button/index.tsx`
    - `examples/investy/client/components/Modal/index.tsx`
    - `examples/investy/client/components/Table/index.tsx`

## Padrão: "Layered Architecture"

### Descrição

A base de código, particularmente no lado do servidor, demonstra uma estrutura em camadas onde diferentes responsabilidades são atribuídas a grupos distintos de módulos. As dependências geralmente fluem de camadas superiores para inferiores, promovendo a separação de preocupações e a manutenibilidade.

### Exemplos

- As rotas da API Next.js (`pages/api/...`) atuam como a camada de entrada, utilizando adaptadores (`NextHttpAdapter`) para rotear requisições para os controladores.
    - `examples/investy/pages/api/users/login.ts`
    - `examples/investy/pages/api/asset-syncs/notion.ts`
- Controladores (`server/controllers`) lidam com a lógica de requisição/resposta e delegam a lógica de negócio para os serviços.
    - `examples/investy/server/controllers/UserController.ts` utiliza `AuthService` e `UserRepository`.
    - `examples/investy/server/controllers/NotionAssetSyncController.ts` utiliza `IntegrationService`, `AssetSyncSchedulerService`, `AssetSyncRepository`, `NotionLib`, etc.
- Serviços (`server/services`) contêm a lógica de negócio principal e orquestram operações, utilizando repositórios e bibliotecas.
    - `examples/investy/server/services/AuthService.ts` utiliza `HashService` e `CryptService`.
    - `examples/investy/server/services/IntegrationService.ts` utiliza `IntegrationRepository`.
- Repositórios (`server/repositories`) encapsulam a lógica de acesso a dados, interagindo com o banco de dados (através de adaptadores e schemas).
    - `examples/investy/server/repositories/UserRepository.ts` utiliza `MongooseRepositoryAdapter` e `UserSchema`.
    - `examples/investy/server/repositories/AssetSyncRepository.ts` utiliza `MongooseRepositoryAdapter` e `AssetSyncSchema`.

## Padrão: "Separation of Concerns"

### Descrição

Diferentes tipos de lógica e responsabilidades são claramente separados em módulos distintos. Isso garante que cada módulo tenha um único propósito bem definido, o que melhora a modularidade, a testabilidade e a manutenibilidade do código.

### Exemplos

- A lógica de manipulação de requisições HTTP (parsing, formatação de resposta) está nos controladores (`server/controllers`) e adaptadores HTTP (`server/adapters/NextHttpAdapter.ts`).
- A lógica de negócio principal (como autenticação, sincronização de ativos) está nos serviços (`server/services`).
- A lógica de persistência de dados (interação com o banco de dados) está nos repositórios (`server/repositories`) e schemas (`server/schemas`).
- A lógica de interação com serviços externos (Notion, StatusInvest) está encapsulada em bibliotecas (`server/lib`).
- A lógica de validação de entrada está separada em módulos de validação (`server/validations`).
- A lógica de inicialização de infraestrutura (banco de dados, fila) está em módulos dedicados em `/infra`.
- A lógica de UI e apresentação está nos componentes React (`client/components`) e páginas (`client/pages`).
