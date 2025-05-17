Com base na análise do código fornecido, os seguintes padrões arquiteturais foram identificados:

## Arquitetura em Camadas (Server)

### Descrição

O código do servidor segue uma arquitetura em camadas, separando as preocupações em módulos distintos com responsabilidades bem definidas. A estrutura de diretórios reflete essa separação, incluindo camadas como infraestrutura (`infra`), acesso a dados (`repositories`), lógica de negócio (`services`), tratamento de requisições (`controllers`, `middlewares`), e utilidades (`utils`, `lib`, `adapters`). As camadas geralmente se comunicam unidirecionalmente (camadas superiores chamam camadas inferiores), embora haja exceções (como `AssetSyncSchedulerService` chamando a infraestrutura de fila, e o uso de exceções).

### Exemplos

**Segue o Padrão:**

*   `server/controllers/NotionAssetSyncController.ts`: Este controlador lida com requisições HTTP (`create`, `update`, `retrieveAll`, `forceSync`) e delega a lógica de negócio e acesso a dados para `IntegrationService`, `AssetSyncSchedulerService`, `InMemoryCacheService`, `AssetSyncRepository` e `NotionLib`. Ele não contém lógica de persistência ou regras de negócio complexas diretamente.

```typescript
class NotionAssetSyncController {
	async create ({ request, response, context }: ApiHandlerInput<{}, NotionBody, {}>): Promise<void> {
		const userId = context.auth.userId
	
		const validation = await NotionAssetSyncValidation.validateNotionData(request.body)

		if (!validation.valid) {
			return response.badRequest(validation.fieldErrors)
		}

		const { databaseId, assetCodePropertyId, assetPricePropertyId } = validation.data

		const notionIntegration = await IntegrationService.getNotionIntegration(userId) // Delega para Service

		if (!notionIntegration) {
			return response.notFound("NotionIntegrationNotFound")
		}

		const notionAssetSync = await AssetSyncRepository.create({ // Delega para Repository
			user_id: userId,
			integration_id: notionIntegration.id,
			extra_data: {
				notion: {
					database_id: databaseId,
					asset_code_property_id: assetCodePropertyId,
					asset_price_property_id: assetPricePropertyId
				}
			}
		})
		
		await AssetSyncSchedulerService.scheduleNotionAssetSync(notionAssetSync.id) // Delega para Service

		return response.noContent()
	}
    // ... outros métodos ...
}
```

**Não Segue o Padrão (Exemplo Hipotético que Quebraria a Camada de Controller):**

*   Um método dentro de um controlador que executa consultas diretas ao banco de dados ou implementa regras de validação complexas que deveriam estar em Services ou Validations.

```typescript
// Exemplo HIPOTÉTICO (não presente no código, para ilustrar a quebra do padrão)
class BadExampleController {
    async someAction({ request, response }: ApiHandlerInput): Promise<void> {
        // Quebra do padrão: Lógica de negócio e acesso a dados no Controller
        const users = await mongoose.model('User').find({ email: request.body.email });
        if (users.length > 0) {
            // Quebra do padrão: Lógica de validação no Controller
            return response.badRequest({ email: 'Email already exists' });
        }
        // ... persistência e outras regras ...
    }
}
```

## Padrão Repository

### Descrição

O acesso a dados é abstraído através de classes Repository. Cada Repository é responsável por lidar com a persistência de uma entidade específica, utilizando um Adapter (MongooseRepositoryAdapter) para interagir com o banco de dados subjacente (MongoDB via Mongoose). Os métodos nos Repositórios (`create`, `retrieveOne`, `retrieveAll`, `update`, `delete`) fornecem uma interface consistente para operações CRUD, desacoplando a lógica de negócio da tecnologia de banco de dados específica.

### Exemplos

**Segue o Padrão:**

*   `server/repositories/UserRepository.ts`: Esta classe estende `MongooseRepositoryAdapter` e é responsável exclusivamente pelas operações de persistência da entidade `UserEntity`.

```typescript
import MongooseRepositoryAdapter from "@server/adapters/MongooseRepositoryAdapter"

import UserEntity from "@server/entities/UserEntity"

import UserSchema from "@server/schemas/UserSchema"

class UserRepository extends MongooseRepositoryAdapter<UserEntity> {}

export default new UserRepository(UserSchema) // Instanciação como Singleton
```

**Não Segue o Padrão (Exemplo Hipotético que Quebraria o Padrão Repository):**

*   Um método dentro de um Service ou Controller que realiza consultas diretas ao Mongoose Model.

