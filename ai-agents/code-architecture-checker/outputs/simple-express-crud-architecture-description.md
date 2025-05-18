## Padrão de Arquitetura MVC (Model-View-Controller)

### Descrição

O padrão MVC é claramente seguido na estrutura do código, onde há uma separação clara entre as responsabilidades de controle, serviço e repositório. O `UserController` lida com as requisições HTTP e interage com o `UserService`, que por sua vez, realiza operações de negócio e interage com o `UserRepository` para acessar os dados. Essa separação de responsabilidades facilita a manutenção e a escalabilidade do sistema.

### Exemplos

- **Segue o padrão:**
  - `UserController` lida com a lógica de requisição e resposta HTTP.
  - `UserService` contém a lógica de negócio.
  - `UserRepository` gerencia o acesso aos dados.

- **Viola o padrão:**
  - Se o `UserController` acessasse diretamente o `UserRepository` sem passar pelo `UserService`, isso violaria o padrão MVC, pois misturaria a lógica de controle com a lógica de acesso a dados.

## Convenção de Nomenclatura para Métodos de Acesso a Dados

### Descrição

Os métodos de acesso a dados no `UserRepository` seguem uma convenção de nomenclatura clara, onde métodos de recuperação de dados começam com `get` e métodos de criação começam com `create`. Essa consistência ajuda a entender rapidamente o propósito dos métodos e a manter a uniformidade no código.

### Exemplos

- **Segue o padrão:**
  - `getAll()`, `getById(id)`, `create(user)` no `UserRepository`.

- **Viola o padrão:**
  - Se houvesse um método chamado `fetchAllUsers()` ou `addUser()` no `UserRepository`, isso violaria a convenção de nomenclatura observada.

## Estrutura de Diretórios por Responsabilidade

### Descrição

A estrutura de diretórios do projeto é organizada por responsabilidade, com pastas separadas para `Controllers`, `Services`, `Repositories`, `Routes`, `Validations` e `Utils`. Essa organização facilita a navegação no projeto e a localização de arquivos relacionados a uma funcionalidade específica.

### Exemplos

- **Segue o padrão:**
  - `src/Controllers/UserController.js`, `src/Services/UserService.js`, `src/Repositories/UserRepository.js`.

- **Viola o padrão:**
  - Se o `UserController` estivesse localizado diretamente em `src/` ao invés de `src/Controllers/`, isso violaria a estrutura de diretórios por responsabilidade.
