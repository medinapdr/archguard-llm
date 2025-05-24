## Padrão: "Naming Conventions"

Este padrão arquitetural é observado na forma consistente como os elementos de código são nomeados em todo o projeto. Classes e variáveis seguem formatos previsíveis que indicam sua função ou tipo.

Exemplos explícitos no código incluem:

-   Classes que fornecem funcionalidades de serviço ou utilidade geral são consistentemente nomeadas com o sufixo `Service`. Exemplos: `HttpService`, `QueueService`, `ErrorHandlerService`, `TempFolderService`, `BrowserService`, `CompressionService`, `CrawlerService`, `ProcessCommandService`, `JSONDatabaseService`, `RSSContentEnricherService`, `MediumImporterService`, `NotificationService`.
-   Classes que fornecem funcionalidades utilitárias gerais são consistentemente nomeadas com o sufixo `Util`. Exemplos: `MapUtil`, `FileUtil`, `GithubActionsUtil`, `ParseUtil`, `AppUtil`, `TimeUtil`, `DateUtil`, `SanitizationUtil`, `ArrayUtil`, `DataManipulationUtil`.
-   Classes que encapsulam lógica de validação são consistentemente nomeadas com o sufixo `Validation`. Exemplos: `EnvironmentValidation`, `ConfigValidation`, `SourceValidation`.
-   Classes que representam unidades funcionais específicas dentro do diretório `Tools` são consistentemente nomeadas com o sufixo `Tool`. Exemplos: `RSSConverterTool`, `MangaConverterTool`, `SMTPSenderTool`, `GmailSenderTool`, `OutlookSenderTool`, `LocalStorageTool`, `RSSImporterTool`, `MangaImporterTool`.
-   Classes que representam módulos funcionais distintos são consistentemente nomeadas com o sufixo `Module`. Exemplos: `SyncModule`, `StoreModule`, `ConversionModule`, `SetupInputModule`, `ImportationModule`.
-   Classes que representam modelos de dados são consistentemente nomeadas com o sufixo `Model`. Exemplo: `DocumentModel`.
-   Classes que representam exceções personalizadas são consistentemente nomeadas com o sufixo `Exception`. Exemplos: `ProcessCommandException`, `ArrayParsingException`, `NoValidSetupInputFoundException`, `EnabledNoDuplicatedSyncWithoutStorageConfigException`.
-   Variáveis booleanas são frequentemente prefixadas com `is` ou `has`. Exemplos: `isGithubActionEnvironment` (em `EnvironmentValidation.ts`), `isDevEnvironment` (em `EnvironmentValidation.ts`), `isMediumRSSSource` (em `SourceValidation.ts`), `isDocumentAlreadySync` (em `StoreModule.ts`), `isAbleToUseStorage` (em `StoreModule.ts`).

## Padrão: "File/Module Organization"

Este padrão arquitetural é demonstrado pela estrutura de diretórios consistente usada para organizar os arquivos do projeto com base em suas responsabilidades ou tipos.

Exemplos explícitos no código incluem:

-   Arquivos contendo classes de serviço ou utilidades funcionais são agrupados no diretório `src/Services/`. Exemplos: `HttpService.ts`, `QueueService.ts`, `ErrorHandlerService.ts`, `TempFolderService.ts`, `BrowserService.ts`, `CompressionService.ts`, `CrawlerService.ts`, `ProcessCommandService.ts`, `JSONDatabaseService.ts`, `RSSContentEnricherService.ts`, `MediumImporterService.ts`, `NotificationService.ts`, `HttpProxyService.ts`.
-   Arquivos contendo classes utilitárias gerais são agrupados no diretório `src/Utils/`. Exemplos: `MapUtil.ts`, `FileUtil.ts`, `GithubActionsUtil.ts`, `ParseUtil.ts`, `AppUtil.ts`, `TimeUtil.ts`, `DateUtil.ts`, `SanitizationUtil.ts`, `ArrayUtil.ts`, `DataManipulationUtil.ts`.
-   Arquivos contendo classes de validação são agrupados no diretório `src/Validations/`. Exemplos: `EnvironmentValidation.ts`, `ConfigValidation.ts`, `SourceValidation.ts`.
-   Arquivos contendo classes que representam unidades funcionais específicas (ferramentas) são agrupados no diretório `src/Tools/`, com subdiretórios adicionais para categorização (e.g., `Converters`, `Senders`, `Importers`, `Storages`). Exemplos: `src/Tools/Converters/RSSConverterTool.ts`, `src/Tools/Senders/SMTPSenderTool.ts`, `src/Tools/Importers/RSSImporterTool.ts`, `src/Tools/Storages/LocalStorageTool.ts`.
-   Arquivos contendo classes que representam módulos funcionais distintos são agrupados no diretório `src/Modules/`. Exemplos: `SyncModule.ts`, `StoreModule.ts`, `ConversionModule.ts`, `SetupInputModule.ts`, `ImportationModule.ts`.
-   Arquivos contendo classes que representam modelos de dados são agrupados no diretório `src/Models/`. Exemplo: `DocumentModel.ts`.
-   Arquivos contendo interfaces e tipos são agrupados no diretório `src/Protocols/`. Exemplos: `MeusMangasProtocol.ts`, `QueueProtocol.ts`, `StorageProtocol.ts`, `SyncProtocol.ts`, `JSONDatabaseProtocol.ts`, `EbookGeneratorProtocol.ts`, `CompressionProtocol.ts`, `CrawlerProtocol.ts`, `NotificationProtocol.ts`, `DataManipulationProtocol.ts`, `RSSContentEnricherProtocol.ts`, `MapProtocol.ts`, `AppProtocol.ts`, `SMTPSenderProtocol.ts`, `GithubActionsProtocol.ts`, `EbookCoverProtocol.ts`, `FileProtocol.ts`, `MangaImporterProtocol.ts`, `SenderProtocol.ts`, `SetupInputProtocol.ts`, `DocumentProtocol.ts`, `ImporterProtocol.ts`, `MediumExporterProtocol.ts`, `ParserProtocol.ts`, `ConverterProtocol.ts`, `HttpProtocol.ts`.
-   Arquivos contendo classes de exceção personalizadas são agrupados no diretório `src/Exceptions/`. Exemplos: `SetupInputException.ts`, `EnabledNoDuplicatedSyncWithoutStorageConfigException.ts`, `ArrayParsingException.ts`, `ProcessCommandException.ts`.