```typescript
// Exemplo HIPOTÉTICO (não presente no código, para ilustrar a quebra do padrão)
import UserSchema from "@server/schemas/UserSchema" // Importa o Schema diretamente

class BadExampleService {
    async createUserAndCheckExists(email: string, data: any): Promise<void> {
        // Quebra do padrão: Acesso direto ao Schema/Model do Mongoose
        const existingUser = await UserSchema.findOne({ email }); 
        if (existingUser) {
            throw new Error("User already exists");
        }
        await UserSchema.create(data); // Quebra do padrão
    }
}
```

## Padrão Adapter

### Descrição

O código utiliza o Padrão Adapter para integrar-se com bibliotecas externas como Mongoose, Quirrel (fila), Next.js HTTP handlers e NodeCache. Classes com o sufixo `Adapter` encapsulam a lógica específica dessas bibliotecas e as adaptam a interfaces (`Contract`s) ou estruturas de dados internas, permitindo que o restante do código interaja com elas de forma mais genérica e desacoplada.

### Exemplos

**Segue o Padrão:**

*   `server/adapters/MongooseRepositoryAdapter.ts`: Adapta o Mongoose Model para a interface `RepositoryContract`.

```typescript
import { Model } from "mongoose"

import {
	RepositoryContract,
	CreateInput,
	WhereInput,
	UpdateInput,
	DefaultEntity
} from "@server/contracts/RepositoryContract"

class MongooseRepositoryAdapter<Entity extends DefaultEntity> implements RepositoryContract<Entity> {
	private readonly schema: Model<Entity>

	constructor (schema: Model<Entity>) {
		this.schema = schema
	}

	async create (data: CreateInput<Entity>): Promise<Entity> {
		const entity = await this.schema.create(data) // Usa API específica do Mongoose
		return entity
	}

    // ... outros métodos que adaptam Mongoose API para RepositoryContract
}
```

**Não Segue o Padrão (Exemplo de Código que seria adaptado):**

*   O uso direto da API do Mongoose, que é encapsulado pelo `MongooseRepositoryAdapter`.

```typescript
// Exemplo de uso direto da API do Mongoose (encapsulado no Adapter)
// Este código NÃO segue o padrão Adapter neste contexto, pois é o que o Adapter encapsula.
import { Model } from "mongoose"

// ... obter o Model, por exemplo:
const UserModel: Model<any> = mongoose.model('User'); 

async function directMongooseCall(data: any): Promise<any> {
    // Uso direto da API do Mongoose
    const user = await UserModel.create(data); 
    return user;
}
```

## Padrão Service (Camada de Serviço)

### Descrição

A lógica de negócio e a orquestração de operações mais complexas são encapsuladas em classes com o sufixo `Service`. Essas classes combinam funcionalidades de Repositórios, Libs e outros Services para executar casos de uso específicos da aplicação. A Camada de Serviço atua como uma camada intermediária entre Controllers/Queues e as camadas de acesso a dados/libs/utilidades.

### Exemplos

**Segue o Padrão:**

*   `server/services/AuthService.ts`: Contém a lógica relacionada a autenticação, utilizando `HashService` e `CryptService` para tarefas específicas.

```typescript
import AuthConfig from "@server/config/AuthConfig"

import { AuthTokenPayload } from "@server/protocols/AuthProtocol"

import HashService from "@server/services/HashService" // Utiliza outro Service
import CryptService from "@server/services/CryptService" // Utiliza outro Service

class AuthService {
	private readonly hashService = new HashService(AuthConfig.hashSaltRounds)
	private readonly cryptService = new CryptService(AuthConfig.tokenSecret)

	async makeHashedPassword (password: string): Promise<string> {
		return await this.hashService.makeHash(password) // Delega tarefa específica
	}

    // ... outros métodos de lógica de autenticação ...
}

export default new AuthService() // Instanciado como Singleton
```

**Não Segue o Padrão (Exemplo Hipotético de Lógica de Negócio fora de um Service):**

*   Lógica de autenticação ou hash de senha implementada diretamente em um Controller ou Middleware.

```typescript
// Exemplo HIPOTÉTICO (não presente no código, para ilustrar a quebra do padrão)
import * as bcrypt from "bcrypt" // Dependência de hashing direto

class AuthMiddleware { // Middleware
    async requireAuth ({ request, response }: ApiHandlerInput<{}, {}, {}>): Promise<void> {
        const authToken = request.headers.get(AuthConfig.tokenKey)

        if (!authToken) {
            return response.unauthorized()
        }

        // Quebra do padrão: Lógica de autenticação/criptografia diretamente no Middleware
        const decoded = await bcrypt.compare('password', 'hashed_password'); // Lógica de negócio/criptografia
        if (!decoded) {
             return response.unauthorized()
        }

        request.context.set({ auth: { userId: 'some-user-id' } })
        return response.next()
    }
}
```

