## Convenção de Nomenclatura de Funções e Métodos

### Descrição

A codebase utiliza uma convenção de nomenclatura para funções e métodos, empregando prefixos que indicam a ação ou o tipo de dado que a função manipula. Prefixos comuns incluem:

*   `get`: Para recuperar ou obter dados.
*   `is`: Para verificar uma condição (retorna booleano).
*   `on`: Para lidar com eventos específicos (principalmente em handlers Alexa).
*   `turn`: Para converter dados de um formato para outro.
*   `build`: Para construir ou criar algo.
*   `canHandle`: Para verificar se um handler pode processar uma requisição.

### Exemplos

**Segue a convenção:**

```typescript
// Em examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Services/OpexService.ts
getSpoilerPageUrlByLandingPageHTML (html: string): string | null { ... }

// Em examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Utils/DateUtil.ts
isSameWeek (dateA: Date, dateB: Date): boolean { ... }

// Em examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/index.ts
async onLaunch ({ responseBuilder }: HandlerProps): Promise<HandlerResponse> { ... }

// Em examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Utils/DateUtil.ts
turnBRHumanDateIntoDate (BRHumanDate: string): Date { ... }

// Em examples/alexa-skills/src/Modules/HandlerAdapterModule.ts
canHandleCustomIntent (customIntentName: string): RequestHandler["canHandle"] { ... }
```

**Não segue a convenção (ou onde a convenção não se aplica diretamente, mas serve como contraste):**

Funções/métodos que não se encaixam diretamente nos prefixos comuns, como métodos de classes utilitárias que realizam uma ação específica sem recuperar/verificar/converter um estado claro, ou métodos privados que não seguem a convenção de prefixo de ação de forma estrita, embora a maioria ainda use `get`. Não há exemplos claros de quebra da convenção para métodos públicos comumente prefixados (`get`, `is`, `on`). O método `adapt` em `HandlerAdapterModule` é um exemplo de método público sem um prefixo de ação típico, pois seu nome descreve sua função principal.

```typescript
// Em examples/alexa-skills/src/Modules/HandlerAdapterModule.ts
adapt (handler: Handler): LambdaHandler { ... }

// Em examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Utils/SanitizationUtil.ts
sanitizeSpoilerContent (spoilerContent: string): string { ... } // Poderia ser `getSanitizedSpoilerContent` mas `sanitize` descreve melhor a ação
```

## Convenção de Nomenclatura de Arquivos e Classes

### Descrição

A codebase adota convenções de nomenclatura para arquivos e classes, frequentemente utilizando sufixos para indicar o propósito ou tipo do arquivo/classe.

*   Arquivos contendo classes de serviço geralmente terminam com `Service.ts` (e a classe interna `Service`).
*   Arquivos contendo classes ou objetos que coordenam múltiplos serviços ou encapsulam lógica de aplicação complexa terminam com `Module.ts` (e a classe interna `Module`).
*   Arquivos com funções utilitárias gerais ou helpers terminam com `Util.ts` (e a classe interna `Util`).
*   Arquivos que definem tipos e interfaces terminam com `Protocol.ts` (e os tipos/interfaces internos, embora a interface principal do arquivo possa ter um nome diferente do arquivo, como `Handler` em `HandlerProtocol.ts`).
*   Arquivos que definem constantes terminam com `Constant.ts`.
*   Arquivos de teste unitário terminam com `.unit.test.ts`.
*   Arquivos de teste de integração terminam com `.integration.test.ts`.
*   Classes e arquivos principais (como entry points de skills) utilizam PascalCase.

### Exemplos

**Segue a convenção:**

```typescript
// Em examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Services/OpexService.ts
class OpexService { ... } // Arquivo OpexService.ts

// Em examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Modules/OpexModule.ts
class OpexModule { ... } // Arquivo OpexModule.ts

// Em examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Utils/DateUtil.ts
class DateUtil { ... } // Arquivo DateUtil.ts

// Em examples/alexa-skills/src/Protocols/HandlerProtocol.ts
export type HandlerEvent = RequestEnvelope // Arquivo HandlerProtocol.ts

// Em examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Constants/SpoilerContentPhrasesConstant.ts
const SpoilerContentPhrasesConstant = { ... } // Arquivo SpoilerContentPhrasesConstant.ts

// Em examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Services/OpexService.unit.test.ts
// Arquivo OpexService.unit.test.ts

// Em examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Modules/OpexModule.integration.test.ts
// Arquivo OpexModule.integration.test.ts

// Em examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/index.ts
class OnePieceMangaSpoilerHandler extends HandlerModule { ... } // Arquivo index.ts (ponto de entrada da skill)
```

