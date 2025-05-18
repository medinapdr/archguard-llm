```
## Estrutura de Camadas (Server-side)

### Descrição

O código do lado do servidor segue uma estrutura de camadas clara, organizando as responsabilidades em diretórios dedicados como `controllers`, `services`, `repositories`, `infra`, `lib`, `utils`, `config`, `entities`, `schemas`, `adapters`, `exceptions`, `protocols`, `contracts`, `middlewares`, `validations` e `queues`. Essa organização promove a separação de preocupações (SoC), onde cada camada tem um papel específico (por exemplo, `controllers` lidam com requisições HTTP, `services` contêm lógica de negócio, `repositories` acessam dados).

### Exemplos

**Segue o padrão:**

- O arquivo `examples/investy/server/controllers/UserController.ts` lida com requisições HTTP relacionadas a usuários, utilizando `AuthService` (camada de serviço) e `UserRepository` (camada de repositório) para realizar as operações necessárias.
- O arquivo `examples/investy/server/services/AuthService.ts` contém lógica de negócio relacionada à autenticação, utilizando `HashService` e `CryptService` (outros serviços ou utilitários) e não acessa diretamente o banco de dados ou lida com requisições HTTP.

**Viola o padrão:**

- Não há violações explícitas deste padrão na estrutura de diretórios fornecida. As responsabilidades parecem bem segregadas entre as pastas.
```

```
## Padrão Repository

### Descrição

O código utiliza o Padrão Repository para abstrair a lógica de acesso a dados. Classes dedicadas, localizadas no diretório `repositories`, são responsáveis por interagir com a fonte de dados (neste caso, Mongoose via `MongooseRepositoryAdapter`). Essas classes fornecem métodos para operações CRUD (Create, Retrieve, Update, Delete) em entidades específicas, desacoplando a lógica de negócio da implementação do banco de dados.

### Exemplos

**Segue o padrão:**

- O arquivo `examples/investy/server/repositories/UserRepository.ts` define `UserRepository` que estende `MongooseRepositoryAdapter<UserEntity>`, fornecendo métodos como `create`, `retrieveOne`, etc., para a entidade `UserEntity`.
- O arquivo `examples/investy/server/repositories/AssetSyncRepository.ts` define `AssetSyncRepository` que estende `MongooseRepositoryAdapter<AssetSyncEntity>`, encapsulando o acesso a dados para `AssetSyncEntity`.

**Viola o padrão:**

- Não há violações explícitas deste padrão na base de código fornecida. Todas as interações com o banco de dados Mongoose parecem ocorrer através das classes `*Repository`.
```

```
## Padrão Service

### Descrição

O código utiliza o Padrão Service, onde classes localizadas no diretório `services` encapsulam a lógica de negócio e orquestram operações que podem envolver múltiplos repositórios, utilitários ou outros serviços. Controladores e handlers de fila interagem com essas classes de serviço para executar tarefas complexas.

### Exemplos

**Segue o padrão:**

- O arquivo `examples/investy/server/services/AuthService.ts` contém a lógica para hashing de senhas, validação e geração/decodificação de tokens de autenticação, utilizando `HashService` e `CryptService`.
- O arquivo `examples/investy/server/services/AssetSyncSchedulerService.ts` lida com a lógica de agendamento de sincronizações, interagindo com o módulo de fila (`@server/infra/queue`).

**Viola o padrão:**

- Não há violações explícitas deste padrão na base de código fornecida. A lógica de negócio parece estar consistentemente localizada nas classes `*Service`.
```