## Padrão Singleton

### Descrição

Muitas classes no código do servidor, particularmente utilitários (`Utils`), serviços que gerenciam recursos globais (`LogService`, `Infra` modules, `QueueModule`, `DatabaseModule`), e Repositórios, são projetadas como Singletons. Elas são instanciadas uma única vez (`export default new ClassName()`) e acessadas globalmente através de sua única instância.

### Exemplos

**Segue o Padrão:**

*   `server/services/LogService.ts`: A classe `LogService` é instanciada uma vez e exportada como a instância padrão.

```typescript
class LogService {
	error (error: Error): void {
		console.error(error)
	}

	info (text: string): void {
		console.log(text)
	}
}

export default new LogService() // Instanciado como Singleton
```

**Não Segue o Padrão:**

*   `server/lib/NotionLib.ts`: Esta classe requer um token (`token`) em seu construtor e é instanciada múltiplas vezes, geralmente por request ou contexto, não como um Singleton global.

```typescript
import { Client } from "@notionhq/client"

// ... imports e types ...

class NotionLib {
	private readonly client: Client

	constructor (token: string) { // Requer parâmetro no construtor
		this.client = new Client({ auth: token })
	}

	// ... métodos ...
}

export default NotionLib // A classe é exportada, não uma instância Singleton
```
(Exemplo de uso da classe não Singleton):
```typescript
// Em server/queues/SyncNotionAssetPriceQueue.ts:
// ...
const notion = new NotionLib(integration.token) // Nova instância criada por uso
// ...
```

## Padrão Middleware (Server)

### Descrição

No código do servidor (especificamente no contexto do Next.js API Routes), classes com o sufixo `Middleware` implementam lógica que intercepta e processa requisições antes que elas cheguem aos Handlers/Controllers finais. Eles são usados para tarefas como inicialização de infraestrutura e autenticação.

### Exemplos

**Segue o Padrão:**

*   `server/middlewares/AuthMiddleware.ts`: Implementa um middleware para verificar a autenticação do usuário.

```typescript
import { ApiHandlerInput } from "@server/contracts/HttpContract"

import AuthConfig from "@server/config/AuthConfig"

import AuthService from "@server/services/AuthService"

class AuthMiddleware {
	async requireAuth ({ request, response }: ApiHandlerInput<{}, {}, {}>): Promise<void> {
		const authToken = request.headers.get(AuthConfig.tokenKey)

		if (!authToken) {
			return response.unauthorized() // Intercepta e responde
		}

		const authTokenPayload = await AuthService.decodeAuthToken(authToken)

		if (!authTokenPayload) {
			return response.unauthorized() // Intercepta e responde
		}

		request.context.set({ auth: authTokenPayload })

		return response.next() // Continua para o próximo handler/controller
	}
}

export default new AuthMiddleware()
```

**Não Segue o Padrão:**

*   `server/controllers/UserController.ts`: Uma classe Controller lida com a lógica principal da requisição após a passagem pelos Middlewares, em vez de interceptá-la antes.

```typescript
// Em server/controllers/UserController.ts:
// ...
class UserController {
	async signup ({ request, response }: ApiHandlerInput<{}, SignupBody, {}>): Promise<void> {
		// ... lógica principal de processamento da requisição ...
		return response.created({ authToken }) // Envia a resposta final
	}
    // ... outros métodos ...
}
// Este código não é um Middleware, pois não tem a função de interceptar e chamar response.next().
```

## Padrão Utility Classes

### Descrição

Classes com o sufixo `Util` agrupam funções helper genéricas e reutilizáveis que não pertencem a uma camada de negócio ou infraestrutura específica. Elas geralmente são puras (não têm estado interno que depende da instância) e são instanciadas como Singletons para fácil acesso.

### Exemplos

**Segue o Padrão:**

*   `server/utils/StringUtil.ts`: Contém funções para manipulação e comparação de strings.

```typescript
import StringSimilarity from "string-similarity"

class StringUtil {
	areSimilar (firstString: string, secondString: string): boolean {
		const normalizedFirstString = firstString.toLowerCase()
		const normalizedSecondString = secondString.toLowerCase()

		const similarity = StringSimilarity.compareTwoStrings(normalizedFirstString, normalizedSecondString)

		return similarity > 0.8
	}

	// ... outras funções utilitárias de string ...
}

export default new StringUtil() // Instanciado como Singleton
```

**Não Segue o Padrão (Exemplo Hipotético que misturaria Utilitário com Lógica de Negócio):**

*   Uma função em uma classe `Util` que interage diretamente com um repositório ou serviço.

