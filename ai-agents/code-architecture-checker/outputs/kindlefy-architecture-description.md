```
## Organização por Diretórios Funcionais

### Descrição

O código está organizado em diretórios que agrupam arquivos com base em sua função ou camada lógica. Diretórios como `Services`, `Utils`, `Tools`, `Modules`, `Validations`, `Protocols`, `Exceptions` e `Models` são usados consistentemente para separar diferentes tipos de código.

### Exemplos

- Arquivos relacionados a serviços de infraestrutura ou de domínio são colocados no diretório `Services` (ex: `src/Services/HttpService.ts`, `src/Services/NotificationService.ts`).
- Arquivos contendo funções utilitárias genéricas são colocados no diretório `Utils` (ex: `src/Utils/FileUtil.ts`, `src/Utils/DateUtil.ts`).
- Arquivos que definem interfaces ou tipos de dados são colocados no diretório `Protocols` (ex: `src/Protocols/HttpProtocol.ts`, `src/Protocols/DocumentProtocol.ts`).

```

```
## Convenção de Nomenclatura de Arquivos

### Descrição

Os arquivos frequentemente seguem uma convenção de nomenclatura onde o nome do arquivo reflete o nome da classe ou funcionalidade principal e termina com um sufixo que indica sua categoria (ex: `Service`, `Util`, `Validation`, `Tool`, `Module`, `Protocol`, `Exception`, `Model`).

### Exemplos

- Arquivos de serviço terminam com `Service.ts` (ex: `HttpService.ts`, `CrawlerService.ts`).
- Arquivos utilitários terminam com `Util.ts` (ex: `FileUtil.ts`, `SanitizationUtil.ts`).
- Arquivos de validação terminam com `Validation.ts` (ex: `ConfigValidation.ts`, `EnvironmentValidation.ts`).
- Arquivos de ferramentas terminam com `Tool.ts` (ex: `RSSConverterTool.ts`, `GmailSenderTool.ts`).
- Arquivos de módulos terminam com `Module.ts` (ex: `SyncModule.ts`, `ImportationModule.ts`).
- Arquivos de definição de tipos/interfaces terminam com `Protocol.ts` (ex: `StorageProtocol.ts`, `SetupInputProtocol.ts`).
- Arquivos de exceção terminam com `Exception.ts` (ex: `ArrayParsingException.ts`, `ProcessCommandException.ts`).
- Arquivos de modelo terminam com `Model.ts` (ex: `DocumentModel.ts`).

```

```
## Padrão de Exportação de Instância Única (Singleton Implícito)

### Descrição

Muitas classes, especialmente aquelas localizadas nos diretórios `Services`, `Utils` e `Validations`, são exportadas como uma nova instância (`export default new ClassName()`) em vez de exportar a própria classe. Isso faz com que essas classes ajam como singletons acessíveis globalmente sem a necessidade de instanciá-las explicitamente onde são usadas.

### Exemplos

- `export default new EnvironmentValidation()` em `src/Validations/EnvironmentValidation.ts`.
- `export default new HttpProxy()` em `src/Services/HttpProxyService.ts`.
- `export default new FileUtil()` em `src/Utils/FileUtil.ts`.

### Exemplos que Violam

- Classes nos diretórios `Modules` (ex: `SyncModule`, `StoreModule`) são exportadas como a própria classe (`export default ClassName`) e são instanciadas explicitamente onde são usadas (ex: `new SyncModule(...)` em `src/App.ts`).
- Algumas classes em `Services` (ex: `HttpService`, `QueueService`, `EbookGeneratorService`, `JSONDatabaseService`) são exportadas como a própria classe e requerem instanciação.
- Classes nos diretórios `Tools/Senders` (ex: `SMTPSenderTool`, `GmailSenderTool`) e `Tools/Storages` (ex: `LocalStorageTool`) são exportadas como a própria classe.

```

