## Padrão: "Naming Conventions"

### Descrição

O código segue convenções de nomenclatura consistentes para arquivos, classes e métodos, indicando claramente o propósito e a responsabilidade de cada componente. Arquivos e classes frequentemente terminam com sufixos que denotam seu papel arquitetural (por exemplo, `Service`, `Util`, `Tool`, `Module`, `Validation`, `Protocol`, `Exception`, `Model`). Métodos geralmente usam verbos de ação que descrevem a operação que realizam (por exemplo, `get`, `set`, `handle`, `import`, `convert`, `send`, `run`, `fetch`, `generate`, `clean`, `start`, `close`).

### Exemplos

- **Sufixos de Arquivo/Classe:**
    - `src/Services/HttpService.ts`
    - `src/Utils/FileUtil.ts`
    - `src/Tools/Converters/RSSConverterTool.ts`
    - `src/Modules/SyncModule.ts`
    - `src/Validations/EnvironmentValidation.ts`
    - `src/Protocols/HttpProtocol.ts`
    - `src/Exceptions/ArrayParsingException.ts`
    - `src/Models/DocumentModel.ts`
- **Nomenclatura de Métodos:**
    - `HttpService.toBuffer()` (usa "to" para conversão de formato)
    - `TempFolderService.generate()` (usa "generate" para criação)
    - `TempFolderService.clean()` (usa "clean" para limpeza)
    - `BrowserService.start()` / `BrowserService.close()` (usam "start" e "close" para ciclo de vida)
    - `QueueService.enqueue()` (usa "enqueue" para adicionar à fila)
    - `CompressionService.addFile()` (usa "add" para adicionar)
    - `ProcessCommandService.run()` (usa "run" para execução)
    - `MediumImporterService.getPostHTML()` (usa "get" para recuperação)
    - `JSONDatabaseService.set()` (usa "set" para definir valor)
    - `ErrorHandlerService.handle()` (usa "handle" para tratamento)
    - `ImportationModule.import()` (usa "import" para importação)
    - `ConversionModule.convert()` (usa "convert" para conversão)
    - `SyncModule.sync()` (usa "sync" para sincronização)
    - `StoreModule.markDocumentSync()` (usa "mark" para marcar estado)
    - `SetupInputModule.fetch()` (usa "fetch" para buscar)
    - `FileUtil.parseFilePath()` (usa "parse" para análise)
    - `SanitizationUtil.sanitizeFilename()` (usa "sanitize" para sanitização)

## Padrão: "File/Module Organization"

### Descrição

O código organiza arquivos e módulos em diretórios distintos com base em sua responsabilidade ou tipo. Essa organização cria uma estrutura de projeto clara e previsível, onde componentes com propósitos semelhantes são agrupados.

### Exemplos

- `src/Modules/`: Contém a lógica de orquestração de alto nível (`SyncModule`, `StoreModule`, `ImportationModule`, `SetupInputModule`, `ConversionModule`).
- `src/Services/`: Contém funcionalidades reutilizáveis e preocupações de infraestrutura (`HttpService`, `TempFolderService`, `BrowserService`, `NotificationService`, etc.).
- `src/Tools/`: Contém implementações específicas para tarefas como conversão, importação, envio e armazenamento, subdivididas por tipo (`Converters`, `Importers`, `Senders`, `Storages`).
- `src/Validations/`: Contém lógica de validação (`EnvironmentValidation`, `ConfigValidation`, `SourceValidation`).
- `src/Utils/`: Contém funções utilitárias genéricas (`FileUtil`, `DateUtil`, `ParseUtil`, etc.).
- `src/Protocols/`: Contém definições de tipos e interfaces.
- `src/Exceptions/`: Contém classes de exceção personalizadas.
- `src/Models/`: Contém modelos de dados (`DocumentModel`).

## Padrão: "Layered Architecture"

### Descrição

O código demonstra uma arquitetura em camadas, onde as responsabilidades são divididas em níveis distintos com dependências direcionais. A camada de aplicação (`App`) orquestra o fluxo principal, dependendo dos `Modules`. Os `Modules` contêm a lógica de negócio principal e dependem de `Tools` e `Services` para realizar tarefas específicas e acessar funcionalidades de infraestrutura. `Tools` e `Services` dependem de `Utils` para operações genéricas. Essa estrutura garante que as preocupações de baixo nível não dependam da lógica de alto nível.

### Exemplos

- `App.ts` depende de classes em `src/Modules/`.
- Classes em `src/Modules/` (como `ImportationModule`, `ConversionModule`, `SyncModule`, `StoreModule`) dependem de classes em `src/Tools/` e `src/Services/`.
- Classes em `src/Tools/` (como `RSSConverterTool`, `MangaConverterTool`, `SMTPSenderTool`, `LocalStorageTool`) dependem de classes em `src/Services/` e `src/Utils/`.
- Classes em `src/Services/` (como `HttpService`, `QueueService`, `JSONDatabaseService`) dependem de classes em `src/Utils/` ou outros `Services`.
- Classes em `src/Validations/` são usadas por `Modules` e `Services`.
- Classes em `src/Utils/` são usadas por `Services` e `Tools`.

## Padrão: "Separation of Concerns"

### Descrição

As responsabilidades são consistentemente separadas em componentes distintos, com cada classe ou módulo focando em uma única preocupação principal. Isso é evidente na forma como as tarefas são divididas entre `Modules` (orquestração do fluxo), `Tools` (implementações específicas de importação/conversão/envio/armazenamento), `Services` (funcionalidades reutilizáveis de infraestrutura/domínio) e `Utils` (funções auxiliares genéricas).

### Exemplos

- `HttpService` lida exclusivamente com requisições HTTP.
- `CrawlerService` foca na análise e extração de dados de HTML.
- `EbookGeneratorService` encapsula a lógica para gerar e converter ebooks usando ferramentas externas.
- `JSONDatabaseService` gerencia a persistência de dados em um arquivo JSON.
- `Validations` classes (como `ConfigValidation`) contêm apenas a lógica para validar estruturas de configuração.
- `ImportationModule` é responsável por selecionar o `ImporterContract` apropriado e executar a importação, mas a lógica de importação específica (como buscar RSS ou dados de Manga) está em classes `ImporterTool` separadas.
- `SyncModule` é responsável por selecionar o `SenderContract` apropriado e executar o envio, mas a lógica de envio específica (SMTP, Gmail, Outlook) está em classes `SenderTool` separadas.
