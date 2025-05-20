## Convenções de Nomenclatura de Arquivos por Tipo

### Descrição

Este padrão define convenções de nomenclatura para arquivos com base no tipo de código que contêm. Arquivos que implementam um determinado tipo de funcionalidade ou contêm definições específicas seguem um sufixo consistente. Isso ajuda a identificar rapidamente o propósito de um arquivo e a manter a consistência em todo o projeto.

### Exemplos

- **Segue o padrão:**
  - `HttpService.ts`: Indica que o arquivo contém a implementação de um serviço HTTP.
  - `DateUtil.ts`: Indica que o arquivo contém funções utilitárias relacionadas a datas.
  - `OpexModule.ts`: Indica que o arquivo contém a implementação de um módulo específico.
  - `SpoilerContentPhrasesConstant.ts`: Indica que o arquivo contém definições de constantes.
  - `OpexProtocol.ts`: Indica que o arquivo contém definições de tipos ou interfaces (protocolos).
  - `OpexService.unit.test.ts`: Indica que o arquivo contém testes unitários para o `OpexService`.

- **Viola o padrão:**
  - `SkillConfig.ts`: Este arquivo contém dados de configuração, mas não segue um sufixo como `Config.ts` ou `Constant.ts` de forma consistente com outros tipos nomeados por sufixo. (Embora seja o único arquivo de configuração mostrado, ele não se alinha com a convenção de sufixo por tipo vista em outros lugares).

## Organização de Arquivos e Módulos por Tipo e Domínio

### Descrição

Este padrão estabelece uma estrutura de diretórios consistente onde os arquivos são agrupados com base no seu tipo (Serviços, Utilitários, Módulos, Protocolos, Constantes) e/ou no domínio específico ao qual pertencem (por exemplo, uma skill Alexa específica). Isso promove a modularidade, facilita a navegação no código e reforça a separação de preocupações.

### Exemplos

- **Segue o padrão:**
  - Arquivos de serviço gerais (`HttpService.ts`, `CrawlerService.ts`) são colocados no diretório `src/Services/`.
  - Arquivos utilitários gerais (`HandlerUtil.ts`, `ServerlessUtil.ts`) são colocados no diretório `src/Utils/`.
  - Arquivos de módulo gerais (`HandlerAdapterModule.ts`, `HandlerModule.ts`) são colocados no diretório `src/Modules/`.
  - Arquivos de protocolo (`CrawlerProtocol.ts`, `HandlerProtocol.ts`) são colocados no diretório `src/Protocols/`.
  - Arquivos específicos da skill `OnePieceMangaSpoiler` (`OpexService.ts`, `OpexModule.ts`, `DateUtil.ts`, `SanitizationUtil.ts`, `SpoilerContentPhrasesConstant.ts`, `OpexProtocol.ts`) são agrupados sob o diretório `src/Skills/OnePieceMangaSpoiler/`, com subdiretórios para seus tipos (`Services`, `Modules`, `Utils`, `Constants`, `Protocols`).

- **Viola o padrão:**
  - Não há exemplos claros de violação explícita deste padrão nos arquivos fornecidos, pois todos os arquivos mostrados parecem seguir a estrutura de diretórios baseada em tipo ou domínio da skill.

## Arquitetura em Camadas

### Descrição

Este padrão organiza o código em camadas lógicas, onde cada camada tem responsabilidades específicas e depende apenas das camadas abaixo dela. A estrutura observada sugere camadas como Apresentação/Entrada (Handlers), Aplicação/Orquestração (Módulos), Lógica de Negócio/Domínio (Serviços específicos) e Infraestrutura/Técnica (Serviços gerais, Utilitários). As dependências fluem predominantemente de cima para baixo.

### Exemplos

- **Segue o padrão:**
  - O `OnePieceMangaSpoilerHandler` (camada de Apresentação/Entrada) depende do `OpexModule` (camada de Aplicação/Orquestração) para obter as informações do spoiler.
  - O `OpexModule` (camada de Aplicação/Orquestração) depende do `OpexService` (camada de Lógica de Negócio/Domínio) para processar o HTML e do `HttpService` (camada de Infraestrutura/Técnica) para buscar o HTML.
  - O `OpexService` (camada de Lógica de Negócio/Domínio) depende do `CrawlerService` (camada de Infraestrutura/Técnica) para analisar o HTML e de `DateUtil` e `SanitizationUtil` (camada de Utilitários).

- **Viola o padrão:**
  - Não há exemplos claros de violação explícita deste padrão nos arquivos fornecidos, onde uma camada inferior dependa diretamente de uma camada superior.

## Separação de Preocupações

### Descrição

Este padrão garante que cada componente (classe, módulo, utilitário) tenha uma única responsabilidade bem definida. A lógica relacionada a diferentes aspectos do sistema (como fazer requisições HTTP, analisar HTML, manipular datas, lidar com a interação da Alexa, extrair informações específicas de um site) é segregada em unidades distintas.

### Exemplos

- **Segue o padrão:**
  - `HttpService` é responsável apenas por fazer requisições HTTP.
  - `CrawlerService` é responsável apenas por analisar HTML.
  - `DateUtil` é responsável apenas por manipulação de datas.
  - `SanitizationUtil` é responsável apenas por sanitizar strings.
  - `OpexService` é responsável pela lógica específica de extrair informações do HTML do site Opex, utilizando as ferramentas gerais fornecidas por `CrawlerService`, `DateUtil` e `SanitizationUtil`.
  - `OnePieceMangaSpoilerHandler` é responsável por lidar com os eventos da Alexa e formatar a resposta falada, utilizando o `OpexModule` para obter os dados necessários.

- **Viola o padrão:**
  - Não há exemplos claros de violação explícita deste padrão nos arquivos fornecidos, onde um componente misture responsabilidades amplamente diferentes e não relacionadas ao seu propósito principal.
