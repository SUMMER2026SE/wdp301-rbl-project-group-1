# 🚀 Backend AI Instruction – Edura API

## 🧠 Overview

You are a **senior backend engineer** working on a **NestJS project** using:

* NestJS (modular architecture)
* DDD (Domain-Driven Design)
* CQRS (Command Query Responsibility Segregation)
* Prisma ORM
* Clean / Hexagonal Architecture principles

⚠️ You MUST strictly follow all rules below when generating or modifying code.

---

## 🏗️ Architecture Overview

Each module follows this structure:

```id="3e8h2k"
module/
 ├── application/
 ├── domain/
 ├── infrastructure/
 └── presentation/
```

### Responsibilities:

* **application** → use cases (commands, queries, handlers)
* **domain** → business logic (entities, value objects, repository interfaces)
* **infrastructure** → implementation (database, external services)
* **presentation** → controllers, DTOs, guards

---

## 🧩 Layer Rules (STRICT)

### 1. Domain Layer (CORE)

Location:

```id="y9c6mk"
domain/
```

Contains:

* entities
* value objects
* domain services
* repository interfaces
* domain events

Rules:

* ❌ NO framework (NestJS, Prisma, etc.)
* ❌ NO database logic
* ✅ Pure business logic only
* ✅ Must be framework-independent

---

### 2. Application Layer

Location:

```id="jdx7zx"
application/
```

Contains:

* commands / queries
* handlers
* application services

Rules:

* Use CQRS pattern
* Each use case = 1 command/query + 1 handler
* Return result objects (NOT entities directly)

Example:

```id="p3o8k6"
login.command.ts
login.handler.ts
login.result.ts
```

---

### 3. Infrastructure Layer

Location:

```id="1cz5z3"
infrastructure/
```

Contains:

* repository implementations
* database (Prisma)
* external services (JWT, hash, etc.)
* mappers

Rules:

* Implements interfaces from domain
* Handles persistence logic
* Can use Prisma

---

### 4. Presentation Layer

Location:

```id="d4qf6t"
presentation/
```

Contains:

* controllers
* DTOs
* guards
* decorators
* strategies

Rules:

* Only handle HTTP request/response
* Call application layer (NOT domain directly)
* Validate input via DTO

---

## 🔄 CQRS Rules

* Commands → write operations
* Queries → read operations

Rules:

* ❌ DO NOT mix command & query logic
* ❌ DO NOT put logic in controller
* ✅ Use handler for all business logic

---

## 📦 Repository Pattern

### Interface (Domain)

```id="u0y3x7"
domain/repositories/
```

### Implementation (Infrastructure)

```id="2pl6qz"
infrastructure/repositories/
```

Rules:

* Domain defines contract
* Infrastructure implements it
* Use dependency injection

---

## 🧱 Entities & Value Objects

### Entities

* Have identity (id)
* Extend base entity if needed

### Value Objects

* Immutable
* No identity
* Use for domain concepts (e.g., token payload)

Rules:

* ❌ No setters
* ✅ Use constructor validation

---

## 🔐 Authentication & Authorization

Module:

```id="q4s7xp"
modules/auth/
```

Rules:

* JWT handled in infrastructure/services
* Guards used in presentation
* Decorators:

  * @Public()
  * @Roles()
  * @CurrentUser()

❌ DO NOT handle auth logic in controllers

---

## 🗄️ Database (Prisma)

Location:

```id="5y0r6r"
prisma/
```

Rules:

* Use Prisma ONLY in infrastructure
* NEVER expose Prisma models to domain
* Use mapper to convert:

  * Prisma → Domain Entity
  * Domain → Prisma

---

## 🔁 Mapping

Location:

```id="k8v4w2"
infrastructure/mappers/
```

Rules:

* Always map:

  * DTO ↔ Domain
  * Domain ↔ Persistence
* ❌ DO NOT leak database schema into domain

---

## 📥 DTO Rules

Location:

```id="n1p9zx"
presentation/dto/
```

Rules:

* Used ONLY in controller layer
* Validate input
* ❌ DO NOT use DTO in domain or application

---

## ⚙️ Shared Module Rules

Location:

```id="g5k2hd"
src/shared/
```

Contains:

* base entities
* common interfaces
* config
* database setup
* logger
* interceptors

Rules:

* Must be generic
* ❌ NO business logic
* Used across modules

---

## 🚫 Anti-patterns (FORBIDDEN)

* ❌ Business logic in controller
* ❌ Direct Prisma usage in application/domain
* ❌ Mixing layers
* ❌ Returning entities directly from controller
* ❌ Skipping CQRS handlers
* ❌ Using DTO inside domain
* ❌ Tight coupling between modules

---

## ✅ Best Practices

* Use dependency injection everywhere
* Keep modules independent
* Use interfaces for abstraction
* Write clean, testable code
* Keep handlers small and focused
* Use Result pattern for responses

---

## 🧪 Code Generation Rules (IMPORTANT)

When generating code, ALWAYS:

1. Place code in correct layer
2. Follow DDD boundaries
3. Use CQRS pattern
4. Create:

   * command/query
   * handler
   * result (if needed)
5. Use repository interface (NOT direct DB)
6. Map data properly between layers
7. Keep controller thin

---

## 🧭 Mental Model

* domain = business rules
* application = use cases
* infrastructure = implementation
* presentation = API layer

---

## 🎯 Goal

Produce code that is:

* Scalable
* Maintainable
* Testable
* Strictly follows DDD + CQRS
* Cleanly separated by layers

---

## 🔥 Priority Order (when in doubt)

1. Respect layer boundaries
2. Follow CQRS
3. Keep domain pure
4. Use repository pattern
5. Keep controller thin
6. Avoid duplication

<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
|------|----------|
| `detect_changes` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context` | Need source snippets for review — token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.
