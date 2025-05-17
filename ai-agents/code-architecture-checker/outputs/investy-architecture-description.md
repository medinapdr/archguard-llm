Okay, analisei o código fonte fornecido para identificar padrões arquiteturais. Aqui estão os padrões encontrados, documentados conforme solicitado:

## Arquitetura em Camadas

### Descrição

O código segue uma arquitetura em camadas com separação clara de responsabilidades. As camadas identificadas incluem:

*   **Apresentação/HTTP (Controllers, Middlewares, Adapters):** Lida com requisições HTTP de entrada, roteamento e formatação de respostas. Utiliza adaptadores para interagir com frameworks web (Next.js).
*   **Lógica de Negócios (Services):** Contém a lógica de negócios principal da aplicação, orquestrando operações entre outras camadas e encapsulando regras de domínio.
*   **Acesso a Dados (Repositories):** Abstrai a lógica de acesso ao banco de dados, fornecendo uma interface para operações CRUD em entidades. Utiliza adaptadores para interagir com ORMs/bibliotecas de banco de dados (Mongoose).
*   **Infraestrutura (Infra, Adapters, Libs):** Lida com detalhes técnicos e integrações externas, como banco de dados, filas, serviços de terceiros (Notion, StatusInvest). Adaptadores e bibliotecas (Libs) são usados para interagir com esses sistemas.
*   **Entidades e Schemas:** Define as estruturas de dados do domínio e o mapeamento para o banco de dados.
*   **Validações:** Encapsula a lógica de validação de dados de entrada.
*   **Configuração:** Centraliza as configurações da aplicação.
*   **Utilitários:** Contém funções auxiliares de uso geral.
*   **Contratos/Protocolos:** Define interfaces e tipos compartilhados entre camadas e módulos.

Essa estrutura ajuda a manter a coesão dentro de cada camada e o baixo acoplamento entre elas.

### Exemplos

**Seguindo o padrão:**

*   `server/controllers/UserController.ts` (Camada de Apresentação) interage com `server/services/AuthService.ts` (Camada de Negócios) e `server/repositories/UserRepository.ts` (Camada de Acesso a Dados).

```typescript
// server/controllers/UserController.ts
class UserController {
	async signup ({ request, response }: ApiHandlerInput<{}, SignupBody, {}>): Promise<void> {
		// ... validação ...
		const { password, name, email } = validation.data

		const hashedPassword = await AuthService.makeHashedPassword(password) // Interação com Service

		const user = await UserRepository.create({ // Interação com Repository
			email,
			name,
			password: hashedPassword
		})

		const authToken = await AuthService.generateAuthToken(user.id) // Interação com Service

		return response.created({ authToken }) // Interação com Adapters HTTP (via response object)
	}
	// ...
}
```

**Não seguindo o padrão (exemplo hipotético que quebraria a separação):**

*   Um Controller acessando diretamente um Schema do Mongoose ou contendo lógica de negócios complexa.

```typescript
// Exemplo hipotético (não presente no código, mas demonstra a quebra do padrão)
// server/controllers/BadExampleController.ts
import UserSchema from "@server/schemas/UserSchema" // Acessando Schema diretamente

class BadExampleController {
	async createUser ({ request, response }: ApiHandlerInput): Promise<void> {
		// Lógica de negócios complexa diretamente no controller
		const newUser = new UserSchema({ ...request.body });
		await newUser.save(); // Interação direta com o modelo de dados
		// ... validação complexa e regras aqui ...
		response.created({ id: newUser._id });
	}
}
```

## Padrão Repository

### Descrição

O padrão Repository é utilizado para abstrair a lógica de persistência de dados. Classes que terminam em `Repository` fornecem métodos para realizar operações de CRUD (Create, Retrieve, Update, Delete) em entidades específicas (e.g., `UserRepository` para `UserEntity`). Elas escondem os detalhes da implementação do banco de dados (neste caso, Mongoose) por trás de uma interface comum definida em `RepositoryContract.ts`.

### Exemplos

**Seguindo o padrão:**

*   As classes `UserRepository`, `IntegrationRepository` e `AssetSyncRepository` estendem `MongooseRepositoryAdapter`, que implementa `RepositoryContract`. Elas fornecem métodos como `create`, `retrieveOne`, `updateOneById`, etc.

```typescript
// server/repositories/UserRepository.ts
import MongooseRepositoryAdapter from "@server/adapters/MongooseRepositoryAdapter"
import UserEntity from "@server/entities/UserEntity"
import UserSchema from "@server/schemas/UserSchema"

class UserRepository extends MongooseRepositoryAdapter<UserEntity> {}

export default new UserRepository(UserSchema) // Instanciando o adapter com o schema
```

*   O uso do Repository em um Service ou Controller:

```typescript
// server/services/AuthService.ts
import UserRepository from "@server/repositories/UserRepository" // Importando o Repository

class AuthService {
	// ...
	async generateAuthToken (userId: string): Promise<string> {
		// ... lógica ...
		// Nenhum detalhe de Mongoose aqui, apenas uso da interface do Repository
		// Exemplo: const user = await UserRepository.retrieveOneById(userId);
		// ...
	}
	// ...
}
```

**Não seguindo o padrão (exemplo hipotético que quebraria a abstração):**

*   Um Service ou Controller acessando diretamente o modelo do Mongoose ou executando queries complexas.

```typescript
// Exemplo hipotético (não presente no código, mas demonstra a quebra do padrão)
// server/services/BadExampleService.ts
import UserSchema from "@server/schemas/UserSchema" // Acessando Schema diretamente

class BadExampleService {
	async findActiveUsers () {
		// Query de Mongoose complexa diretamente no Service
		const activeUsers = await UserSchema.find({ status: 'active', created_at: { $gt: new Date('2023-01-01') } }).exec();
		return activeUsers;
	}
}
```

## Padrão Service Layer

### Descrição

A camada de Services (`server/services`) encapsula a lógica de negócios complexa. Esses serviços orquestram chamadas para Repositories, Libs e outros Services para realizar tarefas específicas, como autenticação (`AuthService`), agendamento de sincronização (`AssetSyncSchedulerService`) ou interações com integrações (`IntegrationService`). Eles fornecem uma interface mais granular e orientada a casos de uso para os Controllers.

### Exemplos

**Seguindo o padrão:**

*   `AuthService` encapsula a lógica de criação de hash de senha, validação de senha e geração/decodificação de tokens de autenticação.

```typescript
// server/services/AuthService.ts
import HashService from "@server/services/HashService" // Utilizando outros Services
import CryptService from "@server/services/CryptService" // Utilizando outros Services
import AuthConfig from "@server/config/AuthConfig" // Utilizando configuração

class AuthService {
	private readonly hashService = new HashService(AuthConfig.hashSaltRounds)
	private readonly cryptService = new CryptService(AuthConfig.tokenSecret)

	async makeHashedPassword (password: string): Promise<string> {
		return await this.hashService.makeHash(password) // Delega para HashService
	}

	async generateAuthToken (userId: string): Promise<string> {
		const authToken = this.cryptService.encode<AuthTokenPayload>({ // Delega para CryptService
			userId
		}, {
			expiresIn: AuthConfig.tokenExpirationInSeconds
		})

		return authToken
	}
	// ... outros métodos de negócio de autenticação
}
```

*   `IntegrationService` encapsula a lógica para obter uma integração Notion específica de um usuário.