```
## Padrão Controller (Server-side)

### Descrição

As classes localizadas no diretório `controllers` atuam como a camada de interface para requisições HTTP. Elas recebem a entrada da requisição, validam os dados (geralmente delegando para classes de validação), interagem com a camada de serviço ou repositório para executar a lógica e formatam a resposta usando um conjunto padronizado de métodos (`ok`, `badRequest`, `notFound`, etc.) fornecidos pelo `ApiHandlerResponse` (parte do `HttpContract`).

### Exemplos

**Segue o padrão:**

- O arquivo `examples/investy/server/controllers/UserController.ts` define métodos como `signup` e `login` que recebem `ApiHandlerInput`, validam a entrada usando `UserValidation`, chamam `AuthService` e `UserRepository` e retornam respostas formatadas usando `response.created` ou `response.ok`.
- O arquivo `examples/investy/server/controllers/NotionAssetSyncController.ts` define métodos como `create`, `update`, `retrieveAll`, `forceSync` que seguem a mesma estrutura, utilizando `NotionAssetSyncValidation`, `AssetSyncValidation`, `IntegrationService`, `AssetSyncRepository`, `AssetSyncSchedulerService`, etc., e retornando respostas padronizadas.

**Viola o padrão:**

- Não há violações explícitas deste padrão na base de código fornecida. Todas as classes no diretório `controllers` parecem seguir essa estrutura e responsabilidade.
```

```
## Padrão Adapter

### Descrição

O código utiliza o Padrão Adapter para fornecer uma interface consistente para interagir com bibliotecas externas ou frameworks. Classes no diretório `adapters` encapsulam a lógica específica de uma biblioteca (como Mongoose, Next.js HTTP, Quirrel, NodeCache) e a expõem através de contratos (`*Contract`) que são independentes da implementação subjacente.

### Exemplos

**Segue o padrão:**

- O arquivo `examples/investy/server/adapters/MongooseRepositoryAdapter.ts` adapta a API do Mongoose para o `RepositoryContract`, fornecendo métodos CRUD genéricos que funcionam com qualquer schema Mongoose.
- O arquivo `examples/investy/server/adapters/NextHttpAdapter.ts` adapta a API de requisição/resposta do Next.js (`NextApiRequest`, `NextApiResponse`) para o `HttpContract`, fornecendo uma interface padronizada (`ApiHandlerInput`, `ApiHandlerResponse`) para os controladores.

**Viola o padrão:**

- Não há violações explícitas deste padrão na base de código fornecida. As interações com bibliotecas externas parecem ser consistentemente encapsuladas em adaptadores.
```

```
## Padrão Singleton (Server-side)

### Descrição

A maioria das classes no lado do servidor (Controladores, Serviços, Repositórios, Utilitários, Módulos de Infraestrutura, Bibliotecas) é instanciada uma única vez e exportada como a exportação padrão do módulo. Isso garante que haja apenas uma instância dessas classes em toda a aplicação, o que é um padrão comum para gerenciar recursos compartilhados e lógica de negócio sem estado.

### Exemplos

**Segue o padrão:**

- O arquivo `examples/investy/server/services/LogService.ts` exporta `export default new LogService()`.
- O arquivo `examples/investy/server/repositories/UserRepository.ts` exporta `export default new UserRepository(UserSchema)`.
- O arquivo `examples/investy/server/controllers/UserController.ts` exporta `export default new UserController()`.

**Viola o padrão:**

- O arquivo `examples/investy/server/services/HashService.ts` exporta a classe `HashService` em vez de uma instância: `export default HashService`.
- O arquivo `examples/investy/server/services/CryptService.ts` exporta a classe `CryptService` em vez de uma instância: `export default CryptService`.
- O arquivo `examples/investy/server/lib/NotionLib.ts` exporta a classe `NotionLib` em vez de uma instância: `export default NotionLib`.
```