```typescript
// Exemplo HIPOTÉTICO (não presente no código, para ilustrar a quebra do padrão)
import UserRepository from "@server/repositories/UserRepository"

class BadExampleUtil {
    // Quebra do padrão: Função utilitária com dependência de Repository (lógica de negócio/acesso a dados)
    async doesUserExist(email: string): Promise<boolean> { 
        const user = await UserRepository.retrieveOne({ email });
        return Boolean(user);
    }
}
// Esta lógica deveria estar em um Service (User or Auth Service) ou Validation.
```

## Convenção de Nomenclatura: Sufixos de Módulo/Classe

### Descrição

O código utiliza consistentemente sufixos nas classes e nos nomes dos arquivos (que correspondem às classes) para indicar a responsabilidade arquitetural do módulo.

### Exemplos

**Segue o Padrão:**

*   `server/repositories/UserRepository.ts`: A classe `UserRepository` lida com acesso a dados e está no diretório `repositories`.
*   `server/services/AuthService.ts`: A classe `AuthService` lida com lógica de autenticação e está no diretório `services`.
*   `server/controllers/UserController.ts`: A classe `UserController` lida com requisições de usuário e está no diretório `controllers`.
*   `server/adapters/MongooseRepositoryAdapter.ts`: A classe `MongooseRepositoryAdapter` adapta o Mongoose e está no diretório `adapters`.
*   `server/utils/StringUtil.ts`: A classe `StringUtil` contém utilidades de string e está no diretório `utils`.
*   `server/validations/UserValidation.ts`: A classe `UserValidation` contém lógica de validação e está no diretório `validations`.
*   `server/exceptions/QueueProcessException.ts`: A classe `QueueProcessException` é uma exceção customizada e está no diretório `exceptions`.
*   `server/config/AuthConfig.ts`: O arquivo `AuthConfig` contém configurações e está no diretório `config`.
*   `server/entities/UserEntity.ts`: O arquivo `UserEntity` define a entidade e está no diretório `entities`.
*   `server/schemas/UserSchema.ts`: O arquivo `UserSchema` define o schema do banco e está no diretório `schemas`.
*   `server/contracts/RepositoryContract.ts`: O arquivo `RepositoryContract` define um contrato e está no diretório `contracts`.
*   `server/protocols/NotionProtocol.ts`: O arquivo `NotionProtocol` define tipos de protocolo e está no diretório `protocols`.

```typescript
// Em server/services/AuthService.ts
class AuthService { /* ... */ }
export default new AuthService()

// Em server/repositories/UserRepository.ts
class UserRepository extends MongooseRepositoryAdapter<UserEntity> { /* ... */ }
export default new UserRepository(UserSchema)

// Em server/utils/StringUtil.ts
class StringUtil { /* ... */ }
export default new StringUtil()
```

**Não Segue o Padrão (Exemplo Hipotético que quebraria a convenção):**

*   Uma classe que lida com lógica de negócio complexa, mas é nomeada `UserHelper` e colocada no diretório `utils`.
*   Uma classe que lida com acesso a dados, mas é nomeada `UserDataManager` e colocada no diretório `services`.

```typescript
// Exemplo HIPOTÉTICO (não presente no código, para ilustrar a quebra da convenção)
// Em server/utils/UserHelper.ts (conteúdo deveria estar em User/Auth Service)
class UserHelper { 
    async findUserByEmail(email: string): Promise<UserEntity | null> {
        // Esta lógica deveria estar em UserRepository.retrieveOne
        // ... acesso direto ao BD ou chamada a Repository ...
    }
}
export default new UserHelper(); 
```

## Convenção de Nomenclatura: Métodos de Acesso a Dados (Repositories)

### Descrição

Métodos nas classes Repository que realizam operações de recuperação de dados usam o prefixo `retrieve`. Métodos para criação, atualização e exclusão usam `create`, `update` e `delete`, respectivamente.

### Exemplos

**Segue o Padrão:**

*   `server/repositories/UserRepository.ts`:

```typescript
class UserRepository extends MongooseRepositoryAdapter<UserEntity> {
	async create (data: CreateInput<UserEntity>): Promise<UserEntity> { /* ... */ }
	async retrieveOne (where: WhereInput<UserEntity>): Promise<UserEntity | null> { /* ... */ }
	async retrieveOneById (id: string): Promise<UserEntity | null> { /* ... */ }
	async retrieveAll (where: WhereInput<UserEntity>): Promise<UserEntity[]> { /* ... */ }
	async updateOneById (id: string, data: UpdateInput<UserEntity>): Promise<void> { /* ... */ }
	async updateMany (where: WhereInput<UserEntity>, data: UpdateInput<UserEntity>): Promise<void> { /* ... */ }
	async deleteMany (where: WhereInput<UserEntity>): Promise<void> { /* ... */ }
}
```