```typescript
// server/services/IntegrationService.ts
import IntegrationRepository from "@server/repositories/IntegrationRepository" // Utilizando Repository

class IntegrationService {
	async getNotionIntegration (userId: string): Promise<IntegrationEntity | null> {
		return await IntegrationRepository.retrieveOne({ // Utilizando método do Repository
			type: "notion",
			user_id: userId
		})
	}
}
```

**Não seguindo o padrão (exemplo hipotético que colocaria lógica de negócio em outro lugar):**

*   Um Controller ou uma Lib contendo lógica complexa de negócio que deveria estar em um Service.

```typescript
// Exemplo hipotético (não presente no código, mas demonstra a quebra do padrão)
// server/controllers/BadExampleController.ts
import IntegrationRepository from "@server/repositories/IntegrationRepository" // Acessando Repository

class BadExampleController {
	async createNotionIntegration ({ request, response, context }: ApiHandlerInput): Promise<void> {
		const userId = context.auth.userId
		const { type, token } = request.body // Dados da requisição

		// Lógica de negócio para verificar se o usuário já tem uma integração deste tipo
		const existingIntegration = await IntegrationRepository.retrieveOne({ user_id: userId, type })
		if (existingIntegration) {
			return response.badRequest({ type: "IntegrationAlreadyExists" })
		}

		// Lógica de negócio para criar a integração
		const integration = await IntegrationRepository.create({
			token,
			type,
			user_id: userId
		})

		return response.created({ id: integration.id })
		// Essa lógica complexa (verificação e criação) deveria estar em IntegrationService.
	}
}
```

## Padrão Adapter

### Descrição

O padrão Adapter é usado extensivamente para adaptar interfaces de bibliotecas ou frameworks externos (como Mongoose, Quirrel, Next.js, NodeCache) a interfaces mais genéricas definidas nos arquivos `contracts`. Isso permite que as camadas de negócio e de aplicação (Services, Controllers) interajam com esses sistemas externos de forma desacoplada, através dos `contracts`.

### Exemplos

**Seguindo o padrão:**

*   `MongooseRepositoryAdapter` adapta a interface do Mongoose (`mongoose.Model`) para a interface genérica `RepositoryContract`.

```typescript
// server/adapters/MongooseRepositoryAdapter.ts
import { Model } from "mongoose" // Dependência da biblioteca externa
import { RepositoryContract, DefaultEntity, CreateInput, WhereInput, UpdateInput } from "@server/contracts/RepositoryContract" // Interface genérica

class MongooseRepositoryAdapter<Entity extends DefaultEntity> implements RepositoryContract<Entity> {
	private readonly schema: Model<Entity> // Objeto da biblioteca externa

	constructor (schema: Model<Entity>) {
		this.schema = schema
	}

	async create (data: CreateInput<Entity>): Promise<Entity> {
		const entity = await this.schema.create(data) // Uso específico da API do Mongoose
		return entity
	}
	// ... outros métodos adaptando Mongoose para RepositoryContract
}
```

*   `NextHttpAdapter` adapta as requisições e respostas do Next.js (`NextApiRequest`, `NextApiResponse`) para as interfaces genéricas `ApiHandlerRequest` e `ApiHandlerResponse` definidas em `HttpContract.ts`.

```typescript
// server/adapters/NextHttpAdapter.ts
import { NextApiRequest, NextApiResponse } from "next" // Dependência do framework externo
import { ApiHandler, ApiHandlerInput, ApiHandlerRequest, ApiHandlerResponse, DefaultData, HttpContract } from "@server/contracts/HttpContract" // Interfaces genéricas
import { RawApiHandler } from "@server/protocols/NextHttpProtocol" // Tipo específico do framework

class NextHttpAdapter implements HttpContract<RawApiHandler> {
	adaptApiHandler (handler: ApiHandler): RawApiHandler {
		return async (req: NextApiRequest, res: NextApiResponse) => { // Parâmetros específicos do Next.js
			const input: ApiHandlerInput<{}, {}, {}> = {
				request: this.adaptApiHandlerRequest(req), // Adaptação da requisição
				response: this.adaptApiHandlerResponse(res), // Adaptação da resposta
				context: (req as any).context // Acessando context customizado
			}
			// ... lógica que usa a interface genérica 'input'
		}
	}
	// ... métodos adaptando Next.js Request/Response para HttpContract Request/Response
}
```

**Não seguindo o padrão (exemplo hipotético que usaria a biblioteca diretamente):**

*   Um Service ou Controller acessando diretamente objetos do Mongoose, Quirrel ou Next.js sem passar por um Adapter.

```typescript
// Exemplo hipotético (não presente no código, mas demonstra a quebra do padrão)
// server/services/BadExampleService.ts
import mongoose from "mongoose" // Dependência direta da biblioteca externa

class BadExampleService {
	async checkDatabaseConnectionStatus () {
		// Acesso direto ao estado da conexão Mongoose
		const state = mongoose.connection.readyState;
		return state === 1 ? "connected" : "disconnected";
		// Essa lógica deveria estar encapsulada dentro do DatabaseModule (que é um tipo de adapter/infra module).
	}
}
```

## Estrutura de Organização por Módulo/Camada

### Descrição

O código é organizado em diretórios que correspondem, em grande parte, às camadas arquiteturais e a domínios específicos. Esta é uma forma de Modularização por Camadas e Domínios. A raiz `server/` contém subdiretórios como `adapters`, `config`, `contracts`, `controllers`, `entities`, `exceptions`, `infra`, `lib`, `middlewares`, `protocols`, `queues`, `repositories`, `schemas`, `services`, `utils`, que agrupam arquivos com responsabilidades semelhantes. No lado do cliente (`client/`), a organização também segue padrões por funcionalidade (e.g., `components`, `config`, `hooks`, `pages`, `protocols`, `routes`, `utils`).

### Exemplos

**Seguindo o padrão:**

*   Todos os arquivos relacionados à configuração estão no diretório `server/config/`.
    *   `server/config/AuthConfig.ts`
    *   `server/config/DatabaseConfig.ts`

*   Todos os arquivos que definem Entidades estão no diretório `server/entities/`.
    *   `server/entities/UserEntity.ts`
    *   `server/entities/IntegrationEntity.ts`
    *   `server/entities/AssetSyncEntity.ts`

*   No cliente, todos os componentes reutilizáveis estão em `client/components/`.
    *   `client/components/Button/index.tsx`
    *   `client/components/Modal/index.tsx`

**Não seguindo o padrão (exemplo hipotético que quebraria a organização):**

*   Um arquivo de configuração colocado em um diretório de Services, ou um arquivo de Repository colocado em Utilitários.

```
// Exemplo hipotético (não presente no código, mas demonstra a quebra do padrão)
server/services/AuthConfigService.ts // Configuração dentro de Services
server/utils/UserRepositoryUtil.ts // Repository dentro de Utils
client/pages/Button.tsx // Componente reutilizável dentro de Pages
```

## Padrão Singleton (Instância Única Exportada)

### Descrição

Muitas classes são instanciadas e exportadas como uma única instância padrão (default export). Isso é uma forma de aplicar o padrão Singleton, garantindo que haja apenas um ponto de acesso e uma única instância para módulos como serviços, utilitários, adaptadores de infraestrutura e controllers que não precisam de múltiplas instâncias.

### Exemplos

**Seguindo o padrão:**

*   `DatabaseModule` é uma classe, mas sua instância é exportada por padrão, tornando-o um singleton na prática.

