Olá! Analisei o código fornecido e identifiquei os seguintes padrões arquiteturais que se repetem em múltiplas partes da base de código:

## Estrutura de Diretórios por Camada e Tipo

### Descrição

O código organiza arquivos em diretórios distintos com base em seu papel arquitetural ou tipo de funcionalidade. Isso cria uma separação clara de responsabilidades entre as camadas, como infraestrutura, acesso a dados, lógica de negócio, utilitários, configurações e componentes de interface.

### Exemplos

- **Seguindo o Padrão:**
  - Todos os arquivos relacionados à infraestrutura de baixo nível (como banco de dados e fila) estão localizados em `/server/infra`. Por exemplo: `examples/investy/server/infra/database/index.ts` e `examples/investy/server/infra/queue/index.ts`.
  - Arquivos contendo lógicas de acesso a dados de entidades específicas (como usuários, integrações, etc.) estão agrupados em `/server/repositories`. Por exemplo: `examples/investy/server/repositories/UserRepository.ts` e `examples/investy/server/repositories/IntegrationRepository.ts`.
  - Arquivos contendo lógicas de negócio e orquestração de serviços estão em `/server/services`. Por exemplo: `examples/investy/server/services/AuthService.ts` e `examples/investy/server/services/IntegrationService.ts`.

## Padrão Singleton para Instâncias de Classes

### Descrição

Muitas classes que representam módulos, utilitários, controladores, middlewares e adaptadores são instanciadas uma única vez e exportadas como a exportação padrão do módulo. Isso garante que haja apenas uma instância dessas classes em toda a aplicação, funcionando como singletons implícitos.

### Exemplos

- **Seguindo o Padrão:**
  ```typescript
  // examples/investy/server/infra/database/index.ts
  class DatabaseModule { /* ... */ }
  export default new DatabaseModule() // Exporta a instância
  ```
  ```typescript
  // examples/investy/server/controllers/UserController.ts
  class UserController { /* ... */ }
  export default new UserController() // Exporta a instância
  ```
  ```typescript
  // examples/investy/server/utils/ValidationUtil.ts
  class ValidationUtil { /* ... */ }
  export default new ValidationUtil() // Exporta a instância
  ```

- **Violando o Padrão (na base de código fornecida, algumas classes são exportadas para serem instanciadas, em vez da própria instância):**
  ```typescript
  // examples/investy/server/lib/NotionLib.ts
  class NotionLib { /* ... */ }
  export default NotionLib // Exporta a classe
  ```
  ```typescript
  // examples/investy/server/adapters/NodeCacheAdapter.ts
  class NodeCacheAdapter<Entity> extends CacheContract<Entity> { /* ... */ }
  export default NodeCacheAdapter // Exporta a classe
  ```

## Padrão Repository com Adapter Genérico

### Descrição

A lógica de acesso a dados para entidades do banco de dados é centralizada em classes chamadas Repositories. Esses Repositories não implementam diretamente a lógica de interação com o ORM (Mongoose), mas a delegam a um Adapter genérico (`MongooseRepositoryAdapter`) que implementa o `RepositoryContract`. Cada Repository específico estende esse adapter para a entidade correspondente.

### Exemplos

- **Seguindo o Padrão:**
  ```typescript
  // examples/investy/server/repositories/IntegrationRepository.ts
  import MongooseRepositoryAdapter from "@server/adapters/MongooseRepositoryAdapter"
  import IntegrationEntity from "@server/entities/IntegrationEntity"
  import IntegrationSchema from "@server/schemas/IntegrationSchema"

  class IntegrationRepository extends MongooseRepositoryAdapter<IntegrationEntity> {} // Estende o Adapter
  export default new IntegrationRepository(IntegrationSchema)
  ```
  ```typescript
  // examples/investy/server/repositories/UserRepository.ts
  import MongooseRepositoryAdapter from "@server/adapters/MongooseRepositoryAdapter"
  import UserEntity from "@server/entities/UserEntity"
  import UserSchema from "@server/schemas/UserSchema"

  class UserRepository extends MongooseRepositoryAdapter<UserEntity> {} // Estende o Adapter
  export default new UserRepository(UserSchema)
  ```