```
## Padrão de Validação

### Descrição

O código utiliza classes dedicadas no diretório `validations` para centralizar e encapsular a lógica de validação dos dados de entrada. Essas classes geralmente utilizam um utilitário comum (`ValidationUtil`) para executar validações e retornar um resultado padronizado (`ValidationResult`) que indica se os dados são válidos e quais campos contêm erros.

### Exemplos

**Segue o padrão:**

- O arquivo `examples/investy/server/validations/UserValidation.ts` define métodos como `validateSignupData` e `validateLoginData` que usam `ValidationUtil.validate` e regras de validação específicas para verificar os dados de usuário.
- O arquivo `examples/investy/server/validations/NotionAssetSyncValidation.ts` define `validateNotionData` que valida os dados de entrada para a sincronização com o Notion usando `ValidationUtil`.

**Viola o padrão:**

- Não há violações explícitas deste padrão na base de código fornecida. A lógica de validação parece estar consistentemente localizada nas classes `*Validation`.
```

```
## Padrão de Componente (Client-side)

### Descrição

O código do lado do cliente organiza a interface do usuário em componentes reutilizáveis, localizados no diretório `client/components`. Cada componente é geralmente definido em seu próprio diretório com um arquivo `index.tsx` e encapsula sua própria lógica, estado e marcação.

### Exemplos

**Segue o padrão:**

- O arquivo `examples/investy/client/components/Button/index.tsx` define um componente `Button` reutilizável com propriedades para variante, largura total, estado de carregamento, etc.
- O arquivo `examples/investy/client/components/TextInput/index.tsx` define um componente `TextInput` com suporte para adornos iniciais, mensagens de erro, etc.

**Viola o padrão:**

- Não há violações explícitas deste padrão na base de código fornecida. A UI parece estar consistentemente organizada em componentes.
```

```
## Padrão de Sub-componente (Client-side)

### Descrição

Alguns componentes complexos no lado do cliente (como `Table`, `Modal`, `SelectInput`, `Dropdown`) utilizam um padrão onde componentes relacionados são definidos separadamente e anexados como propriedades estáticas ao componente principal. Isso permite uma sintaxe de uso mais declarativa e organizada (ex: `<Table.Head>`, `<Modal.Trigger>`). Utilitários como `attachSubComponents` e `buildSubComponents` facilitam essa implementação.

### Exemplos

**Segue o padrão:**

- O arquivo `examples/investy/client/components/Table/index.tsx` define o componente `Table` e anexa `TableBody`, `TableColumn`, `TableHead` e `TableRow` como sub-componentes (`Table.Body`, `Table.Column`, `Table.Head`, `Table.Row`).
- O arquivo `examples/investy/client/components/Modal/index.tsx` define o componente `Modal` e anexa `ModalContent` e `ModalTrigger` como sub-componentes (`Modal.Content`, `Modal.Trigger`).

**Viola o padrão:**

- Não há violações explícitas deste padrão na base de código fornecida. Os componentes que utilizam sub-componentes parecem seguir essa estrutura consistentemente.
```

---

```
## Estrutura de Diretórios de Componentes/Módulos

### Descrição

Componentes React do lado do cliente, hooks e serviços, bem como módulos do lado do servidor como controllers, middlewares e adapters, são organizados em diretórios de nível superior dedicados (`client/components`, `client/hooks`, `client/services`, `@server/controllers`, `@server/middlewares`, `@server/adapters`, etc.). Dentro desses diretórios, entidades individuais (componentes, hooks, serviços, etc.) geralmente residem em seu próprio subdiretório nomeado após a entidade, contendo um arquivo `index.ts` ou `index.tsx` que exporta a entidade principal.

### Exemplos

**Seguindo o padrão:**

- `client/components/InputLabel/index.tsx`: O componente `InputLabel` está em seu próprio diretório `InputLabel` dentro de `client/components`, com o componente exportado de `index.tsx`.
- `@server/controllers/NotionAssetSyncController`: Importado usando um alias que implica uma estrutura de diretório semelhante a `@server/controllers/NotionAssetSyncController/index.ts`.

**Violando o padrão:**

- Com base nos trechos de código fornecidos, este padrão parece ser aplicado consistentemente. Não há exemplos claros de violação dentro do escopo do código analisado.

```

