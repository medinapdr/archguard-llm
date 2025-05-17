## Convecção de Nomenclatura de Funções

### Descrição

Na codebase, as funções seguem um padrão de nomenclatura baseado em ações, como `getAll`, `create`, `validateCreateUserParams`, o que sugere a utilização de prefixos descritivos que refletem a operação executada pela função. Este padrão oferece clara leitura sobre a finalidade de cada função.

### Exemplos

- Conforme o padrão: `getAll`, `createUser`, `validateCreateUserParams`.
- Não conforme o padrão: `allUsers`, `addUser`, `checkUserParams` (não utiliza o mesmo estilo de prefixos).

## Arquitetura em Camadas

### Descrição

A codebase demonstra uma arquitetura em camadas, onde responsabilidades distintas são divididas entre camadas separadas como Controllers, Services, Repositories, Validations, e Routes. Isso promove a separação de preocupações (SoC), facilitando a manutenção e evolução do código.

### Exemplos

- Conforme o padrão: A camada de Controladores (`UserController`) lida com a lógica de requisições HTTP, enquanto a camada de Serviços (`UserService`) trata das regras de negócio. A camada de Repositórios (`UserRepository`) é responsável por interagir com os dados.
- Não conforme o padrão: Misturar chamada de banco de dados diretamente no controlador sem utilizar os serviços e repositórios definidos.

## Singleton Pattern

### Descrição

O padrão Singleton é utilizado na implementação de módulos como `ValidatorUtil`, `UserService`, `UserValidation`, e `UserController`, uma vez que cada um é exportado como uma instância única através do uso de `module.exports = new ClassName()`.

### Exemplos

- Conforme o padrão: `module.exports = new UserValidation();`
- Não conforme o padrão: `module.exports = UserValidation;` (isso não garantiria uma única instância da classe).

## Convenções de Modulação e Organização de Código

### Descrição

O código está organizado de forma modular, cada módulo contendo lógicas específicas. Observa-se isso em pastas como `Routes`, `Controllers`, `Services`, entre outras, que separam funcionalidades e mantêm o código bem organizado e escalável.

### Exemplos

- Conforme o padrão: Arquivos como `UserRoute.js`, `UserController.js`, `UserService.js` demonstram uma clara modularização.
- Não conforme o padrão: Colocar todas as funções e implementações dentro de um único arquivo, desrespeitando a separação lógica por módulos.

## Gerenciamento Consistente de Erros

### Descrição

Os controladores, exemplificados pelo `UserController`, seguem um padrão consistente para lidar com erros, utilizando blocos `try-catch` e retornando respostas com status apropriados ao cliente (`500` para errors de servidor).

### Exemplos

- Conforme o padrão: Uso de blocos `try-catch` em `createUser` e `getAllUsers`.
- Não conforme o padrão: Não capturar exceções que podem lançar erros de runtime sem tratamento adequado.

## Convenção de Acesso a Bancos de Dados

### Descrição

O acesso aos dados segue a convenção de utilização de Repositórios, onde o `UserRepository` gerencia a interação com os dados dos usuários, encapsulando a lógica de acesso aos dados em métodos como `getAll` e `create`.

### Exemplos

- Conforme o padrão: `UserRepository.getAll()` e `UserRepository.create(user)`.
- Não conforme o padrão: Implementar diretamente a manipulação dos arrays de usuários nos controladores ou serviços.
