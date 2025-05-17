## Padrão de Camadas

### Descrição
O código segue uma arquitetura de software em camadas que separa a aplicação em diferentes responsabilidades. As principais camadas identificáveis são: Rotas, Controladores, Serviços, Repositórios e Validações. Cada camada tem uma responsabilidade específica, contribuindo para um design mais modular e fácil de manter.

### Exemplos
- A camada de **Rotas** (`UserRoute.js`) define as rotas HTTP e delega a lógica de negócio para a camada de Controladores.
- A camada de **Controladores** (`UserController.js`) processa as requisições, aplica validações e chama os métodos da camada de Serviços.
- A camada de **Serviços** (`UserService.js`) lida com a lógica de negócio e interage com a camada de Repositórios para acesso a dados.
- A camada de **Repositórios** (`UserRepository.js`) gerencia o armazenamento e recuperação de dados.
- A camada de **Validações** (`UserValidation.js`) é responsável por validar parâmetros das requisições.

Um exemplo de violação desse padrão seria se as funções de validação estivessem embutidas diretamente nos métodos do controlador, misturando responsabilidades.

## Convenção de Nomes de Funções

### Descrição
O código segue a convenção de nomenclatura de funções que começa com verbos descritivos relacionados à sua funcionalidade, como "get", "create", etc. Isso facilita a compreensão da responsabilidade de cada função.

### Exemplos
- As funções `getAll` e `create` seguem a convenção ao indicar claramente suas ações: `UserService.getAll`, `UserService.create`.
- Um exemplo de inconsistência seria usar nomes como `obtainAll` ou `add` em vez dos padrões reconhecíveis `getAll` e `create`.

## Uso de Módulos do Node.js

### Descrição
O código emprega o sistema de módulos do Node.js para organizar a aplicação em arquivos separados que representam diferentes responsabilidades e preocupações, melhorando a manutenibilidade e a legibilidade do código.

### Exemplos
- Cada funcionalidade está isolada em seu respectivo módulo, como `UserRoute`, `UserController`, `UserService`, segregando claramente responsabilidades.
- Uma violação do padrão seria agrupar todas as funcionalidades em um único arquivo, tornando o código monolítico e difícil de manter.

## Estratégia de Manipulação e Validação de Erros

### Descrição
A estratégia de manipulação de erros envolve capturar exceções e responder com códigos de status HTTP adequados, enquanto as validações são realizadas antes da execução da lógica de negócio.

### Exemplos
- Nos métodos do controlador (`getAllUsers`, `createUser`), erros são capturados e um status de erro 500 é retornado: `return res.status(500).json({ error: "Server Error" })`.
- A validação é realizada antes do processamento, como em `createUser`, onde `UserValidation.validateCreateUserParams(user)` é chamado antes de `UserService.create`.
- Uma implementação inconsistente seria não validar os dados de entrada antes de chamar funções de serviço ou não tratar exceções e retornar códigos de status HTTP genéricos.

## Implementação de Um Padrão Singleton

### Descrição
Algumas das classes são instanciadas como objetos únicos (Singleton) usando `module.exports` para garantir que todos os módulos compartilhem a mesma instância.

### Exemplos
- `UserValidation`, `UserService`, `ValidatorUtil`, e `UserRepository` são exportados como instâncias únicas, mantendo consistência e estado dentro da aplicação.
- Um exemplo de má prática seria exportar essas classes sem instanciá-las, obrigando cada módulo a criar sua própria instância, quebrando o padrão Singleton.