```
## Definição de Componentes Funcionais React

### Descrição

Componentes funcionais React são definidos consistentemente usando a sintaxe `const ComponentName: FC<Props> = (props) => { ... }` (ou `FC` sem tipo de props explícito se nenhuma for esperada). As props são tipicamente desestruturadas no início do corpo da função. O componente principal é exportado como o `default export` do seu módulo.

### Exemplos

**Seguindo o padrão:**

- `client/components/InputLabel/index.tsx`:
  ```typescript
  const InputLabel: FC<InputLabelProps> = (props) => {
  	const {
  		inputName,
  		children
  	} = props

  	return (
  		// ... JSX
  	)
  }

  export default InputLabel
  ```
- `client/components/PopConfirm/index.tsx`:
  ```typescript
  const PopConfirm: FC<PopConfirmProps> = (props) => {
  	const {
  		description,
  		children,
  		onConfirm
  	} = props

  	return (
  		// ... JSX
  	)
  }

  export default PopConfirm
  ```

**Violando o padrão:**

- `client/components/PageContainer/index.tsx`:
  ```typescript
  const PageContainer: FC = (props) => (
  	<div className="fixed inset-0 flex justify-center p-4">
  		{props.children} // Props não desestruturadas
  	</div>
  )

  export default PageContainer
  ```

```

```
## Composição de Handlers de Rotas de API

### Descrição

Rotas de API do lado do servidor definidas em `pages/api/` utilizam o adaptador `NextHttpAdapter.createApiHandlerRoute` para mapear métodos HTTP (como `post`, `get`, `put`) para um array de funções handler. Esses arrays tipicamente incluem funções middleware adaptadas por `NextHttpAdapter.adaptApiHandler` antes da função controller final, estabelecendo uma cadeia de execução.

### Exemplos

**Seguindo o padrão:**

- `pages/api/users/login.ts`:
  ```typescript
  export default NextHttpAdapter.createApiHandlerRoute({
  	post: [
  		NextHttpAdapter.adaptApiHandler(InfraMiddleware.setup),
  		NextHttpAdapter.adaptApiHandler(UserController.login)
  	]
  })
  ```
- `pages/api/asset-syncs/notion.ts`:
  ```typescript
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

**Violando o padrão:**

- `pages/api/queues/SyncNotionAssetPrice.ts`:
  ```typescript
  export default QuirrelQueueAdapter.adaptQueueHandler(SyncNotionAssetPriceQueue) // Não usa createApiHandlerRoute
  ```

```

```
## Uso Centralizado do Cliente API

### Descrição

Todas as interações do lado do cliente com a API de backend são realizadas utilizando uma única instância Axios pré-configurada chamada `api`, importada do módulo `@client/services/api`. Esta instância é configurada com a URL base da API e interceptadores para lidar com autenticação e erros.

### Exemplos

**Seguindo o padrão:**

- `client/pages/AssetSyncs/Notion/index.tsx`:
  ```typescript
  const response = await api.get<NotionAssetSync[]>("/asset-syncs/notion")
  // ...
  await api.post(`/asset-syncs/${notionAssetSync.id}/notion`)
  ```
- `client/pages/Login/index.tsx`:
  ```typescript
  const response = await api.post<{ authToken: string }>("/users/login", data)
  ```

**Violando o padrão:**

- Com base nos trechos de código fornecidos, este padrão parece ser aplicado consistentemente. Não há exemplos claros de violação onde uma instância Axios diferente ou `fetch` nativo seja usado para chamadas de API de backend.

```

```
## Gerenciamento Centralizado de Autenticação

### Descrição

A lógica relacionada à autenticação, incluindo o armazenamento e recuperação do token de autenticação no `localStorage`, bem como o tratamento de redirecionamentos após login e logout, é encapsulada dentro do módulo `@client/services/auth.ts`. O cliente API (`@client/services/api.ts`) integra-se a este serviço através de interceptadores para adicionar o token aos cabeçalhos das requisições e lidar com respostas não autorizadas (status 401).

### Exemplos