## Uso Consistente de Adapters

### Descrição

A interação com frameworks ou bibliotecas externas (como Mongoose, Quirrel, Next.js HTTP, NodeCache) é encapsulada em classes "Adapter". Essas classes geralmente implementam contratos específicos (definidos em `/server/contracts`) e fornecem uma interface padronizada para a aplicação, desacoplando-a das implementações concretas das bibliotecas.

### Exemplos

- **Seguindo o Padrão:**
  ```typescript
  // examples/investy/server/adapters/MongooseRepositoryAdapter.ts
  class MongooseRepositoryAdapter<Entity extends DefaultEntity> implements RepositoryContract<Entity> { /* ... */ } // Implementa Contract
  export default MongooseRepositoryAdapter
  ```
  ```typescript
  // examples/investy/server/adapters/NextHttpAdapter.ts
  class NextHttpAdapter implements HttpContract<RawApiHandler> { /* ... */ } // Implementa Contract
  export default new NextHttpAdapter()
  ```

- **Violando o Padrão (classes que interagem com libs externas, mas não seguem a convenção `*Adapter` ou implementam um `*Contract` explícito para essa interação):**
  ```typescript
  // examples/investy/server/lib/NotionLib.ts
  import { Client } from "@notionhq/client" // Interage diretamente com a lib
  class NotionLib { /* ... */ }
  export default NotionLib
  ```
  ```typescript
  // examples/investy/server/lib/StatusInvestLib.ts
  import axios from "axios" // Interage diretamente com a lib
  class StatusInvestLib implements InvestmentHandler { /* ... */ } // Implementa um InvestmentHandler, mas não um adapter genérico para interações HTTP externas
  export default new StatusInvestLib()
  ```

## Camada de Serviço para Lógica de Negócios

### Descrição

A lógica de negócio e a orquestração de operações complexas envolvendo múltiplos repositórios, libs ou utilitários são encapsuladas em classes na camada de "services". Controladores e handlers de fila geralmente chamam métodos nesses serviços para executar ações de negócio.

### Exemplos

- **Seguindo o Padrão:**
  ```typescript
  // examples/investy/server/controllers/NotionAssetSyncController.ts
  // ...
  await IntegrationService.getNotionIntegration(userId) // Chama um serviço
  // ...
  await AssetSyncSchedulerService.scheduleNotionAssetSync(notionAssetSync.id) // Chama um serviço
  // ...
  ```
  ```typescript
  // examples/investy/server/queues/SyncNotionAssetPriceQueue.ts
  // ...
  await AssetSyncSchedulerService.scheduleNotionAssetSync(assetSyncId) // Chama um serviço
  // ...
  ```

- **Violando o Padrão (classes que interagem diretamente com libs ou repositórios que poderiam ser orquestrados por um serviço):**
  ```typescript
  // examples/investy/server/queues/SyncNotionAssetPriceQueue.ts
  // ...
  const notion = new NotionLib(integration.token) // Instancia e usa lib diretamente
  const databaseRows = await notion.getDatabaseRows(notionData.database_id) // Usa lib diretamente
  // ...
  await notion.updateDatabaseRow(notionData.asset_price_property_id, row.id, formattedAssetPrice) // Usa lib diretamente
  // ...
  ```
  ```typescript
  // examples/investy/server/controllers/NotionIntegrationController.ts
  // ...
  const notion = new NotionLib(notionIntegration.token) // Instancia e usa lib diretamente
  const databases = await notion.searchDatabases(name) // Usa lib diretamente
  // ...
  ```

## Padrão Middleware para Processamento de Requisição

### Descrição

A aplicação utiliza classes de "Middleware" para processar requisições HTTP antes que elas atinjam os controladores finais. Esses middlewares são definidos no diretório `/server/middlewares` e seguem o padrão de receber um objeto `ApiHandlerInput` e chamar `response.next()` para passar o controle para o próximo handler ou para o controlador.

### Exemplos

