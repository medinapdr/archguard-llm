## Convenção de Nomenclatura: Funções de Retorno de Dados

### Descrição

Na base de código fornecida, há um padrão de nomenclatura para funções que retornam dados, utilizando o prefixo "get". Tal convenção é aplicada em várias camadas do projeto, como nos serviços e repositórios.

### Exemplos

- Correto: `getAll` (na classe `UserService` e `UserRepository`).
- Incorreto: Em vez de `getAllUsers`, usou-se apenas `getAll` na camada de serviço, mas segue a convenção na funcionalidade.

## Padrão de Design: Modelo MVC (Model-View-Controller)

### Descrição

O projeto segue o padrão de arquitetura MVC, separando as responsabilidades em diferentes camadas: **Model** (UserRepository), **View** (Express.Router) e **Controller** (UserController). Essa separação facilita a manutenção e o entendimento do sistema, além de permitir uma escalabilidade mais ordenada.

### Exemplos

- Correto: A classe `UserController` separa a lógica de controle, utilizando o `UserService` para lógica de negócio e o `UserValidation` para validações.
- Incorreto: Não foram encontrados exemplos que quebrem este padrão claramente na base de código fornecida.

## Padrão de Arquitetura: Utilização de Utilitário para Validações

### Descrição

A classe `ValidatorUtil` centraliza o padrão de validação dos parâmetros recebidos, promovendo uma abordagem DRY e facilitando a reutilização de código de validação.

### Exemplos

- Correto: Uso de `ValidatorUtil` em `UserValidation` para validar parâmetros de criação de usuário.
- Incorreto: Em projetos onde validações são espalhadas diretamente nos controladores ou serviços sem um ponto centralizado como `ValidatorUtil`.

## Padrão de Manutenção de Estado: Repositório

### Descrição

O `UserRepository` é responsável por gerenciar o estado dos dados da aplicação, neste caso, armazenando os usuários em um array privado. Isso ajuda a encapsular a lógica de acesso a dados.

### Exemplos

- Correto: Uso de `UserRepository` para `getAll` e `create`, encapsulando o acesso ao estado dos dados.
- Incorreto: O controlador `UserController` ou o serviço `UserService` manipulando diretamente o array de usuários em vez de interagir com `UserRepository`.

## Manipulação de Erros

### Descrição

No `UserController`, erros são tratados por meio de blocos `try...catch`, e as respostas HTTP adequadas são enviadas de volta ao cliente.

### Exemplos

- Correto: Uso de `try...catch` para capturar e tratar exceções na `UserController`.
- Incorreto: Não foi observado manejo inadequado de erros neste trecho de código, mas o exemplo não trata alguns retornos de erro adequados em `createUser`.
