## Convenção de Nomenclatura de Funções de Acesso a Dados

### Descrição

No código fornecido, as funções que realizam acesso a dados no repositório de usuários seguem uma convenção de nomenclatura que começa com os prefixos "get" e "create".

### Exemplos

- Consistente com a convenção:
  ```javascript
  class UserRepository {
    getAll() {
      // lógica
    }
    
    create(user) {
      // lógica
    }
  }
  ```

- Inconsistente com a convenção:
  ```javascript
  class UserRepository {
    fetchUsers() { // "fetch" ao invés de "getAll"
      // lógica
    }
    
    addUser(user) { // "addUser" ao invés de "create"
      // lógica
    }
  }
  ```

## Padrão MVC (Model-View-Controller)

### Descrição

A estrutura do código segue o padrão arquitetural MVC. Os componentes estão claramente separados em modelos como `UserRepository` (para acesso a dados), `UserService` (para lógica de negócio), `UserController` (para manipulação das requisições), e `UserRoute` (roteamento das requisições). Este padrão promove a separação de responsabilidades e uma melhor organização do código.

### Exemplos

- Consistente com o padrão:
  - `UserRepository` cuida do acesso direto aos dados.
  - `UserService` encapsula a lógica de negócios e manipula dados do repositório.
  - `UserController` gerencia as requisições HTTP e respostas.
  - `UserRoute` define os endpoints e vincula-os aos métodos do controlador.

- Inconsistente com o padrão:
  ```javascript
  class UserService {
    getAllUsers(req, res) { // Deveria estar em UserController
      // lógica
    }
  }

  // ou

  class UserRepository {
    createUser(user) { // já que mistura lógica de negócio e persistência
      // lógica
    }
  }
  ```

## Camada de Validação

### Descrição

A validação dos dados dos usuários é realizada por uma classe separada `UserValidation`, que utiliza especificamente `ValidatorUtil` para validar parâmetros de entrada, mantendo o princípio de responsabilidade única (SoC - Separation of Concerns).

### Exemplos

- Consistente com a separação de preocupações:
  ```javascript
  class UserValidation {
    validateCreateUserParams(user) {
      return ValidatorUtil.validate(user, {
        name: [
          {
            handler: (value) => Boolean(value),
            errorMessage: "must_be_filled",
          }
        ],
      });
    }
  }
  ```

- Inconsistente com a separação de preocupações:
  ```javascript
  class UserController {
    createUser(req, res) {
      if (!req.body.user.name) { // Validação diretamente no controlador
        res.status(400).json({ error: "name must_be_filled" });
      }
      // lógica
    }
  }
  ```