```typescript
// server/infra/database/index.ts
class DatabaseModule {
	async start (): Promise<void> {
		// ...
	}
}

export default new DatabaseModule() // Instância única exportada
```

*   Vários Utilitários são instanciados e exportados da mesma forma.

```typescript
// server/utils/StringUtil.ts
class StringUtil {
	areSimilar (firstString: string, secondString: string): boolean {
		// ...
	}
	// ...
}

export default new StringUtil() // Instância única exportada
```

*   Vários Controllers são instanciados e exportados.

```typescript
// server/controllers/UserController.ts
class UserController {
	async signup ({ request, response }: ApiHandlerInput<{}, SignupBody, {}>): Promise<void> {
		// ...
	}
	// ...
}

export default new UserController() // Instância única exportada
```

**Não seguindo o padrão:**

*   Algumas classes são exportadas diretamente e requerem `new` para serem utilizadas, como `NotionLib`, `HashService`, `CryptService`, `MongooseRepositoryAdapter` e `NodeCacheAdapter`. Elas não são estritamente Singletons exportados.

```typescript
// server/lib/NotionLib.ts
import { Client } from "@notionhq/client"

class NotionLib { // Exportada como classe
	private readonly client: Client

	constructor (token: string) { // Requer new e um parâmetro
		this.client = new Client({ auth: token })
	}
	// ...
}

export default NotionLib // Exportada como classe
```

*   O uso dessas classes que não são Singletons exportados:

```typescript
// server/queues/SyncNotionAssetPriceQueue.ts
import NotionLib from "@server/lib/NotionLib" // Importa a classe

class SyncNotionAssetPriceQueue implements QueueHandler {
	async handle (payload: QueuePayload["SyncNotionAssetPrice"]): Promise<void> {
		// ...
		const notion = new NotionLib(integration.token) // Precisa instanciar com new
		// ...
	}
	// ...
}
```

## Padrão Naming Convention (Server-side)

### Descrição

Existe uma convenção de nomenclatura para classes e arquivos no lado do servidor que reflete suas responsabilidades ou o padrão arquitetural que implementam.

*   **`...Module`**: Usado para módulos de infraestrutura que inicializam recursos externos (`DatabaseModule`, `QueueModule`).
*   **`...Lib`**: Usado para classes que encapsulam interações com bibliotecas ou serviços de terceiros (`StatusInvestLib`, `NotionLib`).
*   **`...Repository`**: Usado para classes que implementam o padrão Repository (`UserRepository`, `IntegrationRepository`, `AssetSyncRepository`).
*   **`...Service`**: Usado para classes que encapsulam lógica de negócio (`AuthService`, `IntegrationService`, `AssetSyncSchedulerService`, `InvestmentService`, `LogService`, `InMemoryCacheService`, `HashService`, `CryptService`).
*   **`...Controller`**: Usado para classes que lidam com requisições HTTP (`UserController`, `IntegrationController`, `NotionIntegrationController`, `NotionAssetSyncController`).
*   **`...Entity`**: Usado para definir as estruturas de dados do domínio (`UserEntity`, `IntegrationEntity`, `AssetSyncEntity`).
*   **`...Schema`**: Usado para definir os schemas do banco de dados (`UserSchema`, `IntegrationSchema`, `AssetSyncSchema`).
*   **`...Adapter`**: Usado para classes que implementam o padrão Adapter (`MongooseRepositoryAdapter`, `QuirrelQueueAdapter`, `NextHttpAdapter`, `NodeCacheAdapter`).
*   **`...Util`**: Usado para classes que agrupam funções utilitárias ou helpers (`StringUtil`, `NumberUtil`, `MongooseUtil`, `ErrorSerializationUtil`, `StatusInvestUtil`, `ValidationUtil`, `IdentificationUtil`).
*   **`...Config`**: Usado para arquivos de configuração (`AuthConfig`, `DatabaseConfig`).
*   **`...Contract`** ou **`...Protocol`**: Usado para definir interfaces, tipos e contratos (`RepositoryContract`, `HttpContract`, `QueueContract`, `AuthProtocol`, `NotionProtocol`, etc.).
*   **`...Validation`**: Usado para classes que encapsulam lógica de validação (`UserValidation`, `IntegrationValidation`, `NotionAssetSyncValidation`, `AssetSyncValidation`).
*   **`...Middleware`**: Usado para classes que implementam middlewares (`InfraMiddleware`, `AuthMiddleware`).
*   **`...Exception`**: Usado para classes de exceção customizadas (`QueueProcessException`).

### Exemplos

**Seguindo o padrão:**

*   A classe que lida com a lógica de autenticação é chamada `AuthService`.
    *   `server/services/AuthService.ts`

*   A classe que abstrai o acesso ao banco de dados de usuários é chamada `UserRepository`.
    *   `server/repositories/UserRepository.ts`

*   A classe que adapta requisições HTTP é chamada `NextHttpAdapter`.
    *   `server/adapters/NextHttpAdapter.ts`

**Não seguindo o padrão (exemplo hipotético que violaria a convenção):**

*   Uma classe de Service chamada `AuthLogic`, ou uma classe de Repository chamada `UserDataHelper`.

```
// Exemplo hipotético (não presente no código, mas demonstra a quebra da convenção)
server/services/AuthLogic.ts // Deveria ser AuthService
server/utils/UserDataHelper.ts // Se lida com persistência, deveria ser UserRepository ou parte dele
server/infra/HttpHandler.ts // Deveria ser NextHttpAdapter ou semelhante
```

## Padrão Naming Convention (Client-side)

### Descrição

Existe uma convenção de nomenclatura para arquivos e diretórios no lado do cliente, focada na organização de componentes, hooks, utilitários e configuração.

*   **Componentes:** Arquivos de componente principal geralmente estão em `client/components/NomeComponente/index.tsx`. Componentes filhos ou relacionados podem estar no mesmo diretório ou em subdiretórios.
*   **Hooks:** Arquivos de hooks customizados estão em `client/hooks/`.
*   **Utils:** Funções utilitárias estão em `client/utils/`, agrupadas por responsabilidade (e.g., `style.ts`, `date.ts`).
*   **Config:** Arquivos de configuração estão em `client/config/`.
*   **Pages:** Componentes que representam páginas estão em `client/pages/`.
*   **Protocols:** Definições de tipos/interfaces estão em `client/protocols/`.
*   **Routes:** Configuração e lógica de roteamento estão em `client/routes/`.

### Exemplos

**Seguindo o padrão:**

*   O componente principal `Button` está em `client/components/Button/index.tsx`.
*   A configuração da API está em `client/config/api.ts`.
*   O hook `useDidMount` está em `client/hooks/useDidMount.ts`.
*   As funções utilitárias de estilo estão em `client/utils/style.ts`.

**Não seguindo o padrão (exemplo hipotético que violaria a convenção):**

*   Um arquivo de configuração em `client/utils/apiConfig.ts` ou um hook em `client/components/useMyHook.ts`.

```
// Exemplo hipotético (não presente no código, mas demonstra a quebra da convenção)
client/utils/apiConfig.ts // Deveria estar em client/config/api.ts
client/components/ButtonComponent.tsx // Poderia ser client/components/Button/index.tsx ou Button.tsx
client/hooks/components/useComponentHook.ts // Hook dentro de diretório de componente
```

## Padrão Centralização de Configuração

### Descrição