**Não segue a convenção (ou onde a convenção não se aplica):**

Arquivos de configuração ou o arquivo principal do serverless (`serverless.ts`) não seguem essa convenção de sufixo baseada em tipo, pois servem a propósitos diferentes da lógica de aplicação central.

```typescript
// Em examples/alexa-skills/src/Config/SkillConfig.ts
export const skillConfig: SkillConfig[] = [ ... ] // Arquivo de configuração

// Em examples/alexa-skills/serverless.ts
const serverlessConfiguration: AWS = { ... } // Arquivo de configuração do framework
```

## Padrão de Design Singleton

### Descrição

Diversas classes de serviço, utilitárias e de módulo são implementadas como Singletons. Elas são instanciadas uma única vez e exportadas como a exportação padrão do módulo, garantindo que haja apenas uma instância dessas classes em toda a aplicação. Isso é comum para serviços que não precisam de estado por instância e servem como pontos de acesso centralizados para funcionalidades específicas.

### Exemplos

**Segue o padrão Singleton:**

```typescript
// Em examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Services/OpexService.ts
class OpexService { ... }
export default new OpexService() // Instanciado e exportado como singleton

// Em examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Utils/DateUtil.ts
class DateUtil { ... }
export default new DateUtil() // Instanciado e exportado como singleton

// Em examples/alexa-skills/src/Modules/HandlerAdapterModule.ts
class HandlerAdapterModule { ... }
export default new HandlerAdapterModule() // Instanciado e exportado como singleton
```

**Não segue o padrão Singleton:**

A classe `HttpService` é instanciada explicitamente onde é necessária (`OpexModule`), permitindo que diferentes instâncias tenham configurações base diferentes (`baseURL`). Isso mostra que nem todos os serviços são Singletons, apenas aqueles que se beneficiam dessa abordagem.

```typescript
// Em examples/alexa-skills/src/Services/HttpService.ts
class HttpService { ... }
export default HttpService // A classe é exportada, não uma instância singleton

// Em examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Modules/OpexModule.ts
const httpService = new HttpService({ baseURL: OPEX_WEBSITE_BASE_URL }) // Instância criada localmente
```

## Padrão de Design Adapter

### Descrição

O `HandlerAdapterModule` atua como um Adapter, convertendo a interface de handlers definida na aplicação (`Handler`, estendida por `HandlerModule`) para a interface esperada pelo SDK da Alexa (`RequestHandler`, `ErrorHandler`). Ele encapsula a lógica de roteamento baseada no tipo e nome da requisição Alexa e chama os métodos correspondentes na instância do handler da aplicação.

### Exemplos

**Segue o padrão Adapter:**

```typescript
// Em examples/alexa-skills/src/Modules/HandlerAdapterModule.ts
import * as Alexa from "ask-sdk-core"
import { LambdaHandler, RequestHandler, ErrorHandler } from "ask-sdk-core"
import { Handler } from "@/Protocols/HandlerProtocol"

class HandlerAdapterModule {
	adapt (handler: Handler): LambdaHandler {
		const alexaHandler = Alexa.SkillBuilders.custom()

		// ... adaptação dos handlers da aplicação para os handlers do SDK ...
		const adaptedRequestHandlers = this.adaptRequestHandlers(handler)
		alexaHandler.addRequestHandlers(...adaptedRequestHandlers)

		// ... adaptação dos handlers de erro ...
		const adaptedErrorHandlers = this.adaptErrorHandlers(handler)
		alexaHandler.addErrorHandlers(...adaptedErrorHandlers)

		return alexaHandler.lambda()
	}

	private adaptRequestHandlers (handler: Handler): RequestHandler[] {
		return [
			{
				canHandle: (props) => Alexa.getRequestType(props.requestEnvelope) === "LaunchRequest",
				handle: async (props) => await handler.onLaunch(props) // Chama o método adaptado
			},
			// ... outros adapters para AMAZON.* intents e SessionEndedRequest ...
		]
	}

	// ... adaptErrorHandlers ...
}

export default new HandlerAdapterModule()
```

