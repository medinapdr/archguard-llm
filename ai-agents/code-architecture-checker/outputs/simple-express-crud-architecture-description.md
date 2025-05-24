## Padrão: "Naming Conventions"

### Descrição

O código utiliza convenções de nomenclatura consistentes para classes e métodos, indicando claramente a responsabilidade ou a ação realizada. Classes são frequentemente nomeadas com sufixos que denotam seu papel arquitetural (como `Service`, `Controller`, `Repository`, `Validation`, `Util`). Métodos seguem um padrão baseado na ação que executam (como `get`, `create`, `validate`).

### Exemplos

- Classes nomeadas com sufixos indicando responsabilidade:
    - `UserService` (examples/simple-express-crud/src/Services/UserService.js)
    - `UserController` (examples/simple-express-crud/src/Controllers/UserController.js)
    - `UserRepository` (examples/simple-express-crud/src/Repositories/UserRepository.js)
    - `UserValidation` (examples/simple-express-crud/src/Validations/UserValidation.js)
    - `ValidatorUtil` (examples/simple-express-crud/src/Utils/ValidatorUtil.js)
- Métodos nomeados com base na ação:
    - `getAll` (examples/simple-express-crud/src/Services/UserService.js, examples/simple-express-crud/src/Repositories/UserRepository.js)
    - `create` (examples/simple-express-crud/src/Services/UserService.js, examples/simple-express-crud/src/Repositories/UserRepository.js)
    - `validate` (examples/simple-express-crud/src/Utils/ValidatorUtil.js)

## Padrão: "File/Module Organization"

### Descrição

Os arquivos e módulos são organizados em diretórios distintos com base em sua responsabilidade ou tipo. Isso cria uma estrutura de projeto clara e previsível, onde componentes relacionados são agrupados logicamente.

### Exemplos

- Arquivos de controle localizados em `/Controllers`:
    - `UserController.js` (examples/simple-express-crud/src/Controllers/UserController.js)
- Arquivos de serviço localizados em `/Services`:
    - `UserService.js` (examples/simple-express-crud/src/Services/UserService.js)
- Arquivos de repositório localizados em `/Repositories`:
    - `UserRepository.js` (examples/simple-express-crud/src/Repositories/UserRepository.js)
    - `AccountRepository.js` (examples/simple-express-crud/src/Repositories/AccountRepository.js)
- Arquivos de rota localizados em `/Routes`:
    - `UserRoute.js` (examples/simple-express-crud/src/Routes/UserRoute.js)
- Arquivos de validação localizados em `/Validations`:
    - `UserValidation.js` (examples/simple-express-crud/src/Validations/UserValidation.js)
- Arquivos de utilitários localizados em `/Utils`:
    - `ValidatorUtil.js` (examples/simple-express-crud/src/Utils/ValidatorUtil.js)

## Padrão: "Layered Architecture"

### Descrição

O código demonstra uma separação de responsabilidades em camadas lógicas. As rotas definem endpoints e delegam para controladores, os controladores lidam com requisições/respostas e orquestram chamadas para serviços e validações, os serviços contêm a lógica de negócio e interagem com repositórios, e os repositórios lidam exclusivamente com o acesso a dados.

### Exemplos

- A camada de Rota (`UserRoute.js`) define endpoints e delega a manipulação para a camada de Controlador (`UserController.js`):
    ```javascript
    route.get(
    	"/users",
    	UserController.getAllUsers
    )
    route.post(
    	"/users",
    	UserController.createUser
    )
    ```
- A camada de Controlador (`UserController.js`) lida com a requisição/resposta HTTP e chama a camada de Serviço (`UserService.js`) e a camada de Validação (`UserValidation.js`):
    ```javascript
    const UserService = require("../Services/UserService")
    const UserValidation = require("../Validations/UserValidation")
    // ... dentro de um método do controller
    const validation = UserValidation.validateCreateUserParams(user)
    // ...
    const users = UserService.getAll()
    ```
- A camada de Serviço (`UserService.js`) contém a lógica de negócio (neste caso, delegação simples) e chama a camada de Repositório (`UserRepository.js`):
    ```javascript
    const UserRepository = require("../Repositories/UserRepository")
    class UserService {
    	getAll () {
    		return UserRepository.getAll()
    	}
    	create (user) {
    		return UserRepository.create(user)
    	}
    }
    ```
- A camada de Repositório (`UserRepository.js`, `AccountRepository.js`) lida com o acesso a dados (neste caso, arrays em memória):
    ```javascript
    class UserRepository {
    	static #users = []
    	getAll () {
    		return UserRepository.#users
    	}
    	create (user) {
    		// ... lógica de persistência ...
    	}
    }
    ```

## Padrão: "Separation of Concerns"

### Descrição

Cada módulo ou componente no código tem uma responsabilidade única e bem definida. Controladores focam em lidar com requisições HTTP, serviços focam na lógica de negócio, repositórios focam no acesso a dados, e validações focam na validação de entrada. Essa separação garante que as responsabilidades não estejam misturadas em um único local.

### Exemplos

- O `UserController` (examples/simple-express-crud/src/Controllers/UserController.js) lida com a requisição e resposta HTTP (`req`, `res`), chama a validação (`UserValidation.validateCreateUserParams`) e o serviço (`UserService.getAll`, `UserService.create`), mas não contém a lógica de validação em si nem a lógica de acesso a dados.
- O `UserService` (examples/simple-express-crud/src/Services/UserService.js) contém a lógica de negócio (delegação para o repositório), mas não lida com requisições HTTP ou acesso direto a dados.
- O `UserRepository` (examples/simple-express-crud/src/Repositories/UserRepository.js) lida exclusivamente com a manipulação do array de usuários em memória, sem lógica de negócio ou HTTP.
- O `UserValidation` (examples/simple-express-crud/src/Validations/UserValidation.js) foca apenas na validação dos parâmetros do usuário, utilizando um utilitário genérico (`ValidatorUtil`).
