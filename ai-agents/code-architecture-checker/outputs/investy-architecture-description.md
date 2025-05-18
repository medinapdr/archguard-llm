## Arquitetura em Camadas com Acesso Direto

### Descrição

O código do lado do servidor é organizado em camadas distintas, como Controladores (Controllers), Serviços (Services), Repositórios (Repositories), Bibliotecas (Libs), Adaptadores (Adapters), Entidades (Entities) e Schemas. Cada camada tem uma responsabilidade principal (por exemplo, Controladores lidam com requisições HTTP, Repositórios lidam com acesso a dados). A dependência geralmente flui das camadas superiores para as inferiores. No entanto, é um padrão repetido que as camadas de entrada (Controladores e Handlers de Fila) acessam diretamente componentes de camadas de infraestrutura (Repositórios e Bibliotecas), em vez de sempre passarem pela camada de Serviços.

### Exemplos

O arquivo `examples/investy/server/services/AuthService.ts` demonstra a camada de Serviço utilizando componentes de camadas inferiores (`HashService` e `CryptService`, que podem ser vistos como utilitários ou adaptadores criptográficos), seguindo o fluxo de dependência descendente.

O arquivo `examples/investy/server/controllers/NotionAssetSyncController.ts` acessa diretamente `AssetSyncRepository` (Repositório) e `NotionLib` (Biblioteca), além de serviços (`IntegrationService`, `AssetSyncSchedulerService`, `InMemoryCacheService`) e validações (`NotionAssetSyncValidation`, `AssetSyncValidation`). Este padrão de Controladores acessando Repositórios e Bibliotecas diretamente é repetido em outros controladores (`UserController`, `examples/investy/server/controllers/IntegrationController.ts`) e no handler de fila (`examples/investy/server/queues/SyncNotionAssetPriceQueue.ts`), violando uma arquitetura em camadas mais estrita onde Controladores/Queues apenas orquestrariam Serviços.
