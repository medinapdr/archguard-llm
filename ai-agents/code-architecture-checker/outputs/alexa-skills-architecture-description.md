Aqui estão os padrões arquiteturais identificados no codebase:

## Organização por Camadas/Responsabilidades

### Descrição

O código está estruturado em diretórios que agrupam arquivos com responsabilidades semelhantes. Esta organização facilita a separação de preocupações e a navegabilidade no projeto. Diretórios como `Services`, `Modules`, `Utils`, `Config`, `Protocols` e `Skills` indicam a intenção de segregar diferentes tipos de lógica e configuração.

### Exemplos

*   **Segue o padrão:**
    ```
    examples/alexa-skills/src/
    ├── Config/          # Configurações globais ou específicas
    │   └── SkillConfig.ts
    ├── Modules/         # Camada de orquestração ou lógica de alto nível
    │   ├── HandlerAdapterModule.ts
    │   └── HandlerModule.ts
    ├── Protocols/       # Definições de tipos e interfaces
    │   ├── CrawlerProtocol.ts
    │   ├── HandlerProtocol.ts
    │   ├── HttpProtocol.ts
    │   ├── ServerlessProtocol.ts
    │   └── SkillProtocol.ts
    ├── Services/        # Camada de serviços externos ou lógicas específicas e reusáveis
    │   ├── CrawlerService.ts
    │   └── HttpService.ts
    ├── Skills/          # Agrupa código específico por funcionalidade (skill)
    │   └── OnePieceMangaSpoiler/
    │       ├── Constants/
    │       │   └── SpoilerContentPhrasesConstant.ts
    │       ├── index.ts          # Ponto de entrada da skill
    │       ├── Modules/
    │       │   └── OpexModule.ts
    │       ├── Protocols/
    │       │   └── OpexProtocol.ts
    │       ├── Services/
    │       │   └── OpexService.ts
    │       └── Utils/
    │           ├── DateUtil.ts
    │           └── SanitizationUtil.ts
    └── Utils/           # Funções utilitárias gerais
        ├── HandlerUtil.ts
        └── ServerlessUtil.ts
    ```
*   **Não segue o padrão:** (Exemplo hipotético)
    ```
    examples/alexa-skills/src/
    ├── main.ts        # Contém lógica de HTTP, Crawler, Handler e Utils misturadas
    ├── types.ts       # Contém protocolos e configurações
    └── helpers.ts     # Contém utilitários e serviços
    ```

## Convenção de Nomenclatura por Sufixo

### Descrição

Arquivos e classes são nomeados com um sufixo que descreve sua função principal dentro da arquitetura. Isso inclui sufixos como `Service`, `Module`, `Util`, `Constant` e `Protocol`. Esta convenção melhora a clareza e a previsibilidade da codebase, permitindo identificar rapidamente o propósito de um arquivo ou classe.

### Exemplos

*   **Segue o padrão:**
    ```typescript
    // Arquivo: examples/alexa-skills/src/Services/CrawlerService.ts
    class CrawlerService { /* ... */ }
    export default new CrawlerService()

    // Arquivo: examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Modules/OpexModule.ts
    class OpexModule { /* ... */ }
    export default new OpexModule()

    // Arquivo: examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Utils/DateUtil.ts
    class DateUtil { /* ... */ }
    export default new DateUtil()

    // Arquivo: examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Constants/SpoilerContentPhrasesConstant.ts
    const SpoilerContentPhrasesConstant = { /* ... */ }
    export default SpoilerContentPhrasesConstant

    // Arquivo: examples/alexa-skills/src/Protocols/HandlerProtocol.ts
    export type HandlerEvent = RequestEnvelope
    // ...
    ```