**Não Segue o Padrão (Exemplo Hipotético que quebraria a convenção):**

*   Um método em um Repository chamado `getUserById` ou `findUsers`.

```typescript
// Exemplo HIPOTÉTICO (não presente no código, para ilustrar a quebra da convenção)
class UserRepository extends MongooseRepositoryAdapter<UserEntity> {
    // Quebra da convenção: deveria ser retrieveOneById
    async getUserById(id: string): Promise<UserEntity | null> { /* ... */ } 
    
    // Quebra da convenção: deveria ser retrieveAll
    async findUsers(filter: any): Promise<UserEntity[]> { /* ... */ } 
}
```

## Convenção de Nomenclatura: Métodos Booleanos

### Descrição

Funções ou métodos que retornam um valor booleano (verdadeiro/falso) geralmente começam com o prefixo `is` ou `has`.

### Exemplos

**Segue o Padrão:**

*   `server/services/HashService.ts`: `isHashValid`
*   `client/utils/route.ts`: `isAuthenticated`
*   `client/utils/array.ts`: `isLastItem`, `isFirstItem`
*   `client/utils/component.ts`: `hasDisplayName`, `containsComponentWithDisplayName`
*   `server/validations/UserValidation.ts`: `isUserEmailAvailable`
*   `server/utils/StringUtil.ts`: `areSimilar` (Embora não use `is`, `are`, ou `has`, o nome indica claramente um retorno booleano sobre similaridade)

```typescript
// Em server/services/HashService.ts
class HashService {
    // ...
	async isHashValid (originalValue: string, hash: string): Promise<boolean> { /* ... */ }
}

// Em client/utils/array.ts
export const isLastItem = (index: number, totalItems?: number) => { /* ... */ }
```

**Não Segue o Padrão (Exemplo Hipotético que quebraria a convenção):**

*   Um método booleano chamado `validatePassword` em vez de `isPasswordValid`.

```typescript
// Exemplo HIPOTÉTICO (não presente no código, para ilustrar a quebra da convenção)
class AuthService {
    // Quebra da convenção: deveria ser isValidPassword
	async validatePassword (password: string, hashedPassword: string): Promise<boolean> { /* ... */ } 
}
```

## Padrão Handler (Queues)

### Descrição

O código utiliza o Padrão Handler para processar mensagens de fila. Classes que implementam a interface `QueueHandler` (`server/contracts/QueueContract.ts`) contêm um método `handle` que executa a lógica principal de processamento para um tipo específico de mensagem de fila, juntamente com métodos de ciclo de vida opcionais (`onActive`, `onCompleted`, `onError`).

### Exemplos

**Segue o Padrão:**

*   `server/queues/SyncNotionAssetPriceQueue.ts`: Implementa a interface `QueueHandler` para processar mensagens de sincronização de preço de ativos do Notion.

```typescript
import { QueueHandler, QueueName, QueuePayload } from "@server/contracts/QueueContract"

// ... imports de Repositories, Services, Libs, etc. ...

class SyncNotionAssetPriceQueue implements QueueHandler {
	name: QueueName = "SyncNotionAssetPrice"

	async handle (payload: QueuePayload["SyncNotionAssetPrice"]): Promise<void> {
		// Lógica principal de processamento da mensagem
		// ...
	}

	async onActive (payload: QueuePayload["SyncNotionAssetPrice"]): Promise<void> {
		// Lógica ao iniciar o processamento
		// ...
	}

    // ... onCompleted, onError ...
}

export default new SyncNotionAssetPriceQueue() // Instanciado como Singleton (para registro com o Adaptador)
```

**Não Segue o Padrão (Exemplo de Código que usa o Handler mas não é um Handler):**

*   A classe `BaseQueue` em `server/contracts/QueueContract.ts`. Embora contenha a lógica para *processar* handlers e chamar seus métodos de ciclo de vida, ela não é um handler em si, mas sim parte da infraestrutura que *gerencia* handlers.

```typescript
// Em server/contracts/QueueContract.ts
export abstract class BaseQueue {
	protected async process (handler: QueueHandler, payload: QueuePayload[QueueName]): Promise<void> {
        // Chama os métodos do handler, mas não é um handler
		try {
			await this.onActive(handler, payload)
			await handler.handle(payload) // Chama o método handle do Handler
			await this.onCompleted(handler, payload)
		} catch (error) {
			await this.onError(handler, payload, error)
		}
	}
    // ... outros métodos de gerenciamento ...
}
// Esta classe implementa a lógica de execução dos handlers, não a lógica específica de uma fila.
```

## Padrão Sub-Componentes (Client - React)

### Descrição

