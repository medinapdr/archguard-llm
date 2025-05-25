## Naming Conventions

Este padrão arquitetural é observado na aplicação de convenções de nomenclatura consistentes em diferentes tipos de arquivos e classes, o que facilita a identificação da responsabilidade e do propósito de cada componente.

- **Classes de Serviço**: Todas as classes localizadas no diretório `src/Services/` seguem a convenção de nomeação com o sufixo `Service`.
  - Exemplos: `NotificationService`, `TempFolderService`, `BrowserService`, `HttpService`, `QueueService`, `RSSContentEnricherService`, `ErrorHandlerService`, `EbookGeneratorService`, `JSONDatabaseService`, `ParserService`, `MeusMangasImporterService`, `EbookCoverService`, `CompressionService`, `CrawlerService`, `ProcessCommandService`, `MediumImporterService`.

- **Classes de Validação**: As classes no diretório `src/Validations/` são nomeadas com o sufixo `Validation`.
  - Exemplos: `EnvironmentValidation`, `ConfigValidation`, `SourceValidation`.

- **Classes de Módulo**: As classes no diretório `src/Modules/` são nomeadas com o sufixo `Module`.
  - Exemplos: `SyncModule`, `StoreModule`, `ImportationModule`, `SetupInputModule`, `ConversionModule`.

- **Classes de Ferramenta (Tools)**: As classes no diretório `src/Tools/` são nomeadas com o sufixo `Tool`.
  - Exemplos: `RSSConverterTool`, `MangaConverterTool`, `GmailSenderTool`, `OutlookSenderTool`, `SMTPSenderTool`, `MangaImporterTool`, `RSSImporterTool`, `LocalStorageTool`.

- **Classes de Utilitário (Utils)**: As classes no diretório `src/Utils/` são nomeadas com o sufixo `Util`.
  - Exemplos: `TimeUtil`, `FileUtil`, `DateUtil`, `DataManipulationUtil`, `SanitizationUtil`, `AppUtil`, `ArrayUtil`, `GithubActionsUtil`, `ParseUtil`, `MapUtil`.

- **Variáveis e Métodos Booleanos**: Variáveis e métodos que retornam um valor booleano são consistentemente prefixados com `is` ou `no` (para negação).
  - Exemplos: `isGithubActionEnvironment` (EnvironmentValidation.ts), `isDevEnvironment` (EnvironmentValidation.ts), `noValidSetupInputFound` (ConfigValidation.ts), `isNoDuplicatedSyncEnabledWithoutStorageConfig` (ConfigValidation.ts), `isMediumRSSSource` (SourceValidation.ts), `isSpecificRSSSource` (SourceValidation.ts), `exists` (HttpService.ts), `isDocumentAlreadySync` (StoreModule.ts), `isAbleToUseStorage` (StoreModule.ts), `isSinglePostPerDocumentConfig` (RSSConverterTool.ts).

- **Métodos de Recuperação (Getters)**: Métodos responsáveis por recuperar dados ou valores são consistentemente prefixados com `get`.
  - Exemplos: `getManga` (MeusMangasImporterService.ts), `getPostHTML` (MediumImporterService.ts), `getPostUrlFromSeeMoreContent` (MediumImporterService.ts), `getMimetypeByFileName` (FileUtil.ts), `get appName` (AppUtil.ts), `get appVersion` (AppUtil.ts), `get packageJSON` (AppUtil.ts), `get path` (TempFolderService.ts), `get isGithubActionEnvironment` (EnvironmentValidation.ts), `get isDevEnvironment` (EnvironmentValidation.ts), `get isAbleToUseStorage` (StoreModule.ts), `get storage` (StoreModule.ts), `get sender` (SyncModule.ts), `getConverterBySourceConfig` (ConversionModule.ts), `getImporterBySourceConfig` (ImportationModule.ts), `get todayFormattedDate` (DateUtil.ts), `getPage` (BrowserService.ts), `getRawChaptersByMangaPath` (MeusMangasImporterService.ts), `getRawChapterPictures` (MeusMangasImporterService.ts), `getElementByClassName` (CrawlerService.ts), `getTagByParagraphType` (MediumImporterService.ts), `get databaseFullPath` (LocalStorageTool.ts).

## File/Module Organization

Este padrão arquitetural é evidente na forma como os arquivos e módulos são estruturados e agrupados em diretórios lógicos, refletindo suas responsabilidades e facilitando a navegação e manutenção do código.

