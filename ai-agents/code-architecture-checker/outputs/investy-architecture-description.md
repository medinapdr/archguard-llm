## Padrão: "File/Module Organization"

Este padrão é observado na forma consistente como os arquivos e módulos são agrupados em diretórios específicos com base em sua responsabilidade ou tipo. Isso cria uma estrutura de projeto organizada e previsível.

Exemplos:
- Arquivos relacionados à infraestrutura (como banco de dados e fila) são encontrados no diretório `server/infra` (`server/infra/database/index.ts`, `server/infra/queue/index.ts`).
- Lógicas de acesso a dados (repositórios) são agrupadas em `server/repositories` (`server/repositories/IntegrationRepository.ts`, `server/repositories/UserRepository.ts`, `server/repositories/AssetSyncRepository.ts`).
- Lógica de negócio e coordenação (serviços) residem em `server/services` (`server/services/LogService.ts`, `server/services/AssetSyncSchedulerService.ts`, `server/services/AuthService.ts`).
- Controladores que lidam com requisições HTTP estão em `server/controllers` (`server/controllers/NotionIntegrationController.ts`, `server/controllers/UserController.ts`).
- Utilitários gerais são colocados em `server/utils` (`server/utils/StringUtil.ts`, `server/utils/NumberUtil.ts`, `server/utils/ValidationUtil.ts`).
- Componentes de interface do usuário no lado do cliente são agrupados em `client/components` (`client/components/Button/index.tsx`, `client/components/Modal/index.tsx`, `client/components/Table/index.tsx`).
- Páginas do lado do cliente (rotas) estão em `client/pages` (`client/pages/Login/index.tsx`, `client/pages/AssetSyncs/Notion/index.tsx`).

## Padrão: "Naming Conventions"

Este padrão é evidente na aplicação consistente de formatos de nomenclatura para diferentes tipos de arquivos e classes, indicando sua função ou propósito.

Exemplos:
- Classes que representam repositórios de dados terminam com o sufixo `Repository` (`IntegrationRepository`, `UserRepository`, `AssetSyncRepository`).
- Classes que contêm lógica de negócio ou orquestração terminam com o sufixo `Service` (`LogService`, `AuthService`, `IntegrationService`).
- Classes que lidam com a camada de apresentação (controladores HTTP) terminam com o sufixo `Controller` (`UserController`, `NotionAssetSyncController`).
- Classes ou arquivos que fornecem funções auxiliares gerais terminam com o sufixo `Util` (`ValidationUtil`, `MongooseUtil`, `StringUtil`).
- Classes que atuam como adaptadores para tecnologias externas terminam com o sufixo `Adapter` (`MongooseRepositoryAdapter`, `NextHttpAdapter`).
- Classes que encapsulam lógica de validação terminam com o sufixo `Validation` (`UserValidation`, `IntegrationValidation`).
- Classes que atuam como middlewares terminam com o sufixo `Middleware` (`AuthMiddleware`, `InfraMiddleware`).
- Hooks React no lado do cliente começam com o prefixo `use` (`useDidMount`, `useValidation`, `useConstantId`).

## Padrão: "Layered Architecture"

Este padrão é demonstrado pela organização do código em camadas lógicas distintas, cada uma com responsabilidades específicas e dependências direcionais.

Exemplos:
- A camada de apresentação (representada pelos Controladores como `UserController` e `NotionAssetSyncController` e arquivos de rota da API em `pages/api`) lida com a entrada e saída de requisições, delegando a lógica de negócio para a camada de Serviço. Por exemplo, `UserController.signup` recebe dados da requisição, chama `UserValidation` para validar, `AuthService` para hash de senha, `UserRepository` para criar o usuário e `AuthService` novamente para gerar o token, formatando a resposta final.
- A camada de Serviço (representada por classes como `AuthService`, `IntegrationService`, `AssetSyncSchedulerService`) contém a lógica de negócio principal e coordena operações, utilizando Repositórios e Bibliotecas. Por exemplo, `AuthService` utiliza `HashService` e `CryptService` para lógica de autenticação. `SyncNotionAssetPriceQueue` (que atua como um handler de fila na camada de aplicação) utiliza `AssetSyncRepository`, `IntegrationRepository`, `NotionLib` e `StatusInvestLib`.
- A camada de Acesso a Dados (representada pelas classes `*Repository` que estendem `MongooseRepositoryAdapter`) é responsável exclusivamente pela interação com o banco de dados, abstraindo os detalhes da implementação (Mongoose). Repositórios são utilizados por Serviços e Handlers de Fila, mas não diretamente por Controladores. Por exemplo, `AssetSyncRepository.retrieveOneById` é chamado por `SyncNotionAssetPriceQueue.handle`.
- Bibliotecas (`NotionLib`, `StatusInvestLib`) encapsulam a lógica de interação com APIs externas, sendo utilizadas pela camada de Serviço/Aplicação. Por exemplo, `NotionLib.getDatabaseRows` é chamado por `SyncNotionAssetPriceQueue.handle`.
- Middlewares (`AuthMiddleware`, `InfraMiddleware`) lidam com preocupações transversais (como autenticação e inicialização de infraestrutura) antes que a requisição chegue ao Controlador, operando em uma camada anterior à lógica principal do endpoint.

## Padrão: "Separation of Concerns"

Este padrão é aplicado ao dividir o código em unidades (classes, módulos, componentes) onde cada unidade tem uma única responsabilidade bem definida.

Exemplos:
- Controladores (`UserController`, `NotionAssetSyncController`) focam em receber requisições, validar (delegando para módulos de validação) e formatar respostas, sem conter lógica de negócio complexa ou acesso direto a dados.
- Repositórios (`UserRepository`, `AssetSyncRepository`) são responsáveis apenas pelas operações CRUD e consultas ao banco de dados, sem lógica de negócio. A classe `MongooseRepositoryAdapter` encapsula a lógica genérica de interação com Mongoose, separando-a dos repositórios específicos.
- Módulos de validação (`UserValidation`, `NotionAssetSyncValidation`) contêm apenas a lógica para verificar a validade dos dados de entrada, separada da lógica que utiliza esses dados.
- Módulos utilitários (`StringUtil`, `NumberUtil`, `ErrorSerializationUtil`) fornecem funções genéricas e reutilizáveis que não estão acopladas a domínios específicos ou camadas arquiteturais.
- Componentes React no lado do cliente (`Button`, `TextInput`, `Table`, `Modal`) focam na apresentação visual e na interação básica do usuário, delegando a lógica de estado complexa, chamadas de API e regras de negócio para hooks (`useValidation`, `useDidMount`) ou serviços (`client/services/api.ts`, `client/services/auth.ts`). Por exemplo, o componente `Login` lida com o formulário, mas a chamada `api.post` e a lógica de redirecionamento (`loginAndRedirect`) estão em módulos de serviço separados.
