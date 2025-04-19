# ZERP-template

Welcome to the ZERP stack template boilerplate – a TypeScript template for PNPM monorepo microservices.

## What's ZERP?

ZERP is a backend micro-framework introducing a robust and efficient mono-repository structure built for working with relational databases. It's easily scalable and fits into various environments.

In contrast with other frameworks, ZERP aims to reduce TypeScript project entropy by introducing minor restrictions on its structure and components.

Investigating this repo may be interesting if you want to learn how to organize your project efficiently.

### Motivation

1. **Framework Pitfalls**: Frameworks like [NestJS](https://github.com/nestjs/nest) and [Next.js](https://github.com/vercel/next.js) introduce several anti-patterns that lead to suboptimal solutions on a larger scale.
2. **PNPM Monorepos**: Setting up PNPM monorepos with workspaces is a challenge, but the consistency and availability benefits make it worthwhile.
3. **Entity Consistency**: Entities should be consistent across all services. By modifying one, we should be able to validate its efficiency across the project.
4. **Structured TypeScript Projects**: Setting up a well-structured TypeScript project can be difficult. _Consider this repo a guide for structuring TypeScript projects._ In my experience, this is the most flexible way to organize a TS project with minimal restrictions, dependencies, and unnecessary clutter.
5. **Personal Ease of Use**: This framework was built primarily for my own convenience, but others may find it useful as well.

### Principles of ZERP

1. **Dependencies and Packages**: Use open-source and community-driven tools.
2. **Cloud-Agnostic**: No reliance on cloud services. Bare metal is our preference.
3. **Zero Dependencies**: Aim for zero unnecessary dependencies—understand the tools you're using.
4. **Security**: No compromises here—security is a top priority.
5. **KISS (Keep It Simple, Stupid)**: Simplicity in design and implementation.

### Template Features

- Ready-to-go production API server for rapid development.
- Built-in CRUD operations for all entities.
- Auto-generated OpenAPI documentation for easy API exploration.
- Contextual configuration via `@zerp/global-configs`.
- Workspace-shared types for consistent type management.
- Comprehensive logging using [Winston](https://github.com/winstonjs/winston).
- Queue management with [BullMQ](https://github.com/taskforcesh/bullmq).

# Limitations

- Exclusively pnpm supported

### Template Components

- **Services** [@zerp/services]: These encapsulate business logic and rely on Apps and Packages. Different services may share some Apps but have distinct logic on top of them.

- **Apps** [@zerp/apps]: Apps can utilize other Packages and Apps within their context. They serve as building blocks for services.

- **Packages** [@zerp/packages]: Packages store all the atomic components, including:

  - **[@zerp/db](https://typeorm.io/)**: TypeORM database entities and common controllers.
  - **[@zerp/errors](https://www.npmjs.com/package/standard-error)**: Standardized error messages that are manageable by the API server.
  - **[@zerp/types](https://www.typescriptlang.org/)**: Common types for type-safe development.
  - **[@zerp/utils](https://github.com/sindresorhus/awesome-nodejs#utilities)**: Utility functions and snippets that don't require external dependencies.
  - **[@zerp/global-configs](https://github.com/node-config/node-config)**: Contextual configurations initialized from environment variables.
  - **[@zerp/shared-modules](https://github.com/peers/peerjs)**: More complex modules with some dependencies but are too small to be a full App.

> With the following succession - [ Services <- Apps <- Packages ]

## Installation

To efficiently use this template we will need to several dependencies

###  Node

Mac OSX 
```shell
brew install node
```
Linux
```shell
apt-get install node
```

### NVM
### Nodemon
### PNPM

*Set node version to 20.18 in nvm


## Onboarding

For quick start you can run
### PNPM
```
pnpm boot
```
### Justfile
```shell
just boot
```
### Bash
```shell
bash ./scripts/bash/bootstrap.sh
```

This will install all the required dependencies



### Stack

- **Main Backend Components**
  - [Express](https://github.com/expressjs/express): Node.js' golden standard for HTTP servers.
  - [Zod](https://github.com/colinhacks/zod): TypeScript-first schema validation with static type inference.
  - [TypeORM](https://typeorm.io/): TypeScript ORM for managing database interactions.
  - [PostgreSQL](https://www.postgresql.org/): Relational database for storing service data.
  - [Redis](https://redis.io/): In-memory key-value database, mainly used for caching in ZERP.
  - [ClickHouse](https://clickhouse.com/): A fast and scalable data warehouse.

- **Analytics Components**
  - [Docker](https://www.docker.com/) / [Kubernetes](https://kubernetes.io/): Containerization and orchestration tools.
  - [Metabase](https://www.metabase.com/): An open-source business intelligence tool.
  - [Vector](https://vector.dev/) / [FluentD](https://www.fluentd.org/): Tools for log aggregation and processing.
  - [Prometheus](https://prometheus.io/): Monitoring and alerting toolkit.
  - [Grafana](https://grafana.com/): Open-source analytics & monitoring platform.
  - [Travis CI](https://travis-ci.org/): Continuous integration service.
  - [Nexus](https://www.sonatype.com/products/repository-oss): Repository manager for managing dependencies.














## Contributing

We welcome contributions to the ZERP-template! Here are some guidelines to help you get started:

1. **Fork the repository**: Click the "Fork" button at the top of this repository and clone your fork locally.

2. **Create a branch**: 
   - Branch off from the `main` branch.
   - Name your branch something descriptive, like `feature/add-new-module` or `fix/bug-xyz`.

   ```bash
   git checkout -b feature/feature-name
   
3. **Make changes and submit a PR 🦾**

  
## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
 changes and create a PR**

## Author

[Number16BusShelter](https://github.com/Number16BusShelter)