**Seguindo o padrão:**

- `client/services/auth.ts`: Define funções como `setAuthToken`, `getAuthToken`, `loginAndRedirect`, `logoutAndRedirect`.
- `client/services/api.ts`:
  ```typescript
  api.interceptors.request.use(async config => {
  	config.headers[authConfig.authTokenKey] = getAuthToken() // Usa getAuthToken
  	return config
  })

  api.interceptors.response.use(async requestConfig => requestConfig, async error => {
  	const statusCode = getErrorResponseStatusCode(error)

  	if (statusCode) {
  		logoutAndRedirect() // Usa logoutAndRedirect
  	}

  	return Promise.reject(error)
  })
  ```
- `client/pages/Login/index.tsx`:
  ```typescript
  loginAndRedirect(response.data.authToken) // Usa loginAndRedirect
  ```

**Violando o padrão:**

- Com base nos trechos de código fornecidos, este padrão parece ser aplicado consistentemente. Não há exemplos claros de violação onde a lógica de autenticação (como acesso direto ao `localStorage` para o token de auth) seja tratada fora do serviço `@client/services/auth.ts` ou dos interceptadores da API.

```

```
## Validação de Formulários com Hook `useValidation`

### Descrição

Formulários que interagem com a API e requerem validação utilizam o hook customizado `useValidation` para gerenciar o estado da validação, processar erros retornados pelas respostas da API (`digestRequestError`), limpar erros de campos específicos (`clearFieldError`) e fornecer mensagens de erro formatadas (`validation.messages`) para exibição ao lado dos campos de input.

### Exemplos

**Seguindo o padrão:**

- `client/pages/Login/index.tsx`:
  ```typescript
  const validation = useValidation()
  // ...
  onValueChange={value => handleChange("email", value)}
  errorMessage={validation.messages.email} // Exibe mensagem de erro
  // ...
  validation.digestRequestError(error) // Processa erro da API
  ```
- `client/pages/Signup/index.tsx`:
  ```typescript
  const validation = useValidation()
  // ...
  onValueChange={value => handleChange("name", value)}
  errorMessage={validation.messages.name} // Exibe mensagem de erro
  // ...
  validation.digestRequestError(error) // Processa erro da API
  ```

**Violando o padrão:**

- `client/pages/AssetSyncs/Notion/components/EditAssetSyncModal/index.tsx`: Este componente contém campos de formulário (`TextInput`, `SelectInput`) e lida com a atualização de dados (`handleChange`) e uma ação de salvamento (`handleSave` que chama `onSave`), mas não utiliza o hook `useValidation` para gerenciar ou exibir erros de validação, incluindo potenciais erros retornados pela API na função `onSave`.

```

```
## Gerenciamento de Estado Local com `useState`

### Descrição

Componentes funcionais React gerenciam seu estado interno e mutável utilizando o hook `useState` fornecido pelo React. Este é o mecanismo padrão para armazenar e atualizar dados que afetam a renderização do componente.

### Exemplos

**Seguindo o padrão:**

- `client/pages/AssetSyncs/Notion/index.tsx`:
  ```typescript
  const [notionAssetSyncs, setNotionAssetSyncs] = useState<NotionAssetSync[]>([])
  const [loading, setLoading] = useState(true)
  ```
- `client/pages/Login/index.tsx`:
  ```typescript
  const [data, setData] = useState({} as Data)
  const [loading, setLoading] = useState(false)
  ```
- `client/pages/AssetSyncs/Notion/components/EditAssetSyncModal/index.tsx`:
  ```typescript
  const [updatedData, setUpdatedData] = useState<Data>(data)
  const [foundDatabases, setFoundDatabases] = useState<Database[]>([mockedCurrentDatabase])
  ```

**Violando o padrão:**

- Com base nos trechos de código fornecidos, este padrão parece ser aplicado consistentemente. Todos os componentes que precisam gerenciar estado local utilizam o hook `useState`.

```
