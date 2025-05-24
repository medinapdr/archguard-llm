## Padrão: "Naming Conventions"

### Descrição

O código utiliza convenções de nomenclatura consistentes para diferentes tipos de arquivos e classes, indicando seu propósito ou responsabilidade. Classes e arquivos que fornecem funcionalidades de serviço geralmente terminam com "Service". Classes e arquivos que contêm funções auxiliares ou utilitárias terminam com "Util". Classes e arquivos que orquestram a lógica de negócio ou agrupam funcionalidades relacionadas terminam com "Module". Arquivos que definem constantes terminam com "Constant". Arquivos que definem tipos e interfaces terminam com "Protocol". Além disso, métodos que retornam valores booleanos frequentemente usam prefixos como "is" ou "canHandle", e métodos que lidam com eventos ou requisições específicas usam o prefixo "on".

### Exemplos

- Sufixos de arquivo/classe:
    - `OpexService.ts`, `HttpService.ts`, `CrawlerService.ts` (sufixo "Service")
    - `DateUtil.ts`, `SanitizationUtil.ts`, `HandlerUtil.ts`, `ServerlessUtil.ts` (sufixo "Util")
    - `OpexModule.ts`, `HandlerAdapterModule.ts`, `HandlerModule.ts` (sufixo "Module")
    - `SpoilerContentPhrasesConstant.ts` (sufixo "Constant")
    - `OpexProtocol.ts`, `CrawlerProtocol.ts`, `HandlerProtocol.ts`, `ServerlessProtocol.ts`, `HttpProtocol.ts`, `SkillProtocol.ts` (sufixo "Protocol")
- Prefixo para métodos booleanos:
    - `DateUtil.ts`: `isSameWeek`
    - `HandlerAdapterModule.ts`: `canHandleCustomIntent`
- Prefixo para métodos de handler/evento:
    - `HandlerModule.ts`: `onLaunch`, `onNo`, `onHelp`, `onCancelAndStop`, `onFallback`, `onSessionEnded`, `onIntentReflector`, `onError`

## Padrão: "File/Module Organization"

### Descrição

O código organiza arquivos e diretórios de forma estruturada, agrupando-os por tipo e por funcionalidade (skill específica). Arquivos que definem serviços globais ou compartilhados estão no diretório `/Services`. Arquivos que contêm funções utilitárias globais ou compartilhadas estão no diretório `/Utils`. Arquivos que definem módulos globais ou compartilhados estão no diretório `/Modules`. Arquivos que definem tipos e interfaces compartilhados estão no diretório `/Protocols`. A lógica e os recursos específicos de uma skill (como "OnePieceMangaSpoiler") são agrupados em um subdiretório dedicado dentro de `/Skills`, mantendo a mesma estrutura interna (`/Constants`, `/Modules`, `/Protocols`, `/Services`, `/Utils`).

### Exemplos

- Agrupamento por tipo global:
    - `/src/Services/HttpService.ts`
    - `/src/Utils/ServerlessUtil.ts`
    - `/src/Modules/HandlerModule.ts`
    - `/src/Protocols/HandlerProtocol.ts`
- Agrupamento por skill e tipo:
    - `/src/Skills/OnePieceMangaSpoiler/Constants/SpoilerContentPhrasesConstant.ts`
    - `/src/Skills/OnePieceMangaSpoiler/Modules/OpexModule.ts`
    - `/src/Skills/OnePieceMangaSpoiler/Protocols/OpexProtocol.ts`
    - `/src/Skills/OnePieceMangaSpoiler/Services/OpexService.ts`
    - `/src/Skills/OnePieceMangaSpoiler/Utils/DateUtil.ts`

## Padrão: "Layered Architecture"

### Descrição

O código demonstra uma separação de responsabilidades em camadas lógicas. A camada de "Handler" (representada por `HandlerModule` e suas implementações como `OnePieceMangaSpoilerHandler`) lida com a interface externa (requisições da Alexa) e a formatação das respostas, delegando a lógica de negócio principal para a camada de "Module". A camada de "Module" (como `OpexModule`) orquestra chamadas a serviços para executar tarefas complexas. A camada de "Service" (como `OpexService`, `HttpService`, `CrawlerService`) encapsula lógica técnica específica (acesso HTTP, parsing de HTML, extração de dados brutos). A camada de "Utility" (como `DateUtil`, `SanitizationUtil`) fornece funções auxiliares genéricas. A camada de "Protocol" define as estruturas de dados e interfaces usadas entre as camadas.

### Exemplos

- Handler delegando para Module:
    - `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/index.ts`: O método `onLaunch` chama `OpexModule.getSpoilerInfo()`.
- Module orquestrando Services:
    - `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Modules/OpexModule.ts`: O método `getSpoilerInfo` usa `HttpService` para buscar HTML e `OpexService` para extrair informações do HTML.
- Services encapsulando lógica técnica:
    - `examples/alexa-skills/src/Services/HttpService.ts`: Contém métodos para fazer requisições HTTP (`toString`, `toJSON`, etc.).
    - `examples/alexa-skills/src/Services/CrawlerService.ts`: Contém métodos para parsing de HTML (`findElements`, `findChildElement`).
    - `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Services/OpexService.ts`: Contém lógica específica para extrair dados de uma estrutura HTML particular.

## Padrão: "Separation of Concerns"

### Descrição

O código demonstra a separação de responsabilidades, onde cada classe ou módulo foca em uma única tarefa bem definida. Classes de serviço como `HttpService` e `CrawlerService` lidam exclusivamente com suas respectivas preocupações técnicas (HTTP e parsing de HTML). Classes utilitárias como `DateUtil` e `SanitizationUtil` contêm apenas funções auxiliares relacionadas a manipulação de datas e sanitização de texto, respectivamente. A lógica de negócio específica para obter informações de spoiler é dividida entre `OpexService` (extração de dados brutos do HTML) e `OpexModule` (orquestração da busca e extração). Os Handlers (como `OnePieceMangaSpoilerHandler`) focam na interação com a plataforma Alexa e na lógica de apresentação da resposta, delegando a obtenção dos dados para os módulos apropriados.

### Exemplos

- Serviço focado em HTTP:
    - `examples/alexa-skills/src/Services/HttpService.ts`: Contém apenas métodos relacionados a requisições HTTP.
- Serviço focado em parsing de HTML:
    - `examples/alexa-skills/src/Services/CrawlerService.ts`: Contém apenas métodos relacionados a encontrar elementos em HTML.
- Utilitário focado em datas:
    - `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Utils/DateUtil.ts`: Contém apenas funções para manipulação de datas.
- Handler focado na interação com a plataforma e delegação:
    - `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/index.ts`: O método `onLaunch` verifica o status do spoiler e constrói a resposta falada, mas chama `OpexModule.getSpoilerInfo()` para obter os dados do spoiler.