- **Seguindo o Padrão:**
  ```typescript
  // examples/investy/server/middlewares/InfraMiddleware.ts
  import { ApiHandlerInput } from "@server/contracts/HttpContract"
  import Infra from "@server/infra"

  class InfraMiddleware {
      async setup ({ response }: ApiHandlerInput<{}, {}, {}>): Promise<void> {
          await Infra.setup()
          return response.next() // Chama response.next()
      }
  }
  export default new InfraMiddleware()
  ```
  ```typescript
  // examples/investy/server/middlewares/AuthMiddleware.ts
  import { ApiHandlerInput } from "@server/contracts/HttpContract"
  // ...
  class AuthMiddleware {
      async requireAuth ({ request, response }: ApiHandlerInput<{}, {}, {}>): Promise<void> {
          // ... validation logic ...
          request.context.set({ auth: authTokenPayload })
          return response.next() // Chama response.next()
      }
  }
  export default new AuthMiddleware()
  ```

## Centralização da Lógica de Validação

### Descrição

A lógica para validar dados (principalmente de entrada de requisições) é agrupada em classes dedicadas no diretório `/server/validations`. Essas classes frequentemente utilizam um utilitário comum (`ValidationUtil`) para executar verificações padrão e retornar um objeto `ValidationResult` padronizado com erros por campo.

### Exemplos

- **Seguindo o Padrão:**
  ```typescript
  // examples/investy/server/validations/UserValidation.ts
  import { ValidationResult } from "@server/protocols/ValidationProtocol"
  import ValidationUtil from "@server/utils/ValidationUtil"
  import UserRepository from "@server/repositories/UserRepository"

  class UserValidation {
      async validateSignupData (data: SignupBody): Promise<ValidationResult<SignupBody>> {
          return await ValidationUtil.validate(data as SignupBody, { // Usa ValidationUtil.validate
              email: [
                  ValidationUtil.defaultValidations.wasSupplied,
                  {
                      isValid: this.isUserEmailAvailable,
                      errorCode: "UserAlreadyExists"
                  }
              ],
              // ... other fields ...
          })
      }
      // ...
  }
  export default new UserValidation()
  ```
  ```typescript
  // examples/investy/server/validations/NotionAssetSyncValidation.ts
  import { ValidationResult } from "@server/protocols/ValidationProtocol"
  import ValidationUtil from "@server/utils/ValidationUtil"
  import { NotionBody } from "@server/validations/NotionAssetSyncValidation"

  class NotionAssetSyncValidation {
      async validateNotionData (data: NotionBody): Promise<ValidationResult<NotionBody>> {
          return await ValidationUtil.validate(data, { // Usa ValidationUtil.validate
              assetCodePropertyId: [
                  ValidationUtil.defaultValidations.wasSupplied
              ],
              // ... other fields ...
          })
      }
  }
  export default new NotionAssetSyncValidation()
  ```

- **Violando o Padrão (classe de validação que não usa o método `ValidationUtil.validate`, embora ainda esteja no diretório de validação):**
  ```typescript
  // examples/investy/server/validations/AssetSyncValidation.ts
  import AssetSyncRepository from "@server/repositories/AssetSyncRepository"

  class AssetSyncValidation {
      async belongsToUser (assetSyncId: string, userId: string): Promise<boolean> { // Lógica de validação, mas não usa ValidationUtil.validate
          const assetSync = await AssetSyncRepository.retrieveOne({
              user_id: userId,
              id: assetSyncId
          })
          return Boolean(assetSync)
      }
  }
  export default new AssetSyncValidation()
  ```

## Padronização de Respostas de Erro HTTP

### Descrição

As respostas de erro para requisições HTTP são padronizadas usando os métodos definidos no `ApiHandlerResponse` (parte do `HttpContract`). Controladores e middlewares utilizam métodos como `response.badRequest()`, `response.notFound()`, `response.serverError()`, etc., para retornar respostas HTTP consistentes com status codes e formatos de corpo predefinidos.

### Exemplos

