## Estrutura de Diretórios Baseada em Camadas/Funções

### Descrição

O código organiza os arquivos em diretórios que correspondem a camadas arquiteturais ou funções específicas dentro da aplicação. No lado do servidor (`server`), há diretórios distintos para `adapters`, `config`, `controllers`, `entities`, `exceptions`, `infra`, `lib`, `middlewares`, `protocols`, `queues`, `repositories`, `schemas`, `services`, e `utils`. No lado do cliente (`client`), há diretórios para `adapters`, `assets`, `components`, `config`, `hooks`, `pages`, `protocols`, `routes`, e `utils`. Essa estrutura promove a separação de responsabilidades e facilita a localização de código relacionado.

### Exemplos

- **Segue o padrão:**
  - Arquivos relacionados à lógica de negócio estão em `server/services` (ex: `LogService.ts`, `AuthService.ts`).
  - Arquivos que definem a interação com o banco de dados estão em `server/repositories` (ex: `UserRepository.ts`, `IntegrationRepository.ts`).
  - Componentes de interface do usuário estão em `client/components` (ex: `Button/index.tsx`, `Table/index.tsx`).

- **Viola o padrão:** (Não há violações explícitas no código fornecido, pois a estrutura é consistentemente aplicada).

## Convenção de Nomenclatura `[Nome][Tipo]`

### Descrição

Uma convenção de nomenclatura consistente é utilizada, onde os nomes de arquivos e classes frequentemente terminam com um sufixo que indica seu tipo ou função arquitetural (por exemplo, `Service`, `Repository`, `Controller`, `Util`, `Lib`, `Middleware`, `Validation`, `Config`, `Entity`, `Schema`, `Adapter`, `Contract`, `Protocol`, `Component`, `Hook`). Isso torna a função de um arquivo ou classe imediatamente clara a partir de seu nome.

### Exemplos

- **Segue o padrão:**
  - `LogService.ts` (indica um serviço de log).
  - `UserRepository.ts` (indica um repositório para a entidade User).
  - `NotionIntegrationController.ts` (indica um controlador para integrações Notion).
  - `StringUtil.ts` (indica uma classe de utilidades para strings).
  - `DatabaseConfig.ts` (indica um arquivo de configuração de banco de dados).
  - `UserEntity.ts` (indica uma entidade de usuário).
  - `UserSchema.ts` (indica um schema Mongoose para usuário).
  - `MongooseRepositoryAdapter.ts` (indica um adapter para repositórios Mongoose).
  - `AuthMiddleware.ts` (indica um middleware de autenticação).
  - `UserValidation.ts` (indica lógica de validação para usuários).
  - `RepositoryContract.ts` (indica um contrato/interface para repositórios).
  - `AuthProtocol.ts` (indica um protocolo/tipo para autenticação).
  - `Button/index.tsx` (indica um componente Button).
  - `useDidMount.ts` (indica um hook React).

- **Viola o padrão:** (Não há violações explícitas no código fornecido, pois a convenção é consistentemente aplicada).

## Padrão Repository com Adapter Mongoose

### Descrição

O acesso ao banco de dados (Mongoose) é abstraído através do padrão Repository. Classes de repositório específicas (como `UserRepository`, `IntegrationRepository`, `AssetSyncRepository`) não interagem diretamente com o Mongoose, mas sim estendem uma classe `MongooseRepositoryAdapter`. Este adapter encapsula a lógica genérica de interação com o Mongoose (criar, buscar, atualizar, deletar), promovendo a reutilização de código e desacoplando a lógica de negócio da implementação específica do ORM.

### Exemplos

- **Segue o padrão:**
  - `UserRepository` estende `MongooseRepositoryAdapter<UserEntity>` e é instanciado com `UserSchema`.
  - `IntegrationRepository` estende `MongooseRepositoryAdapter<IntegrationEntity>` e é instanciado com `IntegrationSchema`.
  - `AssetSyncRepository` estende `MongooseRepositoryAdapter<AssetSyncEntity>` e é instanciado com `AssetSyncSchema`.

- **Viola o padrão:** (Não há violações explícitas no código fornecido, pois todos os repositórios Mongoose seguem este padrão).

## Padrão Controller (API Server) com Resposta Padronizada

### Descrição

As classes localizadas no diretório `server/controllers` são responsáveis por lidar com as requisições HTTP recebidas. Cada método de um controlador recebe um objeto `ApiHandlerInput` que contém objetos `request` e `response` padronizados. O objeto `response` fornece métodos consistentes (`ok`, `badRequest`, `notFound`, `serverError`, `noContent`, `created`, `unauthorized`, `forbidden`, `next`) para enviar respostas HTTP, garantindo um formato de resposta uniforme em toda a API.

### Exemplos

- **Segue o padrão:**
  - Em `NotionIntegrationController.ts`, o método `searchDatabase` recebe `ApiHandlerInput` e usa `response.notFound()` ou `response.ok()`.
  - Em `UserController.ts`, o método `signup` recebe `ApiHandlerInput` e usa `response.badRequest()` ou `response.created()`.
  - Em `IntegrationController.ts`, o método `create` recebe `ApiHandlerInput` e usa `response.badRequest()` ou `response.created()`.

- **Viola o padrão:** (Não há violações explícitas no código fornecido, pois todos os controladores seguem este padrão de entrada e saída).

## Exportação Singleton-like para Módulos

### Descrição

Muitas classes que representam módulos ou serviços (como `Services`, `Repositories`, `Controllers`, `Utils`, `Libs`, `Middlewares`, `Infra` modules) são exportadas como uma única instância utilizando `export default new ClassName()`. Isso garante que haja apenas uma instância desses módulos em toda a aplicação, facilitando o gerenciamento de estado e a injeção de dependências implícita.

### Exemplos

- **Segue o padrão:**
  - `export default new DatabaseModule()` em `server/infra/database/index.ts`.
  - `export default new LogService()` em `server/services/LogService.ts`.
  - `export default new UserRepository(UserSchema)` em `server/repositories/UserRepository.ts`.
  - `export default new NotionIntegrationController()` em `server/controllers/NotionIntegrationController.ts`.
  - `export default new StringUtil()` em `server/utils/StringUtil.ts`.
  - `export default new AuthMiddleware()` em `server/middlewares/AuthMiddleware.ts`.
  - `export default new UserValidation()` em `server/validations/UserValidation.ts`.

- **Viola o padrão:**
  - `export default NotionLib` em `server/lib/NotionLib.ts`. Esta classe é exportada como a própria classe, permitindo múltiplas instanciações (como visto em `SyncNotionAssetPriceQueue.ts` e `NotionAssetSyncController.ts` onde `new NotionLib(token)` é chamado).
  - `export default MongooseRepositoryAdapter` em `server/adapters/MongooseRepositoryAdapter.ts`. Esta classe é exportada para ser estendida e instanciada por outras classes.
  - `export default NodeCacheAdapter` em `server/adapters/NodeCacheAdapter.ts`. Esta classe é exportada para ser instanciada (como visto em `NotionAssetSyncController.ts`).

---

## Desestruturação de Props em Componentes

### Descrição

Componentes funcionais frequentemente desestruturam o objeto `props` no início da função para acessar propriedades individuais como `children` e outras props específicas. Este padrão torna o acesso às props mais direto e legível dentro do corpo do componente.

### Exemplos

**Seguindo o padrão:**

```typescript
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
```

**Violando o padrão:**

```typescript
const PageContainer: FC = (props) => (
	<div className="fixed inset-0 flex justify-center p-4">
		{props.children}
	</div>
)
```
