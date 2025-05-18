## Convenção de Nomenclatura por Sufixo

### Descrição

Este padrão arquitetural é observado na utilização consistente de sufixos específicos para classes e arquivos, indicando seu papel ou tipo dentro da arquitetura. Arquivos localizados em diretórios específicos frequentemente terminam com um sufixo que reflete a natureza do código contido neles. Isso ajuda na organização e na rápida identificação da responsabilidade de um componente.

### Exemplos

-   **Segue o padrão**: Arquivos no diretório `src/Services` consistentemente terminam com `Service.ts` (ex: `HttpService.ts`, `TempFolderService.ts`, `BrowserService.ts`).
-   **Segue o padrão**: Arquivos no diretório `src/Utils` consistentemente terminam com `Util.ts` (ex: `FileUtil.ts`, `DateUtil.ts`, `SanitizationUtil.ts`).
-   **Segue o padrão**: Arquivos no diretório `src/Validations` consistentemente terminam com `Validation.ts` (ex: `EnvironmentValidation.ts`, `ConfigValidation.ts`, `SourceValidation.ts`).
-   **Segue o padrão**: Arquivos no diretório `src/Tools` consistentemente terminam com `Tool.ts` (ex: `RSSConverterTool.ts`, `MangaConverterTool.ts`, `GmailSenderTool.ts`).
-   **Segue o padrão**: Arquivos no diretório `src/Modules` consistentemente terminam com `Module.ts` (ex: `SyncModule.ts`, `StoreModule.ts`, `ImportationModule.ts`).

-   **Viola o padrão**: O arquivo `src/App.ts` não segue a convenção de sufixo baseada em seu diretório (que seria a raiz `src`) ou em seu papel como orquestrador principal.
-   **Viola o padrão**: O arquivo `src/index.ts` não segue a convenção de sufixo.

## Organização de Arquivos por Tipo

### Descrição

Este padrão arquitetural envolve a organização do código-fonte em diretórios distintos, onde cada diretório agrupa arquivos ou módulos com responsabilidades ou tipos semelhantes. Isso cria uma estrutura de projeto clara e previsível, facilitando a localização de componentes específicos e a compreensão da finalidade de cada parte do sistema.

### Exemplos

-   **Segue o padrão**: Todos os serviços de infraestrutura ou utilitários de baixo nível (como manipulação de HTTP, sistema de arquivos temporários, controle de navegador) são agrupados no diretório `src/Services`.
-   **Segue o padrão**: Todas as classes utilitárias de propósito geral (como manipulação de arquivos, datas, sanitização) são agrupadas no diretório `src/Utils`.
-   **Segue o padrão**: Todas as classes responsáveis por lógica de validação são agrupadas no diretório `src/Validations`.
-   **Segue o padrão**: Classes que implementam funcionalidades específicas como importação, conversão ou envio, muitas vezes agindo como adaptadores, são agrupadas no diretório `src/Tools`.
-   **Segue o padrão**: Classes que orquestram fluxos de trabalho de alto nível ou representam funcionalidades principais da aplicação são agrupadas no diretório `src/Modules`.
-   **Segue o padrão**: Definições de tipos e interfaces são agrupadas no diretório `src/Protocols`.
-   **Segue o padrão**: Classes de exceção personalizadas são agrupadas no diretório `src/Exceptions`.
-   **Segue o padrão**: Classes que representam modelos de dados são agrupadas no diretório `src/Models`.

-   **Viola o padrão**: O arquivo `src/App.ts` reside na raiz do diretório `src`, em vez de ser agrupado com outros arquivos de orquestração ou inicialização, se existissem.
-   **Viola o padrão**: O arquivo `src/index.ts`, ponto de entrada da aplicação, reside na raiz do diretório `src`, em vez de ser agrupado em um diretório específico para inicialização ou configuração.

## Arquitetura em Camadas (Implícita)

### Descrição

Este padrão arquitetural, embora não estritamente imposto em todas as interações, é observado na forma como os componentes de nível superior orquestram e dependem de componentes de nível inferior para realizar tarefas. Existe uma tendência clara de dependência unidirecional, onde módulos de aplicação dependem de ferramentas e serviços de infraestrutura, mas não o contrário.

### Exemplos

-   **Segue o padrão**: A classe `App` (camada de aplicação/orquestração) depende e chama métodos de classes no diretório `Modules` (`SetupInputModule`, `ImportationModule`, `ConversionModule`, `SyncModule`, `StoreModule`), que representam a lógica de negócio de alto nível.
-   **Segue o padrão**: Classes no diretório `Modules` (lógica de negócio) dependem e utilizam classes no diretório `Tools` (adaptadores/funcionalidades específicas) para realizar operações como importação, conversão ou envio (ex: `ImportationModule` usa `RSSImporterTool` ou `MangaImporterTool`).
-   **Segue o padrão**: Classes no diretório `Tools` (adaptadores/funcionalidades específicas) dependem e utilizam classes no diretório `Services` (infraestrutura/utilitários) para realizar operações de baixo nível (ex: `RSSConverterTool` usa `ParserService`, `EbookGeneratorService`, `EbookCoverService`, `RSSContentEnricherService`, `QueueService`).

-   **Viola o padrão**: Não há violações claras e repetidas da direção das dependências (camadas inferiores chamando camadas superiores) observadas nos arquivos fornecidos. A estrutura parece manter a dependência fluindo de camadas mais altas para mais baixas.

## Separação de Responsabilidades

### Descrição

Este padrão arquitetural é evidente na forma como as classes e módulos são projetados para ter uma responsabilidade principal bem definida. Cada componente tende a focar em uma única tarefa ou domínio específico, minimizando o acoplamento e facilitando a manutenção e o entendimento do código.

### Exemplos

-   **Segue o padrão**: A classe `HttpService` é unicamente responsável por lidar com requisições HTTP.
-   **Segue o padrão**: A classe `TempFolderService` é unicamente responsável por gerenciar o diretório temporário (gerar, limpar, montar caminhos).
-   **Segue o padrão**: A classe `EbookGeneratorService` é responsável por gerar e converter arquivos de ebook usando ferramentas externas.
-   **Segue o padrão**: A classe `ParserService` é responsável por analisar (parsear) dados de feeds RSS.
-   **Segue o padrão**: A classe `SanitizationUtil` é responsável por sanitizar strings, especificamente nomes de arquivo.
-   **Segue o padrão**: As classes `RSSConverterTool` e `MangaConverterTool` são responsáveis por converter dados de seus respectivos tipos de fonte para o formato de documento final.

-   **Viola o padrão**: A classe `LocalStorageTool` (cuja responsabilidade principal é o armazenamento local) também inclui lógica para interagir com a API do Github Actions (`GithubActionsUtil.updateRepositoryFile`) para persistir o banco de dados em um ambiente específico. Isso mistura a responsabilidade de armazenamento com a responsabilidade de interação com uma plataforma de implantação.
-   **Viola o padrão**: A classe `RSSContentEnricherService` é responsável tanto por determinar qual tipo de conteúdo está sendo processado (`getContentTypeBySourceConfig`, `getEnricherByContentType`) quanto por implementar a lógica específica de enriquecimento para cada tipo (`enrichMediumContent`, `enrichDefaultContent`).