- **Seguindo o Padrão:**
  ```typescript
  // examples/investy/server/controllers/NotionIntegrationController.ts
  class NotionIntegrationController {
      async searchDatabase ({ request, response, context }: ApiHandlerInput): Promise<void> {
          // ... logic ...
          if (!notionIntegration) {
              return response.notFound("NotionIntegrationNotFound") // Resposta padronizada
          }
          // ... logic ...
          if (!name) {
              return response.ok([]) // Resposta padronizada (sucesso)
          }
          // ...
      }
  }
  export default new NotionIntegrationController()
  ```
  ```typescript
  // examples/investy/server/controllers/UserController.ts
  class UserController {
      async signup ({ request, response }: ApiHandlerInput): Promise<void> {
          const validation = await UserValidation.validateSignupData(request.body)
          if (!validation.valid) {
              return response.badRequest(validation.fieldErrors) // Resposta padronizada
          }
          // ... success logic ...
          return response.created({ authToken }) // Resposta padronizada
      }
      // ...
  }
  export default new UserController()
  ```

## Centralização de Log de Erros

### Descrição

Erros que ocorrem na aplicação são capturados em pontos chave (como no adapter HTTP e no handler de fila) e registrados consistentemente utilizando a classe `LogService`. Isso centraliza a lógica de logging e garante que os erros sejam tratados e reportados de maneira uniforme.

### Exemplos

- **Seguindo o Padrão:**
  ```typescript
  // examples/investy/server/adapters/NextHttpAdapter.ts
  class NextHttpAdapter implements HttpContract<RawApiHandler> {
      adaptApiHandler (handler: ApiHandler): RawApiHandler {
          return async (req: NextApiRequest, res: NextApiResponse) => {
              // ... setup ...
              try {
                  return await handler(input)
              } catch (error) {
                  LogService.error(error) // Loga o erro
                  return input.response.serverError()
              }
          }
      }
      // ...
  }
  export default new NextHttpAdapter()
  ```
  ```typescript
  // examples/investy/server/contracts/QueueContract.ts (BaseQueue class)
  import LogService from "@server/services/LogService"

  export abstract class BaseQueue {
      // ... process method ...
      protected async onError (handler: QueueHandler, payload: QueuePayload[QueueName], error: Error): Promise<void> {
          LogService.info(`[Queue][${handler.name}] ERROR!`)
          LogService.error(error) // Loga o erro
          // ...
      }
      // ...
  }
  ```

## Estrutura de Componentes Client-side com SubComponentes Anexados

### Descrição

No lado do cliente, componentes React mais complexos que são compostos por partes menores (como tabelas, modais, inputs de seleção) são construídos utilizando um padrão onde os "subcomponentes" (como `Table.Head`, `Table.Body`, `Table.Row`, `Table.Column` para `Table`) são definidos separadamente e depois "anexados" à componente principal utilizando a função `attachSubComponents`. Isso organiza o código dos componentes compostos.

### Exemplos

- **Seguindo o Padrão:**
  ```typescript
  // examples/investy/client/components/Table/index.tsx
  import TableBody from "@client/components/Table/TableBody"
  import TableColumn from "@client/components/Table/TableColumn"
  import TableHead from "@client/components/Table/TableHead"
  import TableRow from "@client/components/Table/TableRow"
  import { attachSubComponents, buildSubComponents } from "@client/hooks/useSubComponents"

  const SubComponents = buildSubComponents({ // Constrói os subcomponentes
      Body: TableBody,
      Column: TableColumn,
      Head: TableHead,
      Row: TableRow
  })

  const Table: FC = (props) => { /* ... */ }

  export default attachSubComponents(Table, SubComponents) // Anexa os subcomponentes
  ```
  ```typescript
  // examples/investy/client/components/Modal/index.tsx
  import ModalContent from "@client/components/Modal/ModalContent"
  import ModalTrigger from "@client/components/Modal/ModalTrigger"
  import useSubComponents, { attachSubComponents, buildSubComponents } from "@client/hooks/useSubComponents"

  const SubComponents = buildSubComponents({ // Constrói os subcomponentes
      Trigger: ModalTrigger,
      Content: ModalContent
  })

  const Modal: FC<ModalProps> = (props) => { /* ... */ }

  export default attachSubComponents(Modal, SubComponents) // Anexa os subcomponentes
  ```