No código do lado do cliente (React), componentes mais complexos como `Table`, `Modal` e `Dropdown` utilizam um padrão onde componentes filhos específicos (sub-componentes) são definidos e associados ao componente pai. Isso é alcançado através de utilitários (`buildSubComponents`, `attachSubComponents`, `useSubComponents`) e convenções de `displayName` para permitir que o componente pai identifique e processe seus filhos estruturalmente (e.g., `<Table><Table.Head>...</Table.Head></Table>`).

### Exemplos

**Segue o Padrão:**

*   `client/components/Table/index.tsx`: Define o componente `Table` e anexa seus sub-componentes (`TableBody`, `TableColumn`, `TableHead`, `TableRow`) usando `attachSubComponents`. O uso em código de UI se dá na forma `<Table.Body>`, `<Table.Head>`, etc.

```typescript
import { FC } from "react"

import { attachSubComponents, buildSubComponents } from "@client/hooks/useSubComponents"

import TableBody from "@client/components/Table/TableBody"
import TableColumn from "@client/components/Table/TableColumn"
import TableHead from "@client/components/Table/TableHead"
import TableRow from "@client/components/Table/TableRow"

// Define os sub-componentes associados ao componente pai
const SubComponents = buildSubComponents({
	Body: TableBody,
	Column: TableColumn,
	Head: TableHead,
	Row: TableRow
})

const Table: FC = (props) => { /* ... renderiza a tag <table> */ }

// Anexa os sub-componentes ao componente pai
export default attachSubComponents(Table, SubComponents)
```
(Exemplo de uso em outro arquivo):
```typescript
// Em um arquivo de página ou componente de UI:
import Table from "@client/components/Table"

const MyTable = () => (
    <Table>
        <Table.Head> {/* Uso do sub-componente */}
            <Table.Column>Título</Table.Column> {/* Uso do sub-componente */}
            {/* ... */}
        </Table.Head>
        <Table.Body> {/* Uso do sub-componente */}
            <Table.Row> {/* Uso do sub-componente */}
                <Table.Column>Valor</Table.Column> {/* Uso do sub-componente */}
                {/* ... */}
            </Table.Row>
            {/* ... */}
        </Table.Body>
    </Table>
)
```

**Não Segue o Padrão:**

*   Componentes simples como `Button` ou `Chip` que não são projetados para ter uma estrutura interna complexa definida por sub-componentes nomeados. Eles simplesmente recebem children padrão.

```typescript
// Em client/components/Button/index.tsx
import { ButtonHTMLAttributes, FC } from "react"
// ...

const Button: FC<ButtonProps> = (props) => {
	const {
		// ...
		children, // Recebe children genéricos
		// ...
	} = props

	return (
		<button
			// ...
		>
			{children} {/* Renderiza children diretamente */}
            {/* ... */}
		</button>
	)
}

export default Button // Não usa attachSubComponents
```

---

## Estrutura de Componentes React

### Descrição

O código-fonte segue um padrão claro de organização para componentes React. Componentes genéricos e reutilizáveis são colocados no diretório `client/components/`, enquanto componentes que representam páginas ou partes específicas de páginas da aplicação são colocados no diretório `client/pages/`. Dentro de `client/pages/`, componentes específicos de uma página podem ser organizados em subdiretórios, frequentemente sob um diretório `components/`, como visto em `client/pages/AssetSyncs/Notion/components/`.

### Exemplos

**Segue o padrão:**

```typescript
// Arquivo: examples/investy/client/components/InputLabel/index.tsx
import { FC } from "react"

type InputLabelProps = {
	inputName: string
}

const InputLabel: FC<InputLabelProps> = (props) => {
	const {
		inputName,
		children
	} = props

	return (
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
Este é um componente reutilizável localizado no diretório `client/components/`.

**Não segue o padrão (neste contexto, não aplicável/diferente):**

```typescript
// Arquivo: examples/investy/client/hooks/useDidMount.ts
import { useEffect } from "react"

const useDidMount = (callbackFn: () => Promise<void> | void) => {
	useEffect(() => {
		callbackFn()
	// eslint-disable-next-line
	}, [])
}

export default useDidMount
```
Este é um hook customizado, não um componente React, e está localizado no diretório `client/hooks/`, seguindo a convenção para hooks.


## Uso de Custom Hooks

### Descrição

O código utiliza custom hooks para extrair e reutilizar lógica com estado ou efeitos colaterais entre componentes. Esses hooks são definidos no diretório `client/hooks/` e seguem a convenção de nomenclatura, começando com o prefixo `use`.

### Exemplos

**Segue o padrão:**

```typescript
// Arquivo: examples/investy/client/hooks/useValidation.ts
import { useState } from "react"
import { AxiosError } from "axios"

