## Convenção de Nomenclatura de Classes por Diretório

### Descrição

Existe uma convenção de nomenclatura consistente onde o sufixo do nome de uma classe corresponde ao diretório em que ela está localizada, indicando seu papel ou tipo dentro da arquitetura. Classes em `src/Services/` terminam em `Service`, em `src/Validations/` terminam em `Validation`, em `src/Tools/*/` terminam em `Tool`, em `src/Modules/` terminam em `Module` e em `src/Utils/` terminam em `Util`.

### Exemplos

-   **Segue o padrão:**
    -   `src/Services/HttpService.ts` define a classe `HttpService`.
    -   `src/Validations/ConfigValidation.ts` define a classe `ConfigValidation`.
    -   `src/Tools/Converters/RSSConverterTool.ts` define a classe `RSSConverterTool`.
    -   `src/Modules/ImportationModule.ts` define a classe `ImportationModule`.
    -   `src/Utils/FileUtil.ts` define a classe `FileUtil`.

-   **Viola o padrão:** Não foram encontradas violações explícitas deste padrão de nomenclatura de classes nos arquivos fornecidos. Todas as classes dentro dos diretórios designados seguem consistentemente a convenção de sufixo.

## Organização de Arquivos e Módulos por Tipo

### Descrição

Os arquivos de implementação são organizados em diretórios específicos com base em seu papel principal ou tipo de funcionalidade. Lógicas de infraestrutura e utilitários reutilizáveis estão em `src/Services/`, lógicas de validação em `src/Validations/`, lógicas de domínio específicas (importadores, conversores, remetentes, armazenamentos) em `src/Tools/`, lógicas de orquestração de alto nível em `src/Modules/` e funções auxiliares gerais em `src/Utils/`. Arquivos de teste (`*.test.ts`) são colocados no mesmo diretório que o arquivo de implementação que eles testam.

### Exemplos

-   **Segue o padrão:**
    -   `src/Services/QueueService.ts` contém a implementação de um serviço de fila.
    -   `src/Validations/EnvironmentValidation.ts` contém a lógica para validar o ambiente.
    -   `src/Tools/Importers/MangaImporterTool.ts` contém a lógica para importar mangás.
    -   `src/Modules/StoreModule.ts` contém a lógica para gerenciar o estado de sincronização.
    -   `src/Utils/DateUtil.ts` contém funções utilitárias relacionadas a datas.
    -   `src/Services/HttpProxyService.integration.test.ts` é um arquivo de teste para `HttpProxyService` e está no mesmo diretório.

-   **Viola o padrão:** Não foram encontradas violações explícitas deste padrão de organização de arquivos de implementação nos arquivos fornecidos. Todos os arquivos de implementação parecem estar localizados no diretório apropriado com base em seu conteúdo e nome.

## Arquitetura em Camadas

### Descrição

O código segue uma estrutura em camadas onde a aplicação principal (`App`) orquestra módulos de alto nível (`Modules`). Esses módulos, por sua vez, utilizam ferramentas de domínio específicas (`Tools`) e serviços de infraestrutura/utilitários (`Services`, `Utils`). As dependências geralmente fluem para baixo, de camadas superiores para inferiores (por exemplo, `Modules` dependem de `Tools` e `Services`, `Tools` dependem de `Services` e `Utils`).

### Exemplos

-   **Segue o padrão:**
    -   `App.ts` instancia e chama métodos em `SetupInputModule`, `ImportationModule`, `ConversionModule`, `SyncModule` e `StoreModule` (dependência de `App` para `Modules`).
    -   `ImportationModule.ts` utiliza `RSSImporterTool` e `MangaImporterTool` (dependência de `Modules` para `Tools`).
    -   `RSSImporterTool.ts` utiliza `HttpService` (dependência de `Tools` para `Services`).
    -   `HttpService.ts` utiliza `HttpProxyService` (dependência de `Services` para `Services`).
    -   `RSSConverterTool.ts` utiliza `TempFolderService`, `ParserService`, `EbookGeneratorService`, `EbookCoverService`, `RSSContentEnricherService`, `QueueService` (dependência de `Tools` para `Services`).

-   **Viola o padrão:** Não foram encontradas violações explícitas onde uma camada inferior depende de uma camada superior nos arquivos fornecidos.

## Separação de Responsabilidades com Lógica de Domínio em Serviços

### Descrição

Embora haja uma tentativa geral de separar as responsabilidades em componentes distintos (validação, infraestrutura, ferramentas de domínio, orquestração), existe um padrão repetido onde lógica de domínio específica, que poderia ser esperada em uma camada de "ferramentas" ou "domínio", é implementada dentro de classes localizadas no diretório `src/Services/`. Isso borra a linha entre serviços de infraestrutura reutilizáveis e lógica de negócio específica da aplicação.

### Exemplos

-   **Segue o padrão:**
    -   `ConfigValidation.ts` contém apenas lógica de validação de configuração.
    -   `HttpService.ts` contém apenas lógica de cliente HTTP.
    -   `RSSImporterTool.ts` contém a lógica para importar dados RSS, utilizando um `HttpService` para a preocupação de infraestrutura.

-   **Viola o padrão:**
    -   `MeusMangasImporterService.ts` está no diretório `src/Services/` mas contém lógica de domínio específica para analisar a estrutura do site MeusMangas (`searchManga`, `searchMangaChapters`, `getRawChaptersByMangaPath`, `getRawChapterPictures`), que é altamente acoplada à fonte de dados específica e poderia ser considerada lógica de importação de domínio, mais adequada a uma `ImporterTool`.
    -   `RSSContentEnricherService.ts` está no diretório `src/Services/` mas contém lógica de domínio específica para enriquecer o conteúdo RSS com base no tipo de fonte (`enrichMediumContent`, `enrichDefaultContent`), que é lógica de negócio relacionada ao processo de conversão de RSS e poderia ser mais adequada a uma `ConverterTool` ou um helper específico para essa ferramenta.