- **Agrupamento por Tipo de Componente**: O projeto organiza seus arquivos em diretórios dedicados a tipos específicos de componentes.
  - `src/Modules/`: Contém módulos de alto nível que orquestram operações complexas (e.g., `SyncModule`, `StoreModule`, `ImportationModule`, `SetupInputModule`, `ConversionModule`).
  - `src/Services/`: Contém classes que encapsulam lógica de negócio ou interações com serviços externos (e.g., `NotificationService`, `TempFolderService`, `BrowserService`, `HttpService`, `QueueService`, `RSSContentEnricherService`, `ErrorHandlerService`, `EbookGeneratorService`, `JSONDatabaseService`, `ParserService`, `MeusMangasImporterService`, `EbookCoverService`, `CompressionService`, `CrawlerService`, `ProcessCommandService`, `MediumImporterService`).
  - `src/Tools/`: Contém ferramentas específicas que implementam funcionalidades de conversão, importação, envio ou armazenamento (e.g., `RSSConverterTool`, `MangaConverterTool`, `GmailSenderTool`, `OutlookSenderTool`, `SMTPSenderTool`, `MangaImporterTool`, `RSSImporterTool`, `LocalStorageTool`).
  - `src/Validations/`: Contém classes dedicadas à lógica de validação (e.g., `EnvironmentValidation`, `ConfigValidation`, `SourceValidation`).
  - `src/Utils/`: Contém funções utilitárias e helpers de uso geral (e.g., `TimeUtil`, `FileUtil`, `DateUtil`, `DataManipulationUtil`, `SanitizationUtil`, `AppUtil`, `ArrayUtil`, `GithubActionsUtil`, `ParseUtil`, `MapUtil`).
  - `src/Protocols/`: Contém definições de tipos e interfaces (e.g., `MeusMangasProtocol.ts`, `QueueProtocol.ts`, `StorageProtocol.ts`, `SyncProtocol.ts`, `JSONDatabaseProtocol.ts`, `EbookGeneratorProtocol.ts`, `CompressionProtocol.ts`, `CrawlerProtocol.ts`, `NotificationProtocol.ts`, `DataManipulationProtocol.ts`, `RSSContentEnricherProtocol.ts`, `MapProtocol.ts`, `AppProtocol.ts`, `SMTPSenderProtocol.ts`, `GithubActionsProtocol.ts`, `EbookCoverProtocol.ts`, `FileProtocol.ts`, `MangaImporterProtocol.ts`, `SenderProtocol.ts`, `SetupInputProtocol.ts`, `DocumentProtocol.ts`, `ImporterProtocol.ts`, `MediumExporterProtocol.ts`, `ParserProtocol.ts`, `ConverterProtocol.ts`, `HttpProtocol.ts`).
  - `src/Exceptions/`: Contém classes de exceção personalizadas (e.g., `SetupInputException.ts`, `EnabledNoDuplicatedSyncWithoutStorageConfigException.ts`, `ArrayParsingException.ts`, `ProcessCommandException.ts`).
  - `src/Models/`: Contém modelos de dados (e.g., `DocumentModel.ts`).

## Layered Architecture

Este padrão arquitetural é observado na clara separação de responsabilidades entre as camadas lógicas da aplicação, onde cada camada tem um papel bem definido e interage com as camadas adjacentes de forma controlada.

- **Camada de Orquestração (Modules)**: Os arquivos em `src/Modules/` atuam como uma camada de orquestração de alto nível. Eles coordenam o fluxo de trabalho principal da aplicação, delegando tarefas a serviços e ferramentas mais específicos.
  - Exemplo: `App.ts` utiliza `SetupInputModule`, `ImportationModule`, `ConversionModule`, `SyncModule` e `StoreModule` para gerenciar o ciclo de vida da aplicação.
  - Exemplo: `SyncModule.ts` é responsável por orquestrar o envio de documentos, delegando a tarefa a uma instância de `SenderContract` (e.g., `SMTPSenderTool`, `GmailSenderTool`, `OutlookSenderTool`).
  - Exemplo: `StoreModule.ts` gerencia o armazenamento de documentos, utilizando uma instância de `StorageContract` (e.g., `LocalStorageTool`).
  - Exemplo: `ConversionModule.ts` delega a conversão de conteúdo a uma instância de `ConverterContract` (e.g., `RSSConverterTool`, `MangaConverterTool`).
  - Exemplo: `ImportationModule.ts` delega a importação de conteúdo a uma instância de `ImporterContract` (e.g., `RSSImporterTool`, `MangaImporterTool`).
  - Exemplo: `SetupInputModule.ts` é responsável por buscar e validar as configurações de entrada, utilizando `EnvironmentValidation` e `ConfigValidation`.

- **Camada de Serviço (Services)**: Os arquivos em `src/Services/` contêm a lógica de negócio e as interações com recursos externos ou funcionalidades específicas. Eles são chamados pelos módulos e, por sua vez, podem utilizar utilitários ou outros serviços.
  - Exemplo: `HttpService.ts` lida exclusivamente com requisições HTTP.
  - Exemplo: `EbookGeneratorService.ts` é responsável pela geração e conversão de ebooks.
  - Exemplo: `JSONDatabaseService.ts` gerencia a persistência de dados em arquivos JSON.
  - Exemplo: `RSSContentEnricherService.ts` enriquece o conteúdo RSS, utilizando `SourceValidation` e `MediumImporterService`.