```
## Uso Consistente de `async`/`await`

### Descrição

Operações assíncronas em todo o código são consistentemente tratadas usando a sintaxe `async`/`await`. Isso é aplicado a chamadas de I/O (como operações de arquivo, requisições HTTP) e coordenação de tarefas assíncronas, frequentemente utilizando `Promise.all` para execução paralela.

### Exemplos

- O método `run` em `src/App.ts` usa `await` para chamar métodos assíncronos de módulos e serviços: `await NotificationService.task(...)`, `await TempFolderService.generate()`, `await Promise.all(...)`.
- Métodos em `src/Services/JSONDatabaseService.ts` usam `await` para operações de arquivo e enfileiramento: `await JSONDatabaseService.actionFIFOQueue.enqueue(...)`, `await fs.promises.readFile(...)`.
- Métodos em `src/Tools/Converters/RSSConverterTool.ts` usam `await` para coordenação de tarefas assíncronas: `await Promise.all(...)`, `await this.queueService.enqueue(...)`.

### Exemplos que Violam

- Não há exemplos significativos de operações assíncronas sendo tratadas sem o uso de `async`/`await` no código fornecido.

```

```
## Centralização do Tratamento de Erros

### Descrição

Erros capturados em blocos `try...catch` em várias partes da aplicação são frequentemente passados para o método `ErrorHandlerService.handle()` para um tratamento centralizado, que no código fornecido consiste em logar o erro no console.

### Exemplos

- Em `src/Services/NotificationService.ts`, erros dentro das tarefas são passados para `ErrorHandlerService.handle(error)`.
- Em `src/Services/MediumImporterService.ts`, erros ao buscar HTML de posts são passados para `ErrorHandlerService.handle(error)`.
- Em `src/Utils/ParseUtil.ts`, erros ao analisar arrays são passados para `ErrorHandlerService.handle(new ArrayParsingException(...))`.
- Em `src/Utils/GithubActionsUtil.ts`, erros ao atualizar arquivos no repositório são passados para `ErrorHandlerService.handle(error)`.

### Exemplos que Violam

- Em `src/Services/ProcessCommandService.ts`, o erro capturado na execução do comando (`exec`) é usado para rejeitar a Promise diretamente (`reject(new ProcessCommandException(error, stdout, stderr))`) em vez de ser passado para `ErrorHandlerService.handle()`.

```

```
## Seleção de Implementação Baseada em Tipo

### Descrição

Módulos que orquestram a execução de diferentes ferramentas ou serviços (como `SyncModule`, `StoreModule`, `ConversionModule`, `ImportationModule`) utilizam um objeto de mapa (ex: `importerMap`, `converterMap`, `senderMap`, `storageMap`) para selecionar a implementação concreta apropriada com base em uma propriedade `type` fornecida na configuração de entrada.

### Exemplos

- O getter `sender` em `src/Modules/SyncModule.ts` seleciona a instância correta (`SMTPSenderTool`, `GmailSenderTool`, `OutlookSenderTool`) usando `senderMap[config.type]`.
- O getter `storage` em `src/Modules/StoreModule.ts` seleciona a instância correta (`LocalStorageTool`) usando `storageMap[config.type]`.
- O método `getConverterBySourceConfig` em `src/Modules/ConversionModule.ts` seleciona a ferramenta de conversão correta (`RSSConverterTool`, `MangaConverterTool`) usando `converterMap[sourceConfig.type]`.
- O método `getImporterBySourceConfig` em `src/Modules/ImportationModule.ts` seleciona a ferramenta de importação correta (`RSSImporterTool`, `MangaImporterTool`) usando `importerMap[sourceConfig.type]`.

### Exemplos que Violam

- Serviços utilitários (ex: `FileUtil`, `DateUtil`) ou serviços de infraestrutura específicos (ex: `HttpService`, `CrawlerService`) geralmente não implementam essa lógica de seleção baseada em tipo, pois suas responsabilidades são mais focadas e não dependem de variações de configuração de alto nível.

```
