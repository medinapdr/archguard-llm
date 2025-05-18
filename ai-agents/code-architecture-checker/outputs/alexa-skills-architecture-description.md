## Convenções de Nomenclatura

### Descrição

O código segue convenções de nomenclatura consistentes para diferentes tipos de componentes e funções. Classes que fornecem funcionalidades genéricas ou específicas de domínio são frequentemente nomeadas com sufixos como `Service` ou `Util`. Módulos que orquestram lógica ou adaptam frameworks são nomeados com o sufixo `Module`. Arquivos de definição de tipos são nomeados com o sufixo `Protocol`. Arquivos de constantes são nomeados com o sufixo `Constant`. Funções que recuperam dados geralmente começam com `get`, funções que verificam condições começam com `is` ou `canHandle`, e métodos de manipuladores de eventos começam com `on`.

### Exemplos

- **Segue:**
  - `OpexService.ts`, `HttpService.ts`, `CrawlerService.ts` (Sufixo `Service` para classes de funcionalidade).
  - `DateUtil.ts`, `SanitizationUtil.ts`, `HandlerUtil.ts`, `ServerlessUtil.ts` (Sufixo `Util` para classes de utilidade).
  - `OpexModule.ts`, `HandlerAdapterModule.ts`, `HandlerModule.ts` (Sufixo `Module` para classes de módulo/orquestração).
  - `OpexProtocol.ts`, `CrawlerProtocol.ts`, `HandlerProtocol.ts`, `ServerlessProtocol.ts`, `HttpProtocol.ts`, `SkillProtocol.ts` (Sufixo `Protocol` para definições de tipo).
  - `SpoilerContentPhrasesConstant.ts` (Sufixo `Constant` para constantes).
  - `getSpoilerPageUrlByLandingPageHTML`, `getSpoilerInfoBySpoilerPageHTML`, `getTodayDate` (Funções que recuperam dados começam com `get`).
  - `isSameWeek`, `canHandleCustomIntent` (Funções que verificam condições começam com `is` ou `canHandle`).
  - `onLaunch`, `onOnePieceMangaSpoilerIntent`, `onHelp` (Métodos de manipuladores de eventos começam com `on`).

- **Viola:** Nenhuma violação explícita das convenções de nomenclatura repetidas foi encontrada no código fornecido.

## Organização de Arquivos/Módulos

### Descrição

O código organiza arquivos e módulos em diretórios específicos com base em seu propósito ou domínio. Componentes genéricos ou de infraestrutura compartilhada (como serviços HTTP, utilitários gerais, definições de protocolo e configuração) residem em diretórios de nível superior (`src/Services`, `src/Utils`, `src/Protocols`, `src/Config`). A lógica específica de cada skill (habilidade da Alexa) é agrupada em um diretório dedicado dentro de `src/Skills/<SkillName>`, contendo seus próprios subdiretórios para constantes, protocolos, serviços, módulos e utilitários específicos da skill, além do ponto de entrada principal (`index.ts`). Arquivos de teste são colocados ao lado do código que testam, usando sufixos `.unit.test.ts` ou `.integration.test.ts`.

### Exemplos

- **Segue:**
  - `src/Services/HttpService.ts` e `src/Services/CrawlerService.ts` (Serviços genéricos em `src/Services`).
  - `src/Utils/DateUtil.ts` e `src/Utils/SanitizationUtil.ts` (Utilitários genéricos ou específicos de domínio em `src/Utils` ou `src/Skills/<SkillName>/Utils`).
  - `src/Protocols/OpexProtocol.ts` e `src/Protocols/HandlerProtocol.ts` (Definições de tipo em `src/Protocols` ou `src/Skills/<SkillName>/Protocols`).
  - `src/Config/SkillConfig.ts` (Configuração em `src/Config`).
  - `src/Skills/OnePieceMangaSpoiler/Services/OpexService.ts` (Serviço específico da skill em `src/Skills/<SkillName>/Services`).
  - `src/Skills/OnePieceMangaSpoiler/Modules/OpexModule.ts` (Módulo específico da skill em `src/Skills/<SkillName>/Modules`).
  - `src/Skills/OnePieceMangaSpoiler/index.ts` (Ponto de entrada da skill em `src/Skills/<SkillName>/index.ts`).
  - `src/Skills/OnePieceMangaSpoiler/Services/OpexService.unit.test.ts` (Teste unitário ao lado do serviço).

- **Viola:** Nenhuma violação explícita do padrão de organização de arquivos/módulos repetido foi encontrada no código fornecido.

## Arquitetura em Camadas

### Descrição

O código demonstra uma estrutura em camadas onde componentes de nível superior dependem de componentes de nível inferior, mas não o contrário. A lógica de interação com a Alexa (Manipuladores/Handlers) reside na camada mais alta, dependendo de Módulos e Utilitários. Módulos orquestram a lógica de negócio, dependendo de Serviços e outros Módulos. Serviços encapsulam detalhes de implementação ou interações externas (como HTTP ou crawling), dependendo de outros Serviços, Utilitários e Constantes. Utilitários, Constantes e Protocolos formam as camadas mais baixas, sendo dependidos por componentes de níveis superiores.

### Exemplos

- **Segue:**
  - `OnePieceMangaSpoilerHandler` (Camada Handler) depende de `OpexModule` (Camada Module) e `DateUtil` (Camada Util).
  - `OpexModule` (Camada Module) depende de `OpexService` (Camada Service) e `HttpService` (Camada Service).
  - `OpexService` (Camada Service) depende de `CrawlerService` (Camada Service), `DateUtil` (Camada Util), `SanitizationUtil` (Camada Util) e `SpoilerContentPhrasesConstant` (Camada Constant).
  - `HttpService` (Camada Service) depende de `HttpProtocol` (Camada Protocol).
  - `DateUtil` (Camada Util) não depende de componentes internos de níveis superiores.

- **Viola:** Nenhuma violação explícita do padrão de arquitetura em camadas repetido (dependência de camada inferior para superior) foi encontrada no código fornecido.

## Separação de Preocupações (SoC)

### Descrição

O código separa responsabilidades distintas em componentes dedicados. Cada classe ou módulo tende a focar em uma única preocupação ou um conjunto coeso de preocupações relacionadas. Por exemplo, há serviços dedicados para HTTP, crawling, lógica específica de scraping de um site, utilitários para datas ou sanitização, módulos para orquestração de lógica de negócio e manipuladores para a interação com a plataforma Alexa.

### Exemplos

- **Segue:**
  - `HttpService` lida exclusivamente com requisições HTTP.
  - `CrawlerService` lida exclusivamente com a análise e busca em HTML.
  - `DateUtil` lida exclusivamente com operações de data.
  - `SanitizationUtil` lida exclusivamente com a sanitização de strings.
  - `OpexService` lida com os detalhes específicos da extração de dados do site Opex.
  - `OpexModule` orquestra o processo de obtenção de informações do Opex, utilizando outros serviços.
  - `OnePieceMangaSpoilerHandler` lida com a lógica de resposta às requisições da Alexa.

- **Viola:** Nenhuma violação explícita do padrão de separação de preocupações repetido foi encontrada no código fornecido.
