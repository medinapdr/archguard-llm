```
## Organização de Arquivos por Tipo e Feature

### Descrição

Os arquivos do código são organizados em diretórios que refletem seu tipo funcional (e.g., `Services`, `Utils`, `Protocols`) e, para lógica específica de uma feature ou skill, são agrupados adicionalmente sob um diretório dedicado à skill (`Skills/<SkillName>`). Isso cria uma estrutura hierárquica onde a lógica genérica reside em diretórios de tipo na raiz de `src`, enquanto a lógica específica de uma skill reside em diretórios de tipo dentro do diretório da skill.

### Exemplos

- Arquivos de serviço específicos de uma skill: `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Services/OpexService.ts`
- Arquivos de utilitário específicos de uma skill: `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Utils/DateUtil.ts`
- Arquivos de protocolo específicos de uma skill: `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Protocols/OpexProtocol.ts`
- Arquivos de serviço genéricos: `examples/alexa-skills/src/Services/HttpService.ts`
- Arquivos de utilitário genéricos: `examples/alexa-skills/src/Utils/HandlerUtil.ts`

```
## Convenção de Nomenclatura de Testes

### Descrição

Arquivos de teste seguem uma convenção de nomenclatura específica: `<NomeDoArquivoOriginal>.<TipoDeTeste>.test.ts`. O `<TipoDeTeste>` indica o escopo ou a natureza do teste, como `unit` para testes unitários ou `integration` para testes de integração.

### Exemplos

- Teste unitário para um serviço: `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Services/OpexService.unit.test.ts`
- Teste de integração para um módulo: `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Modules/OpexModule.integration.test.ts`

```
## Exportação de Instâncias Únicas

### Descrição

Classes que representam serviços, utilitários ou módulos são frequentemente instanciadas uma vez dentro de seu próprio arquivo e exportadas como o `default`. Isso sugere um padrão de uso como singletons implícitos, onde os consumidores importam diretamente a instância pronta para uso.

### Exemplos

- Exportação de uma instância de serviço:
```typescript
class OpexService {
	// ... methods
}

export default new OpexService()
```
- Exportação de uma instância de utilitário:
```typescript
class DateUtil {
	// ... methods
}

export default new DateUtil()
```
- Exportação de uma instância de módulo:
```typescript
class OpexModule {
	// ... methods
}

export default new OpexModule()
```

### Exemplos que violam o padrão

- Exportação da classe em vez de uma instância:
```typescript
class HttpService {
	// ... methods
}

export default HttpService
```

```
## Uso de Alias `@/` para Importações

### Descrição

O alias `@/` é consistentemente usado no início dos caminhos de importação para se referir ao diretório `src`. Isso permite o uso de importações absolutas a partir da raiz do código-fonte, tornando os caminhos de importação mais curtos e legíveis, especialmente em arquivos aninhados profundamente na estrutura de diretórios.

### Exemplos

- Importação de um serviço usando `@/`:
```typescript
import OpexService from "@/Skills/OnePieceMangaSpoiler/Services/OpexService"
```
- Importação de um utilitário usando `@/`:
```typescript
import DateUtil from "@/Skills/OnePieceMangaSpoiler/Utils/DateUtil"
```
- Importação de um protocolo usando `@/`:
```typescript
import { SpoilerInfo } from "@/Skills/OnePieceMangaSpoiler/Protocols/OpexProtocol"
```

```
## Estrutura de Handlers de Skill

### Descrição

Classes que implementam a lógica principal para lidar com requisições de uma skill Alexa seguem uma estrutura específica. Elas estendem uma classe base (`HandlerModule`) que fornece implementações padrão para intents comuns e definem um array `customRequestHandlers` para mapear intents personalizadas para métodos assíncronos específicos dentro da classe.

### Exemplos

- Definição de um handler de skill estendendo `HandlerModule` e definindo `customRequestHandlers`:
```typescript
class OnePieceMangaSpoilerHandler extends HandlerModule {
	customRequestHandlers: HandlerModule["customRequestHandlers"] = [
		{
			canHandle: HandlerAdapterModule.canHandleCustomIntent("OnePieceMangaSpoilerIntent"),
			handle: async (props) => await this.onOnePieceMangaSpoilerIntent(props)
		}
	]

	async onLaunch ({ responseBuilder }: HandlerProps): Promise<HandlerResponse> {
		// ... logic
	}

	async onOnePieceMangaSpoilerIntent ({ responseBuilder }: HandlerProps): Promise<HandlerResponse> {
		// ... logic
	}
	// ... other on* methods
}
```

```
## Definição de Tipos em Arquivos `Protocol.ts`

### Descrição

Interfaces e tipos TypeScript usados para definir contratos de dados ou estruturas são agrupados em arquivos dedicados com o sufixo `Protocol.ts`. Esses arquivos são organizados em um diretório `Protocols` na raiz do `src` para tipos genéricos ou dentro de diretórios de feature (`Skills/<SkillName>/Protocols`) para tipos específicos da feature.

### Exemplos

- Definição de tipos genéricos em `Protocols`:
```typescript
// examples/alexa-skills/src/Protocols/HandlerProtocol.ts
export type HandlerEvent = RequestEnvelope
export type HandlerProps = HandlerInput
// ... other types
```
- Definição de tipos específicos de skill em `Protocols`:
```typescript
// examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Protocols/OpexProtocol.ts
export type SpoilerInfo = {
	status: "available" | "manga-launched" | "not-found"
	date?: Date
	content?: string
}
```

```
## Convenção de Nomenclatura por Tipo

### Descrição

Nomes de classes e arquivos frequentemente terminam com uma palavra que indica seu tipo ou responsabilidade funcional dentro da arquitetura. Isso inclui sufixos como `Service`, `Util`, `Module`, `Constant`, `Protocol`, e `Handler`.

### Exemplos

- Arquivo/Classe de Serviço: `OpexService.ts`, `HttpService.ts`, `CrawlerService.ts`
- Arquivo/Classe de Utilitário: `DateUtil.ts`, `SanitizationUtil.ts`, `HandlerUtil.ts`, `ServerlessUtil.ts`
- Arquivo/Classe de Módulo: `OpexModule.ts`, `HandlerAdapterModule.ts`, `HandlerModule.ts`
- Arquivo de Constantes: `SpoilerContentPhrasesConstant.ts`
- Arquivo de Protocolos: `OpexProtocol.ts`, `HandlerProtocol.ts`, etc.
- Arquivo/Classe de Handler: `OnePieceMangaSpoilerHandler` (classe), `HandlerModule` (classe base)

### Exemplos que violam o padrão

- Arquivo de configuração: `SkillConfig.ts` (termina com `Config`)
- Arquivo de entrada principal da skill: `index.ts` (nome padrão, não segue o sufixo `Handler`)
```
