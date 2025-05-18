## Organização de Arquivos/Módulos

### Descrição

O código está organizado em diretórios, onde cada diretório agrupa arquivos com responsabilidades ou tipos semelhantes. Essa organização facilita a localização de código relacionado e ajuda a entender a estrutura geral do projeto.

### Exemplos

- O arquivo `HttpService.ts`, responsável por lidar com requisições HTTP, está localizado no diretório `src/Services/`.
- O arquivo `SetupInputModule.ts`, que orquestra a lógica de obtenção de configuração, está localizado no diretório `src/Modules/`.
- O arquivo `FileUtil.ts`, contendo funções utilitárias para manipulação de arquivos, está localizado no diretório `src/Utils/`.

## Convenções de Nomenclatura

### Descrição

As classes seguem convenções de nomenclatura consistentes baseadas no diretório em que estão localizadas. Classes em `src/Services/` geralmente terminam com `Service`, classes em `src/Modules/` terminam com `Module`, classes em `src/Utils/` terminam com `Util`, classes em `src/Validations/` terminam com `Validation` e classes em `src/Tools/` terminam com `Tool`.

### Exemplos

- A classe `BrowserService` em `src/Services/BrowserService.ts`.
- A classe `ImportationModule` em `src/Modules/ImportationModule.ts`.
- A classe `SanitizationUtil` em `src/Utils/SanitizationUtil.ts`.
- A classe `ConfigValidation` em `src/Validations/ConfigValidation.ts`.
- A classe `RSSConverterTool` em `src/Tools/Converters/RSSConverterTool.ts`.

## Arquitetura em Camadas

### Descrição

O código demonstra uma estrutura em camadas, onde diferentes partes do sistema têm responsabilidades distintas e dependem de camadas inferiores. Observa-se uma separação entre:
- Camada de Orquestração/Apresentação (`App`)
- Camada de Lógica de Aplicação (`Modules`)
- Camada de Tarefas Específicas/Domínio (`Tools`)
- Camada de Infraestrutura/Serviços de Baixo Nível/Utilitários (`Services`, `Utils`, `Validations`, `Protocols`, `Exceptions`, `Models`)
Camadas superiores dependem de camadas inferiores, mas não o contrário.

### Exemplos

- A classe `App` (camada de Orquestração) instancia e utiliza classes de `Modules` (`SetupInputModule`, `ImportationModule`, `ConversionModule`, `SyncModule`, `StoreModule`) e `Services` (`NotificationService`, `TempFolderService`, `BrowserService`).
- Classes em `Modules` (`ImportationModule`, `ConversionModule`, `SyncModule`, `StoreModule`) instanciam ou utilizam classes de `Tools` (`RSSImporterTool`, `MangaImporterTool`, `RSSConverterTool`, `MangaConverterTool`, `SMTPSenderTool`, `GmailSenderTool`, `OutlookSenderTool`, `LocalStorageTool`) e `Services` (`QueueService`, `NotificationService`, `ErrorHandlerService`, `JSONDatabaseService`).
- Classes em `Tools` (`RSSConverterTool`, `MangaConverterTool`, `SMTPSenderTool`, `GmailSenderTool`, `OutlookSenderTool`, `LocalStorageTool`, `RSSImporterTool`, `MangaImporterTool`) instanciam ou utilizam classes de `Services` (`TempFolderService`, `ParserService`, `EbookGeneratorService`, `EbookCoverService`, `RSSContentEnricherService`, `QueueService`, `JSONDatabaseService`, `MeusMangasImporterService`, `HttpService`) e `Utils` (`FileUtil`, `DateUtil`, `DataManipulationUtil`, `SanitizationUtil`, `GithubActionsUtil`).

## Separação de Responsabilidades

### Descrição

As responsabilidades são divididas entre diferentes classes e módulos, com cada unidade de código focando em uma tarefa específica. Isso evita que uma única classe se torne um "faz-tudo" e melhora a manutenibilidade e o entendimento do código.

### Exemplos

- A classe `HttpService` é responsável exclusivamente por lidar com requisições HTTP.
- A classe `ParserService` é responsável por analisar (parsear) conteúdo RSS.
- A classe `EbookGeneratorService` é responsável por gerar arquivos de ebook (EPUB, Kindle).
- A classe `EnvironmentValidation` é responsável por validar o ambiente de execução.
- A classe `ErrorHandlerService` é responsável por lidar com erros (neste caso, logar no console).