Os dados de configuração (como credenciais de banco de dados, segredos de token, tempos de expiração) são centralizados em arquivos específicos dentro do diretório `server/config`. Isso facilita a gestão, atualização e externalização das configurações (e.g., lendo de variáveis de ambiente).

### Exemplos

**Seguindo o padrão:**

*   Todas as configurações de banco de dados estão em `server/config/DatabaseConfig.ts`.

```typescript
// server/config/DatabaseConfig.ts
const DatabaseConfig = {
	host: process.env.DATABASE_HOST, // Lendo de variável de ambiente
	user: process.env.DATABASE_USERNAME,
	password: process.env.DATABASE_PASSWORD,
	name: process.env.DATABASE_NAME,
	port: Number(process.env.DATABASE_PORT),
}

export default DatabaseConfig
```

*   As configurações de autenticação estão em `server/config/AuthConfig.ts`.

```typescript
// server/config/AuthConfig.ts
const AuthConfig = {
	tokenKey: "x-investy-auth-token",
	tokenExpirationInSeconds: 60 * 60 * 24 * (1), // 24 hours
	tokenSecret: process.env.AUTH_TOKEN_SECRET, // Lendo de variável de ambiente
	hashSaltRounds: 12,
}

export default AuthConfig
```

**Não seguindo o padrão (exemplo hipotético que espalharia a configuração):**

*   Um segredo ou configuração de tempo de expiração definido diretamente em um arquivo de Service ou Controller.

```typescript
// Exemplo hipotético (não presente no código, mas demonstra a quebra do padrão)
// server/services/AuthService.ts
// const tokenSecret = "hardcoded-secret"; // Segredo hardcoded aqui
// const expiration = 60 * 60; // Expiração hardcoded aqui
```

## Padrão Tratamento de Erros Consistente (Parcial)

### Descrição

Existe um esforço para tratar erros de forma consistente em algumas áreas, especialmente no lado do servidor e no tratamento de filas.
No server-side HTTP:
*   Controllers retornam respostas de erro padronizadas (`response.badRequest`, `response.notFound`, `response.serverError`, etc.) via o Adapter HTTP.
*   O Adapter HTTP (`NextHttpAdapter`) inclui um bloco `try...catch` para capturar erros não tratados nos handlers e retornar um `serverError`, além de logar o erro (`LogService.error`).
No processamento de filas:
*   O `BaseQueue` (classe base para adaptadores de fila) implementa um bloco `try...catch` para o método `process`.
*   Ele chama métodos de lifecycle (`onActive`, `onCompleted`, `onError`) para lidar com diferentes estágios do processamento da fila.
*   Erros no processamento da fila são capturados e o método `onError` é chamado, que loga o erro e atualiza o status do `AssetSync`.
*   Erros são serializados usando `ErrorSerializationUtil.serialize` antes de serem armazenados no banco de dados.
*   Exceções customizadas (`QueueProcessException`) são usadas para indicar erros específicos durante o processamento da fila.

### Exemplos

**Seguindo o padrão:**

*   Tratamento de erro no Adapter HTTP:

```typescript
// server/adapters/NextHttpAdapter.ts
class NextHttpAdapter implements HttpContract<RawApiHandler> {
	adaptApiHandler (handler: ApiHandler): RawApiHandler {
		return async (req: NextApiRequest, res: NextApiResponse) => {
			// ... input preparation ...
			try {
				return await handler(input) // Chama o handler (Controller/Middleware)
			} catch (error) {
				LogService.error(error) // Loga o erro
				return input.response.serverError() // Retorna resposta de erro padrão
			}
		}
	}
	// ...
}
```

*   Tratamento de erro no processamento da fila:

```typescript
// server/contracts/QueueContract.ts (BaseQueue)
export abstract class BaseQueue {
	protected async process (handler: QueueHandler, payload: QueuePayload[QueueName]): Promise<void> {
		try {
			await this.onActive(handler, payload)
			await handler.handle(payload) // Lógica principal que pode lançar erro
			await this.onCompleted(handler, payload)
		} catch (error) {
			await this.onError(handler, payload, error) // Chama o handler de erro
		}
	}

	protected async onError (handler: QueueHandler, payload: QueuePayload[QueueName], error: Error): Promise<void> {
		LogService.info(`[Queue][${handler.name}] ERROR!`)
		LogService.error(error) // Loga o erro

		setImmediate(() => { // Executa assincronamente
			handler?.onError(payload, error)?.catch(LogService.error) // Chama o onError específico do handler
		})	
	}
	// ...
}
```

*   Implementação específica do `onError` no handler da fila:

```typescript
// server/queues/SyncNotionAssetPriceQueue.ts
import ErrorSerializationUtil from "@server/utils/ErrorSerializationUtil" // Serializa o erro
import AssetSyncRepository from "@server/repositories/AssetSyncRepository" // Atualiza status no DB

class SyncNotionAssetPriceQueue implements QueueHandler {
	// ... handle, onActive, onCompleted ...
	async onError (payload: QueuePayload["SyncNotionAssetPrice"], error: Error): Promise<void> {
		const { assetSyncId } = payload

		await AssetSyncRepository.updateOneById(assetSyncId, { // Atualiza status no DB
			last_sync_status: "error",
			last_sync_error: ErrorSerializationUtil.serialize(error) // Armazena erro serializado
		})

		await AssetSyncSchedulerService.scheduleNotionAssetSync(assetSyncId) // Agenda nova tentativa ou próximo ciclo
	}
}
```

**Não seguindo o padrão (exemplo hipotético que não trataria ou logaria erros adequadamente):**

*   Um método em um Service que ignora ou simplesmente lança um erro sem logar ou tratar.

```typescript
// Exemplo hipotético (não presente no código, mas demonstra a quebra do padrão)
// server/services/BadExampleService.ts
class BadExampleService {
	async fetchData () {
		// Fetch data from external API
		const response = await fetch("..."); // Pode falhar

		if (!response.ok) {
			// Erro não tratado, apenas lançado
			throw new Error("Failed to fetch data"); // O erro pode não ser logado ou tratado adequadamente pelas camadas superiores se elas não tiverem catchs apropriados.
		}

		return response.json();
	}
}
```

## Padrão Nomenclatura de Métodos de Repositório

### Descrição

Os métodos nas classes Repository (`server/repositories`) seguem uma convenção de nomenclatura baseada nas operações CRUD que realizam, muitas delas herdadas do `MongooseRepositoryAdapter`.

*   `create`: Para criar uma nova entidade.
*   `retrieveOne`: Para buscar uma única entidade por critérios.
*   `retrieveOneById`: Para buscar uma única entidade pelo ID.
*   `retrieveAll`: Para buscar múltiplas entidades por critérios.
*   `updateOneById`: Para atualizar uma entidade pelo ID.
*   `updateMany`: Para atualizar múltiplas entidades por critérios.
*   `deleteMany`: Para deletar múltiplas entidades por critérios.

### Exemplos

**Seguindo o padrão:**

*   `UserRepository` utiliza métodos como `create` e `retrieveOne`.

```typescript
// server/repositories/UserRepository.ts
class UserRepository extends MongooseRepositoryAdapter<UserEntity> {
	// Métodos herdados do adapter:
	// async create (data: CreateInput<UserEntity>): Promise<UserEntity>
	// async retrieveOne (where: WhereInput<UserEntity>): Promise<UserEntity | null>
	// async retrieveOneById (id: string): Promise<UserEntity | null>
	// async retrieveAll (where: WhereInput<UserEntity>): Promise<UserEntity[]>
	// async updateOneById (id: string, data: UpdateInput<UserEntity>): Promise<void>
	// async updateMany (where: WhereInput<UserEntity>, data: UpdateInput<UserEntity>): Promise<void>
	// async deleteMany (where: WhereInput<UserEntity>): Promise<void>
}
```

