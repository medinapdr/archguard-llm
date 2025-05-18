```
## Padrão de Estrutura em Camadas

### Descrição

O código segue um padrão de arquitetura em camadas, onde a responsabilidade é separada entre controladores, serviços, repositórios, validações e rotas. Este padrão é importante porque promove a separação de preocupações, facilitando a manutenção e a escalabilidade do sistema. Cada camada tem uma responsabilidade clara: os controladores lidam com a lógica de entrada e saída, os serviços contêm a lógica de negócios, os repositórios gerenciam o acesso a dados, as validações garantem a integridade dos dados de entrada, e as rotas definem os endpoints da API.

### Exemplos

- **Segue o padrão**: 
  - `UserController.js` lida com as requisições HTTP e utiliza `UserService.js` para a lógica de negócios.
  - `UserService.js` interage com `UserRepository.js` para operações de dados.
  - `UserValidation.js` é usado para validar dados de entrada antes de serem processados.

- **Viola o padrão**:
  - Se `UserController.js` contivesse diretamente a lógica de acesso a dados, como manipulação direta do array de usuários, isso violaria a separação de responsabilidades esperada na arquitetura em camadas.

## Convenção de Nomenclatura de Métodos

### Descrição

Os métodos dentro das classes seguem uma convenção de nomenclatura que reflete suas ações, como `getAll`, `create`, `validateCreateUserParams`. Essa prática é importante porque melhora a legibilidade do código e facilita a compreensão das ações realizadas por cada método.

### Exemplos

- **Segue o padrão**:
  - `UserService.js` possui métodos como `getAll` e `create`, que indicam claramente suas funções.
  - `UserValidation.js` possui o método `validateCreateUserParams`, que descreve sua finalidade de validação.

- **Viola o padrão**:
  - Se um método em `UserService.js` fosse nomeado de forma genérica ou não descritiva, como `doAction`, isso violaria a convenção de nomenclatura clara e descritiva.

## Uso de Instâncias Singleton

### Descrição

O código utiliza o padrão Singleton para instanciar classes, garantindo que apenas uma única instância de cada classe seja criada e utilizada em todo o aplicativo. Isso é importante para manter o estado compartilhado e evitar a criação desnecessária de múltiplas instâncias que poderiam levar a inconsistências.

### Exemplos

- **Segue o padrão**:
  - `UserValidation.js`, `UserService.js`, `UserController.js`, `UserRepository.js`, e `ValidatorUtil.js` exportam uma única instância de suas respectivas classes.

- **Viola o padrão**:
  - Se `UserRepository.js` exportasse a classe diretamente em vez de uma instância, permitindo múltiplas instâncias, isso violaria o padrão Singleton.
```
