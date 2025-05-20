## Convenções de Nomenclatura

### Descrição

O código segue consistentemente convenções de nomenclatura onde classes, tipos e interfaces frequentemente incluem um sufixo que indica seu papel ou a pasta onde estão localizados. Isso ajuda a identificar rapidamente a responsabilidade ou a natureza de um componente.

### Exemplos

*   **Segue o padrão:**
    *   Classes em `/Services` terminam em `Service` (ex: `HttpService`, `QueueService`).
    *   Classes em `/Utils` terminam em `Util` (ex: `FileUtil`, `DateUtil`).
    *   Classes em `/Validations` terminam em `Validation` (ex: `ConfigValidation`, `SourceValidation`).
    *   Classes em `/Tools` (e subpastas) terminam em `Tool` (ex: `RSSConverterTool`, `SMTPSenderTool`).
    *   Classes em `/Modules` terminam em `Module` (ex: `SyncModule`, `ImportationModule`).
    *   Classes em `/Models` terminam em `Model` (ex: `DocumentModel`).
    *   Classes em `/Exceptions` terminam em `Exception` (ex: `ArrayParsingException`, `ProcessCommandException`).
    *   Interfaces e tipos em `/Protocols` frequentemente terminam em `Protocol`, `Contract`, `Input`, `Options`, `Result` (ex: `StorageContract`, `QueueOptions`, `GenerateInput`).

*   **Viola o padrão:**
    *   Alguns tipos e interfaces em `/Protocols` não seguem a convenção de sufixo:
        *   `Database` (em `JSONDatabaseProtocol.ts`)
        *   `Element` (em `CrawlerProtocol.ts`)
        *   `Ordering` (em `DataManipulationProtocol.ts`)
        *   `Config` (em `SetupInputProtocol.ts`)

## Organização de Arquivos/Módulos

### Descrição

Os arquivos são organizados em diretórios distintos com base em sua função principal ou tipo. Isso cria uma estrutura de projeto clara e previsível, facilitando a localização de componentes específicos.

### Exemplos

*   **Segue o padrão:**
    *   Arquivos que fornecem funcionalidades de serviço genéricas ou de baixo nível estão em `/Services` (ex: `HttpService.ts`, `TempFolderService.ts`).
    *   Arquivos que contêm funções utilitárias ou auxiliares estão em `/Utils` (ex: `FileUtil.ts`, `SanitizationUtil.ts`).
    *   Arquivos que contêm lógica de validação estão em `/Validations` (ex: `EnvironmentValidation.ts`, `ConfigValidation.ts`).
    *   Arquivos que implementam operações de domínio específicas (conversão, envio, importação, armazenamento) estão em subpastas dentro de `/Tools` (ex: `RSSConverterTool.ts` em `/Tools/Converters`, `SMTPSenderTool.ts` em `/Tools/Senders`).
    *   Arquivos que orquestram fluxos de aplicação de alto nível estão em `/Modules` (ex: `ImportationModule.ts`, `StoreModule.ts`).
    *   Arquivos que definem interfaces e tipos estão em `/Protocols` (ex: `StorageProtocol.ts`, `QueueProtocol.ts`).
    *   Arquivos que definem classes de exceção estão em `/Exceptions` (ex: `SetupInputException.ts`, `ArrayParsingException.ts`).
    *   Arquivos que definem modelos de dados estão em `/Models` (ex: `DocumentModel.ts`).

*   **Viola o padrão:**
    *   Não foram encontradas violações repetidas deste padrão nos arquivos fornecidos. Todos os arquivos funcionais parecem estar localizados consistentemente de acordo com sua função e convenção de nomenclatura.

## Arquitetura em Camadas

### Descrição

O código demonstra uma estrutura em camadas, onde componentes de alto nível dependem de componentes de nível inferior para realizar tarefas específicas. As camadas identificáveis incluem orquestração (`App`), lógica de aplicação (`Modules`), operações de domínio/infraestrutura (`Tools`/`Services`), e utilitários/validações (`Utils`/`Validations`). A regra geral é que as dependências fluem para baixo, de camadas superiores para inferiores.

### Exemplos

*   **Segue o padrão:**
    *   `App.ts` (camada de orquestração) importa e utiliza classes de `/Modules` (ex: `ImportationModule`, `ConversionModule`) e `/Services` (ex: `NotificationService`, `TempFolderService`).
    *   Classes em `/Modules` (camada de lógica de aplicação) importam e utilizam classes de `/Tools` (ex: `ImportationModule` importa `RSSImporterTool`), `/Services` (ex: `StoreModule` importa `LocalStorageTool` que por sua vez usa `JSONDatabaseService`), e `/Validations` (ex: `SetupInputModule` importa `ConfigValidation`).
    *   Classes em `/Tools` (camada de operações de domínio) importam e utilizam classes de `/Services` (ex: `RSSConverterTool` importa `ParserService`, `EbookGeneratorService`) e `/Utils` (ex: `MangaConverterTool` importa `FileUtil`).
    *   Classes em `/Services` (camada de infraestrutura/suporte) importam e utilizam outras classes de `/Services` (ex: `HttpService` importa `HttpProxyService`, `JSONDatabaseService` importa `QueueService`) e `/Utils` (ex: `EbookGeneratorService` importa `FileUtil`).
    *   Classes em `/Validations` e `/Utils` (camadas de utilitários/validações) geralmente não importam classes de camadas superiores (`Modules`, `Tools`, `App`).

*   **Viola o padrão:**
    *   Classes na camada `/Utils` (utilitários) importam classes na camada `/Services` (serviços), o que viola a regra de dependência descendente:
        *   `ParseUtil.ts` importa `ErrorHandlerService` (em `/Services`).
        *   `GithubActionsUtil.ts` importa `ErrorHandlerService` (em `/Services`).
