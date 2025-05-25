## Naming Conventions

Este padrão arquitetural é observado na aplicação de formatos de nomes consistentes e previsíveis para diferentes tipos de entidades no código.

-   **Classes de Serviço**: Classes que encapsulam lógica de negócios ou coordenação de operações são consistentemente nomeadas com o sufixo `Service`.
    -   Exemplos: `OpexService` (em `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Services/OpexService.ts`), `HttpService` (em `examples/alexa-skills/src/Services/HttpService.ts`), `CrawlerService` (em `examples/alexa-skills/src/Services/CrawlerService.ts`).
-   **Classes de Utilitários**: Classes que fornecem funções auxiliares ou de conveniência são consistentemente nomeadas com o sufixo `Util`.
    -   Exemplos: `DateUtil` (em `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Utils/DateUtil.ts`), `SanitizationUtil` (em `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Utils/SanitizationUtil.ts`), `HandlerUtil` (em `examples/alexa-skills/src/Utils/HandlerUtil.ts`), `ServerlessUtil` (em `examples/alexa-skills/src/Utils/ServerlessUtil.ts`).
-   **Classes de Módulos**: Classes que orquestram operações de alto nível ou adaptam interfaces são consistentemente nomeadas com o sufixo `Module`.
    -   Exemplos: `HandlerAdapterModule` (em `examples/alexa-skills/src/Modules/HandlerAdapterModule.ts`), `HandlerModule` (em `examples/alexa-skills/src/Modules/HandlerModule.ts`), `OpexModule` (em `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Modules/OpexModule.ts`).
-   **Constantes**: Arquivos ou objetos que contêm valores constantes são nomeados com o sufixo `Constant`.
    -   Exemplo: `SpoilerContentPhrasesConstant` (em `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Constants/SpoilerContentPhrasesConstant.ts`).
-   **Arquivos de Teste**: Arquivos de teste de unidade são nomeados com o sufixo `.unit.test.ts`, e arquivos de teste de integração com `.integration.test.ts`.
    -   Exemplos: `OpexService.unit.test.ts` (em `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Services/OpexService.unit.test.ts`), `OpexModule.integration.test.ts` (em `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Modules/OpexModule.integration.test.ts`), `DateUtil.unit.test.ts` (em `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Utils/DateUtil.unit.test.ts`).

## File/Module Organization

Este padrão arquitetural é evidenciado pela consistência estrutural na forma como os arquivos e módulos são agrupados e posicionados dentro do diretório do projeto, seguindo uma organização por tipo de responsabilidade ou funcionalidade.

-   **Agrupamento por Tipo**:
    -   Arquivos de configuração são armazenados em `/Config`. Exemplo: `SkillConfig.ts` (em `examples/alexa-skills/src/Config/SkillConfig.ts`).
    -   Serviços são agrupados em diretórios `/Services`. Exemplo: `HttpService.ts` (em `examples/alexa-skills/src/Services/HttpService.ts`), `CrawlerService.ts` (em `examples/alexa-skills/src/Services/CrawlerService.ts`).
    -   Módulos de alto nível ou adaptadores são agrupados em `/Modules`. Exemplo: `HandlerAdapterModule.ts` (em `examples/alexa-skills/src/Modules/HandlerAdapterModule.ts`), `HandlerModule.ts` (em `examples/alexa-skills/src/Modules/HandlerModule.ts`).
    -   Utilitários compartilhados são colocados em um diretório `/Utils` comum. Exemplo: `HandlerUtil.ts` (em `examples/alexa-skills/src/Utils/HandlerUtil.ts`), `ServerlessUtil.ts` (em `examples/alexa-skills/src/Utils/ServerlessUtil.ts`).
    -   Definições de tipos e interfaces são centralizadas em `/Protocols`. Exemplo: `CrawlerProtocol.ts` (em `examples/alexa-skills/src/Protocols/CrawlerProtocol.ts`), `HandlerProtocol.ts` (em `examples/alexa-skills/src/Protocols/HandlerProtocol.ts`).
-   **Agrupamento por Funcionalidade (dentro de `Skills`)**: Dentro do diretório `src/Skills`, cada funcionalidade (skill) tem seu próprio diretório, e dentro dele, os arquivos são novamente organizados por tipo.
    -   A skill `OnePieceMangaSpoiler` tem seu próprio diretório `src/Skills/OnePieceMangaSpoiler`.
    -   Dentro de `src/Skills/OnePieceMangaSpoiler`, há subpastas para:
        -   `Constants`: Para constantes específicas da skill. Exemplo: `SpoilerContentPhrasesConstant.ts` (em `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Constants/SpoilerContentPhrasesConstant.ts`).
        -   `Modules`: Para módulos específicos da skill. Exemplo: `OpexModule.ts` (em `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Modules/OpexModule.ts`).
        -   `Protocols`: Para definições de tipos e interfaces específicas da skill. Exemplo: `OpexProtocol.ts` (em `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Protocols/OpexProtocol.ts`).
        -   `Services`: Para serviços específicos da skill. Exemplo: `OpexService.ts` (em `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Services/OpexService.ts`).
        -   `Utils`: Para utilitários específicos da skill. Exemplo: `DateUtil.ts` (em `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Utils/DateUtil.ts`), `SanitizationUtil.ts` (em `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Utils/SanitizationUtil.ts`).

## Layered Architecture

