---
applyTo: '**'
---

# Copilot Instruction Set for NestJS Applications (Node.js + TypeScript)

## Data Structure & Logic Optimization Rules

- Always prefer structured data transfer using DTOs, interfaces, and types for all input, output, and internal data flows.
- Use DTOs and interfaces to define and enforce data contracts between layers and modules.
- Prefer optimized and performant computation logic, especially in hot code paths.
- Use raw `for` loops for array iteration in performance-critical sections; avoid `forEach`, `map`, `filter`, and `reduce` in hot paths.
- Cache array length in `for` loops to avoid repeated property access.
- Use `Array` for indexed access and sequential iteration.
- Use `Map` for dynamic key-value pairs, especially when keys are not strings.
- Use `Set` for collections of unique values with fast lookup.
- Avoid using plain `Object` for dynamic key sets or unordered maps.
- Avoid unnecessary cloning of objects or arrays inside loops.
- Minimize memory allocations and avoid creating new functions within loops.
- Avoid placing `try/catch` blocks inside loops; move error handling outside the loop when possible.
- Prefer early returns in functions for clarity and to reduce nesting.
- Inline small functions where function call overhead may impact performance.
- Avoid large, deeply nested closures in performance-sensitive code.
- Avoid dynamic property access when the structure is known; use direct property access for better performance and type safety.
- Always analyze and minimize both time and space complexity when designing algorithms and data flows.
- Prefer algorithms and data structures that provide optimal performance for the expected input size and usage patterns.
- Avoid unnecessary nested loops and redundant computations; refactor logic to reduce algorithmic complexity where possible.
- Use memoization, caching, or precomputation to optimize repeated expensive operations.
- Profile and benchmark critical code paths to identify and address performance bottlenecks.
- Choose the most efficient data structure for the task (e.g., prefer `Map` or `Set` for fast lookups, avoid linear searches in large arrays).
- Avoid holding large objects or arrays in memory longer than necessary; release resources promptly.
- Document the expected time and space complexity of non-trivial functions and algorithms.

## General Node.js & TypeScript Best Practices

- Use TypeScript strict mode (`"strict": true` in tsconfig).
- Prefer `const` and `let` over `var`.
- Use ES6+ features (async/await, destructuring, etc.).
- Always handle errors (try/catch, error middleware).
- Use environment variables for configuration (never hardcode secrets).
- Structure code into modules for maintainability.
- Write unit and integration tests for all features.
- Use Prettier and ESLint for code formatting and linting.
- Avoid using deprecated Node.js or TypeScript features.
- Prefer dependency injection over direct instantiation.

## NestJS-Specific Rules

- Use NestJS CLI for generating modules, controllers, and services.
- Organize code into modules by domain (feature modules).
- Use DTOs (Data Transfer Objects) for request validation.
- Use Pipes for validation and transformation.
- Use Guards for authentication and authorization.
- Use Interceptors for logging, transformation, and error handling.
- Use Providers for business logic, not in controllers.
- Use async/await for all asynchronous operations.
- Use `@nestjs/config` for configuration management.
- Use `@nestjs/swagger` for API documentation.
- Use `@nestjs/testing` for writing tests.
- Use dependency injection for all services and repositories.
- Avoid logic in controllers; delegate to services.
- Use custom exceptions and exception filters for error handling.
- Use TypeORM or Prisma for database access, with repositories or services.
- Use environment-specific configuration files.
- Always validate incoming data using class-validator and class-transformer.

## Security & Performance

- Sanitize all inputs to prevent injection attacks.
- Use HTTPS in production.
- Set appropriate HTTP headers (CORS, HSTS, etc.).
- Limit request size and rate-limit APIs.
- Use helmet middleware for security.
- Avoid exposing stack traces in production.
- Use logging (e.g., Winston, Pino) for error and access logs.

## Documentation & Collaboration

- Document all public APIs using Swagger decorators.
- Write JSDoc comments for complex logic.
- Keep README and API docs up to date.
- Use GitHub Actions for CI/CD.
- Use semantic commit messages.

## Copilot AI Instructions

- Follow all above rules when generating code.
- Prefer idiomatic NestJS and TypeScript patterns.
- Do not generate code that hardcodes secrets or credentials.
- Always use DTOs and validation for incoming requests.
- Use dependency injection for all services.
- Generate tests for new features.
- Use async/await for all asynchronous code.
- Use environment variables for configuration.
- Use best practices for error handling and logging.