*   **Não segue o padrão:** (Exemplo hipotético)
    ```typescript
    // Arquivo: examples/alexa-skills/src/Core/Crawler.ts // Deveria ser CrawlerService
    class Crawler { /* ... */ }

    // Arquivo: examples/alexa-skills/src/Operations/Opex.ts // Deveria ser OpexModule
    class Opex { /* ... */ }

    // Arquivo: examples/alexa-skills/src/Helpers/Date.ts // Deveria ser DateUtil
    class Date { /* ... */ }
    ```

## Padrão Singleton para Serviços e Utilitários

### Descrição

Muitas classes que representam serviços ou conjuntos de funções utilitárias são implementadas como Singletons, sendo exportadas como uma única instância. Isso garante que haja apenas uma instância desses recursos compartilhados durante a execução da aplicação.

### Exemplos

*   **Segue o padrão:**
    ```typescript
    // Arquivo: examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Utils/DateUtil.ts
    class DateUtil { /* ... */ }
    export default new DateUtil() // Exporta uma única instância

    // Arquivo: examples/alexa-skills/src/Services/CrawlerService.ts
    class CrawlerService { /* ... */ }
    export default new CrawlerService() // Exporta uma única instância
    ```
*   **Não segue o padrão:** (Exemplo hipotético - `HttpService` não é um singleton na sua definição, embora a forma como é usado em `OpexModule` poderia sugerir uma intenção de Singleton para a instância *associada* a uma URL base, mas não para a classe em si)
    ```typescript
    // Arquivo: examples/alexa-skills/src/Services/HttpService.ts
    // Esta classe é instanciada onde é necessária, não exportada como uma única instância global.
    class HttpService {
        constructor (options: HttpOptions) { /* ... */ }
        // ...
    }
    export default HttpService // Exporta a classe, não uma instância
    ```

## Convenção de Nomenclatura para Métodos de Acesso a Dados/Estado

### Descrição

Métodos responsáveis por obter dados ou informações frequentemente utilizam o prefixo `get`. Esta convenção é observada em classes de `Service` e `Module` que interagem com fontes de dados externas (como páginas web ou APIs simuladas).

### Exemplos

*   **Segue o padrão:**
    ```typescript
    // Arquivo: examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Services/OpexService.ts
    class OpexService {
        getSpoilerPageUrlByLandingPageHTML (html: string): string | null { /* ... */ }
        getSpoilerInfoBySpoilerPageHTML (html: string): SpoilerInfo { /* ... */ }
        private getSpoilerInfoDateBySpoilerPageHTML (html: string): Date | null { /* ... */ }
        private getSpoilerInfoStatusBySpoilerPageHTML (html: string): SpoilerInfo["status"] { /* ... */ }
        private getSpoilerInfoContentBySpoilerPageHTML (html: string): string | null { /* ... */ }
    }

    // Arquivo: examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Modules/OpexModule.ts
    class OpexModule {
        async getSpoilerInfo (): Promise<SpoilerInfo> { /* ... */ }
    }

    // Arquivo: examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Utils/DateUtil.ts
    class DateUtil {
        getDateWeekDay (date: Date): number { /* ... */ } // Usa 'get'
        getTodayDate (): Date { /* ... */ } // Usa 'get'
    }
    ```
*   **Não segue o padrão:** (Exemplo hipotético)
    ```typescript
    // Arquivo: examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Modules/OpexModule.ts
    class OpexModule {
        async fetchSpoilerDetails (): Promise<SpoilerInfo> { /* ... */ } // Usa 'fetch' em vez de 'get'
    }

    // Arquivo: examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Services/OpexService.ts
    class OpexService {
        retrieveSpoilerUrl (html: string): string | null { /* ... */ } // Usa 'retrieve' em vez de 'get'
    }
    ```

## Padrão Adapter

### Descrição

O `HandlerAdapterModule` implementa o padrão Adapter para permitir que as classes de Handler personalizadas (`OnePieceMangaSpoilerHandler`, que estendem `HandlerModule`) sejam utilizadas pelo SDK da Alexa, que espera uma interface específica (`RequestHandler`, `ErrorHandler`). Ele traduz as chamadas do SDK (`canHandle`, `handle`) para os métodos definidos na interface `Handler` (`onLaunch`, `onHelp`, etc.).

