## Padrão de Estrutura de Camadas

### Descrição

O código segue um padrão de arquitetura em camadas, onde há uma clara separação entre as responsabilidades de controle, serviço, repositório e validação. Este padrão é importante porque promove a separação de preocupações, facilitando a manutenção e evolução do código. Cada camada tem uma responsabilidade específica: 

- **Controllers**: Lidam com a lógica de entrada e saída HTTP.
- **Services**: Contêm a lógica de negócios.
- **Repositories**: Gerenciam o acesso aos dados.
- **Validations**: Realizam validações de dados.

### Exemplos

- **Exemplo que segue o padrão**: 
  - `UserController` utiliza `UserService` para lógica de negócios e `UserValidation` para validação de dados.
  - `UserService` utiliza `UserRepository` para operações de dados.

- **Exemplo que viola o padrão**:
  - Se `UserController` acessasse diretamente `UserRepository` para buscar dados, isso violaria a separação de camadas, pois a lógica de negócios estaria misturada com a lógica de controle.

## Convenção de Nomenclatura para Métodos de Repositório

### Descrição

Os métodos nos repositórios seguem uma convenção de nomenclatura que reflete a operação que realizam, como `getAll`, `getById` e `create`. Esta convenção é importante para a clareza e previsibilidade do código, facilitando a compreensão das operações realizadas por cada método.

### Exemplos

- **Exemplo que segue o padrão**:
  - `UserRepository.getAll()`, `UserRepository.create(user)`, `UserRepository.getById(id)`

- **Exemplo que viola o padrão**:
  - Se um método no repositório fosse nomeado de forma genérica ou não descritiva, como `doSomething()`, isso violaria a convenção de nomenclatura, tornando o código menos claro.

## Uso Consistente de Instâncias Singleton

### Descrição

O código utiliza instâncias singleton para classes de serviço, validação e utilitários, garantindo que apenas uma instância de cada classe seja criada e utilizada em toda a aplicação. Isso é importante para economizar recursos e manter o estado compartilhado quando necessário.

### Exemplos

- **Exemplo que segue o padrão**:
  - `module.exports = new UserService()`, `module.exports = new UserValidation()`, `module.exports = new ValidatorUtil()`

- **Exemplo que viola o padrão**:
  - Se `UserService` fosse exportado como `module.exports = UserService`, permitindo múltiplas instâncias, isso violaria o padrão singleton, potencialmente levando a inconsistências de estado.
