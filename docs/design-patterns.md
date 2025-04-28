# Padrões de Design e Princípios de Codificação Implementados

## Arquitetura

### Clean Architecture
O projeto implementa a Clean Architecture através de uma clara separação de camadas:

```
src/
├── domain/          # Regras de negócio e entidades
├── application/     # Casos de uso e contratos
├── presentation/    # Interface com o usuário e comunicação
├── validation/      # Validações de entrada e saída
├── infra/          # Implementações técnicas
└── main/           # Composição e configuração
```

#### Domain Layer
- **Responsabilidade**: Contém as regras de negócio e entidades
- **Componentes**:
  - Entidades
  - Value Objects
  - Regras de negócio
  - Interfaces de repositórios
- **Exemplo**:
```typescript
export interface UserEntity {
  email: string
  name: string
  username: string
}
```

#### Application Layer
- **Responsabilidade**: Orquestra o fluxo de dados e implementa casos de uso
- **Componentes**:
  - Casos de uso
  - Contratos
  - Serviços
  - Transformers
- **Exemplo**:
```typescript
export interface UserRepository {
  findById(id: string): Promise<UserEntity>
  save(user: UserEntity): Promise<void>
}
```

#### Presentation Layer
- **Responsabilidade**: Gerencia a interface com o usuário e a comunicação
- **Componentes**:
  - Controllers
  - Helpers HTTP
  - Interfaces de usuário
  - Adaptadores de apresentação
- **Exemplo**:
```typescript
export abstract class Controller {
  abstract perform(request: HttpRequest): Promise<HttpResponse>
}
```

#### Validation Layer
- **Responsabilidade**: Valida dados de entrada e saída
- **Componentes**:
  - Validadores
  - Schemas
  - Regras de validação
  - Adaptadores de validação
- **Exemplo**:
```typescript
export interface Validator {
  validate(data: any): ValidationResult
}
```

#### Infrastructure Layer
- **Responsabilidade**: Implementa detalhes técnicos
- **Componentes**:
  - Repositórios
  - Gateways
  - Adaptadores externos
  - Configurações técnicas
- **Exemplo**:
```typescript
export class ExampleUserRepository implements UserRepository {
  constructor(
    private readonly connection: DatabaseConnection,
    private readonly transformer: UserTransformer
  ) {}
}
```

#### Main Layer (Composition Root)
- **Responsabilidade**: Composição e configuração
- **Componentes**:
  - Factories
  - Configurações
  - Adaptadores de infraestrutura
  - Ponto de entrada da aplicação
- **Exemplo**:
```typescript
export class ExampleUserRepositoryFactory {
  public make(): ExampleUserRepository {
    return new ExampleUserRepository(
      DatabaseConnections.catalyst,
      UserTransformerFactory.getInstance().make()
    )
  }
}
```

### Domain-Driven Design (DDD)
Exemplo de uma entidade de domínio (src/domain/entities/User.ts):
```typescript
export interface UserEntity {
  email: string
  name: string
  username: string
}
```

## Design Patterns

### 1. Singleton Pattern
O padrão Singleton é utilizado extensivamente nas factories para garantir uma única instância dos objetos. Exemplos:

```typescript
// ErrorContainerFactory
export class ErrorContainerFactory {
  private static instance: ErrorContainerFactory
  private instanceErrorContainer: ErrorContainer | undefined

  public static getInstance(): ErrorContainerFactory {
    if (!ErrorContainerFactory.instance) {
      ErrorContainerFactory.instance = new ErrorContainerFactory()
    }
    return ErrorContainerFactory.instance
  }
}

// UserTransformerFactory
export class UserTransformerFactory {
  private static instance: UserTransformerFactory
  private instanceUserTransformer: UserTransformer | undefined

  public static getInstance(): UserTransformerFactory {
    if (!UserTransformerFactory.instance) {
      UserTransformerFactory.instance = new UserTransformerFactory()
    }
    return UserTransformerFactory.instance
  }
}
```

### 2. Factory Pattern
O projeto utiliza factories para criar e gerenciar instâncias de objetos complexos. Exemplo do `ExampleUserRepositoryFactory`:

```typescript
export class ExampleUserRepositoryFactory {
  private static instance: ExampleUserRepositoryFactory
  private instanceExampleUserRepository: ExampleUserRepository | undefined

  public make(): ExampleUserRepository {
    if (!this.instanceExampleUserRepository) {
      this.instanceExampleUserRepository = new ExampleUserRepository(
        DatabaseConnections.catalyst,
        UserTransformerFactory.getInstance().make()
      )
    }
    return this.instanceExampleUserRepository
  }
}
```

### 3. Adapter Pattern
O padrão Adapter é utilizado para adaptar interfaces externas ao formato esperado pela aplicação. Exemplo do `AdapterLambda`:

```typescript
export class AdapterLambda {
  constructor(private readonly controller: Controller) {}

  async handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const request: HttpRequest = { 
      query: event.queryStringParameters ?? {},
      body: JSON.parse(event.body ?? '{}'),
      path: null 
    }

    const httpResponse = await this.controller.perform(request)

    return {
      statusCode: httpResponse.statusCode,
      body: this.formatResponse(httpResponse),
      headers: cors()
    }
  }
}
```

### 4. Composite Pattern
O projeto utiliza o Composite Pattern para gerenciar erros através do `ErrorContainer`:

