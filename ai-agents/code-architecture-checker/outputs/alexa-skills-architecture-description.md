## Organização de Arquivos por Tipo e Funcionalidade

### Descrição

O código organiza os arquivos em diretórios baseados no tipo de funcionalidade que eles representam. Existem diretórios de nível superior como `Config`, `Services`, `Modules`, `Utils` e `Protocols`. Dentro do diretório `Skills`, há subdiretórios para cada skill específica (`OnePieceMangaSpoiler`), que por sua vez contêm subdiretórios para os tipos de arquivos relacionados a essa skill (`Constants`, `Modules`, `Services`, `Utils`, `Protocols`). Este padrão promove a separação de interesses e facilita a localização de arquivos por sua função e pela skill a que pertencem.

### Exemplos

**Seguindo o padrão:**

-   `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Services/OpexService.ts`: Um serviço específico da skill `OnePieceMangaSpoiler` localizado no diretório `Services` dentro do diretório da skill.
-   `examples/alexa-skills/src/Protocols/HandlerProtocol.ts`: Um arquivo de definição de tipos (protocolo) para handlers, localizado no diretório `Protocols` de nível superior.

**Violando o padrão:**

-   Nenhum exemplo de violação deste padrão foi encontrado no código fornecido. Todos os arquivos parecem seguir a estrutura de diretórios baseada em tipo e funcionalidade.

## Exportação de Instância Única (Singleton Implícito)

### Descrição

Um padrão recorrente é a definição de uma classe e a exportação direta de uma nova instância dessa classe usando `export default new ClassName()`. Isso garante que, ao importar o módulo, o código receba sempre a mesma instância da classe, funcionando como um Singleton implícito para o ponto de importação.

### Exemplos

**Seguindo o padrão:**

-   `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Services/OpexService.ts`: Exporta `export default new OpexService()`.
-   `examples/alexa-skills/src/Utils/DateUtil.ts`: Exporta `export default new DateUtil()`.

**Violando o padrão:**

-   `examples/alexa-skills/src/Services/HttpService.ts`: Exporta a classe em si (`export default HttpService`) em vez de uma instância.
-   `examples/alexa-skills/src/Modules/HandlerModule.ts`: Exporta a classe abstrata em si (`export default HandlerModule`) em vez de uma instância.

## Definição de Tipos em Arquivos Separados

### Descrição

As definições de tipos e interfaces (protocolos) são consistentemente agrupadas em arquivos separados, localizados dentro de diretórios nomeados `Protocols`. Este padrão mantém as definições de contrato de dados e comportamento separadas da lógica de implementação, melhorando a clareza e a manutenibilidade.

### Exemplos

**Seguindo o padrão:**

-   `examples/alexa-skills/src/Protocols/HandlerProtocol.ts`: Define tipos relacionados a handlers.
-   `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Protocols/OpexProtocol.ts`: Define tipos específicos para a funcionalidade Opex dentro da skill.

**Violando o padrão:**

-   Nenhum exemplo de violação deste padrão foi encontrado no código fornecido. Todas as definições de tipo parecem estar localizadas em arquivos dentro de diretórios `Protocols`.

## Convenção de Nomenclatura para Arquivos de Teste

### Descrição

Os arquivos de teste seguem uma convenção de nomenclatura específica, terminando com `.unit.test.ts` para testes unitários ou `.integration.test.ts` para testes de integração. Este padrão facilita a identificação rápida do propósito de um arquivo de teste e do tipo de teste que ele contém.

### Exemplos

**Seguindo o padrão:**

-   `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Services/OpexService.unit.test.ts`: Arquivo de teste unitário para `OpexService`.
-   `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Modules/OpexModule.integration.test.ts`: Arquivo de teste de integração para `OpexModule`.

**Violando o padrão:**

-   Nenhum exemplo de violação deste padrão de nomenclatura para arquivos de teste foi encontrado no código fornecido.

## Convenção de Nomenclatura para Classes de Lógica/Interação

### Descrição

Classes que encapsulam lógica de negócio específica, interações com serviços externos (como HTTP ou crawling) ou orquestração de funcionalidades são nomeadas com o sufixo `Service` ou `Module`. Este padrão ajuda a categorizar a responsabilidade principal da classe.

### Exemplos

**Seguindo o padrão:**

-   `examples/alexa-skills/src/Services/HttpService.ts`: Classe para interações HTTP.
-   `examples/alexa-skills/src/Skills/OnePieceMangaSpoiler/Modules/OpexModule.ts`: Classe que orquestra a obtenção de informações do Opex.

**Violando o padrão:**

-   Nenhum exemplo de violação deste padrão de nomenclatura para classes de lógica/interação foi encontrado no código fornecido.

## Convenção de Nomenclatura para Classes de Utilidade

### Descrição

Classes que fornecem funções auxiliares genéricas, reutilizáveis em diferentes partes do código e que geralmente não contêm lógica de negócio complexa, são nomeadas com o sufixo `Util`. Este padrão distingue essas classes de serviços ou módulos mais focados.

### Exemplos

**Seguindo o padrão:**

-   `examples/alexa-skills/src/Utils/DateUtil.ts`: Classe com funções auxiliares para manipulação de datas.
-   `examples/alexa-skills/src/Utils/ServerlessUtil.ts`: Classe com funções auxiliares para configuração do Serverless.

**Violando o padrão:**

-   Nenhum exemplo de violação deste padrão de nomenclatura para classes de utilidade foi encontrado no código fornecido.
