# **Desafio para estágio Loomer Tech**
---

## **Breve descrição**

Essa Api tem como objetivo um gerenciamento de imóveis. Foi feita para um desafio de vaga de estágio, api está sendo desenvolvida com uma arquitetura bem definida e desacoplada, utilizando TDD (programação orientada a testes) como metodologia de trabalho, [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) para fazer a distribuição de responsabilidades em camadas, sempre seguindo os princípios do SOLID e, sempre que possível, aplicando Design Patterns para resolver alguns problemas comuns.

> ## Apis desenvolvidas atualmente

1. [Cadastro](./requirements/signup.md)
2. [Login](./requirements/login.md)
3. [Registrar Imóveis](./requirements/register-imovel.md)
4. [Atualizar Imóveis](./requirements/update-imovel.md)
5. [Listar todos Imóveis](./requirements/load-imoveis.md)
6. [Busca um Imóveis](./requirements/load-imovel.md)
7. [Deletar um Imóveis](./requirements/delete-imovel.md)

> ## Princípios do SOLID usado na api


* Single Responsibility Principle (SRP)
* Open Closed Principle (OCP)
* Liskov Substitution Principle (LSP)
* Interface Segregation Principle (ISP)
* Dependency Inversion Principle (DIP)
* Keep It Simple, Silly (KISS)

> ## Design Patterns

* Factory
* Adapter
* Composite
* Dependency Injection
* Composition Root

> ## Metodologias e Designs

* TDD
* Clean Architecture
* Conventional Commits
* GitFlow
* Use Cases

> ## Bibliotecas e Ferramentas

* NPM
* Typescript
* Git
* Jest
* MongoDb
* Bcrypt
* Faker
* Validator
* Express
* Supertest
* Husky
* Lint Staged
* Eslint
* Standard Javascript Style
* Sucrase
* In-Memory MongoDb Server
* Mongodb
* cpf-cnpj-validator
* Module-Alias

> ## Features do Node

* API Rest com Express
* Segurança (Hashing, Encryption e Encoding)
* CORS
* Middlewares

> ## Features do Git

* Alias
* Log Personalizado
* Branch
* Reset
* Amend
* Tag
* Merge

> ## Features do Typescript

* POO Avançado
* Interface
* TypeAlias
* Namespace
* Utility Types
* Configurações

> ## Features de Testes

* Testes Unitários
* Testes de Integração
* Cobertura de Testes
* Test Doubles
* Mocks

> ## Features do MongoDb

* Connect e Reconnect
* Collections
* InsertOne e InserMany
* DeleteMany
* UpdateOne

## tips/scripts

> ## Instalar as dependências:

- ### Tem um script no package para auxiliar nisso, uma vez que estamos usando ts.

* Terminal: `yarn`

> ## Rodas os testes do sistema:

- ### Tem um script no package para auxiliar nisso, uma vez que estamos usando ts.

* Terminal: `yarn test` ===> Todos os testes
* Terminal: `yarn test:unit` ===> Testes unitários
* Terminal: `yarn test:integration` ===> Testes de Integração
* Terminal: `yarn test:verbose` ===> Testes com todas as informações
* Terminal: `yarn test:staged` ===> Todos os testes da staged de commits
* Terminal: `yarn test:ci` ===> Cobertura de testes