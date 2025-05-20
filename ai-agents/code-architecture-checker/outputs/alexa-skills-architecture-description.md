## Padrão: "Organização de Arquivos por Papel e Domínio"

### Descrição

O código organiza arquivos e módulos em diretórios distintos com base em seu papel arquitetural (como `Services`, `Utils`, `Protocols`, `Modules`, `Config`) e, dentro de domínios específicos (como `Skills/OnePieceMangaSpoiler`), subdivide ainda mais por papel. Essa estrutura facilita a localização de código relacionado e reforça a separação de responsabilidades. Arquivos de teste são colocados junto ao código que testam, seguindo convenções de nomenclatura específicas.

### Exemplos

- Arquivos de configuração são colocados no diretório `Config`: `examples/alexa-skills/src/Config/SkillConfig.ts`
- Serviços genéricos são colocados no diretório `Services`: `examples/alexa-skills/src/Services/HttpService.ts`, `examples/alexa-skills/src/Services/CrawlerService.ts`
- Utilitários genéricos são colocados no diretório `Utils`: `examples/alexa-skills/src/Utils/HandlerUtil.ts`, `examples/alexa-skills/src/Utils/ServerlessUtil.ts`
- Definições de tipos/protocolos são colocadas no diretório `Protocols`: `examples/alexa-skills/src/Protocols/CrawlerProtocol.ts`, `examples/alexa-skills/src/Protocols/HandlerProtocol.ts`
- Módulos de adaptação ou base são colocados no diretório `Modules`: `examples/alexa-skills/src/Modules/HandlerAdapterModule.ts`, `examples/alexa-skills/src/Modules/HandlerModule.ts`
- Lógica específica de uma skill é agrupada em `Skills/<SkillName>` e subdividida por papel:
    - Constantes: `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Constants/SpoilerContentPhrasesConstant.ts`
    - Módulos: `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Modules/OpexModule.ts`
    - Protocolos: `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Protocols/OpexProtocol.ts`
    - Serviços: `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Services/OpexService.ts`
    - Utilitários: `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Utils/DateUtil.ts`, `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Utils/SanitizationUtil.ts`
- Arquivos de teste são colocados nos mesmos diretórios que o código testado: `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Services/OpexService.unit.test.ts`, `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Modules/OpexModule.integration.test.ts`, `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Utils/DateUtil.unit.test.ts`

## Padrão: "Nomenclatura por Papel"

### Descrição

Classes e arquivos são nomeados de forma consistente com base em seu papel ou responsabilidade. Isso inclui sufixos específicos para utilitários (`Util`), serviços (`Service`), módulos (`Module`), protocolos (`Protocol`) e constantes (`Constant`), além de convenções para arquivos de teste. Essa padronização torna o propósito de cada arquivo ou classe imediatamente claro.

### Exemplos

- Classes utilitárias terminam com `Util`: `DateUtil`, `SanitizationUtil`, `HandlerUtil`, `ServerlessUtil`. Exemplo de arquivo: `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Utils/DateUtil.ts`
- Classes de serviço terminam com `Service`: `OpexService`, `HttpService`, `CrawlerService`. Exemplo de arquivo: `examples/alexa-skills/src/Services/HttpService.ts`
- Classes de módulo terminam com `Module`: `OpexModule`, `HandlerAdapterModule`, `HandlerModule`. Exemplo de arquivo: `examples/alexa-skills/src/Modules/HandlerModule.ts`
- Arquivos de definição de tipos/protocolos terminam com `Protocol`: `OpexProtocol`, `CrawlerProtocol`, `HandlerProtocol`, `ServerlessProtocol`, `HttpProtocol`, `SkillProtocol`. Exemplo de arquivo: `examples/alexa-skills/src/Protocols/HandlerProtocol.ts`
- Arquivos de constantes terminam com `Constant`: `SpoilerContentPhrasesConstant`. Exemplo de arquivo: `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Constants/SpoilerContentPhrasesConstant.ts`
- Arquivos de teste seguem o padrão `*.unit.test.ts` ou `*.integration.test.ts`: `OpexService.unit.test.ts`, `OpexModule.integration.test.ts`, `DateUtil.unit.test.ts`. Exemplo de arquivo: `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Services/OpexService.unit.test.ts`

## Padrão: "Separação de Responsabilidades por Camadas Lógicas"

### Descrição

O código demonstra uma separação clara de responsabilidades entre diferentes componentes e diretórios, que atuam como camadas lógicas. Há uma distinção entre:
- Lógica de adaptação e manipulação de requisições externas (Handler/Adapter Modules).
- Lógica de negócio específica de um domínio/skill (Skill Modules/Services).
- Lógica de infraestrutura ou genérica (Services como HTTP, Crawler).
- Funções auxiliares e utilitárias (Utils).
- Definições de estrutura de dados e tipos (Protocols).
- Configuração (Config).
Essa separação garante que cada parte do código tenha um propósito bem definido e reduz o acoplamento.

### Exemplos

- A lógica de adaptação da Alexa SDK é encapsulada em `HandlerAdapterModule`: `examples/alexa-skills/src/Modules/HandlerAdapterModule.ts`
- A lógica de manipulação de requisições da skill é definida em `HandlerModule` e implementada em `OnePieceMangaSpoilerHandler`: `examples/alexa-skills/src/Modules/HandlerModule.ts`, `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/index.ts`
- Serviços genéricos de infraestrutura como HTTP e Crawler são separados em `HttpService` e `CrawlerService`: `examples/alexa-skills/src/Services/HttpService.ts`, `examples/alexa-skills/src/Services/CrawlerService.ts`
- A lógica de negócio específica para obter informações de spoiler é dividida entre `OpexModule` (orquestração) e `OpexService` (detalhes de parsing): `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Modules/OpexModule.ts`, `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Services/OpexService.ts`
- Funções auxiliares como manipulação de datas ou sanitização são isoladas em `Utils`: `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Utils/DateUtil.ts`, `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Utils/SanitizationUtil.ts`
- As definições de tipos e interfaces são agrupadas em `Protocols`: `examples/alexa-skills/src/Protocols/HandlerProtocol.ts`, `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Protocols/OpexProtocol.ts`
