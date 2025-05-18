## Organização de Arquivos/Módulos

### Descrição

O código demonstra uma organização de arquivos e módulos consistente, especialmente no diretório `server/`, onde os arquivos são agrupados em subdiretórios com base em sua responsabilidade ou camada arquitetural. Essa estrutura inclui diretórios como `controllers/`, `services/`, `repositories/`, `utils/`, `libs/`, `infra/`, `validations/`, `schemas/`, `entities/`, `protocols/`, `contracts/`, `adapters/`, e `exceptions/`. Essa organização facilita a localização de código relacionado e reforça a separação de responsabilidades.

### Exemplos

Um exemplo que segue este padrão é o diretório `server/repositories/`, que contém exclusivamente arquivos relacionados à lógica de acesso a dados para diferentes entidades, como `AssetSyncRepository.ts`, `IntegrationRepository.ts`, e `UserRepository.ts`.

Um exemplo que viola este padrão, dentro do contexto da estrutura do `server/`, é o arquivo `pages/api/queues/SyncNotionAssetPrice.ts`. Embora esteja na localização padrão do Next.js para rotas de API (`pages/api/`), seu conteúdo principal é a adaptação de um `QueueHandler` usando um `Adapter`, o que poderia, em uma estrutura estritamente organizada por responsabilidade do servidor, estar mais próximo dos diretórios `server/queues` ou `server/adapters`, em vez de misturar a preocupação de "exposição via API" com a preocupação de "adaptação de handler de fila" neste arquivo de ponto de entrada.

## Convenções de Nomenclatura

### Descrição

O código utiliza convenções de nomenclatura consistentes para arquivos e classes, baseadas em sua função ou responsabilidade. Classes e arquivos de repositório geralmente terminam com `Repository` (ex: `UserRepository`), serviços com `Service` (ex: `AuthService`), controladores com `Controller` (ex: `UserController`), utilitários com `Util` (ex: `StringUtil`), wrappers de bibliotecas externas com `Lib` (ex: `NotionLib`), adaptadores com `Adapter` (ex: `MongooseRepositoryAdapter`), validações com `Validation` (ex: `UserValidation`), entidades com `Entity` (ex: `UserEntity`), esquemas de banco de dados com `Schema` (ex: `UserSchema`), contratos/interfaces com `Contract` (ex: `RepositoryContract`), handlers de fila com `Queue` (ex: `SyncNotionAssetPriceQueue`), e hooks do lado do cliente com o prefixo `use` (ex: `useDidMount`).

### Exemplos

Um exemplo que segue este padrão é a classe `AuthService` definida no arquivo `server/services/AuthService.ts`, que encapsula a lógica relacionada à autenticação. Outro exemplo é a classe `UserRepository` em `server/repositories/UserRepository.ts`, dedicada às operações de persistência de dados do usuário.

Um exemplo que viola este padrão é o nome do arquivo `pages/api/queues/SyncNotionAssetPrice.ts`. Enquanto outros arquivos na pasta `pages/api/` seguem uma convenção de nomenclatura baseada no recurso ou propósito da rota (ex: `users/login.ts`, `integrations/index.ts`, `asset-syncs/notion.ts`), este arquivo é nomeado diretamente após o handler de fila que ele expõe, quebrando a consistência de nomenclatura dentro do diretório `pages/api`.

## Arquitetura em Camadas

### Descrição

O código no lado do servidor demonstra uma arquitetura em camadas, separando as responsabilidades em camadas distintas. Observa-se uma separação entre a camada de Apresentação/API (`pages/api/`), a camada de Aplicação/Controladores (`controllers/`), a camada de Domínio/Negócio (`services/`, `queues/`), a camada de Acesso a Dados (`repositories/`), e a camada de Infraestrutura (`libs/`, `infra/`, `adapters/`). As dependências geralmente fluem de camadas superiores para inferiores (ex: Controladores chamam Serviços, Serviços chamam Repositórios e Libs).

### Exemplos

Um exemplo que segue este padrão é o `UserController` (`server/controllers/UserController.ts`), que lida com requisições de API para usuários. Ele delega a lógica de negócio para o `AuthService` (`server/services/AuthService.ts`) e as operações de persistência para o `UserRepository` (`server/repositories/UserRepository.ts`), sem interagir diretamente com esquemas de banco de dados ou lógica de hashing/criptografia de baixo nível.

Um exemplo que viola este padrão é o `NotionIntegrationController` (`server/controllers/NotionIntegrationController.ts`). Este controlador, que faz parte da camada de Aplicação/Controladores, importa e chama diretamente o `NotionLib` (`server/lib/NotionLib.ts`), que é um wrapper para uma API externa e pertence à camada de Infraestrutura/Libs. Uma arquitetura em camadas mais estrita exigiria que o controlador delegasse essa interação com a biblioteca externa a um serviço na camada de Domínio/Negócio.

## Separação de Responsabilidades

### Descrição

O código exibe uma forte separação de responsabilidades, onde cada módulo, classe ou diretório é focado em uma única preocupação bem definida. Controladores lidam com a entrada/saída da API, Serviços contêm a lógica de negócio principal, Repositórios gerenciam a persistência de dados, Validações lidam com a verificação de dados de entrada, Utilitários fornecem funções auxiliares genéricas, Libs encapsulam interações com serviços externos, Infra lida com a configuração de recursos de infraestrutura, e Adapters fornecem implementações específicas de tecnologia para contratos.

### Exemplos

Um exemplo que segue este padrão é o `UserRepository` (`server/repositories/UserRepository.ts`), cuja única responsabilidade é realizar operações CRUD (Create, Retrieve, Update, Delete) na entidade `User` no banco de dados, sem incluir lógica de negócio, validação ou formatação de resposta de API.

Um exemplo que viola este padrão é o `NotionIntegrationController` (`server/controllers/NotionIntegrationController.ts`). Embora sua responsabilidade principal seja lidar com requisições de API relacionadas à integração com o Notion, ele também assume a responsabilidade de interagir diretamente com a biblioteca externa do Notion (`NotionLib.searchDatabases`). Isso mistura a preocupação de manipulação da requisição API com a preocupação de interação com um serviço externo, que idealmente seria delegada a um serviço dedicado para manter a separação de responsabilidades.