### Exemplos

*   **Segue o padrão:**
    ```typescript
    // Arquivo: examples/alexa-skills/src/Modules/HandlerAdapterModule.ts
    class HandlerAdapterModule {
        adapt (handler: Handler): LambdaHandler {
            const alexaHandler = Alexa.SkillBuilders.custom()
            // Adapta handlers customizados e handlers padrão
            alexaHandler.addRequestHandlers(...handler.customRequestHandlers)
            alexaHandler.addRequestHandlers(...this.adaptRequestHandlers(handler))
            // Adapta handlers de erro
            alexaHandler.addErrorHandlers(...this.adaptErrorHandlers(handler))
            return alexaHandler.lambda()
        }

        private adaptRequestHandlers (handler: Handler): RequestHandler[] {
            return [
                {
                    canHandle: (props) => (Alexa.getRequestType(props.requestEnvelope) === "LaunchRequest"),
                    handle: async (props) => await handler.onLaunch(props) // Chama o método do handler adaptado
                },
                // ... outros adapters de RequestHandler
            ]
        }
        // ... outros métodos adaptadores
    }
    export default new HandlerAdapterModule()
    ```
*   **Não segue o padrão:** (Exemplo hipotético)
    ```typescript
    // Se a lógica de interação direta com o SDK da Alexa estivesse misturada dentro da classe OnePieceMangaSpoilerHandler, sem um adaptador intermediário.
    // Arquivo: examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/index.ts
    // class OnePieceMangaSpoilerHandler implements RequestHandler { // Implementando diretamente a interface do SDK
    //    canHandle(props): boolean { // Lógica específica do SDK aqui }
    //    handle(props): Response { // Lógica específica do SDK aqui }
    //    // ... misturado com a lógica de negócio da skill
    // }
    ```

## Padrão Template Method / Estrutura de Manipulação de Eventos

### Descrição

A classe abstrata `HandlerModule` define uma estrutura (um "template") para manipular eventos comuns da Alexa (LaunchRequest, IntentRequest, SessionEndedRequest, etc.) através de métodos pré-definidos como `onLaunch`, `onHelp`, `onCancelAndStop`, etc. As classes de skills concretas (`OnePieceMangaSpoilerHandler`) herdam de `HandlerModule` e substituem (ou adicionam) a lógica específica para esses métodos. O `HandlerAdapterModule` utiliza essa estrutura chamando os métodos `on*` apropriados em resposta aos eventos do SDK da Alexa. Além disso, permite a adição de handlers customizados via `customRequestHandlers`, que podem ser vistos como "estratégias" específicas para Intents customizadas.

### Exemplos

*   **Segue o padrão:**
    ```typescript
    // Arquivo: examples/alexa-skills/src/Modules/HandlerModule.ts
    abstract class HandlerModule implements Handler {
        // Métodos "template" a serem implementados ou substituídos pelas subclasses
        async onLaunch ({ responseBuilder }: HandlerProps): Promise<HandlerResponse> {
            return responseBuilder.getResponse() // Implementação padrão vazia
        }
        async onHelp ({ responseBuilder }: HandlerProps): Promise<HandlerResponse> {
            return responseBuilder.getResponse() // Implementação padrão vazia
        }
        // ... outros métodos on*
        abstract customRequestHandlers: Handler["customRequestHandlers"] // Obrigatório para subclasses definirem handlers customizados
    }

    // Arquivo: examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/index.ts
    class OnePieceMangaSpoilerHandler extends HandlerModule { // Herda a estrutura
        customRequestHandlers: HandlerModule["customRequestHandlers"] = [
            {
                canHandle: HandlerAdapterModule.canHandleCustomIntent("OnePieceMangaSpoilerIntent"),
                handle: async (props) => await this.onOnePieceMangaSpoilerIntent(props) // Chama um método específico
            }
        ]
        async onLaunch ({ responseBuilder }: HandlerProps): Promise<HandlerResponse> {
            // Implementa a lógica específica para LaunchRequest
            const spoilerInfo = await OpexModule.getSpoilerInfo()
            // ... lógica
        }
        // ... substitui ou implementa outros métodos on*
    }
    ```
