## Organização de Arquivos e Módulos

### Descrição

O código segue um padrão consistente de organização de arquivos e diretórios, separando o código por funcionalidade (Skills) e por tipo de componente (Services, Modules, Utils, Constants, Protocols). Componentes de uso geral são colocados em diretórios na raiz de `src/`, enquanto componentes específicos de uma Skill são aninhados em `src/Skills/<NomeDaSkill>/`.

### Exemplos

- O arquivo `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Services/OpexService.ts` é um serviço específico da skill "OnePieceMangaSpoiler" e está localizado no diretório `Services` dentro do diretório da skill.
- O arquivo `examples/alexa-skills/src/Services/HttpService.ts` é um serviço de uso geral (HTTP) e está localizado no diretório `Services` na raiz de `src/`.

## Arquitetura em Camadas

### Descrição

A codebase demonstra uma arquitetura em camadas, onde as responsabilidades são divididas entre diferentes tipos de componentes com dependências direcionais. Observa-se uma estrutura onde Handlers dependem de Modules, Modules dependem de Services, e Services dependem de Utilities ou outros Services de infraestrutura.

### Exemplos

- O `OnePieceMangaSpoilerHandler` (camada de Handler) depende e chama métodos do `OpexModule` (camada de Module) para obter informações (`await OpexModule.getSpoilerInfo()`).
- O `OpexModule` (camada de Module) depende e chama métodos do `OpexService` e `HttpService` (camada de Service/Infraestrutura) para realizar suas tarefas (`OpexService.getSpoilerPageUrlByLandingPageHTML(landingPageHTML)`, `await httpService.toString("")`).

## Convenções de Nomenclatura

### Descrição

Existe um padrão para nomear arquivos e classes com base em seu propósito. Arquivos de teste incluem `.unit.test` ou `.integration.test` no nome. Classes que representam serviços terminam com `Service`, módulos terminam com `Module`, utilitários terminam com `Util`, e handlers terminam com `Handler` ou `AdapterModule`. Constantes são frequentemente nomeadas usando PascalCase ou SCREAMING_SNAKE_CASE.

### Exemplos

- O arquivo `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Services/OpexService.ts` nomeia a classe `OpexService`, seguindo a convenção para serviços.
- O arquivo `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Constants/SpoilerContentPhrasesConstant.ts` nomeia a constante `SpoilerContentPhrasesConstant` usando PascalCase.

### Violações

- A constante `skillConfig` no arquivo `examples/alexa-skills/src/Config/SkillConfig.ts` é nomeada usando camelCase, o que viola a convenção observada para outras constantes como `SpoilerContentPhrasesConstant` e `OPEX_WEBSITE_BASE_URL`.