- **Violando o Padrão (componentes que não utilizam essa estrutura de subcomponentes anexados, pois não são compostos dessa forma):**
  ```typescript
  // examples/investy/client/components/Button/index.tsx
  // Nenhuma definição de subcomponentes anexados
  const Button: FC<ButtonProps> = (props) => { /* ... */ }
  export default Button
  ```
  ```typescript
  // examples/investy/client/components/Chip/index.tsx
  // Nenhuma definição de subcomponentes anexados
  const Chip: FC<ChipProps> = (props) => { /* ... */ }
  export default Chip
  ```

## Organização de Arquivos Client-side por Papel

### Descrição

Similar ao lado do servidor, os arquivos do lado do cliente são organizados em diretórios com base em seu papel ou tipo de funcionalidade (componentes de UI, utilitários, configurações, hooks, páginas, etc.). Isso mantém o código client-side organizado e facilita a localização de arquivos com base em sua responsabilidade.

### Exemplos

- **Seguindo o Padrão:**
  - Todos os componentes de UI reutilizáveis estão localizados em `/client/components`. Por exemplo: `examples/investy/client/components/Button/index.tsx`, `examples/investy/client/components/Table/index.tsx`.
  - Funções auxiliares específicas do cliente estão em `/client/utils`. Por exemplo: `examples/investy/client/utils/style.ts`, `examples/investy/client/utils/route.ts`.
  - Definições de configuração estão em `/client/config`. Por exemplo: `examples/investy/client/config/route.ts`, `examples/investy/client/config/api.ts`.

## Centralização de Configurações Client-side

### Descrição

As configurações específicas do lado do cliente (como chaves de autenticação, URLs de API, rotas) são definidas em arquivos separados dentro do diretório `/client/config`. Cada arquivo geralmente agrupa configurações relacionadas e as exporta como objetos constantes.

### Exemplos

- **Seguindo o Padrão:**
  ```typescript
  // examples/investy/client/config/api.ts
  export const apiConfig = { // Objeto de configuração
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
  }
  ```
  ```typescript
  // examples/investy/client/config/route.ts
  export const routeConfig: Record<PageName, RouteInfo> = { // Objeto de configuração
      root: { /* ... */ },
      login: { /* ... */ },
      // ...
  }
  ```
  ```typescript
  // examples/investy/client/config/auth.ts
  export const authConfig = { // Objeto de configuração
      authTokenKey: "x-investy-auth-token"
  }
  ```

---

```
## Padrão de Componentes Compostos

### Descrição

Componentes de interface do usuário que consistem em múltiplas partes inter-relacionadas são frequentemente estruturados utilizando o padrão de Componentes Compostos. Isso envolve anexar sub-componentes (como `Content`, `Trigger`, `Head`, `Body`, `Column`, `Row`, `Item`) como propriedades ao componente principal (como `Modal`, `Table`, `Dropdown`). Essa abordagem permite uma maneira declarativa de compor estruturas de UI complexas, onde a relação entre as partes é clara no uso. No entanto, este padrão não é aplicado universalmente a todas as composições de componentes na base de código fornecida.

### Exemplos

**Exemplo que segue o padrão:**
A utilização do componente `Modal` em `examples/investy/client/components/PopConfirm/index.tsx` demonstra a composição usando sub-componentes `Modal.Content` e `Modal.Trigger`:

```typescript
<Modal
	title="Are you sure?"
	onConfirm={onConfirm}
>
	<Modal.Content>
		{description}
	</Modal.Content>

	<Modal.Trigger>
		{children}
	</Modal.Trigger>
</Modal>
```

**Exemplo que viola o padrão:**
A composição de um rótulo (`InputLabel`) e um campo de texto (`TextInput`) em `examples/investy/client/pages/Login/index.tsx` não utiliza um componente composto (`FormGroup` ou similar), tratando `InputLabel` e `TextInput` como componentes separados, apesar de estarem semanticamente relacionados em um formulário:

```typescript
<div>
	<InputLabel
		inputName="email"
	>
		Email
	</InputLabel>
	<TextInput
		fullWidth
		name="email"
		value={data.email}
		onValueChange={value => handleChange("email", value)}
		errorMessage={validation.messages.email}
	/>
</div>
```
```