Este padrão arquitetural é observado na clara separação de responsabilidades entre camadas lógicas, onde cada camada tem um papel distinto e se comunica com as camadas adjacentes de forma controlada.

-   **Camada de Apresentação/Interface (Handlers)**: Os arquivos `index.ts` dentro de cada skill (como `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/index.ts`) atuam como a camada de apresentação. Eles são responsáveis por:
    -   Receber requisições da plataforma Alexa (via `HandlerAdapterModule`).
    -   Delegar a lógica de negócios para módulos e serviços.
    -   Formatar as respostas a serem enviadas de volta para o usuário.
    -   Exemplo: Em `OnePieceMangaSpoilerHandler`, os métodos `onLaunch`, `onOnePieceMangaSpoilerIntent`, `onNo`, etc., chamam `OpexModule.getSpoilerInfo()` para obter dados e então usam `responseBuilder.speak()` para construir a resposta de voz. Eles não contêm a lógica de como os spoilers são obtidos ou processados.

-   **Camada de Lógica de Negócios (Modules)**: Os módulos (como `OpexModule` em `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Modules/OpexModule.ts`) contêm a lógica de negócios principal e orquestram as operações entre diferentes serviços. Eles são responsáveis por:
    -   Coordenar chamadas a serviços de nível inferior (como `HttpService` e `OpexService`).
    -   Aplicar regras de negócio para determinar o status ou conteúdo a ser retornado.
    -   Exemplo: `OpexModule.getSpoilerInfo()` coordena a obtenção do HTML via `HttpService`, a extração da URL da página de spoiler via `OpexService.getSpoilerPageUrlByLandingPageHTML`, e a extração das informações do spoiler via `OpexService.getSpoilerInfoBySpoilerPageHTML`.

-   **Camada de Serviços/Acesso a Dados (Services)**: Os serviços (como `OpexService` em `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Services/OpexService.ts`, `HttpService` em `examples/alexa-skills/src/Services/HttpService.ts`, e `CrawlerService` em `examples/alexa-skills/src/Services/CrawlerService.ts`) são responsáveis por operações específicas e de baixo nível, como acesso a dados externos ou manipulação de dados brutos.
    -   `HttpService`: Responsável exclusivamente por fazer requisições HTTP e retornar os dados em diferentes formatos (string, buffer, JSON, stream). Não contém lógica de negócios sobre o que fazer com os dados.
    -   `CrawlerService`: Responsável por manipular HTML, encontrar elementos e extrair informações. Não sabe o que essas informações significam em termos de negócio.
    -   `OpexService`: Responsável por extrair informações específicas de páginas HTML relacionadas a spoilers, como URLs, datas e conteúdo, utilizando o `CrawlerService`. Ele não faz as requisições HTTP diretamente, delegando essa responsabilidade ao `HttpService` (via `OpexModule`).

## Separation of Concerns

Este padrão arquitetural é observado na forma como cada módulo ou componente possui uma única e bem definida responsabilidade, evitando a mistura de lógicas distintas.

-   **Lógica de Requisição/Resposta vs. Lógica de Negócios**:
    -   Os `HandlerModule`s (como `OnePieceMangaSpoilerHandler` em `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/index.ts`) são responsáveis por lidar com os tipos de requisição da Alexa (`LaunchRequest`, `IntentRequest`, etc.) e formatar as respostas. Eles delegam a lógica de negócios complexa para os `Module`s.
    -   Exemplo: `onLaunch` em `OnePieceMangaSpoilerHandler` chama `OpexModule.getSpoilerInfo()` para obter os dados do spoiler e, com base no status retornado, constrói a frase de resposta. A lógica de como `getSpoilerInfo` funciona (fazer requisições HTTP, parsear HTML) está completamente separada em `OpexModule` e `OpexService`.

-   **Acesso a Dados/Crawling vs. Lógica de Negócios Específica**:
    -   `HttpService` (em `examples/alexa-skills/src/Services/HttpService.ts`) é responsável apenas por operações HTTP genéricas (GET, HEAD, etc.) e diferentes tipos de retorno (buffer, string, JSON, stream). Ele não tem conhecimento do domínio de "spoilers de One Piece" ou de como parsear HTML.
    -   `CrawlerService` (em `examples/alexa-skills/src/Services/CrawlerService.ts`) é responsável por operações de parsing de HTML genéricas (encontrar elementos, encontrar filhos). Ele não sabe o que é um "spoiler" ou "mangá".
    -   `OpexService` (em `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Services/OpexService.ts`) é responsável por extrair informações *específicas* de spoilers de One Piece de HTML, utilizando as capacidades genéricas de `CrawlerService`. Ele não faz as requisições HTTP, delegando isso ao `HttpService` (via `OpexModule`).

-   **Utilitários Genéricos vs. Lógica de Domínio**:
    -   `DateUtil` (em `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Utils/DateUtil.ts`) e `SanitizationUtil` (em `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Utils/SanitizationUtil.ts`) contêm funções utilitárias que podem ser aplicadas a diferentes contextos, como manipulação de datas ou sanitização de strings. Eles não contêm lógica de negócios sobre spoilers ou a interação com a Alexa.
    -   Exemplo: `OpexService` utiliza `SanitizationUtil.sanitizeSpoilerContent` para limpar o texto do spoiler, mas a lógica de *como* sanitizar está encapsulada em `SanitizationUtil`, e a lógica de *quando* sanitizar e *o que* sanitizar está em `OpexService`.