- **Camada de Ferramentas (Tools)**: Os arquivos em `src/Tools/` representam implementações concretas de funcionalidades específicas (conversores, importadores, remetentes, armazenamentos) que são utilizadas pelos módulos.
  - Exemplo: `RSSConverterTool.ts` e `MangaConverterTool.ts` implementam a lógica de conversão para diferentes tipos de conteúdo.
  - Exemplo: `SMTPSenderTool.ts`, `GmailSenderTool.ts` e `OutlookSenderTool.ts` implementam a lógica de envio de documentos.
  - Exemplo: `RSSImporterTool.ts` e `MangaImporterTool.ts` implementam a lógica de importação de conteúdo.
  - Exemplo: `LocalStorageTool.ts` implementa a lógica de armazenamento local.

- **Camada de Utilitários (Utils)**: Os arquivos em `src/Utils/` fornecem funções auxiliares e genéricas que podem ser usadas por qualquer camada, sem conter lógica de negócio específica.
  - Exemplo: `FileUtil.ts` para manipulação de caminhos de arquivo, `DateUtil.ts` para formatação de datas, `SanitizationUtil.ts` para sanitização de strings.

## Separation of Concerns

Este padrão arquitetural é demonstrado pela atribuição de responsabilidades únicas e bem definidas a cada módulo, serviço ou utilitário, evitando que um componente acumule múltiplas responsabilidades não relacionadas.

- **Controladores (Módulos de Orquestração) focam na coordenação**: Os módulos em `src/Modules/` são responsáveis por orquestrar o fluxo de trabalho, mas delegam a lógica de negócio e operações específicas a serviços e ferramentas.
  - Exemplo: Em `App.ts`, o método `run` coordena as chamadas para `setupInputModule.fetch()`, `TempFolderService.generate()`, `BrowserService.start()`, `importationModule.import()`, `conversionModule.convert()`, `syncModule.sync()`, `storeModule.markDocumentSync()`, `storeModule.commitDocumentSyncChanges()`, `TempFolderService.clean()` e `BrowserService.close()`. Ele não contém a lógica interna de como cada uma dessas operações é realizada.

- **Serviços encapsulam lógica de negócio específica**: Cada serviço em `src/Services/` tem uma responsabilidade clara e única.
  - Exemplo: `HttpService.ts` é exclusivamente responsável por fazer requisições HTTP e formatar as respostas (`toBuffer`, `toString`, `toJSON`, `toReadStream`, `exists`, `makeRawRequest`). Ele não lida com a lógica de negócio de como esses dados são usados ou transformados.
  - Exemplo: `EbookGeneratorService.ts` foca apenas na geração e conversão de ebooks.
  - Exemplo: `JSONDatabaseService.ts` gerencia apenas a leitura e escrita de dados em um arquivo JSON, incluindo controle de concorrência para o arquivo.
  - Exemplo: `ErrorHandlerService.ts` tem a única responsabilidade de lidar com erros, registrando-os no console.
  - Exemplo: `BrowserService.ts` gerencia a inicialização e o fechamento de uma instância do navegador Puppeteer e a obtenção de novas páginas.

- **Ferramentas implementam funcionalidades específicas**: As classes em `src/Tools/` são especializadas em uma única funcionalidade (conversão, importação, envio, armazenamento).
  - Exemplo: `RSSConverterTool.ts` e `MangaConverterTool.ts` são responsáveis apenas pela conversão de um tipo específico de conteúdo para o formato de documento.
  - Exemplo: `SMTPSenderTool.ts` é responsável apenas pelo envio de documentos via SMTP.
  - Exemplo: `LocalStorageTool.ts` é responsável apenas por salvar e recuperar documentos de um armazenamento local (arquivo JSON).

- **Utilitários fornecem funções genéricas e sem estado**: As classes em `src/Utils/` contêm funções auxiliares que não possuem estado ou lógica de negócio complexa, sendo reutilizáveis em diferentes contextos.
  - Exemplo: `FileUtil.ts` lida com operações de caminho de arquivo e mimetype.
  - Exemplo: `SanitizationUtil.ts` foca apenas na sanitização de nomes de arquivo.
  - Exemplo: `DataManipulationUtil.ts` fornece métodos para manipulação genérica de arrays (ordenação, limite).

- **Validações são separadas da lógica principal**: As classes em `src/Validations/` contêm apenas a lógica para validar dados ou o ambiente, sem executar ações ou lógica de negócio.
  - Exemplo: `ConfigValidation.ts` contém métodos como `noValidSetupInputFound` e `isNoDuplicatedSyncEnabledWithoutStorageConfig` que apenas verificam condições na configuração.
