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
edura-api
├─ .agents
│  └─ backend.md
├─ .claude
│  ├─ settings.json
│  └─ skills
│     ├─ debug-issue.md
│     ├─ explore-codebase.md
│     ├─ refactor-safely.md
│     └─ review-changes.md
├─ .cursor
│  └─ mcp.json
├─ .cursorrules
├─ .kiro
│  └─ steering
│     └─ code-review-graph.md
├─ .mcp.json
├─ .opencode.json
├─ .prettierrc
├─ .windsurfrules
├─ AGENTS.md
├─ CLAUDE.md
├─ eslint.config.mjs
├─ GEMINI.md
├─ generated
├─ GIT_NAMING_CONVENTION_RULES.md
├─ nest-cli.json
├─ package-lock.json
├─ package.json
├─ prisma
│  ├─ migrations
│  └─ schema.prisma
├─ prisma.config.ts
├─ README.md
├─ src
│  ├─ app.module.ts
│  ├─ main.ts
│  ├─ modules
│  │  ├─ academic-catalog
│  │  │  ├─ academic-catalog.module.ts
│  │  │  ├─ application
│  │  │  │  ├─ commands
│  │  │  │  │  ├─ create-grade
│  │  │  │  │  │  ├─ create-grade.command.ts
│  │  │  │  │  │  ├─ create-grade.handler.ts
│  │  │  │  │  │  └─ create-grade.result.ts
│  │  │  │  │  └─ create-subject
│  │  │  │  │     ├─ create-subject.command.ts
│  │  │  │  │     ├─ create-subject.handler.ts
│  │  │  │  │     └─ create-subject.result.ts
│  │  │  │  └─ queries
│  │  │  │     ├─ get-grades
│  │  │  │     │  ├─ get-grades.handler.ts
│  │  │  │     │  ├─ get-grades.query.ts
│  │  │  │     │  └─ get-grades.result.ts
│  │  │  │     └─ get-subjects
│  │  │  │        ├─ get-subjects.handler.ts
│  │  │  │        ├─ get-subjects.query.ts
│  │  │  │        └─ get-subjects.result.ts
│  │  │  ├─ domain
│  │  │  │  ├─ entities
│  │  │  │  │  ├─ grade.entity.ts
│  │  │  │  │  └─ subject.entity.ts
│  │  │  │  └─ repositories
│  │  │  │     ├─ grade.repository.interface.ts
│  │  │  │     └─ subject.repository.interface.ts
│  │  │  ├─ infrastructure
│  │  │  │  ├─ mapper
│  │  │  │  │  ├─ grade.mapper.ts
│  │  │  │  │  └─ subject.mapper.ts
│  │  │  │  └─ repositories
│  │  │  │     ├─ grade.repository.impl.ts
│  │  │  │     ├─ grade.repository.type.ts
│  │  │  │     ├─ subject.repository.impl.ts
│  │  │  │     └─ subject.repository.type.ts
│  │  │  └─ presentation
│  │  │     ├─ controllers
│  │  │     │  ├─ grade.controller.ts
│  │  │     │  └─ subject.controller.ts
│  │  │     └─ schemas
│  │  │        ├─ create-grade.dto.ts
│  │  │        ├─ create-subject.dto.ts
│  │  │        ├─ grade-reponse.dto.ts
│  │  │        └─ subject-reponse.dto.ts
│  │  ├─ auth
│  │  │  ├─ application
│  │  │  │  ├─ commands
│  │  │  │  │  ├─ forgot-password
│  │  │  │  │  │  ├─ forgot-password.command.ts
│  │  │  │  │  │  ├─ forgot-password.handler.ts
│  │  │  │  │  │  └─ forgot-password.result.ts
│  │  │  │  │  ├─ login
│  │  │  │  │  │  ├─ login.command.ts
│  │  │  │  │  │  ├─ login.handler.ts
│  │  │  │  │  │  └─ login.result.ts
│  │  │  │  │  ├─ login-google
│  │  │  │  │  │  ├─ login-google.command.ts
│  │  │  │  │  │  ├─ login-google.handler.ts
│  │  │  │  │  │  └─ login-google.result.ts
│  │  │  │  │  ├─ logout
│  │  │  │  │  │  ├─ logout.command.ts
│  │  │  │  │  │  └─ logout.handler.ts
│  │  │  │  │  ├─ refresh-token
│  │  │  │  │  │  ├─ refresh-token.command.ts
│  │  │  │  │  │  ├─ refresh-token.handler.ts
│  │  │  │  │  │  └─ refresh-token.result.ts
│  │  │  │  │  ├─ register
│  │  │  │  │  │  ├─ register.command.ts
│  │  │  │  │  │  ├─ register.handler.ts
│  │  │  │  │  │  └─ register.result.ts
│  │  │  │  │  ├─ reset-password
│  │  │  │  │  │  ├─ reset-password.command.ts
│  │  │  │  │  │  ├─ reset-password.handler.ts
│  │  │  │  │  │  └─ reset-password.result.ts
│  │  │  │  │  └─ verify-otp
│  │  │  │  │     ├─ verify-otp.command.ts
│  │  │  │  │     ├─ verify-otp.handler.ts
│  │  │  │  │     └─ verify-otp.result.ts
│  │  │  │  ├─ events
│  │  │  │  │  └─ sync-user-to-rabbitmq.handler.ts
│  │  │  │  ├─ queries
│  │  │  │  │  ├─ get-login-history
│  │  │  │  │  └─ get-me
│  │  │  │  │     ├─ get-me.handler.ts
│  │  │  │  │     ├─ get-me.query.ts
│  │  │  │  │     └─ get-me.result.ts
│  │  │  │  └─ services
│  │  │  │     ├─ hash.service.ts
│  │  │  │     ├─ jwt.service.ts
│  │  │  │     └─ otp.service.ts
│  │  │  ├─ auth.module.ts
│  │  │  ├─ domain
│  │  │  │  ├─ entities
│  │  │  │  │  ├─ otp.entity.ts
│  │  │  │  │  └─ refresh-token.entity.ts
│  │  │  │  ├─ repositories
│  │  │  │  │  ├─ auth.repository.interface.ts
│  │  │  │  │  └─ otp.repository.ts
│  │  │  │  └─ value-objects
│  │  │  │     └─ auth-token-payload.ts
│  │  │  ├─ infrastructure
│  │  │  │  ├─ mapper
│  │  │  │  │  ├─ otp.mapper.ts
│  │  │  │  │  └─ refresh-token.mapper.ts
│  │  │  │  ├─ repositories
│  │  │  │  │  ├─ auth.repository.impl.ts
│  │  │  │  │  ├─ auth.repository.types.ts
│  │  │  │  │  ├─ otp.repository.impl.ts
│  │  │  │  │  └─ otp.repository.types.ts
│  │  │  │  └─ services
│  │  │  │     ├─ google-auth.service.ts
│  │  │  │     ├─ hash.service.ts
│  │  │  │     ├─ jwt.service.ts
│  │  │  │     └─ otp.service.ts
│  │  │  └─ presentation
│  │  │     ├─ controllers
│  │  │     │  └─ auth.controller.ts
│  │  │     ├─ decorators
│  │  │     │  ├─ auth-metadata.constants.ts
│  │  │     │  ├─ current-user.decorator.ts
│  │  │     │  ├─ public.decorator.ts
│  │  │     │  └─ role.decorator.ts
│  │  │     ├─ guards
│  │  │     │  ├─ jwt-auth.guard.ts
│  │  │     │  ├─ reset-token.guard.ts
│  │  │     │  └─ roles.guard.ts
│  │  │     ├─ schemas
│  │  │     │  ├─ auth-response.dto.ts
│  │  │     │  ├─ forgot-password.dto.ts
│  │  │     │  ├─ login-google.dto.ts
│  │  │     │  ├─ login.dto.ts
│  │  │     │  ├─ register.dto.ts
│  │  │     │  ├─ reset-password.dto.ts
│  │  │     │  └─ verify-otp.dto.ts
│  │  │     └─ strategies
│  │  │        ├─ jwt.strategy.ts
│  │  │        └─ reset-token.strategy.ts
│  │  ├─ course
│  │  │  ├─ application
│  │  │  │  ├─ commands
│  │  │  │  │  ├─ change-course-status
│  │  │  │  │  │  ├─ change-course-status.command.ts
│  │  │  │  │  │  ├─ change-course-status.handler.ts
│  │  │  │  │  │  └─ change-course-status.result.ts
│  │  │  │  │  ├─ create-course
│  │  │  │  │  │  ├─ create-course.command.ts
│  │  │  │  │  │  ├─ create-course.handler.ts
│  │  │  │  │  │  └─ create-course.result.ts
│  │  │  │  │  └─ update-course
│  │  │  │  │     ├─ update-course.command.ts
│  │  │  │  │     ├─ update-course.handler.ts
│  │  │  │  │     └─ update-course.result.ts
│  │  │  │  ├─ events
│  │  │  │  │  ├─ sync-course-to-rabbitmq.handler.ts
│  │  │  │  │  └─ sync-course-update-to-rabbitmq.handler.ts
│  │  │  │  └─ queries
│  │  │  │     ├─ get-course-by-id
│  │  │  │     │  ├─ get-course-by-id.handler.ts
│  │  │  │     │  ├─ get-course-by-id.query.ts
│  │  │  │     │  └─ get-course-by-id.result.ts
│  │  │  │     ├─ get-courses
│  │  │  │     │  ├─ get-courses.handler.ts
│  │  │  │     │  ├─ get-courses.query.ts
│  │  │  │     │  └─ get-courses.result.ts
│  │  │  │     ├─ get-joined-students
│  │  │  │     │  ├─ get-joined-students.handler.ts
│  │  │  │     │  ├─ get-joined-students.query.ts
│  │  │  │     │  └─ get-joined-students.result.ts
│  │  │  │     └─ get-tutor-courses
│  │  │  │        ├─ get-tutor-courses.handler.ts
│  │  │  │        ├─ get-tutor-courses.query.ts
│  │  │  │        └─ get-tutor-courses.result.ts
│  │  │  ├─ course.module.ts
│  │  │  ├─ domain
│  │  │  │  ├─ entities
│  │  │  │  │  └─ course.entity.ts
│  │  │  │  ├─ events
│  │  │  │  │  ├─ course-created.domain-event.ts
│  │  │  │  │  └─ course-updated.domain-event.ts
│  │  │  │  ├─ repositories
│  │  │  │  │  └─ course.repository.interface.ts
│  │  │  │  └─ value-objects
│  │  │  │     └─ course-level.ts
│  │  │  ├─ infrastructure
│  │  │  │  ├─ mapper
│  │  │  │  │  └─ course.mapper.ts
│  │  │  │  └─ repositories
│  │  │  │     ├─ course.repository.impl.ts
│  │  │  │     ├─ course.repository.type.ts
│  │  │  │     └─ grade.repository.type.ts
│  │  │  └─ presentation
│  │  │     ├─ controllers
│  │  │     │  └─ course.controller.ts
│  │  │     └─ schemas
│  │  │        ├─ change-course-status.dto.ts
│  │  │        ├─ course-response.dto.ts
│  │  │        ├─ create-course.dto.ts
│  │  │        ├─ get-courses-query.dto.ts
│  │  │        └─ update-course.dto.ts
│  │  ├─ enrollment
│  │  │  ├─ application
│  │  │  │  ├─ commands
│  │  │  │  │  └─ enroll-course
│  │  │  │  │     ├─ enroll-course.command.ts
│  │  │  │  │     ├─ enroll-course.handler.ts
│  │  │  │  │     └─ enroll-course.result.ts
│  │  │  │  └─ events
│  │  │  │     └─ sync-enrollment-to-rabbitmq.handler.ts
│  │  │  ├─ domain
│  │  │  │  ├─ entities
│  │  │  │  │  └─ enrollment.entity.ts
│  │  │  │  ├─ events
│  │  │  │  │  └─ enrollment-created.domain-event.ts
│  │  │  │  └─ repositories
│  │  │  │     └─ enrollment.repository.interface.ts
│  │  │  ├─ enrollment.module.ts
│  │  │  ├─ infrastructure
│  │  │  │  ├─ mapper
│  │  │  │  │  └─ enrollment.mapper.ts
│  │  │  │  └─ repositories
│  │  │  │     ├─ enrollment.repository.impl.ts
│  │  │  │     └─ enrollment.repository.type.ts
│  │  │  └─ presentation
│  │  │     ├─ controllers
│  │  │     │  └─ enrollment.controller.ts
│  │  │     └─ schemas
│  │  │        ├─ enroll-course.dto.ts
│  │  │        └─ enrollment-response.dto.ts
│  │  ├─ health
│  │  │  ├─ health.controller.spec.ts
│  │  │  ├─ health.controller.ts
│  │  │  ├─ health.module.ts
│  │  │  ├─ prisma.health.ts
│  │  │  └─ redis.health.ts
│  │  ├─ lesson
│  │  │  ├─ application
│  │  │  │  ├─ commands
│  │  │  │  │  ├─ create-lesson
│  │  │  │  │  │  ├─ create-lesson.command.ts
│  │  │  │  │  │  ├─ create-lesson.handler.ts
│  │  │  │  │  │  └─ create-lesson.result.ts
│  │  │  │  │  └─ update-lesson
│  │  │  │  │     ├─ update-lesson.command.ts
│  │  │  │  │     ├─ update-lesson.handler.ts
│  │  │  │  │     └─ update-lesson.result.ts
│  │  │  │  └─ queries
│  │  │  │     ├─ get-lesson-by-id
│  │  │  │     │  ├─ get-lesson-by-id.handler.ts
│  │  │  │     │  ├─ get-lesson-by-id.query.ts
│  │  │  │     │  └─ get-lesson-by-id.result.ts
│  │  │  │     ├─ get-lesson-details
│  │  │  │     │  ├─ get-lesson-details.handler.ts
│  │  │  │     │  ├─ get-lesson-details.query.ts
│  │  │  │     │  └─ get-lesson-details.result.ts
│  │  │  │     └─ get-lessons-by-course
│  │  │  │        ├─ get-lessons-by-course.handler.ts
│  │  │  │        ├─ get-lessons-by-course.query.ts
│  │  │  │        └─ get-lessons-by-course.result.ts
│  │  │  ├─ domain
│  │  │  │  ├─ entities
│  │  │  │  │  └─ lesson.entity.ts
│  │  │  │  ├─ interfaces
│  │  │  │  │  └─ meeting-service.interface.ts
│  │  │  │  └─ repositories
│  │  │  │     └─ lesson.repository.interface.ts
│  │  │  ├─ infrastructure
│  │  │  │  ├─ adapters
│  │  │  │  │  └─ meeting-service.adapter.ts
│  │  │  │  ├─ mapper
│  │  │  │  │  └─ lesson.mapper.ts
│  │  │  │  └─ repositories
│  │  │  │     ├─ lesson.repository.impl.ts
│  │  │  │     └─ lesson.repository.type.ts
│  │  │  ├─ lesson.module.ts
│  │  │  └─ presentation
│  │  │     ├─ controllers
│  │  │     │  └─ lesson.controller.ts
│  │  │     └─ schemas
│  │  │        ├─ create-lesson.dto.ts
│  │  │        ├─ get-lessons-by-course-query.dto.ts
│  │  │        ├─ lesson-response.dto.ts
│  │  │        └─ update-lesson.dto.ts
│  │  ├─ meeting
│  │  │  ├─ application
│  │  │  │  └─ services
│  │  │  │     └─ meeting.service.ts
│  │  │  ├─ domain
│  │  │  │  └─ interfaces
│  │  │  │     └─ meeting-provider.interface.ts
│  │  │  ├─ infrastructure
│  │  │  │  └─ providers
│  │  │  │     └─ google-meet.provider.ts
│  │  │  ├─ meeting.module.ts
│  │  │  └─ presentation
│  │  ├─ notification
│  │  │  ├─ application
│  │  │  │  ├─ commands
│  │  │  │  │  └─ send-email
│  │  │  │  │     ├─ send-email.command.ts
│  │  │  │  │     └─ send-email.handler.ts
│  │  │  │  ├─ services
│  │  │  │  │  └─ smtp-email.interface.ts
│  │  │  │  └─ templates
│  │  │  │     └─ views
│  │  │  │        ├─ course-status-updated.hbs
│  │  │  │        ├─ otp.hbs
│  │  │  │        ├─ tutor-application-approved.hbs
│  │  │  │        └─ tutor-application-rejected.hbs
│  │  │  ├─ domain
│  │  │  ├─ infrastructure
│  │  │  │  ├─ providers
│  │  │  │  │  └─ mail
│  │  │  │  │     └─ mailer.provider.ts
│  │  │  │  └─ services
│  │  │  │     └─ smtp-email.service.ts
│  │  │  └─ notification.module.ts
│  │  ├─ payment
│  │  │  ├─ application
│  │  │  │  ├─ commands
│  │  │  │  │  ├─ confirm-payment
│  │  │  │  │  │  ├─ confirm-payment.command.ts
│  │  │  │  │  │  ├─ confirm-payment.handler.ts
│  │  │  │  │  │  └─ confirm-payment.result.ts
│  │  │  │  │  └─ create-payment
│  │  │  │  │     ├─ create-payment.command.ts
│  │  │  │  │     ├─ create-payment.handler.ts
│  │  │  │  │     └─ create-payment.result.ts
│  │  │  │  └─ queries
│  │  │  │     └─ get-payment
│  │  │  ├─ domain
│  │  │  │  ├─ entities
│  │  │  │  │  └─ payment.entity.ts
│  │  │  │  ├─ events
│  │  │  │  │  └─ payment-confirmed.event.ts
│  │  │  │  ├─ gateways
│  │  │  │  │  └─ payment.gateway.interface.ts
│  │  │  │  └─ repositories
│  │  │  │     └─ payment.repository.interface.ts
│  │  │  ├─ infrastructure
│  │  │  │  ├─ gateways
│  │  │  │  │  └─ payos
│  │  │  │  │     └─ payos.gateway.ts
│  │  │  │  └─ repositories
│  │  │  │     ├─ payment.repository.ts
│  │  │  │     └─ payment.repository.types.ts
│  │  │  ├─ payment.module.ts
│  │  │  └─ presentation
│  │  │     ├─ controllers
│  │  │     │  ├─ payment.controller.ts
│  │  │     │  └─ webhook.controller.ts
│  │  │     └─ schemas
│  │  │        └─ create-payment.dto.ts
│  │  ├─ recommendation
│  │  │  ├─ application
│  │  │  │  └─ queries
│  │  │  │     ├─ get-recommended-courses
│  │  │  │     │  ├─ get-recommended-courses.handler.ts
│  │  │  │     │  ├─ get-recommended-courses.query.ts
│  │  │  │     │  └─ get-recommended-courses.result.ts
│  │  │  │     └─ get-recommended-tutors
│  │  │  │        ├─ get-recommended-tutors.handler.ts
│  │  │  │        ├─ get-recommended-tutors.query.ts
│  │  │  │        └─ get-recommended-tutors.result.ts
│  │  │  ├─ domain
│  │  │  │  └─ services
│  │  │  │     └─ ai-recommendation.service.interface.ts
│  │  │  ├─ infrastructure
│  │  │  │  └─ services
│  │  │  │     └─ http-ai-recommendation.service.ts
│  │  │  ├─ presentation
│  │  │  │  ├─ controllers
│  │  │  │  │  └─ recommendation.controller.ts
│  │  │  │  └─ schemas
│  │  │  │     └─ recommendation-response.dto.ts
│  │  │  └─ recommendation.module.ts
│  │  ├─ resource
│  │  │  ├─ application
│  │  │  │  ├─ commands
│  │  │  │  │  ├─ create-resource
│  │  │  │  │  │  ├─ create-resource.command.ts
│  │  │  │  │  │  ├─ create-resource.handler.ts
│  │  │  │  │  │  └─ create-resource.result.ts
│  │  │  │  │  ├─ delete-resource
│  │  │  │  │  │  ├─ delete-resource.command.ts
│  │  │  │  │  │  ├─ delete-resource.handler.ts
│  │  │  │  │  │  └─ delete-resource.result.ts
│  │  │  │  │  └─ update-resource
│  │  │  │  │     ├─ update-resource.command.ts
│  │  │  │  │     ├─ update-resource.handler.ts
│  │  │  │  │     └─ update-resource.result.ts
│  │  │  │  └─ queries
│  │  │  │     ├─ get-all-resources
│  │  │  │     │  ├─ get-all-resources.handler.ts
│  │  │  │     │  ├─ get-all-resources.query.ts
│  │  │  │     │  └─ get-all-resources.result.ts
│  │  │  │     ├─ get-resource-by-id
│  │  │  │     │  ├─ get-resource-by-id.handler.ts
│  │  │  │     │  ├─ get-resource-by-id.query.ts
│  │  │  │     │  └─ get-resource-by-id.result.ts
│  │  │  │     ├─ get-resources-by-target
│  │  │  │     │  ├─ get-resources-by-target.handler.ts
│  │  │  │     │  ├─ get-resources-by-target.query.ts
│  │  │  │     │  └─ get-resources-by-target.result.ts
│  │  │  │     └─ get-resources-by-tutor
│  │  │  │        ├─ get-resources-by-tutor.handler.ts
│  │  │  │        ├─ get-resources-by-tutor.query.ts
│  │  │  │        └─ get-resources-by-tutor.result.ts
│  │  │  ├─ domain
│  │  │  │  ├─ entities
│  │  │  │  │  └─ resource.entity.ts
│  │  │  │  ├─ repositories
│  │  │  │  │  └─ resource.repository.interface.ts
│  │  │  │  └─ value-objects
│  │  │  │     └─ resource-type.ts
│  │  │  ├─ infrastructure
│  │  │  │  ├─ mapper
│  │  │  │  │  └─ resource.mapper.ts
│  │  │  │  └─ repositories
│  │  │  │     ├─ resource.repository.impl.ts
│  │  │  │     └─ resource.repository.type.ts
│  │  │  ├─ presentation
│  │  │  │  ├─ controllers
│  │  │  │  │  └─ resource.controller.ts
│  │  │  │  └─ schemas
│  │  │  │     ├─ create-resource.dto.ts
│  │  │  │     ├─ get-resources-by-target-query.dto.ts
│  │  │  │     ├─ get-resources-by-tutor-query.dto.ts
│  │  │  │     ├─ resource-response.dto.ts
│  │  │  │     └─ update-resource.dto.ts
│  │  │  └─ resource.module.ts
│  │  ├─ storage
│  │  │  ├─ application
│  │  │  │  └─ storage.service.ts
│  │  │  ├─ domain
│  │  │  │  └─ interfaces
│  │  │  │     ├─ file-storage.service.interface.ts
│  │  │  │     └─ image-storage.service.interface.ts
│  │  │  ├─ infrastructure
│  │  │  │  ├─ cloudinary
│  │  │  │  │  └─ cloudinary.service.ts
│  │  │  │  └─ supabase
│  │  │  │     ├─ supabase-storage.service.ts
│  │  │  │     └─ supabase.client.ts
│  │  │  ├─ presentation
│  │  │  │  ├─ controllers
│  │  │  │  │  └─ storage.controller.ts
│  │  │  │  ├─ decorators
│  │  │  │  │  ├─ api-image-upload.decorator.ts
│  │  │  │  │  └─ uploaded-image.decorator.ts
│  │  │  │  └─ schemas
│  │  │  │     ├─ presign.dto.ts
│  │  │  │     └─ upload-image.dto.ts
│  │  │  └─ storage.module.ts
│  │  ├─ tutor-application
│  │  │  ├─ application
│  │  │  │  ├─ command
│  │  │  │  │  ├─ approve-tutor-application
│  │  │  │  │  │  ├─ approve-tutor-application.command.ts
│  │  │  │  │  │  ├─ approve-tutor-application.handler.ts
│  │  │  │  │  │  └─ approve-tutor-application.result.ts
│  │  │  │  │  ├─ create-tutor-application
│  │  │  │  │  │  ├─ create-tutor-application.command.ts
│  │  │  │  │  │  ├─ create-tutor-application.handler.ts
│  │  │  │  │  │  └─ create-tutor-application.result.ts
│  │  │  │  │  └─ reject-tutor-application
│  │  │  │  │     ├─ reject-tutor-application.command.ts
│  │  │  │  │     ├─ reject-tutor-application.handler.ts
│  │  │  │  │     └─ reject-tutor-application.result.ts
│  │  │  │  ├─ events
│  │  │  │  │  └─ sync-tutor-to-rabbitmq.handler.ts
│  │  │  │  └─ query
│  │  │  │     └─ get-tutor-application
│  │  │  │        ├─ get-tutor-application.handler.ts
│  │  │  │        ├─ get-tutor-application.query.ts
│  │  │  │        └─ get-tutor-application.result.ts
│  │  │  ├─ domain
│  │  │  │  ├─ entities
│  │  │  │  │  └─ tutor-application.entity.ts
│  │  │  │  ├─ enums
│  │  │  │  │  └─ tutor-application.ts
│  │  │  │  ├─ events
│  │  │  │  │  └─ tutor-created.domain-event.ts
│  │  │  │  └─ repositories
│  │  │  │     └─ tutor-application.repository.ts
│  │  │  ├─ infrastructure
│  │  │  │  ├─ mapper
│  │  │  │  │  └─ tutor-application.mapper.ts
│  │  │  │  └─ repositories
│  │  │  │     ├─ tutor-application.repository.impl.ts
│  │  │  │     └─ tutor-application.type.ts
│  │  │  ├─ presentation
│  │  │  │  ├─ controllers
│  │  │  │  │  └─ tutor-application.controller.ts
│  │  │  │  └─ schemas
│  │  │  │     ├─ create-tutor-application.dto.ts
│  │  │  │     ├─ get-tutor-applications.dto.ts
│  │  │  │     └─ tutor-application-response.dto.ts
│  │  │  └─ tutor-application.module.ts
│  │  └─ user
│  │     ├─ application
│  │     │  ├─ commands
│  │     │  │  ├─ change-avatar
│  │     │  │  │  ├─ change-avatar.command.ts
│  │     │  │  │  ├─ change-avatar.handler.ts
│  │     │  │  │  └─ change-avatar.result.ts
│  │     │  │  ├─ update-profile
│  │     │  │  │  ├─ update-profile.command.ts
│  │     │  │  │  ├─ update-profile.handler.ts
│  │     │  │  │  └─ update-profile.result.ts
│  │     │  │  └─ upgrade-tutor
│  │     │  │     ├─ upgrade-tutor.command.ts
│  │     │  │     ├─ upgrade-tutor.handler.ts
│  │     │  │     └─ upgrade-tutor.result.ts
│  │     │  └─ queries
│  │     │     ├─ get-profile
│  │     │     │  ├─ get-profile.handler.ts
│  │     │     │  ├─ get-profile.query.ts
│  │     │     │  └─ get-profile.result.ts
│  │     │     └─ get-users
│  │     │        ├─ get-users.handler.ts
│  │     │        ├─ get-users.query.ts
│  │     │        └─ get-users.result.ts
│  │     ├─ domain
│  │     │  ├─ entities
│  │     │  │  ├─ parent.entity.ts
│  │     │  │  ├─ profile.entity.ts
│  │     │  │  ├─ student.entity.ts
│  │     │  │  ├─ tutor.entity.ts
│  │     │  │  ├─ user-identity.entity.ts
│  │     │  │  └─ user.entity.ts
│  │     │  ├─ events
│  │     │  │  └─ user-created.domain-event.ts
│  │     │  ├─ repositories
│  │     │  │  ├─ profile.repository.interface.ts
│  │     │  │  ├─ user-identity.repository.interface.ts
│  │     │  │  └─ user.repository.interface.ts
│  │     │  ├─ services
│  │     │  └─ value-objects
│  │     ├─ infrastructure
│  │     │  ├─ mappers
│  │     │  │  ├─ profile.mapper.ts
│  │     │  │  ├─ user-identity.mapper.ts
│  │     │  │  └─ user.mapper.ts
│  │     │  ├─ repositories
│  │     │  │  ├─ profile.repository.impl.ts
│  │     │  │  ├─ user-identity.repository.impl.ts
│  │     │  │  └─ user.repository.impl.ts
│  │     │  └─ user.infrastructure.module.ts
│  │     ├─ presentation
│  │     │  ├─ controllers
│  │     │  │  └─ user.controller.ts
│  │     │  └─ schemas
│  │     │     ├─ change-avatar-response.dto.ts
│  │     │     ├─ change-avatar.dto.ts
│  │     │     ├─ get-profile-response.dto.ts
│  │     │     ├─ profile-response.dto.ts
│  │     │     ├─ update-profile.dto.ts
│  │     │     ├─ upgrade-tutor-response.dto.ts
│  │     │     └─ user-response.dto.ts
│  │     └─ user.module.ts
│  ├─ shared
│  │  ├─ application
│  │  │  ├─ constants
│  │  │  │  ├─ cache.constants.ts
│  │  │  │  └─ events.constants.ts
│  │  │  └─ interfaces
│  │  │     ├─ cache.interface.ts
│  │  │     ├─ mapper.interface.ts
│  │  │     ├─ message-broker.interface.ts
│  │  │     ├─ unit-of-work.ts
│  │  │     └─ use-case.interface.ts
│  │  ├─ domain
│  │  │  ├─ common
│  │  │  │  └─ query.ts
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
│  │  │  │  ├─ prisma
│  │  │  │  │  ├─ prisma-transaction.context.ts
│  │  │  │  │  ├─ prisma-unit-of-work.ts
│  │  │  │  │  ├─ prisma.module.ts
│  │  │  │  │  └─ prisma.service.ts
│  │  │  │  └─ redis
│  │  │  │     ├─ redis.module.ts
│  │  │  │     └─ redis.service.ts
│  │  │  ├─ documentation
│  │  │  │  ├─ swagger
│  │  │  │  │  ├─ swagger.config.ts
│  │  │  │  │  └─ swagger.setup.ts
│  │  │  │  └─ zod
│  │  │  │     └─ zod.ts
│  │  │  ├─ logger
│  │  │  │  ├─ exception.filter.ts
│  │  │  │  ├─ logger.module.ts
│  │  │  │  ├─ logger.service.ts
│  │  │  │  └─ logging.interceptor.ts
│  │  │  └─ messaging
│  │  │     └─ rabbitmq
│  │  │        ├─ rabbitmq.constants.ts
│  │  │        ├─ rabbitmq.module.ts
│  │  │        ├─ rabbitmq.service.ts
│  │  │        └─ rabbitmq.types.ts
│  │  └─ presentation
│  │     ├─ decorators
│  │     │  ├─ api-response.decorator.ts
│  │     │  ├─ decorator.constants.ts
│  │     │  ├─ query.decorator.ts
│  │     │  └─ rate-limit.decorator.ts
│  │     ├─ filters
│  │     ├─ guards
│  │     │  ├─ rate-limit.guard.spec.ts
│  │     │  └─ rate-limit.guard.ts
│  │     ├─ interceptors
│  │     │  ├─ logging.interceptor.ts
│  │     │  └─ response-transform.interceptor.ts
│  │     ├─ responses
│  │     │  ├─ api-response.ts
│  │     │  ├─ base-response.ts
│  │     │  └─ query-response.ts
│  │     └─ schemas
│  │        └─ base-query.dto.ts
│  └─ types
│     └─ fastify.d.ts
├─ test
│  ├─ app.e2e-spec.ts
│  └─ jest-e2e.json
├─ tsconfig.build.json
└─ tsconfig.json

```