**Não segue o padrão Adapter (ou onde o padrão não se aplica):**

A classe `OpexService` não é um adapter; ela implementa diretamente a lógica de negócio para processar dados de web scraping.

```typescript
// Em examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Services/OpexService.ts
class OpexService {
	getSpoilerPageUrlByLandingPageHTML (html: string): string | null {
		// Implementa lógica de parsing HTML
		...
	}
	// ... outros métodos de lógica de negócio ...
}
```

## Arquitetura em Camadas

### Descrição

A codebase demonstra uma estrutura em camadas, separando as responsabilidades em diferentes níveis de abstração. Embora não seja uma arquitetura em camadas rígida formal, as preocupações são agrupadas logicamente:

*   **Camada de Apresentação/Entrada:** Handlers Alexa (`index.ts`, estendendo `HandlerModule`) que lidam com a interação direta com a plataforma Alexa, interpretam intents e constroem respostas de fala. `HandlerAdapterModule` faz parte dessa camada de entrada/adaptação.
*   **Camada de Aplicação/Módulo:** Classes de módulo (`OpexModule`) que coordenam operações usando serviços para realizar casos de uso específicos da aplicação (e.g., obter informações de spoiler).
*   **Camada de Serviço:** Serviços específicos (`OpexService`, `HttpService`, `CrawlerService`) que fornecem funcionalidades reutilizáveis relacionadas a domínios externos ou infraestrutura.
*   **Camada de Utilidade:** Funções genéricas e helpers (`DateUtil`, `SanitizationUtil`) que não estão ligadas a um domínio de negócio específico, mas auxiliam as camadas superiores.
*   **Camada de Configuração/Protocolo:** Arquivos que definem configurações globais, constantes e tipos de dados utilizados nas camadas acima.

### Exemplos

**Estrutura de diretórios mostrando as camadas:**

```
src/
├── Config/          // Configuração
├── Modules/         // Módulos de Aplicação
├── Protocols/       // Protocolos/Tipos
├── Services/        // Serviços de Infraestrutura/Domínio
├── Skills/          // Lógica específica de cada Skill (camada de apresentação/aplicação)
│   └── OnePieceMangaSpoiler/
│       ├── Constants/ // Constantes específicas da Skill
│       ├── Modules/   // Módulos específicos da Skill
│       ├── Protocols/ // Protocolos específicos da Skill
│       ├── Services/  // Serviços específicos da Skill
│       └── Utils/     // Utilitários específicos da Skill
└── Utils/           // Utilitários Gerais
```

**Exemplo de interação entre camadas:**

```typescript
// Camada de Aplicação (OpexModule) usa Camada de Serviço (HttpService, OpexService)
// Em examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Modules/OpexModule.ts
import OpexService from "@/Skills/OnePieceMangaSpoiler/Services/OpexService"
import HttpService from "@/Services/HttpService"

class OpexModule {
	async getSpoilerInfo (): Promise<SpoilerInfo> {
		const httpService = new HttpService({ baseURL: OPEX_WEBSITE_BASE_URL }) // Usa HttpService
		const landingPageHTML = await httpService.toString("") // Usa HttpService

		const spoilerPageUrl = OpexService.getSpoilerPageUrlByLandingPageHTML(landingPageHTML) // Usa OpexService

		// ... continua usando OpexService
		const spoilerInfo = OpexService.getSpoilerInfoBySpoilerPageHTML(spoilerPageHTML)

		return spoilerInfo
	}
}
```

**Não segue (Exemplo Contrário):**

Uma violação seria uma Camada de Apresentação/Entrada acessando diretamente um serviço de baixo nível como `HttpService` ou `CrawlerService` em vez de usar a camada de Módulo (`OpexModule`) que encapsula a lógica de negócio. No código fornecido, o handler (`OnePieceMangaSpoilerHandler`) usa `OpexModule` (`OpexModule.getSpoilerInfo()`), aderindo à estrutura em camadas.

