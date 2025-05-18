```
## Separação de Camadas: Controller, Service e Repository

### Descrição

O código segue um padrão de separação de responsabilidades em camadas distintas: Controller, Service e Repository. Cada uma dessas camadas tem uma responsabilidade específica:

- **Controller**: responsável por lidar com as requisições HTTP, chamar o serviço apropriado e retornar a resposta HTTP.
- **Service**: contém a lógica de negócios. Interage com o repository para manipular dados.
- **Repository**: responsável pelo acesso e manipulação direta dos dados, neste caso, simulando operações em um banco de dados através de um array.

A separação de camadas é importante para manter o código organizado, facilitar a manutenção e melhorar a testabilidade, permitindo a modificação de uma camada sem afetar diretamente as outras.

### Exemplos

- **Exemplo que segue o padrão:**
  - `examples/simple-express-crud/src/Controllers/UserController.js` lida com as requisições e utiliza o `UserService` para realizar operações.
  - `examples/simple-express-crud/src/Services/UserService.js` define a lógica de obter e criar usuários, interagindo com o `UserRepository`.
  - `examples/simple-express-crud/src/Repositories/UserRepository.js` executa a manipulação de dados, simulando um banco de dados com um array.

- **Exemplo que viola o padrão:**
  - Se a lógica de manipulação de dados estivesse diretamente no `UserController` em vez de ser delegada ao `UserService` e `UserRepository`, como:
    ```javascript
    class UserController {
      getAllUsers (req, res) {
        try {
          const users = UserRepository.getAll() // Chamando diretamente o repository em vez de passar pelo service
          return res.status(200).json({ users })
        } catch (error) {
          console.error(error)
          return res.status(500).json({ error: "Server Error" })
        }
      }
    }
    ```

## Convenção de Nomenclatura para Métodos

### Descrição

Os métodos no código seguem uma convenção de nomenclatura clara que reflete suas ações, utilizando prefixos como `get`, `create`, etc. Isso aumenta a legibilidade e a compreensão imediata das ações que cada método executa.

### Exemplos

- **Exemplo que segue o padrão:**
  - `UserService.getAll()`: Usando `getAll` para indicar a obtenção de todos os recursos.
  - `UserRepository.create(user)`: Usando `create` para indicar a criação de um recurso.

- **Exemplo que viola o padrão:**
  - Se um método de obtenção de todos os usuários fosse nomeado de forma inconsistente, como `UserService.retrieveUsers()`, em vez de `getAll()`, quebraria a consistência e a expectativa de nomenclatura.

## Manipulação de Validação Centralizada

### Descrição

Toda a validação de entrada do usuário é feita através de uma classe de validação centralizada, `UserValidation`, que utiliza uma utilidade de validação (`ValidatorUtil`). Isso garante que todas as regras de validação sejam centralizadas e facilmente gerenciadas e expandidas.

### Exemplos

- **Exemplo que segue o padrão:**
  - `UserValidation.validateCreateUserParams(user)`: Usa uma classe dedicada para validar parâmetros de criação de usuário.

- **Exemplo que viola o padrão:**
  - A validação dos parâmetros do usuário feita diretamente no controlador sem a utilização da classe de validação, como:
    ```javascript
    createUser (req, res) {
      try {
        const user = req.body.user
        if (!user.name) { // Validação direta sem o uso do UserValidation
          return res.status(400).json({ error: "name must be filled" })
        }
        UserService.create(user)
        return res.status(201).json({})
      } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Server Error" })
      }
    }
    ```
```