## Naming Conventions

- Use `camelCase` for variables, functions, and methods.
- Use `PascalCase` for class, interface, DTO, and enum names.
- Use `UPPER_SNAKE_CASE` for environment variables and constants.
- Name files and folders using `kebab-case`.
- Suffix DTOs with `.DTO`, and services with `.Service`.
- Use `.Repository` suffix for repository classes.
- Use `.Controller` suffix for controller classes.
- Use `.Module` suffix for module classes.
- Use `.Guard`, `.Interceptor`, `.Pipe`, and `.Filter` suffixes for respective classes.
- Use `.Enum` suffix for enum classes.
- Use `.Factory` suffix for factory classes.
- Use `.Interface` suffix for interface definitions.

## Interface Abstraction

- Define interfaces for all service contracts and repository layers.
- Use interfaces to abstract external dependencies and promote loose coupling.
- Implement interfaces in services and repositories for testability and flexibility.
- Prefer interface-based dependency injection.

## Modular Approach

- Organize code into feature-based modules.
- Each module should encapsulate its controllers, services, DTOs, entities, and providers.
- Avoid circular dependencies between modules.
- Use shared modules for common functionality.

## Reusability

- Extract reusable logic into utility functions, shared services, or modules.
- Avoid code duplication by leveraging inheritance, composition, or generics where appropriate.
- Use dependency injection to share services across modules.

## Scalability

- Design modules and services to be stateless and independent.
- Use configuration and environment variables to support scaling.
- Structure code to allow easy addition of new features and modules.
- Use asynchronous patterns and queues for heavy or long-running tasks.

## Readability

- Write self-explanatory, descriptive names for variables, functions, and classes.
- Keep functions and methods short and focused on a single responsibility.
- Add JSDoc comments for complex logic and public APIs.
- Use consistent code formatting and linting.

## Function, Service, and Controller Definition with DTO Approach

- Define all controller methods to accept and return DTOs.
- Use DTOs for request validation and response shaping.
- Keep controllers thin; delegate business logic to services.
- Services should implement interfaces and contain business logic only.
- Use dependency injection for all service and repository dependencies.
- Validate all incoming data using class-validator and class-transformer in DTOs.
- Document all controller endpoints with Swagger decorators.

## Line Endings

- Use LF (`\n`) line endings for all generated files to ensure cross-platform compatibility.

## File Naming Convention Sample

- All files and folders must use `kebab-case` (lowercase, words separated by hyphens).
- Suffix files according to their type:
  - DTOs: `*.dto.ts` (e.g., `create-user.dto.ts`)
  - Services: `*.service.ts` (e.g., `user.service.ts`)
  - Controllers: `*.controller.ts` (e.g., `user.controller.ts`)
  - Modules: `*.module.ts` (e.g., `user.module.ts`)
  - Repositories: `*.repository.ts` (e.g., `user.repository.ts`)
  - Guards: `*.guard.ts` (e.g., `auth.guard.ts`)
  - Interceptors: `*.interceptor.ts` (e.g., `logging.interceptor.ts`)
  - Pipes: `*.pipe.ts` (e.g., `validation.pipe.ts`)
  - Filters: `*.filter.ts` (e.g., `http-exception.filter.ts`)
  - Enums: `*.enum.ts` (e.g., `role.enum.ts`)
  - Factories: `*.factory.ts` (e.g., `user.factory.ts`)
  - Interfaces: `*.interface.ts` (e.g., `user.interface.ts`)

**Strictly apply this rule to all generated files and folders.**

## Interface Organization

- Never define interfaces in service, controller, entity, or DTO files.
- Always keep interfaces in a dedicated `interfaces` folder within the same module.
- If an interface is shared across modules, place it in a `common/interfaces` folder at the project root.
- Import interfaces from their respective `interfaces` folders only.
- Do not mix interface definitions with implementation or business logic files.

## Logging

- Use a centralized logger service (e.g., Winston or Pino) integrated with NestJS.
- Inject the logger service using dependency injection; do not instantiate loggers directly in classes.
- Use the logger for all error, warning, and informational messages.
- Log all incoming requests and outgoing responses using interceptors.
- Do not log sensitive information (e.g., passwords, secrets, tokens).
- Configure log levels via environment variables.
- Use structured logging (JSON format) for production environments.
- Ensure logs include timestamps, request IDs, and relevant context for traceability.
- Write unit tests to verify logging behavior in critical flows.