*   **Não segue o padrão:** (Exemplo hipotético)
    ```typescript
    // Se cada skill tivesse que implementar toda a lógica de manipulação de eventos da Alexa do zero, sem herdar de HandlerModule.
    // Arquivo: examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/index.ts
    // class OnePieceMangaSpoilerHandler { // Não herda de HandlerModule
    //     // Toda a lógica de canHandle/handle do SDK da Alexa teria que ser implementada diretamente aqui
    //     // Ou a lógica on* teria que ser chamada manualmente sem a estrutura base.
    // }
    ```

## Convenção de Nomenclatura para Event Handlers da Alexa

### Descrição

Os métodos dentro das classes que herdam de `HandlerModule` (ou implementam a interface `Handler`) e que são responsáveis por responder a eventos específicos da Alexa (Intents padrão ou customizadas, LaunchRequest, SessionEndedRequest) utilizam o prefixo `on`.

### Exemplos

*   **Segue o padrão:**
    ```typescript
    // Arquivo: examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/index.ts
    class OnePieceMangaSpoilerHandler extends HandlerModule {
        async onLaunch ({ responseBuilder }: HandlerProps): Promise<HandlerResponse> { /* ... */ }
        async onOnePieceMangaSpoilerIntent ({ responseBuilder }: HandlerProps): Promise<HandlerResponse> { /* ... */ }
        async onNo ({ responseBuilder }: HandlerProps): Promise<HandlerResponse> { /* ... */ }
        async onHelp ({ responseBuilder }: HandlerProps): Promise<HandlerResponse> { /* ... */ }
        async onCancelAndStop ({ responseBuilder }: HandlerProps): Promise<HandlerResponse> { /* ... */ }
        // ... outros métodos com prefixo 'on'
    }
    ```
*   **Não segue o padrão:** (Exemplo hipotético)
    ```typescript
    // Arquivo: examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/index.ts
    class OnePieceMangaSpoilerHandler extends HandlerModule {
        async handleLaunchRequest ({ responseBuilder }: HandlerProps): Promise<HandlerResponse> { /* ... */ } // Não usa prefixo 'on'
        async onePieceIntent ({ responseBuilder }: HandlerProps): Promise<HandlerResponse> { /* ... */ } // Não usa prefixo 'on'
    }
    ```

## Convenção de Nomenclatura para Constantes

### Descrição

Objetos que agrupam valores constantes são nomeados com PascalCase e terminam com o sufixo `Constant`. As chaves (propriedades) dentro desses objetos utilizam a convenção SCREAMING_SNAKE_CASE.

### Exemplos

*   **Segue o padrão:**
    ```typescript
    // Arquivo: examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Constants/SpoilerContentPhrasesConstant.ts
    const SpoilerContentPhrasesConstant = { // PascalCase + Constant suffix
        ALL_SPOILER_IMAGES: "Todas as imagens", // SCREAMING_SNAKE_CASE
        END_OF_SPOILER: "Fim do Capítulo", // SCREAMING_SNAKE_CASE
        START_OF_SPOILER: "Capítulo" // SCREAMING_SNAKE_CASE
    }
    export default SpoilerContentPhrasesConstant
    ```
*   **Não segue o padrão:** (Exemplo hipotético)
    ```typescript
    // Arquivo: examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Constants/SpoilerContentPhrases.ts // Sem sufixo Constant
    const spoilerContentPhrases = { // camelCase
        allSpoilerImages: "Todas as imagens", // camelCase
        endOfSpoiler: "Fim do Capítulo", // camelCase
        startOfSpoiler: "Capítulo" // camelCase
    }
    export default spoilerContentPhrases
    ```

