## Organização de Arquivos/Módulos

### Descrição

O código-fonte é consistentemente organizado em diretórios, onde cada diretório agrupa arquivos com responsabilidades ou tipos semelhantes. Esta estrutura facilita a localização de componentes específicos e ajuda a manter o código-fonte organizado.

### Exemplos

Arquivos que fornecem funcionalidades de serviço (como `HttpService.ts`, `TempFolderService.ts`, `BrowserService.ts`) são consistentemente colocados no diretório `/Services`. Arquivos que contêm lógica de validação (como `EnvironmentValidation.ts`, `ConfigValidation.ts`) são encontrados no diretório `/Validations`. Arquivos que orquestram partes do fluxo da aplicação (como `SyncModule.ts`, `ImportationModule.ts`) estão no diretório `/Modules`. Arquivos utilitários genéricos (como `FileUtil.ts`, `DateUtil.ts`) residem no diretório `/Utils`. Ferramentas específicas para tarefas de domínio (como `RSSConverterTool.ts`, `GmailSenderTool.ts`) são agrupadas no diretório `/Tools` e seus subdiretórios.

## Convenções de Nomenclatura

### Descrição

Existe uma convenção consistente para nomear arquivos e classes com base em sua função ou no diretório em que residem. Isso fornece uma indicação clara do propósito de um arquivo ou classe apenas pelo seu nome.

### Exemplos

Arquivos e classes no diretório `/Services` são nomeados com o sufixo `Service` (ex: `HttpService.ts`, `class HttpService`). Arquivos e classes no diretório `/Validations` usam o sufixo `Validation` (ex: `ConfigValidation.ts`, `class ConfigValidation`). Arquivos e classes no diretório `/Modules` usam o sufixo `Module` (ex: `ImportationModule.ts`, `class ImportationModule`). Arquivos e classes no diretório `/Utils` usam o sufixo `Util` (ex: `SanitizationUtil.ts`, `class SanitizationUtil`). Arquivos e classes no diretório `/Tools` e seus subdiretórios usam o sufixo `Tool` (ex: `MangaConverterTool.ts`, `class MangaConverterTool`).

## Arquitetura em Camadas

### Descrição

O código demonstra uma organização em camadas lógicas, onde componentes de camadas superiores dependem de componentes de camadas inferiores para realizar suas tarefas. A estrutura geral observada segue uma hierarquia como `Modules` -> `Tools` -> `Services` / `Validations` / `Utils`.

### Exemplos

**Seguindo o padrão:**
- O `ImportationModule` (camada `Modules`) depende de `ImporterContract` implementado por classes como `RSSImporterTool` e `MangaImporterTool` (camada `Tools`).
- O `RSSImporterTool` (camada `Tools`) depende de `HttpService` e `ParserService` (camada `Services`).
- O `MangaConverterTool` (camada `Tools`) depende de `QueueService`, `EbookGeneratorService`, `EbookCoverService` (camada `Services`) e `FileUtil`, `DataManipulationUtil`, `SanitizationUtil` (camada `Utils`).

**Violando o padrão:**
- O `GithubActionsUtil` (localizado na camada `Utils`, que é geralmente considerada uma camada inferior) depende do `ErrorHandlerService` (localizado na camada `Services`, que é geralmente considerada uma camada superior).
- O `ParseUtil` (localizado na camada `Utils`) também depende do `ErrorHandlerService` (localizado na camada `Services`).