```typescript
// Em examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/index.ts
import OpexModule from "@/Skills/OnePieceMangaSpoiler/Modules/OpexModule" // Correto: usa o módulo

class OnePieceMangaSpoilerHandler extends HandlerModule {
	async onLaunch ({ responseBuilder }: HandlerProps): Promise<HandlerResponse> {
		const spoilerInfo = await OpexModule.getSpoilerInfo() // Acessa a camada de Módulo
		// ...
	}
	// ...
}

// Exemplo de violação (hipotético):
// import HttpService from "@/Services/HttpService" // Incorreto: Camada de Apresentação acessando serviço de infraestrutura
// class OnePieceMangaSpoilerHandler {
//    async onLaunch(...) {
//        const httpService = new HttpService(...) // Violação
//        ...
//    }
// }
```

## Organização Modular

### Descrição

A codebase é organizada em módulos lógicos, onde cada módulo (representado por um diretório e seu conteúdo) agrupa arquivos relacionados a uma responsabilidade ou domínio específico. Isso promove a coesão dentro dos módulos e o baixo acoplamento entre eles. Exemplos de módulos incluem `Services`, `Modules`, `Utils`, `Protocols`, e sub-módulos específicos por skill dentro de `Skills`.

### Exemplos

**Segue a organização modular:**

```
// O diretório Services agrupa todos os serviços reutilizáveis de infraestrutura ou domínio genérico
examples/alexa-skills/src/Services/
├── CrawlerService.ts
└── HttpService.ts

// O diretório Utils agrupa funções utilitárias gerais
examples/alexa-skills/src/Utils/
├── HandlerUtil.ts
└── ServerlessUtil.ts

// A lógica específica da skill OnePieceMangaSpoiler está contida em seu próprio diretório
examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/
├── Constants/
├── Modules/
├── Protocols/
├── Services/
├── Utils/
└── index.ts
```

**Não segue a organização modular (Exemplo Contrário):**

Uma violação seria misturar arquivos de diferentes responsabilidades no mesmo diretório, como ter uma classe de serviço de infraestrutura (`HttpService`) dentro do diretório de uma skill específica, ou colocar constantes específicas de uma skill no diretório global `src/Config`.

```typescript
// Exemplo de violação (hipotético):
// examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/
// ├── HttpService.ts // Incorreto: Serviço genérico dentro do módulo da skill
// └── index.ts
```
No código fornecido, a estrutura de diretórios adere bem à organização modular.

## Separação de Interesses (SoC)

### Descrição

O código demonstra a Separação de Interesses (Separation of Concerns - SoC) ao designar responsabilidades distintas para classes e módulos específicos. Por exemplo, a comunicação HTTP é tratada pelo `HttpService`, o parsing de HTML pelo `CrawlerService`, a lógica de extração de informações de spoiler pelo `OpexService`, a adaptação para o SDK da Alexa pelo `HandlerAdapterModule`, e a lógica de lidar com intents da Alexa pelo `HandlerModule`/`OnePieceMangaSpoilerHandler`.

### Exemplos

**Segue o princípio de SoC:**

```typescript
// examples/alexa-skills/src/Services/HttpService.ts - Responsabilidade: Comunicação HTTP
class HttpService {
	async toString (url: string): Promise<string> { ... }
	async exists (url: string): Promise<boolean> { ... }
	// ... outros métodos HTTP
}

// examples/alexa-skills/src/Services/CrawlerService.ts - Responsabilidade: Parsing HTML e busca de elementos
class CrawlerService {
	findElements (input: FindElementsInput): Element[] { ... }
	findChildElement (input: FindChildElementInput): Element { ... }
}

// examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Services/OpexService.ts - Responsabilidade: Lógica de extração de informação de spoiler do HTML
class OpexService {
	getSpoilerPageUrlByLandingPageHTML (html: string): string | null { ... }
	getSpoilerInfoBySpoilerPageHTML (html: string): SpoilerInfo { ... }
	private getSpoilerInfoContentBySpoilerPageHTML (html: string): string | null { ... }
	// ... outras lógicas relacionadas ao spoiler
}
```

**Não segue o princípio de SoC (Exemplo Contrário):**

Uma violação seria uma única classe ou função tentar gerenciar múltiplas responsabilidades. Por exemplo, um `OpexService` que fizesse requisições HTTP *e* parsing HTML *e* lógica de sanitização *e* manipulação de datas diretamente, sem delegar essas tarefas a serviços ou utilitários especializados.