*   Uso dos métodos em um Controller:

```typescript
// server/controllers/UserController.ts
import UserRepository from "@server/repositories/UserRepository"

class UserController {
	async signup ({ request, response }: ApiHandlerInput<{}, SignupBody, {}>): Promise<void> {
		// ...
		const user = await UserRepository.create({ // Usando o método 'create'
			email,
			name,
			password: hashedPassword
		})
		// ...
	}

	async login ({ request, response }: ApiHandlerInput<{}, LoginBody, {}>): Promise<void> {
		// ...
		const user = await UserRepository.retrieveOne({ email }) // Usando o método 'retrieveOne'
		// ...
	}
}
```

**Não seguindo o padrão (exemplo hipotético que usaria outra nomenclatura):**

*   Um método em um Repository chamado `getUserByEmail` em vez de `retrieveOne`, ou `saveUser` em vez de `create` ou `updateOneById`.

```typescript
// Exemplo hipotético (não presente no código, mas demonstra a quebra do padrão)
class UserRepository extends MongooseRepositoryAdapter<UserEntity> {
	async getUserByEmail (email: string): Promise<UserEntity | null> { // Deveria ser retrieveOne({ email })
		const entity = await this.schema.findOne({ email });
		return entity;
	}
}
```

---

## Arquitetura Orientada a Componentes (Client-side)

### Descrição

O código do lado do cliente (dentro do diretório `client`) segue fortemente uma arquitetura baseada em componentes, onde a UI é construída a partir de pequenas unidades independentes e reutilizáveis. Cada componente encapsula sua própria lógica, estado e renderização.

### Exemplos

**Seguindo o padrão:**
O arquivo `examples/investy/client/pages/Login/index.tsx` demonstra o uso do padrão ao compor a página de Login utilizando vários componentes menores como `PageContainer`, `Head`, `Divider`, `InputLabel`, `TextInput`, `Button` e `Link`.

```typescript
// examples/investy/client/pages/Login/index.tsx
const Login = () => {
	// ... state and logic ...
	return (
		<PageContainer> // Componente PageContainer
			<Head // Componente Head
				page={{
					title: `Investy | ${routeConfig.login.title}`
				}}
			/>
			{/* ... outros elementos ... */}
			<Divider orientation="horizontal" size="md" /> {/* Componente Divider */}
			{/* ... */}
					<InputLabel // Componente InputLabel
						inputName="email"
					>
						Email
					</InputLabel>
					<TextInput // Componente TextInput
						fullWidth
						name="email"
						value={data.email}
						onValueChange={value => handleChange("email", value)}
						errorMessage={validation.messages.email}
					/>
			{/* ... */}
			<Button // Componente Button
				fullWidth
				variant="primary"
				type="submit"
				loading={loading}
			>
				Sign in
			</Button>
		</PageContainer>
	)
}
```

**Não seguindo o padrão (Exemplo Hipotético):**
Em uma arquitetura não baseada em componentes, a lógica e a renderização de uma página inteira estariam contidas em uma única função ou classe grande, sem a decomposição em unidades menores. Como o codebase fornecido é um projeto React, ele intrinsecamente segue uma arquitetura baseada em componentes, portanto, um exemplo real que *não* segue o padrão não está presente nos arquivos. No entanto, um código que renderizasse todo o formulário de login e seus inputs diretamente dentro da função `Login` sem usar os componentes `InputLabel`, `TextInput`, `Button`, etc., seria um exemplo de *não* seguir este padrão de granularidade e reutilização.

## Componentes Funcionais e Hooks (Client-side)

### Descrição

No lado do cliente, a abordagem predominante para construir a UI é através de componentes funcionais do React, combinados com o uso extensivo de Hooks (nativos como `useState`, `useEffect` e customizados). Esta é a forma recomendada de desenvolver componentes no React moderno, gerenciando estado e efeitos colaterais dentro de funções.

### Exemplos

**Seguindo o padrão:**
O arquivo `examples/investy/client/components/InputLabel/index.tsx` é um exemplo simples de componente funcional que recebe props e retorna JSX.

```typescript
// examples/investy/client/components/InputLabel/index.tsx
import { FC } from "react" // Uso de componente funcional (FC)

type InputLabelProps = {
	inputName: string
}

const InputLabel: FC<InputLabelProps> = (props) => { // Componente funcional
	const {
		inputName,
		children
	} = props

	return ( // Retorna JSX
		<label
			className="block text-gray-900 text-sm font-medium mb-2"
			htmlFor={inputName}
		>
			{children}
		</label>
	)
}

export default InputLabel
```
O arquivo `examples/investy/client/pages/Login/index.tsx` demonstra o uso de Hooks, como `useState` e o hook customizado `useValidation`.

```typescript
// examples/investy/client/pages/Login/index.tsx
import { FormEventHandler, useState } from "react" // Uso de useState

// ... imports ...

import useValidation from "@client/hooks/useValidation" // Uso de hook customizado

type Data = {
	email: string
	password: string
}

const Login = () => {
	const [data, setData] = useState({} as Data) // Uso de useState
	const [loading, setLoading] = useState(false) // Uso de useState
	const validation = useValidation() // Uso de hook customizado

	// ... rest of the component logic ...
}
```

**Não seguindo o padrão (Exemplo Hipotético):**
Em um projeto React mais antigo ou que não segue as práticas modernas, os componentes poderiam ser definidos como classes que estendem `React.Component` e utilizariam `this.state`, `componentDidMount`, etc., em vez de Hooks. Como todos os componentes fornecidos são funcionais, um exemplo real que não segue este padrão não está presente.

## Padrão Compound Component (Client-side)

### Descrição

Alguns componentes mais complexos, como `Modal`, `Table`, `SelectInput` e `Dropdown`, utilizam o padrão Compound Component. Neste padrão, um componente pai gerencia o estado e a lógica compartilhada, enquanto componentes filhos (aninhados como propriedades do pai) são usados para compor a estrutura interna, permitindo uma API mais declarativa e flexível.

### Exemplos

**Seguindo o padrão:**
O arquivo `examples/investy/client/components/PopConfirm/index.tsx` utiliza o componente `Modal`, que é um Compound Component, através de suas propriedades `Modal.Content` e `Modal.Trigger`.

```typescript
// examples/investy/client/components/PopConfirm/index.tsx
// ... imports ...
import Modal from "@client/components/Modal" // Importa o componente pai

// ... type definitions ...

const PopConfirm: FC<PopConfirmProps> = (props) => {
	const {
		description,
		children,
		onConfirm
	} = props

	return (
		<Modal // Componente pai
			title="Are you sure?"
			onConfirm={onConfirm}
		>
			<Modal.Content> {/* Componente filho (parte do Compound Component) */}
				{description}
			</Modal.Content>

			<Modal.Trigger> {/* Componente filho (parte do Compound Component) */}
				{children}
			</Modal.Trigger>
		</Modal>
	)
}
```
Outro exemplo é o componente `Table` em `examples/investy/client/pages/AssetSyncs/Notion/index.tsx`, que utiliza `Table.Head`, `Table.Column`, `Table.Body` e `Table.Row`.

