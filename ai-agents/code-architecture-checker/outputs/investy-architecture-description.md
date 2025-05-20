## Organização de Arquivos por Papel

### Descrição

O código organiza consistentemente arquivos em diretórios baseados em seu papel ou responsabilidade dentro da arquitetura. Por exemplo, lógica de negócio reside em `/services`, acesso a dados em `/repositories`, manipulação de requisições em `/controllers`, utilitários em `/utils`, adaptações para frameworks externos em `/adapters`, definições de contratos em `/contracts`, definições de protocolos em `/protocols`, esquemas de banco de dados em `/schemas`, definições de entidades em `/entities`, configurações em `/config`, middlewares em `/middlewares`, lógica de validação em `/validations`, wrappers para bibliotecas externas em `/lib`, componentes de UI em `/components` e hooks React em `/hooks`.

### Exemplos

**Seguindo o padrão:**

*   O arquivo `examples/investy/server/services/LogService.ts` reside no diretório `/server/services`, indicando que ele fornece funcionalidades de serviço (neste caso, logging).
*   O arquivo `examples/investy/server/repositories/UserRepository.ts` reside no diretório `/server/repositories`, indicando que ele lida com operações de acesso a dados para a entidade `User`.
*   O arquivo `examples/investy/client/components/Button/index.tsx` reside no diretório `/client/components`, indicando que é um componente de interface do usuário.

**Violando o padrão:**

*   Não foram encontradas violações explícitas deste padrão na estrutura de diretórios fornecida. Todos os arquivos parecem estar localizados nos diretórios correspondentes ao seu papel.

## Convenção de Nomenclatura por Papel

### Descrição

O código utiliza uma convenção de nomenclatura consistente onde o nome de um arquivo ou classe frequentemente termina com um sufixo que indica seu papel arquitetural. Exemplos incluem `Service`, `Repository`, `Controller`, `Util`, `Adapter`, `Contract`, `Protocol`, `Schema`, `Entity`, `Config`, `Middleware`, `Validation`, `Lib`. Hooks React no lado do cliente consistentemente começam com o prefixo `use`.

### Exemplos

**Seguindo o padrão:**

*   A classe `LogService` em `examples/investy/server/services/LogService.ts` termina com `Service`.
*   A classe `UserRepository` em `examples/investy/server/repositories/UserRepository.ts` termina com `Repository`.
*   A classe `NotionIntegrationController` em `examples/investy/server/controllers/NotionIntegrationController.ts` termina com `Controller`.
*   A classe `MongooseRepositoryAdapter` em `examples/investy/server/adapters/MongooseRepositoryAdapter.ts` termina com `Adapter`.
*   O hook `useDidMount` em `examples/investy/client/hooks/useDidMount.ts` começa com `use`.

**Violando o padrão:**

*   Não foram encontradas violações explícitas desta convenção de nomenclatura nos arquivos fornecidos. Todos os nomes de arquivos e classes parecem seguir o padrão estabelecido para seus respectivos diretórios.

## Arquitetura em Camadas

### Descrição

O código segue um padrão geral de arquitetura em camadas, onde as responsabilidades são divididas em camadas distintas, como apresentação (API routes/Controllers), lógica de negócio (Services), acesso a dados (Repositories) e integração com sistemas externos (Libs). As dependências geralmente fluem de camadas superiores para inferiores (por exemplo, Controllers dependem de Services, Services dependem de Repositories e Libs). Middlewares lidam com preocupações transversais antes que a requisição chegue ao Controller.

### Exemplos

**Seguindo o padrão:**

*   Em `examples/investy/pages/api/users/login.ts`, a rota API utiliza `NextHttpAdapter` para adaptar a requisição e delega para `InfraMiddleware.setup` e `UserController.login`, mostrando a camada de entrada delegando para middlewares e controllers.
*   Em `examples/investy/server/controllers/UserController.ts`, o método `login` chama `UserValidation.validateLoginData` (validação), `UserRepository.retrieveOne` (acesso a dados) e `AuthService.generateAuthToken` (lógica de negócio/serviço), mostrando um controller orquestrando validação, acesso a dados e serviços.
*   Em `examples/investy/server/services/AuthService.ts`, a classe utiliza `HashService` e `CryptService`, mostrando um serviço utilizando outros serviços para compor sua lógica.

**Violando o padrão:**

*   Em `examples/investy/server/controllers/NotionAssetSyncController.ts`, o método `retrieveAll` chama `AssetSyncRepository.retrieveAll` e `NotionLib.getDatabase` diretamente, contornando a camada de Service que normalmente orquestraria essas interações.
*   Em `examples/investy/server/validations/UserValidation.ts`, o método `isUserEmailAvailable` chama `UserRepository.retrieveOne` diretamente. A lógica de validação idealmente não deveria interagir diretamente com a camada de acesso a dados.

## Separação de Responsabilidades

### Descrição

O código demonstra uma forte separação de responsabilidades, onde módulos e classes são projetados para ter um único foco principal. Repositórios lidam exclusivamente com persistência de dados, Serviços contêm lógica de negócio e orquestração, Controllers lidam com a interface de requisição/resposta, Utilitários fornecem funções auxiliares genéricas, Validações lidam com a validação de entrada, Adaptadores encapsulam detalhes de frameworks/bibliotecas externas e Libs encapsulam interações com APIs externas específicas.

### Exemplos

**Seguindo o padrão:**

*   A classe `MongooseRepositoryAdapter` em `examples/investy/server/adapters/MongooseRepositoryAdapter.ts` foca exclusivamente em adaptar operações CRUD genéricas para o Mongoose.
*   A classe `AuthService` em `examples/investy/server/services/AuthService.ts` foca em lógica relacionada à autenticação (hashing de senha, geração/decodificação de token).
*   A classe `ValidationUtil` em `examples/investy/server/utils/ValidationUtil.ts` fornece funções utilitárias genéricas para validação, sem lógica de negócio específica.

**Violando o padrão:**

*   Em `examples/investy/server/controllers/NotionAssetSyncController.ts`, o método `retrieveAll` inclui lógica para formatar os dados retornados do repositório e da lib (`formattedAssetSyncs` mapping), o que poderia ser considerado lógica de apresentação ou de negócio que idealmente residiria em um Service ou em um serializador dedicado, não no Controller.
*   Em `examples/investy/server/validations/UserValidation.ts`, o método `isUserEmailAvailable` realiza uma consulta ao banco de dados através do `UserRepository`. Isso mistura a responsabilidade de validação com a responsabilidade de acesso a dados.
