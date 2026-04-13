<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

```
edura-api
├─ .prettierrc
├─ eslint.config.mjs
├─ generated
├─ GIT_NAMING_CONVENTION_RULES.md
├─ nest-cli.json
├─ package-lock.json
├─ package.json
├─ prisma
│  ├─ migrations
│  │  ├─ 20260327095030_init
│  │  │  └─ migration.sql
│  │  ├─ 20260330164725_create_base_database
│  │  │  └─ migration.sql
│  │  ├─ 20260410134022_add_refresh_token
│  │  │  └─ migration.sql
│  │  └─ migration_lock.toml
│  └─ schema.prisma
├─ prisma.config.ts
├─ README.md
├─ src
│  ├─ app.module.ts
│  ├─ main.ts
│  ├─ modules
│  │  ├─ auth
│  │  │  ├─ application
│  │  │  │  ├─ commands
│  │  │  │  │  ├─ login
│  │  │  │  │  │  ├─ login.command.ts
│  │  │  │  │  │  ├─ login.handler.ts
│  │  │  │  │  │  └─ login.result.ts
│  │  │  │  │  ├─ logout
│  │  │  │  │  │  ├─ logout.command.ts
│  │  │  │  │  │  └─ logout.handler.ts
│  │  │  │  │  ├─ refresh-token
│  │  │  │  │  │  ├─ refresh-token.command.ts
│  │  │  │  │  │  ├─ refresh-token.handler.ts
│  │  │  │  │  │  └─ refresh-token.result.ts
│  │  │  │  │  └─ register
│  │  │  │  │     ├─ register.command.ts
│  │  │  │  │     ├─ register.handler.ts
│  │  │  │  │     └─ register.result.ts
│  │  │  │  ├─ queries
│  │  │  │  │  └─ get-login-history
│  │  │  │  └─ services
│  │  │  │     ├─ hash.service.ts
│  │  │  │     └─ jwt.service.ts
│  │  │  ├─ auth.module.ts
│  │  │  ├─ domain
│  │  │  │  ├─ entities
│  │  │  │  │  └─ refresh-token.entity.ts
│  │  │  │  ├─ repositories
│  │  │  │  │  └─ auth.repository.interface.ts
│  │  │  │  └─ value-objects
│  │  │  │     └─ auth-token-payload.ts
│  │  │  ├─ infrastructure
│  │  │  │  ├─ repositories
│  │  │  │  │  ├─ auth.repository.impl.ts
│  │  │  │  │  └─ auth.repository.types.ts
│  │  │  │  └─ services
│  │  │  │     ├─ hash.service.ts
│  │  │  │     └─ jwt.service.ts
│  │  │  └─ presentation
│  │  │     ├─ controllers
│  │  │     │  └─ auth.controller.ts
│  │  │     ├─ decorators
│  │  │     │  ├─ auth-metadata.constants.ts
│  │  │     │  ├─ current-user.decorator.ts
│  │  │     │  ├─ public.decorator.ts
│  │  │     │  └─ role.decorator.ts
│  │  │     ├─ dto
│  │  │     │  ├─ auth-response.dto.ts
│  │  │     │  ├─ login.dto.ts
│  │  │     │  └─ register.dto.ts
│  │  │     ├─ guards
│  │  │     │  ├─ jwt-auth.guard.ts
│  │  │     │  └─ roles.guard.ts
│  │  │     └─ strategies
│  │  │        └─ jwt.strategy.ts
│  │  ├─ health
│  │  │  ├─ health.controller.spec.ts
│  │  │  ├─ health.controller.ts
│  │  │  ├─ health.module.ts
│  │  │  └─ prisma.health.ts
│  │  └─ user
│  │     ├─ application
│  │     │  ├─ commands
│  │     │  └─ queries
│  │     │     └─ get-users
│  │     │        ├─ get-users.handler.ts
│  │     │        └─ get-users.query.ts
│  │     ├─ domain
│  │     │  ├─ entities
│  │     │  │  ├─ parent.entity.ts
│  │     │  │  ├─ student.entity.ts
│  │     │  │  ├─ tutor.entity.ts
│  │     │  │  └─ user.entity.ts
│  │     │  ├─ events
│  │     │  ├─ repositories
│  │     │  │  └─ user.repository.interface.ts
│  │     │  ├─ services
│  │     │  └─ value-objects
│  │     ├─ infrastructure
│  │     │  ├─ mappers
│  │     │  ├─ repositories
│  │     │  │  └─ user.repository.impl.ts
│  │     │  └─ user.infrastructure.module.ts
│  │     ├─ presentation
│  │     │  ├─ controllers
│  │     │  │  └─ user.controller.ts
│  │     │  └─ dto
│  │     │     └─ user-response.dto.ts
│  │     └─ user.module.ts
│  ├─ shared
│  │  ├─ application
│  │  │  ├─ common
│  │  │  │  └─ pagination.ts
│  │  │  └─ interfaces
│  │  │     ├─ mapper.interface.ts
│  │  │     └─ use-case.interface.ts
│  │  ├─ domain
│  │  │  ├─ entities
│  │  │  │  ├─ aggregate-root.ts
│  │  │  │  ├─ auditable.entity.ts
│  │  │  │  └─ base-entity.ts
│  │  │  ├─ enums
│  │  │  │  └─ enums.ts
│  │  │  ├─ events
│  │  │  │  └─ domain-event.ts
│  │  │  ├─ exceptions
│  │  │  │  └─ domain-exception.ts
│  │  │  ├─ repositories
│  │  │  │  └─ repository.interface.ts
│  │  │  ├─ result.ts
│  │  │  ├─ services
│  │  │  │  └─ domain-service.interface.ts
│  │  │  └─ value-objects
│  │  │     └─ value-object.ts
│  │  ├─ infrastructure
│  │  │  ├─ config
│  │  │  │  ├─ config.module.ts
│  │  │  │  ├─ configuration.ts
│  │  │  │  └─ env.validation.ts
│  │  │  ├─ database
│  │  │  │  ├─ database.module.ts
│  │  │  │  ├─ mongo
│  │  │  │  │  └─ mongoose.module.ts
│  │  │  │  └─ prisma
│  │  │  │     ├─ prisma.module.ts
│  │  │  │     └─ prisma.service.ts
│  │  │  ├─ documentation
│  │  │  │  └─ swagger
│  │  │  │     ├─ swagger.config.ts
│  │  │  │     └─ swagger.setup.ts
│  │  │  └─ logger
│  │  │     ├─ exception.filter.ts
│  │  │     ├─ logger.module.ts
│  │  │     ├─ logger.service.ts
│  │  │     └─ logging.interceptor.ts
│  │  └─ presentation
│  │     ├─ decorators
│  │     │  └─ api-response.decorator.ts
│  │     ├─ filters
│  │     ├─ guards
│  │     ├─ interceptors
│  │     │  ├─ logging.interceptor.ts
│  │     │  └─ response-transform.interceptor.ts
│  │     └─ responses
│  │        ├─ api-response.ts
│  │        └─ base-response.ts
│  └─ types
│     └─ fastify.d.ts
├─ test
│  ├─ app.e2e-spec.ts
│  └─ jest-e2e.json
├─ tsconfig.build.json
└─ tsconfig.json

```