```typescript
// examples/investy/client/pages/AssetSyncs/Notion/index.tsx
// ... imports ...
import Table from "@client/components/Table" // Importa o componente pai

// ... component logic ...

return (
	// ... other JSX ...
	<Table> {/* Componente pai */}
		<Table.Head> {/* Componente filho */}
			<Table.Column> {/* Componente filho */}
				Database
			</Table.Column>
			{/* ... other Table.Column ... */}
		</Table.Head>

		<Table.Body> {/* Componente filho */}
			{notionAssetSyncs.map(notionAssetSync => (
				<Table.Row // Componente filho
					key={notionAssetSync.id}
				>
					{/* ... Table.Column children ... */}
				</Table.Row>
			))}
		</Table.Body>
	</Table>
	// ... other JSX ...
)
```

**Não seguindo o padrão:**
O arquivo `examples/investy/client/components/IconButton/index.tsx` é um componente simples que não gerencia o estado compartilhado de múltiplos elementos filhos complexos, portanto, não utiliza o padrão Compound Component. Ele apenas recebe props e renderiza um único elemento `<button>`.

```typescript
// examples/investy/client/components/IconButton/index.tsx
import { ButtonHTMLAttributes, FC } from "react"
// ... imports ...

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

const IconButton: FC<IconButtonProps> = (props) => {
	// ... props destructuring and logic ...

	return ( // Renderiza um único elemento raiz, sem sub-componentes aninhados
		<button
			// ... attributes ...
			{...rest}
		>
			{children}
		</button>
	)
}
```

## Camada de Serviços (Client-side)

### Descrição

O código do lado do cliente separa a lógica para interagir com APIs externas (como o backend) e lidar com funcionalidades cross-cutting (como autenticação) em uma camada de serviços dedicada (`client/services`). Isso centraliza a lógica de comunicação e persistência do lado do cliente, promovendo a reutilização e facilitando a manutenção.

### Exemplos

**Seguindo o padrão:**
O arquivo `examples/investy/client/services/api.ts` define uma instância configurada do Axios para todas as chamadas de API, incluindo interceptors para adicionar tokens de autenticação e lidar com erros. O arquivo `examples/investy/client/services/auth.ts` centraliza as operações relacionadas ao token de autenticação (guardar, obter, limpar, redirecionar). O arquivo `examples/investy/client/pages/Login/index.tsx` demonstra o uso desses serviços para realizar o login.

```typescript
// examples/investy/client/pages/Login/index.tsx
// ... imports ...
import { api } from "@client/services/api" // Uso do serviço api
import { loginAndRedirect } from "@client/services/auth" // Uso do serviço auth

// ... component state and logic ...

const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
	event.preventDefault()
	setLoading(true)

	try {
		// Interação com a API usando o serviço 'api'
		const response = await api.post<{ authToken: string }>("/users/login", data)

		// Manipulação da autenticação usando o serviço 'auth'
		loginAndRedirect(response.data.authToken)
	} catch (error) {
		validation.digestRequestError(error)
	}

	setLoading(false)
}
```
O arquivo `examples/investy/client/pages/AssetSyncs/Notion/index.tsx` também usa o serviço `api` para buscar dados e enviar requisições.

```typescript
// examples/investy/client/pages/AssetSyncs/Notion/index.tsx
// ... imports ...
import { api } from "@client/services/api" // Uso do serviço api

// ... component state and logic ...

const loadData = async () => {
	// Interação com a API usando o serviço 'api'
	const response = await api.get<NotionAssetSync[]>("/asset-syncs/notion")
	setNotionAssetSyncs(response.data)
	setLoading(false)
}

const handleSync = async (notionAssetSync: NotionAssetSync) => {
	// Interação com a API usando o serviço 'api'
	await api.post(`/asset-syncs/${notionAssetSync.id}/notion`)
}
```

**Não seguindo o padrão (Exemplo Hipotético):**
Em um código que não segue o padrão de camada de serviços, as requisições HTTP poderiam ser feitas diretamente dentro dos componentes da página ou funções utilitárias, espalhando a lógica de comunicação pela codebase.
Exemplo hipotético (não presente no código):

```typescript
// Exemplo hipotético de código que *não* segue o padrão de serviço
// Diretamente dentro de um componente ou hook:
import axios from 'axios'; // Importa axios diretamente
// ... dentro de uma função async ...
try {
  // Faz a chamada API diretamente, sem usar o serviço 'api' configurado
  const response = await axios.post('http://localhost:3000/api/users/login', data, {
      headers: { 'Auth-Token': localStorage.getItem('auth-token') } // Acessa localStorage diretamente
  });
  // Lógica de redirecionamento e armazenamento de token espalhada
  localStorage.setItem('auth-token', response.data.authToken);
  window.location.replace('/dashboard');
} catch (error) {
  // Lógica de erro não centralizada ou padronizada
  console.error(error);
}
```

## Camada de Hooks Customizados (Client-side)

### Descrição

A lógica reutilizável relacionada ao estado ou efeitos colaterais dos componentes é extraída para hooks customizados, seguindo a convenção de nomenclatura do React (prefixo `use`). Estes hooks encapsulam lógica específica e podem ser facilmente compartilhados entre componentes funcionais.

### Exemplos

**Seguindo o padrão:**
O arquivo `examples/investy/client/hooks/useValidation.ts` é um hook customizado que encapsula a lógica para gerenciar erros de validação recebidos de requisições API. Ele gerencia seu próprio estado (`fieldErrors`) e expõe funções (`digestRequestError`, `clearFieldError`) e dados (`messages`) para o componente que o utiliza.

```typescript
// examples/investy/client/hooks/useValidation.ts
import { useState } from "react" // Uso de hooks nativos internamente
import { AxiosError } from "axios"
// ... imports ...

const useValidation = () => { // Definido como hook customizado (prefixo use)
	const [fieldErrors, setFieldErrors] = useState<FieldErrors>({}) // Gerencia estado interno

	// ... internal logic ...

	return { // Retorna valores e funções para o componente usar
		digestRequestError: processRequestError,
		clearFieldError,
		messages: processFieldErrorMessages()
	}
}

export default useValidation
```
O arquivo `examples/investy/client/pages/Login/index.tsx` utiliza este hook.

```typescript
// examples/investy/client/pages/Login/index.tsx
// ... imports ...
import useValidation from "@client/hooks/useValidation" // Importa o hook customizado

const Login = () => {
	// ... other state ...
	const validation = useValidation() // Usa o hook customizado

	// ... component logic using validation.messages, validation.digestRequestError ...
}
```

**Não seguindo o padrão (Exemplo Hipotético):**
Em um código que não segue este padrão, a lógica de validação poderia estar duplicada em vários componentes ou gerenciada de forma mais complexa e menos reutilizável, possivelmente usando render props ou componentes de ordem superior.
Exemplo hipotético de código que *não* segue o padrão de hooks customizados (lógica de validação inline ou duplicada):

```typescript
// Exemplo hipotético de código que *não* segue o padrão de hook customizado
// Diretamente dentro de um componente de página:
const [fieldErrors, setFieldErrors] = useState({}); // Estado de erro local, não encapsulado

const digestRequestError = (error) => { // Lógica de processamento de erro duplicada
  const requestFieldErrors = error?.response?.data?.fieldErrors;
  if (requestFieldErrors) {
    setFieldErrors(requestFieldErrors);
  }
}

const clearFieldError = (field) => { /* lógica duplicada */ };
const processFieldErrorMessages = () => { /* lógica duplicada */ };

// ... handleSubmit function using local logic ...
```