## Additional TypeScript Interface Rules

- Never use inline return types for functions, methods, or services; always define and use named interfaces for return types.
- All DTOs, service contracts, and repository responses must use explicitly defined interfaces from the appropriate `interfaces` folder.
- Avoid using type aliases for object shapes; prefer interfaces for consistency and extensibility.
- Do not use anonymous or inline object types in function signatures or class properties.
- When extending or composing types, always use interfaces and avoid intersection or union types unless absolutely necessary.
- All public APIs, including controller responses and service methods, must return objects typed with interfaces, not inline or anonymous types.

## Module File Cleanliness

- Never implement business logic, utility functions, or complex code directly in module (`*.module.ts`) files.
- Module files (`*.module.ts`) must be strictly declarative: only import, configure, and wire up providers, controllers, and dependencies.
- Never implement business logic, utility functions, configuration logic, or complex code directly in module files or the main application entry file (`main.ts`).
- If initialization or setup logic is required, encapsulate it in dedicated services (e.g., `utils.service.ts`) and register them as providers using dependency injection; never instantiate them directly in module files.
- Keep module and entry files concise, readable, and focused solely on structure, configuration, and bootstrapping.
- The `main.ts` file should only bootstrap the NestJS application and configure global middleware, pipes, filters, and interceptors.
- Place all business, configuration, and utility logic in dedicated services, providers, or utility modules.
- Never include instructional comments or implementation details in module or entry files; these files must remain clean, declarative, and maintainable.

## Variable and Naming Clarity

- Avoid using short, ambiguous, or generic variable names (e.g., `a`, `b`, `data`, `item`, `obj`, `res`, `req`).
- Use descriptive, self-explanatory names that clearly convey the purpose and context of variables, functions, classes, and interfaces.
- Do not use single-letter variable names except for well-known conventions in small scopes (e.g., `i` for loop indices).
- Always prefer meaningful names that reflect the domain and intent of the code.
- Review all generated code to ensure naming clarity and avoid generic or placeholder names.

## MongoDB Database Rules & Optimization (NestJS + Mongoose)

- Use Mongoose as the ODM for MongoDB integration in NestJS.
- Define all schemas using Mongoose `Schema` and TypeScript interfaces for strong typing.
- Always use DTOs and interfaces for all data flows between controllers, services, and repositories.
- Use `@Prop({ index: true })` or schema-level indexes for fields frequently used in queries, filters, or sorting to optimize query performance.
- Design collections with optimal indexes; analyze query patterns and add compound indexes where appropriate.
- Avoid unnecessary indexes to reduce write overhead and storage usage.
- Use MongoDB's aggregation framework for complex data transformations, reporting, and analytics; prefer pipelines that minimize data scanned and leverage indexes.
- Use MongoDB views for simplified, read-only representations of data when appropriate, but ensure views do not introduce performance bottlenecks.
- Always use the most efficient query operators (`$in`, `$exists`, `$gte`, `$lte`, etc.) and avoid full collection scans.
- Prefer projections to limit returned fields and reduce network payload.
- Use lean queries (`.lean()`) in Mongoose for read-only operations to improve performance by returning plain JavaScript objects instead of Mongoose documents.
- Use pagination (`limit`, `skip`, or cursor-based) for large result sets to avoid memory issues.
- Always use the string alias `id` for MongoDB's `_id` field in DTOs and interfaces for portability and clarity; map `_id` to `id` as a string in all responses.
- Avoid storing large blobs or files in MongoDB; use external storage and reference by URL or ID.
- Normalize or denormalize data based on access patterns; prefer embedding for tightly coupled data and referencing for loosely coupled or large collections.
- Use transactions for multi-document updates to ensure data consistency.
- Regularly review and optimize schema design, indexes, and query patterns using MongoDB Atlas or `explain()` for performance analysis.
- Use environment variables for all MongoDB connection strings and credentials; never hardcode secrets.
- Handle all database errors gracefully and log them using the centralized logger service.
- Use dependency injection for all database services and repositories.
- Write unit and integration tests for all database operations.
- Document all data models, indexes, and aggregation pipelines for maintainability.
- Follow official NestJS and Mongoose best practices for schema design, connection management, and performance optimization.
