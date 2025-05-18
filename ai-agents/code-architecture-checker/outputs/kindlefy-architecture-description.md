## Estrutura de Diretórios por Responsabilidade

### Descrição

O código-fonte é organizado em diretórios que agrupam arquivos com base em suas responsabilidades ou papéis dentro da aplicação. Isso promove a separação de preocupações e facilita a navegação e manutenção do código. Diretórios comuns incluem `Services`, `Utils`, `Modules`, `Tools`, `Validations`, `Protocols`, `Exceptions` e `Models`.

### Exemplos

**Conforme:**
- Arquivos relacionados a validações, como `EnvironmentValidation.ts` e `ConfigValidation.ts`, estão localizados no diretório `src/Validations/`.
- Arquivos que fornecem funcionalidades utilitárias genéricas, como `FileUtil.ts` e `DateUtil.ts`, estão localizados no diretório `src/Utils/`.

**Violando:**
- Não há exemplos claros de violação desta estrutura nos arquivos fornecidos, pois a organização por diretórios é consistentemente aplicada.

## Convenção de Nomenclatura por Categoria

### Descrição

Classes e arquivos seguem uma convenção de nomenclatura onde um sufixo específico é usado para indicar a categoria ou o papel principal do código. Esta convenção ajuda a identificar rapidamente a responsabilidade de um arquivo ou classe. Sufixos comuns incluem `Service`, `Util`, `Validation`, `Module` e `Tool`.

### Exemplos

**Conforme:**
- `HttpService` (em `src/Services/HttpService.ts`) indica que é um serviço.
- `FileUtil` (em `src/Utils/FileUtil.ts`) indica que é uma classe utilitária.
- `ConfigValidation` (em `src/Validations/ConfigValidation.ts`) indica que é uma classe de validação.
- `ImportationModule` (em `src/Modules/ImportationModule.ts`) indica que é um módulo.
- `RSSConverterTool` (em `src/Tools/Converters/RSSConverterTool.ts`) indica que é uma ferramenta.

**Violando:**
- Não há exemplos claros de violação desta convenção de nomenclatura nos arquivos fornecidos.

## Padrão Singleton para Serviços e Utilitários

### Descrição

Muitas classes localizadas nos diretórios `Services` e `Utils` são implementadas como Singletons. Isso é alcançado exportando uma única instância da classe diretamente no final do arquivo (`export default new ClassName()`). Isso garante que apenas uma instância dessas classes exista na aplicação, o que é adequado para funcionalidades que não precisam de estado por instância ou que gerenciam um recurso compartilhado.

### Exemplos

**Conforme:**
- `export default new EnvironmentValidation()` em `src/Validations/EnvironmentValidation.ts`.
- `export default new TempFolderService()` em `src/Services/TempFolderService.ts`.
- `export default new FileUtil()` em `src/Utils/FileUtil.ts`.

**Violando:**
- A classe `HttpService` (em `src/Services/HttpService.ts`) é exportada como classe (`export default HttpService`) e instanciada com opções específicas (`new HttpService({ ... })`) em `MeusMangasImporterService` e `MediumImporterService`, permitindo múltiplas instâncias com configurações diferentes.
- A classe `JSONDatabaseService` (em `src/Services/JSONDatabaseService.ts`) é exportada como classe e instanciada com um caminho de arquivo específico (`new JSONDatabaseService(...)`) em `LocalStorageTool`, permitindo múltiplas instâncias para diferentes arquivos de banco de dados.

## Seleção de Implementação Baseada em Tipo (Strategy/Factory via Map)

### Descrição

Em vários pontos da aplicação, especialmente em módulos que orquestram operações (como `ImportationModule`, `ConversionModule`, `SyncModule` e `StoreModule`), a implementação concreta a ser utilizada (por exemplo, qual importador, conversor, remetente ou armazenamento) é selecionada dinamicamente com base em um valor de "tipo" fornecido na configuração (e.g., `sourceConfig.type`, `senderConfig.type`, `storageConfig.type`). Essa seleção é frequentemente realizada utilizando um objeto JavaScript (um mapa) onde as chaves são os valores de tipo e os valores são as classes ou instâncias das implementações correspondentes.

### Exemplos

**Conforme:**
- No método `getConverterBySourceConfig` em `ConversionModule`, um mapa (`converterMap`) é usado para selecionar a ferramenta de conversão (`RSSConverterTool` ou `MangaConverterTool`) com base em `sourceConfig.type`.
- No método `sender` em `SyncModule`, um mapa (`senderMap`) é usado para selecionar a ferramenta de envio (`SMTPSenderTool`, `GmailSenderTool` ou `OutlookSenderTool`) com base em `config.type`.
- No método `storage` em `StoreModule`, um mapa (`storageMap`) é usado para selecionar a ferramenta de armazenamento (`LocalStorageTool`) com base em `config.type`.

**Violando:**
- Não há exemplos claros de violação deste padrão específico (seleção baseada em tipo usando um mapa) nos arquivos fornecidos, onde uma lógica similar de seleção baseada em tipo seja implementada de forma inconsistente (por exemplo, usando longas cadeias de `if/else if` em vez de um mapa).

## Tratamento Centralizado de Erros

### Descrição

Erros que ocorrem em diferentes partes da aplicação são frequentemente capturados em blocos `try...catch` e passados para o serviço `ErrorHandlerService` para serem tratados de forma consistente, geralmente registrando o erro no console.

### Exemplos

**Conforme:**
- Em `src/Services/NotificationService.ts`, dentro dos métodos `CLITask` e `githubActionTask`, erros capturados são passados para `ErrorHandlerService.handle(error)`.
- Em `src/Services/RSSContentEnricherService.ts`, dentro do método `enrichMediumContent`, erros capturados são passados para `ErrorHandlerService.handle(error)`.
- Em `src/Utils/ParseUtil.ts`, dentro do método `safelyParseArray`, erros capturados são passados para `ErrorHandlerService.handle(...)`.

**Violando:**
- Em `src/Services/ProcessCommandService.ts`, o método `exec` captura erros mas rejeita a Promise diretamente com o erro ou stderr, sem chamar `ErrorHandlerService.handle`.
- Em `src/Services/JSONDatabaseService.ts`, o método privado `syncInMemoryDatabaseByFileDatabase` usa um bloco `try...catch` mas, em caso de erro, apenas define o banco de dados em memória como um objeto vazio (`{}`), sem chamar `ErrorHandlerService.handle`.