## Padrão Adapter para API Routes (Server-side)

### Descrição

No lado do servidor (dentro do diretório `pages/api`), a integração com o framework Next.js para lidar com rotas de API é feita utilizando um padrão Adapter (`NextHttpAdapter`). Este adapter converte as requisições e respostas do Next.js para um formato mais agnóstico, permitindo que a lógica de negócio (middleware, controllers) seja implementada de forma mais limpa e testável, desacoplada dos detalhes específicos do Next.js.

### Exemplos

**Seguindo o padrão:**
O arquivo `examples/investy/pages/api/users/login.ts` define a rota `/api/users/login` usando o `NextHttpAdapter.createApiHandlerRoute`. Este adapter recebe um objeto mapeando métodos HTTP (`post`) para arrays de handlers (middleware e controller), e o adapter se encarrega de processar a requisição do Next.js, chamar os handlers na ordem correta e enviar a resposta no formato do Next.js. O `NextHttpAdapter.adaptApiHandler` é usado para envolver os handlers individuais para serem compatíveis com a estrutura do adapter.

```typescript
// examples/investy/pages/api/users/login.ts
import UserController from "@server/controllers/UserController" // Importa o Controller
import InfraMiddleware from "@server/middlewares/InfraMiddleware" // Importa o Middleware
import NextHttpAdapter from "@server/adapters/NextHttpAdapter" // Importa o Adapter

export default NextHttpAdapter.createApiHandlerRoute({ // Usa o Adapter para criar a rota
	post: [ // Array de handlers para o método POST
		NextHttpAdapter.adaptApiHandler(InfraMiddleware.setup), // Adapta e inclui Middleware
		NextHttpAdapter.adaptApiHandler(UserController.login) // Adapta e inclui Controller
	]
})
```

**Não seguindo o padrão (Exemplo Hipotético):**
Em um código que não utiliza o padrão Adapter, a lógica de middleware e controller estaria acoplada diretamente à interface de `(req, res)` do Next.js dentro do arquivo da rota de API.
Exemplo hipotético de código que *não* segue o padrão Adapter:

```typescript
// Exemplo hipotético de código que *não* segue o padrão Adapter
// Diretamente dentro do arquivo pages/api/users/login.ts:
import { NextApiRequest, NextApiResponse } from 'next';
import UserController from "@server/controllers/UserController"
import InfraMiddleware from "@server/middlewares/InfraMiddleware"

// Lógica de middleware e controller diretamente acoplada à interface do Next.js
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Lógica do InfraMiddleware.setup diretamente aqui
  await InfraMiddleware.setup(req, res); // Exemplo simplificado, middleware real precisa ser adaptado

  // Lógica do AuthMiddleware.requireAuth diretamente aqui (se aplicável à rota)
  // ...

  // Lógica do UserController.login diretamente aqui
  if (req.method === 'POST') {
    await UserController.login(req, res); // Exemplo simplificado, controller real precisa ser adaptado
  } else {
    res.status(405).end(); // Método não permitido
  }
}
```

## Padrão Middleware (Server-side)

### Descrição

As rotas de API no lado do servidor utilizam o padrão Middleware, onde a requisição HTTP passa por uma cadeia de funções antes de chegar à lógica de negócio principal (o Controller). Cada middleware pode executar tarefas como autenticação, configuração de infraestrutura ou manipulação da requisição/resposta, e decidir se a cadeia deve continuar.

### Exemplos

**Seguindo o padrão:**
Os arquivos de rota de API, como `examples/investy/pages/api/users/login.ts`, definem um array de handlers para cada método HTTP. Estes arrays representam a cadeia de middleware que a requisição atravessará. O `InfraMiddleware.setup` é um exemplo de middleware aplicado a várias rotas.

```typescript
// examples/investy/pages/api/users/login.ts
import UserController from "@server/controllers/UserController"
import InfraMiddleware from "@server/middlewares/InfraMiddleware" // Importa o Middleware
import NextHttpAdapter from "@server/adapters/NextHttpAdapter"

export default NextHttpAdapter.createApiHandlerRoute({
	post: [
		NextHttpAdapter.adaptApiHandler(InfraMiddleware.setup), // Middleware InfraMiddleware.setup
		NextHttpAdapter.adaptApiHandler(UserController.login) // Controller (último na cadeia para esta rota)
	]
})
```
Outro exemplo é o arquivo `examples/investy/pages/api/asset-syncs/notion.ts`, que aplica tanto o `InfraMiddleware.setup` quanto o `AuthMiddleware.requireAuth` antes de chamar o controller.

```typescript
// examples/investy/pages/api/asset-syncs/notion.ts
import NotionAssetSyncController from "@server/controllers/NotionAssetSyncController"
import AuthMiddleware from "@server/middlewares/AuthMiddleware" // Importa o Middleware
import InfraMiddleware from "@server/middlewares/InfraMiddleware" // Importa o Middleware
import NextHttpAdapter from "@server/adapters/NextHttpAdapter"

export default NextHttpAdapter.createApiHandlerRoute({
	post: [
		NextHttpAdapter.adaptApiHandler(InfraMiddleware.setup), // Primeiro Middleware
		NextHttpAdapter.adaptApiHandler(AuthMiddleware.requireAuth), // Segundo Middleware
		NextHttpAdapter.adaptApiHandler(NotionAssetSyncController.create) // Controller
	],
	get: [
		NextHttpAdapter.adaptApiHandler(InfraMiddleware.setup), // Primeiro Middleware
		NextHttpAdapter.adaptApiHandler(AuthMiddleware.requireAuth), // Segundo Middleware
		NextHttpAdapter.adaptApiHandler(NotionAssetSyncController.retrieveAll) // Controller
	]
})
```

**Não seguindo o padrão (Exemplo Hipotético):**
Em um código que não utiliza o padrão Middleware, a lógica de autenticação, configuração de infraestrutura, etc., estaria embutida no início de cada função de controller ou duplicada em cada arquivo de rota de API.
Exemplo hipotético de código que *não* segue o padrão Middleware (lógica de autenticação inline):

```typescript
// Exemplo hipotético de código que *não* segue o padrão Middleware
// Dentro de uma função de Controller:
import { NextApiRequest, NextApiResponse } from 'next'; // Assumindo que o controller recebe req/res diretamente
// ... logic ...

const retrieveAll = async (req: NextApiRequest, res: NextApiResponse) => {
  // Lógica de autenticação duplicada em cada controller que precisa dela
  const authToken = req.headers['Auth-Token'];
  if (!authToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  // ... lógica de negócio principal ...
}
```

## Camada de Controllers (Server-side)

### Descrição

A lógica de negócio principal para processar as requisições de API no lado do servidor é organizada em classes ou objetos chamados Controllers (dentro do diretório `server/controllers`). Estes controllers são responsáveis por coordenar as operações necessárias para atender a uma requisição específica, geralmente chamados após a execução dos middlewares.

### Exemplos

**Seguindo o padrão:**
O arquivo `examples/investy/pages/api/users/login.ts` direciona a requisição POST para o método `login` do `UserController`.