// ... (código omitido)

const useValidation = () => {
	const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

	// ... (código omitido)

	return {
		digestRequestError: processRequestError,
		clearFieldError,
		messages: processFieldErrorMessages()
	}
}

export default useValidation
```
Este hook customizado encapsula a lógica de validação e tratamento de erros de requisição.

**Não segue o padrão (neste contexto, não aplicável/diferente):**

```typescript
// Arquivo: examples/investy/client/services/auth.ts
import { routeConfig } from "@client/config/route"

const AUTH_TOKEN_LOCAL_STORAGE_KEY = "auth-token"

export const setAuthToken = (authToken: string) => {
	localStorage.setItem(AUTH_TOKEN_LOCAL_STORAGE_KEY, authToken)
}

// ... (código omitido)
```
Este é um módulo de serviço que encapsula a lógica de autenticação, mas não é um hook React e não gerencia estado ou efeitos colaterais no ciclo de vida de um componente da mesma forma que um hook.


## Padrão Adapter (Server-side)

### Descrição

No lado do servidor, o código utiliza o padrão Adapter para desacoplar a lógica de negócio e os controladores dos detalhes específicos do framework (Next.js API routes, Quirrel queues). Adaptadores como `NextHttpAdapter` e `QuirrelQueueAdapter` traduzem as requisições ou eventos do framework para um formato que pode ser processado pelos middlewares e controllers internos.

### Exemplos

**Segue o padrão:**

```typescript
// Arquivo: examples/investy/pages/api/users/login.ts
import UserController from "@server/controllers/UserController"
import InfraMiddleware from "@server/middlewares/InfraMiddleware"
import NextHttpAdapter from "@server/adapters/NextHttpAdapter"

export default NextHttpAdapter.createApiHandlerRoute({
	post: [
		NextHttpAdapter.adaptApiHandler(InfraMiddleware.setup),
		NextHttpAdapter.adaptApiHandler(UserController.login)
	]
})
```
Aqui, o `NextHttpAdapter` adapta as funções internas (`InfraMiddleware.setup`, `UserController.login`) para serem executadas dentro do contexto de uma API route do Next.js.

**Não segue o padrão (neste contexto, não aplicável/diferente):**

```typescript
// Arquivo: examples/investy/client/services/auth.ts
import { routeConfig } from "@client/config/route"

// ... (código omitido)

export const setAuthToken = (authToken: string) => {
	localStorage.setItem(AUTH_TOKEN_LOCAL_STORAGE_KEY, authToken)
}

// ... (código omitido)
```
Este é um módulo de serviço no lado do cliente que interage diretamente com APIs do navegador (`localStorage`) sem a necessidade de um adaptador para traduzir entre frameworks ou bibliotecas externas e a lógica da aplicação.


## Padrão Middleware (Server-side)

### Descrição

As rotas de API no lado do servidor empregam um padrão de Middleware para executar lógica transversal (cross-cutting concerns) antes que a requisição chegue ao controlador final. Middlewares como `AuthMiddleware` e `InfraMiddleware` são encadeados usando o `NextHttpAdapter` para lidar com autenticação, configuração de infraestrutura, etc.

### Exemplos

**Segue o padrão:**

```typescript
// Arquivo: examples/investy/pages/api/asset-syncs/notion.ts
import NotionAssetSyncController from "@server/controllers/NotionAssetSyncController"
import AuthMiddleware from "@server/middlewares/AuthMiddleware"
import InfraMiddleware from "@server/middlewares/InfraMiddleware"
import NextHttpAdapter from "@server/adapters/NextHttpAdapter"

export default NextHttpAdapter.createApiHandlerRoute({
	post: [
		NextHttpAdapter.adaptApiHandler(InfraMiddleware.setup),
		NextHttpAdapter.adaptApiHandler(AuthMiddleware.requireAuth),
		NextHttpAdapter.adaptApiHandler(NotionAssetSyncController.create)
	],
	get: [
		NextHttpAdapter.adaptApiHandler(InfraMiddleware.setup),
		NextHttpAdapter.adaptApiHandler(AuthMiddleware.requireAuth),
		NextHttpAdapter.adaptApiHandler(NotionAssetSyncController.retrieveAll)
	]
})
```
Nesta rota, `InfraMiddleware.setup` e `AuthMiddleware.requireAuth` são executados como middlewares antes que a requisição atinja o controlador (`NotionAssetSyncController.create` ou `NotionAssetSyncController.retrieveAll`).

**Não segue o padrão (neste contexto, não aplicável/diferente):**

```typescript
// Arquivo: examples/investy/pages/api/queues/SyncNotionAssetPrice.ts
import QuirrelQueueAdapter from "@server/adapters/QuirrelQueueAdapter"
import SyncNotionAssetPriceQueue from "@server/queues/SyncNotionAssetPriceQueue"

