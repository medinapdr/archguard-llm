## Padrão de Estrutura em Camadas

### Descrição

O código segue um padrão de arquitetura em camadas, onde há uma separação clara entre as responsabilidades de controle, serviço, repositório e validação. Este padrão é importante porque promove a separação de preocupações, facilitando a manutenção e evolução do código. Cada camada tem uma responsabilidade específica: 

- **Controllers**: Lidam com a lógica de entrada e saída, interagindo com as requisições HTTP.
- **Services**: Contêm a lógica de negócios e interagem com os repositórios.
- **Repositories**: Gerenciam o acesso aos dados, seja em memória ou em um banco de dados.
- **Validations**: Realizam a validação dos dados de entrada.

### Exemplos

- **Segue o padrão**: 
  - `UserController` interage com `UserService` para obter dados e processar requisições.
  - `UserService` utiliza `UserRepository` para acessar dados de usuários.
  - `UserValidation` é usado para validar dados de entrada antes de serem processados.

- **Viola o padrão**:
  - Se `UserController` acessasse diretamente `UserRepository` para obter dados, sem passar por `UserService`, isso violaria a separação de camadas.

## Convenção de Nomenclatura para Repositórios

### Descrição

Todos os repositórios seguem uma convenção de nomenclatura que utiliza o sufixo "Repository". Isso ajuda a identificar rapidamente a responsabilidade de uma classe como sendo relacionada ao acesso a dados. Essa consistência é importante para a legibilidade e manutenção do código.

### Exemplos

- **Segue o padrão**:
  - `UserRepository` e `AccountRepository` são nomeados com o sufixo "Repository", indicando claramente sua função.

- **Viola o padrão**:
  - Se houvesse uma classe chamada `UserData` que funcionasse como um repositório, isso violaria a convenção de nomenclatura estabelecida.

## Uso Consistente de Instâncias Singleton

### Descrição

O código utiliza instâncias singleton para classes que não precisam de múltiplas instâncias, como `UserValidation`, `UserService`, `UserController`, `ValidatorUtil`, `AccountRepository` e `UserRepository`. Isso é importante para garantir que o estado compartilhado seja gerenciado de forma consistente e para economizar recursos.

### Exemplos

- **Segue o padrão**:
  - `module.exports = new UserService()` exporta uma única instância de `UserService`.

- **Viola o padrão**:
  - Se `UserService` fosse exportado como `module.exports = UserService`, permitindo múltiplas instâncias, isso violaria o padrão singleton.