## Organização por Funcionalidade Específica (Skills)

### Descrição

O código relacionado a uma skill específica (como "OnePieceMangaSpoiler") é agrupado em um diretório próprio dentro de `src/Skills`. Este diretório contém subdiretórios para `Constants`, `Modules`, `Protocols`, `Services` e `Utils` que são específicos para essa skill. Isso promove a coesão do código dentro de cada skill e facilita a adição de novas skills no futuro.

### Exemplos

*   **Segue o padrão:**
    ```
    examples/alexa-skills/src/Skills/
    ├── OnePieceMangaSpoiler/     # Diretório para a skill "OnePieceMangaSpoiler"
    │   ├── Constants/
    │   │   └── SpoilerContentPhrasesConstant.ts
    │   ├── index.ts              # Ponto de entrada da skill
    │   ├── Modules/
    │   │   └── OpexModule.ts
    │   ├── Protocols/
    │   │   └── OpexProtocol.ts
    │   ├── Services/
    │   │   └── OpexService.ts
    │   └── Utils/
    │       ├── DateUtil.ts
    │       └── SanitizationUtil.ts
    └── AnotherSkill/             # Diretório para outra skill (hipotético)
        ├── Constants/
        ├── index.ts
        ├── Modules/
        ├── Protocols/
        ├── Services/
        └── Utils/
    ```
*   **Não segue o padrão:** (Exemplo hipotético)
    ```
    examples/alexa-skills/src/
    ├── Services/
    │   ├── CrawlerService.ts
    │   ├── HttpService.ts
    │   └── OpexService.ts        # Serviço de Opex misturado com serviços gerais
    ├── Modules/
    │   ├── HandlerAdapterModule.ts
    │   ├── HandlerModule.ts
    │   └── OpexModule.ts         # Módulo de Opex misturado com módulos gerais
    ├── Utils/
    │   ├── DateUtil.ts           # Utilitário de Data misturado com utilitários gerais
    │   ├── SanitizationUtil.ts   # Utilitário de Sanitização misturado
    │   ├── HandlerUtil.ts
    │   └── ServerlessUtil.ts
    └── index.ts                 # Ponto de entrada principal que gerencia todas as skills sem separação em diretórios dedicados
    ```

## Padrão de Teste (Describe/Test)

### Descrição

Os arquivos de teste unitário e de integração seguem uma estrutura consistente utilizando blocos `describe` para agrupar testes por funcionalidade ou unidade sob teste e blocos `test` (ou `it`) para definir casos de teste individuais com nomes descritivos.

### Exemplos

*   **Segue o padrão:**
    ```typescript
    // Arquivo: examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Services/OpexService.unit.test.ts
    describe("OpexService", () => { // Descreve a unidade sob teste
        describe("getSpoilerPageUrlByLandingPageHTML()", () => { // Descreve o método sob teste
            test("Should get spoiler page url when there is a spoiler/manga available", async () => { // Caso de teste específico
                // ... teste
            })
            test("Should receive null when there is no spoiler/manga available", async () => { // Outro caso de teste
                // ... teste
            })
        })
        describe("getSpoilerInfoBySpoilerPageHTML()", () => { // Outro método sob teste
            test("Should get content if there is a spoiler/manga available", async () => { // Caso de teste
                // ... teste
            })
            // ... mais testes para este método
        })
    })
    ```
*   **Não segue o padrão:** (Exemplo hipotético)
    ```typescript
    // Arquivo: examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Services/OpexService.unit.test.ts
    // Testes misturados sem describe ou com nomes pouco claros
    test("test OpexService function 1", async () => { /* ... */ })
    test("test OpexService function 2", async () => { /* ... */ })
    // ...
    ```