```typescript
// Exemplo de violação (hipotético):
// class OpexService {
//    async getSpoilerInfo(...) {
//        // Faz requisição HTTP aqui
//        const html = await axios.get(...);
//        // Faz parsing HTML aqui
//        const $ = cheerio.load(html);
//        // Faz sanitização aqui
//        const sanitized = rawContent.replace(...)
//        // Manipula datas aqui
//        const date = new Date(...)
//        // ... tudo em um só lugar
//    }
// }
```
No código fornecido, as responsabilidades são bem distribuídas entre as classes, aderindo ao SoC.

## Tratamento Centralizado de Erros (Entry Point)

### Descrição

Existe um padrão para lidar com erros capturando-os no ponto de entrada da aplicação (o handler da skill Alexa). O `HandlerAdapterModule` configura um `ErrorHandler` padrão (`canHandle: () => true`) que chama o método `onError` na instância do handler da skill. Isso permite que a lógica de tratamento de erros seja centralizada em um único local para toda a skill. No entanto, a propagação de erros das camadas inferiores (serviços, utilitários) não é explicitamente gerenciada com try/catch ou tipos de retorno específicos; presume-se que as exceções serão lançadas e capturadas pelo handler de erro central.

### Exemplos

**Segue o padrão de tratamento centralizado de erros no entry point:**

```typescript
// Em examples/alexa-skills/src/Modules/HandlerAdapterModule.ts
import { ErrorHandler } from "ask-sdk-core"
import { Handler } from "@/Protocols/HandlerProtocol"

class HandlerAdapterModule {
	// ... adaptRequestHandlers ...

	private adaptErrorHandlers (handler: Handler): ErrorHandler[] {
		return [
			{
				canHandle: () => true, // Captura todos os erros não tratados por outros handlers
				handle: async (props, error) => {
					console.error("Error handled by onError:", error); // Exemplo de log centralizado
					return await handler.onError(props, error) // Delega para o método onError da skill
				}
			}
		]
	}
}

// Em examples/alexa-skills/src/Modules/HandlerModule.ts
abstract class HandlerModule implements Handler {
    // ... outros métodos
    async onError ({ responseBuilder }: HandlerProps): Promise<HandlerResponse> {
        // Lógica padrão para tratamento de erro na skill
        console.log(`Error handled by onError.`); // Loga que o erro foi tratado
        return responseBuilder.getResponse(); // Pode retornar uma resposta de erro genérica para o usuário
    }
}

// Em examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/index.ts
class OnePieceMangaSpoilerHandler extends HandlerModule {
    // ... implementa onLaunch, onOnePieceMangaSpoilerIntent, etc.
    async onError ({ responseBuilder }: HandlerProps): Promise<HandlerResponse> {
        // Lógica específica de erro para esta skill, se necessário
        console.error("Specific Error in OnePieceMangaSpoilerHandler");
        const speakOutput = "Desculpe, tive problemas para fazer o que você pediu. Por favor, tente novamente.";
        return responseBuilder.speak(speakOutput).getResponse();
    }
}
```

**Não segue o padrão (Exemplo Contrário):**

Uma violação seria espalhar blocos `try...catch` extensivos e lógica de tratamento de erro duplicada em vários serviços ou utilitários, em vez de permitir que os erros sejam propagados para serem tratados centralmente pelo handler de erro da skill. Outra seria serviços que silenciam erros importantes sem logar ou re-lançar.

```typescript
// Exemplo de violação (hipotético em um Serviço):
// class OpexService {
//    async getSpoilerPageUrlByLandingPageHTML (...) {
//        try {
//            // Lógica...
//        } catch (error) {
//            console.error("Erro ao obter URL do spoiler", error);
//            return null; // Silencia o erro e pode mascarar o problema
//        }
//    }
// }
```
No código fornecido, os serviços e utilitários não contêm tratamento explícito de `try...catch` para erros de lógica ou dependência (como erros de rede no `HttpService` ou erros de parsing no `CrawlerService`/`OpexService`), confiando na propagação para o handler centralizado. O `HttpService.exists` é uma exceção, pois usa try/catch para implementar sua lógica booleana.