export default QuirrelQueueAdapter.adaptQueueHandler(SyncNotionAssetPriceQueue)
```
Esta rota lida com um handler de fila adaptado, que é acionado por eventos externos (a fila Quirrel), e não segue o pipeline de requisição HTTP típico onde middlewares são comumente usados para processamento antes do handler principal.


## Organização de Serviços (Client-side)

### Descrição

No lado do cliente, a lógica relacionada a interações externas ou funcionalidades específicas da aplicação é agrupada em módulos de "serviços" localizados no diretório `client/services/`. Isso inclui serviços para interação com a API (`api.ts`) e gerenciamento de autenticação (`auth.ts`).

### Exemplos

**Segue o padrão:**

```typescript
// Arquivo: examples/investy/client/services/auth.ts
import { routeConfig } from "@client/config/route"

const AUTH_TOKEN_LOCAL_STORAGE_KEY = "auth-token"

export const setAuthToken = (authToken: string) => {
	localStorage.setItem(AUTH_TOKEN_LOCAL_STORAGE_KEY, authToken)
}

export const clearAuthToken = () => {
	localStorage.removeItem(AUTH_TOKEN_LOCAL_STORAGE_KEY)
}

export const getAuthToken = (): string | null => {
	const authToken = localStorage.getItem(AUTH_TOKEN_LOCAL_STORAGE_KEY)

	return authToken ?? null
}

export const isAuthenticated = () => {
	return Boolean(getAuthToken())
}

export const loginAndRedirect = (authToken: string) => {
	setAuthToken(authToken)
	window.location.replace(routeConfig.root.path)
}

export const logoutAndRedirect = () => {
	clearAuthToken()
	window.location.replace(routeConfig.login.path)
}
```
Este módulo agrupa todas as funções relacionadas ao gerenciamento do estado de autenticação no cliente.

**Não segue o padrão (neste contexto, não aplicável/diferente):**

```typescript
// Arquivo: examples/investy/client/components/InputLabel/index.tsx
import { FC } from "react"

type InputLabelProps = {
	inputName: string
}

const InputLabel: FC<InputLabelProps> = (props) => {
	const {
		inputName,
		children
	} = props

	return (
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
Este é um componente de UI, focado na apresentação e interação visual, e não encapsula lógica de negócio ou interação com recursos externos da mesma forma que um serviço.


## Padrão Compound Component (Client-side)

### Descrição

Alguns componentes complexos, como `Modal`, `Table` e `Dropdown`, utilizam o padrão Compound Component. O componente pai gerencia o estado implícito ou o comportamento compartilhado, enquanto os componentes filhos (acessados como propriedades do pai, ex: `Modal.Content`, `Table.Head`) são responsáveis por renderizar partes específicas da UI e interagir com o pai de forma coordenada.

### Exemplos

**Segue o padrão:**

```typescript
// Arquivo: examples/investy/client/components/PopConfirm/index.tsx
import { FC, useState } from "react"
// ... (imports omitidos)
import Modal from "@client/components/Modal"
// ... (imports omitidos)

// ... (types omitidos)

const PopConfirm: FC<PopConfirmProps> = (props) => {
	const {
		description,
		children,
		onConfirm
	} = props

	return (
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
	)
}

export default PopConfirm
```
Aqui, `PopConfirm` utiliza o componente `Modal` e seus sub-componentes `Modal.Content` e `Modal.Trigger` para estruturar seu conteúdo e comportamento.

**Não segue o padrão (neste contexto, não aplicável/diferente):**

```typescript
// Arquivo: examples/investy/client/components/IconButton/index.tsx
import { ButtonHTMLAttributes, FC } from "react"
import { mergeClassNames, conditionalClassNames, defaultTransitionClassName } from "@client/utils/style"

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

const IconButton: FC<IconButtonProps> = (props) => {
	const {
		children,
		className,
		disabled,
		...rest
	} = props

	const needToDisable = disabled

	return (
		<button
			className={mergeClassNames([
				"hover:bg-gray-50 focus:outline-none font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center",
				defaultTransitionClassName,
				conditionalClassNames(needToDisable, ["cursor-not-allowed", "bg-gray-50"]),
				className
			])}
			disabled={needToDisable}
			{...rest}
		>
			{children}
		</button>
	)
}

export default IconButton
```
Este é um componente simples que renderiza um elemento HTML (`<button>`) com estilos e propriedades customizadas. Ele não é projetado para funcionar com sub-componentes específicos como parte de uma composição complexa.