```typescript
export class ErrorContainerFactory {
  make(): ErrorContainerContract {
    const errorsMap = new Map<ErrorsEnum, Error>([
      [ErrorsEnum.SERVER_ERROR, new ServerError()],
      [ErrorsEnum.TIME_OUT_ERROR, new TimeOutError()],
      [ErrorsEnum.NOT_FOUND_ERROR, new NotFoundError('')],
      // ... outros erros
    ])

    return new ErrorContainer(errorsMap)
  }
}
```

## Composition Root

O projeto implementa o Composition Root na camada Main, onde todas as dependências são instanciadas e compostas. A estrutura de factories atua como o ponto central de composição:

```
src/main/
├── factories/           # Composition Root
│   ├── adapters/       # Factories para adaptadores
│   ├── containers/     # Factories para containers
│   ├── gateway/        # Factories para gateways
│   ├── repositories/   # Factories para repositórios
│   ├── services/       # Factories para serviços
│   ├── transformers/   # Factories para transformers
│   └── connections/    # Factories para conexões
├── adapters/           # Implementações de adaptadores
└── config/            # Configurações da aplicação
```

### Exemplo de Composição de Dependências:

```typescript
// Composição de dependências usando factories
const userRepository = ExampleUserRepositoryFactory.getInstance().make()
const userTransformer = UserTransformerFactory.getInstance().make()
const errorContainer = ErrorContainerFactory.getInstance().make()
```

## Princípios SOLID

### 1. Single Responsibility Principle (SRP)
Cada classe tem uma única responsabilidade bem definida:

```typescript
// AdapterLambda: Responsável apenas por adaptar requisições Lambda
export class AdapterLambda {
  async handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    // Lógica de adaptação
  }
}

// ErrorContainer: Responsável apenas por gerenciar erros
export class ErrorContainer {
  constructor(private readonly errorsMap: Map<ErrorsEnum, Error>) {}
}
```

### 2. Open/Closed Principle (OCP)
O projeto utiliza interfaces e abstrações para permitir extensões sem modificar o código existente:

```typescript
// Interface genérica para containers
export interface ErrorContainerContract {
  getError(errorEnum: ErrorsEnum): Error
}

// Implementações específicas podem ser adicionadas sem modificar o código existente
export class ErrorContainer implements ErrorContainerContract {
  constructor(private readonly errorsMap: Map<ErrorsEnum, Error>) {}
}
```

### 3. Liskov Substitution Principle (LSP)
O projeto utiliza herança e implementação de interfaces de forma que subtipos possam ser substituídos por seus tipos base:

```typescript
// Todos os erros herdam de Error e podem ser usados de forma intercambiável
export class ServerError extends Error {}
export class TimeOutError extends Error {}
export class NotFoundError extends Error {}
```

### 4. Interface Segregation Principle (ISP)
Interfaces são específicas para cada necessidade:

```typescript
// Interface específica para transformação de usuários
export interface UserTransformer {
  transform(data: any): UserEntity
}

// Interface específica para repositórios
export interface UserRepository {
  findById(id: string): Promise<UserEntity>
  save(user: UserEntity): Promise<void>
}
```

### 5. Dependency Inversion Principle (DIP)
O projeto depende de abstrações, não de implementações concretas:

```typescript
// Dependência de abstração
export class ExampleUserRepository {
  constructor(
    private readonly connection: DatabaseConnection,
    private readonly transformer: UserTransformer
  ) {}
}
```

## Estrutura de Camadas

### Domain Layer
- Entidades e regras de negócio
- Interfaces dos repositórios
- Value Objects
- Enums

### Application Layer
- Casos de uso
- Contratos e interfaces
- Serviços de aplicação
- Transformers

### Infrastructure Layer
- Implementações de repositórios
- Adaptadores externos
- Gateways
- Validadores

### Main Layer (Composition Root)
- Factories
- Configuração
- Composição de dependências
- Adaptadores de infraestrutura

## Convenções e Boas Práticas

1. **Nomenclatura**
   - Factories: Sufixo `Factory`
   - Adaptadores: Sufixo `Adapter`
   - Transformers: Sufixo `Transformer`
   - Repositórios: Sufixo `Repository`

2. **Estrutura de Arquivos**
   - Cada padrão em seu diretório específico
   - Separação clara de responsabilidades
   - Organização por features

3. **Dependency Injection**
   - Injeção via construtores
   - Uso de factories para criação de instâncias
   - Inversão de controle

4. **Tratamento de Erros**
   - Hierarquia de erros bem definida
   - Container de erros centralizado
   - Mapeamento de erros para códigos HTTP

## Boas Práticas Implementadas

1. **Organização de Código**
   - Estrutura de diretórios clara e consistente
   - Separação por responsabilidades
   - Nomenclatura descritiva

2. **Tipagem Forte**
   - Uso extensivo de TypeScript
   - Interfaces bem definidas
   - Tipos explícitos

3. **Modularização**
   - Cada módulo com responsabilidade única
   - Baixo acoplamento entre módulos
   - Alta coesão dentro dos módulos

4. **Extensibilidade**
   - Interfaces genéricas
   - Contratos bem definidos
   - Fácil adição de novas implementações

## Convenções de Código

1. **Nomenclatura**
   - Interfaces começam com letra maiúscula
   - Tipos são descritivos e específicos
   - Namespaces para agrupar tipos relacionados

2. **Estrutura de Arquivos**
   - Um conceito por arquivo
   - Index files para exportação
   - Organização hierárquica de módulos

3. **Importações**
   - Paths aliases (@/)
   - Importações tipo-safe
   - Separação entre tipos e implementações 