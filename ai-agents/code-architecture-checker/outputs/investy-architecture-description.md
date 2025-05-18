## Convenções de Nomenclatura
### Descrição

Classes e arquivos no lado do servidor seguem consistentemente um padrão de nomenclatura baseado em seu papel arquitetural principal. Isso geralmente se manifesta como `[Nome][Papel]` ou `[Papel][Nome]`, onde `[Papel]` indica a função (por exemplo, `Controller`, `Service`, `Repository`, `Lib`, `Util`, `Adapter`, `Config`, `Entity`, `Schema`, `Contract`/`Protocol`, `Middleware`, `Validation`, `Queue`).

### Exemplos

*   **Segue o padrão:**
    *   `UserController` (em `server/controllers/UserController.ts`)
    *   `AuthService` (em `server/services/AuthService.ts`)
    *   `UserRepository` (em `server/repositories/UserRepository.ts`)
    *   `NotionLib` (em `server/lib/NotionLib.ts`)
    *   `ValidationUtil` (em `server/utils/ValidationUtil.ts`)
    *   `NextHttpAdapter` (em `server/adapters/NextHttpAdapter.ts`)
    *   `DatabaseConfig` (em `server/config/DatabaseConfig.ts`)
    *   `UserEntity` (em `server/entities/UserEntity.ts`)
    *   `UserSchema` (em `server/schemas/UserSchema.ts`)
    *   `HttpContract` (em `server/contracts/HttpContract.ts`)
    *   `AuthMiddleware` (em `server/middlewares/AuthMiddleware.ts`)
    *   `UserValidation` (em `server/validations/UserValidation.ts`)
    *   `SyncNotionAssetPriceQueue` (em `server/queues/SyncNotionAssetPriceQueue.ts`)

*   **Viola o padrão:** Nenhuma violação clara e repetida deste padrão de nomenclatura baseada em papel foi encontrada nos trechos de código fornecidos para os componentes do lado do servidor.

## Organização de Arquivos/Módulos
### Descrição

Os arquivos do lado do servidor são consistentemente organizados em diretórios que correspondem ao seu papel arquitetural. Isso cria uma estrutura de projeto clara onde módulos de um tipo específico (por exemplo, controladores, serviços, repositórios) são agrupados em seus respectivos diretórios.

### Exemplos

*   **Segue o padrão:**
    *   O arquivo `server/controllers/UserController.ts` contém a classe `UserController`.
    *   O arquivo `server/services/AuthService.ts` contém a classe `AuthService`.
    *   O arquivo `server/repositories/UserRepository.ts` contém a classe `UserRepository`.
    *   O arquivo `server/utils/StringUtil.ts` contém a classe `StringUtil`.
    *   O arquivo `server/adapters/NextHttpAdapter.ts` contém a classe `NextHttpAdapter`.
    *   O arquivo `server/config/DatabaseConfig.ts` contém o objeto `DatabaseConfig`.
    *   O arquivo `server/entities/UserEntity.ts` contém a definição do tipo `UserEntity`.
    *   O arquivo `server/schemas/UserSchema.ts` contém a definição do schema `UserSchema`.
    *   O arquivo `server/contracts/HttpContract.ts` contém a interface `HttpContract`.
    *   O arquivo `server/middlewares/AuthMiddleware.ts` contém a classe `AuthMiddleware`.
    *   O arquivo `server/validations/UserValidation.ts` contém a classe `UserValidation`.
    *   O arquivo `server/queues/SyncNotionAssetPriceQueue.ts` contém a classe `SyncNotionAssetPriceQueue`.

*   **Viola o padrão:** Nenhuma violação clara e repetida deste padrão de organização de arquivos foi encontrada nos trechos de código fornecidos, onde um arquivo do lado do servidor é colocado em um diretório inconsistente com seu papel e nomenclatura.

## Arquitetura em Camadas
### Descrição

O tratamento de requisições no lado do servidor segue uma estrutura em camadas. Os pontos de entrada da API (`pages/api/*`) delegam as requisições através de middlewares para os controladores. Os controladores orquestram a lógica chamando serviços, que por sua vez interagem com repositórios (para acesso a dados), bibliotecas (para interações externas) e módulos de infraestrutura. As dependências geralmente fluem de camadas de nível superior (controladores) para camadas de nível inferior (serviços, repositórios, libs, infra).

### Exemplos

*   **Segue o padrão:**
    *   O arquivo `pages/api/users/signup.ts` define um ponto de entrada da API que utiliza o `NextHttpAdapter` para rotear requisições POST. Ele chama `InfraMiddleware.setup` e `AuthMiddleware.requireAuth` (embora `AuthMiddleware` não seja estritamente necessário para signup/login, ele está presente em outros endpoints autenticados) antes de delegar para `UserController.signup`.
    *   O método `UserController.signup` (em `server/controllers/UserController.ts`) não contém lógica de banco de dados ou hashing diretamente, mas chama `UserValidation.validateSignupData` (validação), `AuthService.makeHashedPassword` (serviço de hashing), `UserRepository.create` (repositório para persistência) e `AuthService.generateAuthToken` (serviço de autenticação). Isso demonstra a delegação para camadas inferiores.

*   **Viola o padrão:** Nenhuma violação clara e repetida deste padrão de fluxo em camadas para o tratamento de requisições API foi encontrada nos trechos de código fornecidos, onde uma camada inferior chama repetidamente uma camada superior ou ignora o fluxo pretendido.

## Separação de Preocupações (SoC)
### Descrição

A lógica é consistentemente separada em módulos distintos (classes/arquivos) com base em sua preocupação principal. Controladores lidam com o processamento de requisições HTTP e delegação, serviços contêm a lógica de negócio principal, repositórios abstraem a lógica de acesso a dados, bibliotecas encapsulam interações com APIs externas, validações lidam com a verificação de entrada, e utilitários fornecem funções auxiliares genéricas.

### Exemplos

*   **Segue o padrão:**
    *   `UserController` (em `server/controllers/UserController.ts`) foca em receber requisições HTTP, chamar validação e delegar a lógica de negócio e persistência para serviços e repositórios.
    *   `AuthService` (em `server/services/AuthService.ts`) foca na lógica de autenticação (hashing de senha, geração/decodificação de token), utilizando serviços mais específicos (`HashService`, `CryptService`).
    *   `UserRepository` (em `server/repositories/UserRepository.ts`) foca exclusivamente na interação com o banco de dados para a entidade `User`, utilizando um adaptador (`MongooseRepositoryAdapter`).
    *   `NotionLib` (em `server/lib/NotionLib.ts`) foca em interagir com a API externa do Notion.
    *   `UserValidation` (em `server/validations/UserValidation.ts`) foca na validação dos dados de entrada do usuário.

*   **Viola o padrão:** Nenhuma violação clara e repetida deste padrão de separação de preocupações em módulos distintos foi encontrada nos trechos de código fornecidos, onde um módulo mistura repetidamente preocupações que são claramente atribuídas a outros tipos de módulos.