## Padrão: "Layered Architecture"

Este padrão arquitetural é observado na organização do código em camadas lógicas, onde cada camada tem responsabilidades específicas e interage principalmente com as camadas adjacentes.

Exemplos explícitos no código incluem:

-   A classe `App` (em `src/App.ts`) atua como uma camada de aplicação ou orquestração de alto nível. Ela coordena o fluxo principal da aplicação, chamando métodos de diferentes `Modules` (`SetupInputModule`, `ImportationModule`, `ConversionModule`, `StoreModule`, `SyncModule`) e `Services` (`NotificationService`, `TempFolderService`, `BrowserService`). Ela não contém lógica de negócio detalhada, importação, conversão ou envio, delegando essas tarefas para as camadas inferiores.
-   As classes no diretório `src/Modules/` (`SetupInputModule`, `ImportationModule`, `ConversionModule`, `StoreModule`, `SyncModule`) representam uma camada de lógica de negócio ou fluxo de trabalho. Cada módulo encapsula uma parte específica do processo (configuração, importação, conversão, armazenamento, sincronização) e coordena o uso de componentes de camadas inferiores (`Tools` e `Services`). Por exemplo, `ImportationModule` delega a importação real para classes `ImporterTool` (em `src/Tools/Importers/`), e `ConversionModule` delega a conversão para classes `ConverterTool` (em `src/Tools/Converters/`).
-   As classes nos diretórios `src/Tools/` (e seus subdiretórios como `Converters`, `Senders`, `Importers`, `Storages`) e `src/Services/` atuam como camadas de funcionalidade específica ou acesso a recursos externos. Elas contêm a lógica detalhada para tarefas como fazer requisições HTTP (`HttpService`), gerar ebooks (`EbookGeneratorService`), interagir com o sistema de arquivos (`TempFolderService`, `JSONDatabaseService`), enviar emails (`SMTPSenderTool`), etc. Essas classes são utilizadas pelos `Modules` e, em alguns casos, por outras classes de `Service` ou `Tool`.
-   As classes nos diretórios `src/Utils/` e `src/Validations/` fornecem funcionalidades de suporte e validação que podem ser utilizadas por várias camadas, mas não representam o fluxo principal da aplicação.

A dependência flui predominantemente de camadas superiores para inferiores (e.g., `App` -> `Modules` -> `Tools`/`Services` -> `Utils`/`Validations`), demonstrando uma estrutura em camadas.

## Padrão: "Separation of Concerns"

Este padrão arquitetural é evidente na forma como o código é dividido em unidades (classes, módulos) onde cada unidade tem uma responsabilidade única e bem definida.

Exemplos explícitos no código incluem:

-   As classes no diretório `src/Validations/` (e.g., `EnvironmentValidation`, `ConfigValidation`, `SourceValidation`) são responsáveis exclusivamente por validar dados ou o ambiente, sem misturar essa lógica com processamento de dados ou interação externa.
-   As classes no diretório `src/Services/` (e.g., `HttpService`, `TempFolderService`, `CrawlerService`, `ProcessCommandService`) focam em uma única preocupação, como fazer requisições HTTP, gerenciar arquivos temporários, rastrear HTML ou executar comandos de processo, respectivamente. Elas não contêm lógica de negócio complexa ou orquestração de fluxo.
-   As classes no diretório `src/Tools/` (e seus subdiretórios) também demonstram separação de preocupações. Por exemplo, `RSSImporterTool` (em `src/Tools/Importers/`) é responsável apenas por importar conteúdo RSS, enquanto `RSSConverterTool` (em `src/Tools/Converters/`) é responsável apenas por converter conteúdo RSS importado em documentos. `SMTPSenderTool` (em `src/Tools/Senders/`) é responsável apenas por enviar documentos via SMTP, e `LocalStorageTool` (em `src/Tools/Storages/`) é responsável apenas por armazenar documentos localmente.
-   As classes no diretório `src/Modules/` (e.g., `ImportationModule`, `ConversionModule`, `SyncModule`, `StoreModule`) encapsulam uma preocupação de fluxo de trabalho específica (importação, conversão, sincronização, armazenamento), mas delegam a execução das tarefas detalhadas para as classes `Tool` e `Service` apropriadas. Por exemplo, `ImportationModule` não sabe como importar RSS ou Manga; ele apenas seleciona o `ImporterTool` correto e chama seu método `import`.
-   A classe `App` (em `src/App.ts`) tem a preocupação única de orquestrar o fluxo geral da aplicação, chamando os módulos e serviços necessários na sequência correta. Ela não implementa a lógica interna de nenhum módulo ou serviço.
-   As classes no diretório `src/Utils/` (e.g., `FileUtil`, `DateUtil`, `SanitizationUtil`) fornecem funcionalidades genéricas e reutilizáveis que não estão ligadas a uma preocupação de negócio específica, como manipulação de arquivos, datas ou strings.