```typescript
// examples/investy/pages/api/users/login.ts
import UserController from "@server/controllers/UserController" // Importa o Controller
// ... imports ...

export default NextHttpAdapter.createApiHandlerRoute({
	post: [
		// ... middleware ...
		NextHttpAdapter.adaptApiHandler(UserController.login) // Chama o método login do UserController
	]
})
```
O arquivo `examples/investy/pages/api/asset-syncs/notion.ts` direciona as requisições GET e POST para métodos diferentes do `NotionAssetSyncController`.

```typescript
// examples/investy/pages/api/asset-syncs/notion.ts
import NotionAssetSyncController from "@server/controllers/NotionAssetSyncController" // Importa o Controller
// ... imports ...

export default NextHttpAdapter.createApiHandlerRoute({
	post: [
		// ... middleware ...
		NextHttpAdapter.adaptApiHandler(NotionAssetSyncController.create) // Chama NotionAssetSyncController.create
	],
	get: [
		// ... middleware ...
		NextHttpAdapter.adaptApiHandler(NotionAssetSyncController.retrieveAll) // Chama NotionAssetSyncController.retrieveAll
	]
})
```

**Não seguindo o padrão (Exemplo Hipotético):**
Em um código que não utiliza o padrão Controller, a lógica de negócio estaria misturada com a lógica de roteamento dentro dos arquivos `pages/api/`, tornando-os grandes, difíceis de ler e reutilizar.
Exemplo hipotético de código que *não* segue o padrão Controller:

```typescript
// Exemplo hipotético de código que *não* segue o padrão Controller
// Diretamente dentro do arquivo pages/api/users/login.ts:
import { NextApiRequest, NextApiResponse } from 'next';
// ... imports de lógica de negócio (e.g., UserRepository) ...

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ... middleware logic ...

  if (req.method === 'POST') {
    // Lógica de negócio do login diretamente aqui
    const { email, password } = req.body;
    // Consulta o banco de dados, valida credenciais, gera token, etc.
    // Mistura lógica de roteamento com lógica de negócio
    // ... extensive login business logic ...
    res.status(200).json({ authToken: '...' });
  } else {
    res.status(405).end();
  }
}
```

## Convenção de Nomenclatura para Hooks (Client-side)

### Descrição

Todos os hooks customizados no lado do cliente seguem a convenção do React e são nomeados com o prefixo `use`. Esta convenção torna claro para outros desenvolvedores que uma função é um hook e segue as regras dos hooks.

### Exemplos

**Seguindo o padrão:**
Os arquivos dentro do diretório `client/hooks` definem hooks que começam com `use`, como `useDidMount`, `useSubComponents`, `useConstantId`, `useWindowObject` e `useValidation`.

```typescript
// examples/investy/client/hooks/useDidMount.ts
import { useEffect } from "react"

// Função nomeada com o prefixo 'use'
const useDidMount = (callbackFn: () => Promise<void> | void) => {
	useEffect(() => {
		callbackFn()
	}, [])
}

export default useDidMount
```

```typescript
// examples/investy/client/hooks/useValidation.ts
import { useState } from "react"
// ... imports ...

// Função nomeada com o prefixo 'use'
const useValidation = () => {
	const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

	// ... internal logic ...

	return {
		digestRequestError: processRequestError,
		clearFieldError,
		messages: processFieldErrorMessages()
	}
}

export default useValidation
```

**Não seguindo o padrão (Exemplo Hipotético):**
Uma função que utiliza hooks internamente, mas não é nomeada com o prefixo `use`, seria um exemplo de *não* seguir esta convenção. Isso violaria a regra dos Hooks do React (Hooks só podem ser chamados em componentes funcionais ou outros Hooks) e tornaria o código menos legível e propenso a erros.
Exemplo hipotético de código que *não* segue o padrão (nome inválido para um hook):

```typescript
// Exemplo hipotético de código que *não* segue a convenção
// Função que usa hooks mas não tem o prefixo 'use'
const getValidationState = () => { // Deveria ser useValidationState
  const [errors, setErrors] = useState({}); // Uso de hook nativo
  // ... logic ...
  return { errors, setErrors };
}
```

## Organização de Arquivos/Diretórios (Client/Server)

### Descrição

O código é organizado em diretórios lógicos que separam as preocupações entre o lado do cliente (`client`) e o lado do servidor (`server`), bem como por tipo de funcionalidade ou padrão arquitetural (e.g., `components`, `pages`, `hooks`, `services` no client; `adapters`, `controllers`, `middlewares`, `queues` no server). Dentro dessas categorias, os arquivos são nomeados de forma descritiva, muitas vezes com uma estrutura de diretórios baseada no nome do componente/serviço/etc. (e.g., `components/InputLabel/index.tsx`). As páginas Next.js seguem a estrutura de roteamento baseada em arquivos (`pages/api/...`, `pages/...`).

### Exemplos

**Seguindo o padrão:**
O arquivo `examples/investy/client/components/InputLabel/index.tsx` encapsula a lógica do componente `InputLabel` em um diretório com o nome do componente. O arquivo `examples/investy/client/services/auth.ts` agrupa todas as funções relacionadas à autenticação do lado do cliente. As rotas de API são definidas em `pages/api` e organizadas por caminho (`pages/api/users/login.ts`, `pages/api/asset-syncs/notion.ts`).

```
examples/investy/client/
├── components/         # Componentes de UI reutilizáveis
│   ├── Dropdown/
│   ├── IconButton/
│   ├── InputLabel/     # Componente InputLabel em seu próprio diretório
│   │   └── index.tsx
│   ├── Modal/
│   ...
├── hooks/              # Hooks customizados
│   ├── useDidMount.ts
│   ├── useValidation.ts
│   ...
├── pages/              # Páginas Next.js (Client-side)
│   ├── AssetSyncs/
│   │   ├── Notion/     # Página Notion Asset Syncs
│   │   │   └── index.tsx
│   │   └── index.tsx
│   ├── Login/          # Página de Login
│   │   └── index.tsx
│   ...
└── services/           # Camada de serviços
    ├── api.ts          # Serviço de API
    └── auth.ts         # Serviço de autenticação
...
examples/investy/pages/api/ # Rotas de API Next.js (Server-side)
├── asset-syncs/
│   ├── [id]/notion.ts
│   └── notion.ts       # Rota específica
├── integrations/
│   ├── notion/database.ts
│   └── index.ts
├── queues/
│   └── SyncNotionAssetPrice.ts
├── users/
│   ├── login.ts        # Rota de Login
│   └── signup.ts
...
examples/investy/server/ # Lógica do lado do servidor
├── adapters/           # Adapters
├── controllers/        # Controllers
├── middlewares/        # Middlewares
└── queues/             # Handlers de fila
```

**Não seguindo o padrão (Exemplo Hipotético):**
Em um código que não segue esta organização, arquivos de diferentes categorias (componentes, hooks, serviços) poderiam estar misturados no mesmo diretório, ou a lógica de servidor poderia estar diretamente nos arquivos `pages/api/` sem separação em controllers, middlewares, etc.
Exemplo hipotético de código que *não* segue o padrão (organização misturada):

```
// Exemplo hipotético de código que *não* segue a organização
examples/investy/client/
├── utils/
│   ├── date.ts
│   ├── style.ts
│   └── InputLabel.tsx  # Componente InputLabel misturado com utilitários
├── hooks/
│   └── useDidMount.ts
├── LoginLogic.ts       # Lógica da página de Login fora do diretório pages/Login
├── api.ts              # Serviço de API
...
examples/investy/pages/api/
└── users.ts            # Um único arquivo para login, signup, etc., sem controllers/middleware
```
