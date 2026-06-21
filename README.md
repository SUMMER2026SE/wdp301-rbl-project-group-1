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
```
edura-api
├─ .claude
│  └─ skills
│     ├─ debug-issue.md
│     ├─ explore-codebase.md
│     ├─ refactor-safely.md
│     └─ review-changes.md
├─ .dockerignore
├─ .kiro
│  └─ steering
│     └─ code-review-graph.md
├─ .opencode.json
├─ .prettierrc
├─ .windsurfrules
├─ Dockerfile
├─ docs
│  ├─ architecture.md
│  ├─ features-list.md
│  ├─ future-management-api-tasks.md
│  ├─ future-management-expansion.md
│  ├─ roadmap.md
│  ├─ tech-stack.md
│  └─ vision.md
├─ eslint.config.mjs
├─ GEMINI.md
├─ generated
├─ GIT_NAMING_CONVENTION_RULES.md
├─ nest-cli.json
├─ package-lock.json
├─ package.json
├─ prisma
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
│  │  │  │  │  ├─ send-verify-email-otp
│  │  │  │  │  │  ├─ send-verify-email-otp.command.ts
│  │  │  │  │  │  ├─ send-verify-email-otp.handler.ts
│  │  │  │  │  │  └─ send-verify-email-otp.result.ts
│  │  │  │  │  ├─ verify-email
│  │  │  │  │  │  ├─ verify-email.command.ts
│  │  │  │  │  │  ├─ verify-email.handler.ts
│  │  │  │  │  │  └─ verify-email.result.ts
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
│  │  │  │  │  └─ refresh-token.entity.ts
│  │  │  │  ├─ repositories
│  │  │  │  │  └─ auth.repository.interface.ts
│  │  │  │  └─ value-objects
│  │  │  │     └─ auth-token-payload.ts
│  │  │  ├─ infrastructure
│  │  │  │  ├─ mapper
│  │  │  │  │  └─ refresh-token.mapper.ts
│  │  │  │  ├─ repositories
│  │  │  │  │  ├─ auth.repository.impl.ts
│  │  │  │  │  └─ auth.repository.types.ts
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
│  │  │     │  ├─ send-verify-email-otp.dto.ts
│  │  │     │  ├─ verify-email.dto.ts
│  │  │     │  └─ verify-otp.dto.ts
│  │  │     └─ strategies
│  │  │        ├─ jwt.strategy.ts
│  │  │        └─ reset-token.strategy.ts
│  │  ├─ booking
│  │  │  ├─ application
│  │  │  │  ├─ commands
│  │  │  │  │  ├─ accept-booking
│  │  │  │  │  │  ├─ accept-booking.command.ts
│  │  │  │  │  │  ├─ accept-booking.handler.ts
│  │  │  │  │  │  └─ accept-booking.result.ts
│  │  │  │  │  ├─ approve-reschedule-session
│  │  │  │  │  │  ├─ approve-reschedule-session.command.ts
│  │  │  │  │  │  ├─ approve-reschedule-session.handler.ts
│  │  │  │  │  │  └─ approve-reschedule-session.result.ts
│  │  │  │  │  ├─ cancel-session
│  │  │  │  │  │  ├─ cancel-session.command.ts
│  │  │  │  │  │  ├─ cancel-session.handler.ts
│  │  │  │  │  │  └─ cancel-session.result.ts
│  │  │  │  │  ├─ confirm-session-attendance
│  │  │  │  │  │  ├─ confirm-session-attendance.command.ts
│  │  │  │  │  │  ├─ confirm-session-attendance.handler.ts
│  │  │  │  │  │  └─ confirm-session-attendance.result.ts
│  │  │  │  │  ├─ create-direct-booking
│  │  │  │  │  │  ├─ create-direct-booking.command.ts
│  │  │  │  │  │  ├─ create-direct-booking.handler.ts
│  │  │  │  │  │  └─ create-direct-booking.result.ts
│  │  │  │  │  ├─ reject-booking
│  │  │  │  │  │  ├─ reject-booking.command.ts
│  │  │  │  │  │  ├─ reject-booking.handler.ts
│  │  │  │  │  │  └─ reject-booking.result.ts
│  │  │  │  │  ├─ reject-reschedule-session
│  │  │  │  │  │  ├─ reject-reschedule-session.command.ts
│  │  │  │  │  │  ├─ reject-reschedule-session.handler.ts
│  │  │  │  │  │  └─ reject-reschedule-session.result.ts
│  │  │  │  │  ├─ renew-booking
│  │  │  │  │  │  ├─ renew-booking.command.ts
│  │  │  │  │  │  ├─ renew-booking.handler.ts
│  │  │  │  │  │  └─ renew-booking.result.ts
│  │  │  │  │  ├─ reschedule-session
│  │  │  │  │  │  ├─ reschedule-session.command.ts
│  │  │  │  │  │  ├─ reschedule-session.handler.ts
│  │  │  │  │  │  └─ reschedule-session.result.ts
│  │  │  │  │  └─ take-attendance
│  │  │  │  │     ├─ take-attendance.command.ts
│  │  │  │  │     ├─ take-attendance.handler.ts
│  │  │  │  │     └─ take-attendance.result.ts
│  │  │  │  ├─ event-handlers
│  │  │  │  │  └─ payment-confirmed.handler.ts
│  │  │  │  └─ queries
│  │  │  │     ├─ get-booking-by-id
│  │  │  │     │  ├─ get-booking-by-id.handler.ts
│  │  │  │     │  └─ get-booking-by-id.query.ts
│  │  │  │     ├─ get-bookings
│  │  │  │     │  ├─ get-bookings.handler.ts
│  │  │  │     │  ├─ get-bookings.query.ts
│  │  │  │     │  └─ get-bookings.result.ts
│  │  │  │     ├─ get-my-sessions
│  │  │  │     │  ├─ get-my-sessions.handler.ts
│  │  │  │     │  ├─ get-my-sessions.query.ts
│  │  │  │     │  └─ get-my-sessions.result.ts
│  │  │  │     └─ get-tutor-sessions
│  │  │  │        ├─ get-tutor-sessions.handler.ts
│  │  │  │        └─ get-tutor-sessions.query.ts
│  │  │  ├─ booking.module.ts
│  │  │  ├─ domain
│  │  │  │  ├─ entities
│  │  │  │  │  └─ booking.entity.ts
│  │  │  │  ├─ events
│  │  │  │  │  └─ booking-events.ts
│  │  │  │  ├─ repositories
│  │  │  │  │  └─ booking.repository.interface.ts
│  │  │  │  └─ services
│  │  │  │     └─ session-generator.service.ts
│  │  │  ├─ infrastructure
│  │  │  │  └─ repositories
│  │  │  │     └─ booking.repository.impl.ts
│  │  │  └─ presentation
│  │  │     ├─ controllers
│  │  │     │  └─ booking.controller.ts
│  │  │     └─ schemas
│  │  │        ├─ booking-response.dto.ts
│  │  │        ├─ cancel-session.dto.ts
│  │  │        ├─ create-direct-booking.dto.ts
│  │  │        ├─ get-bookings-query.dto.ts
│  │  │        ├─ get-my-sessions-query.dto.ts
│  │  │        ├─ mark-session-attendance.dto.ts
│  │  │        ├─ renew-booking.dto.ts
│  │  │        ├─ reschedule-session.dto.ts
│  │  │        ├─ session-response.dto.ts
│  │  │        └─ take-attendance.dto.ts
│  │  ├─ chat
│  │  │  ├─ application
│  │  │  │  ├─ commands
│  │  │  │  │  ├─ create-conversation
│  │  │  │  │  │  ├─ create-conversation.command.ts
│  │  │  │  │  │  ├─ create-conversation.handler.ts
│  │  │  │  │  │  └─ create-conversation.result.ts
│  │  │  │  │  ├─ delete-message
│  │  │  │  │  │  ├─ delete-message.command.ts
│  │  │  │  │  │  └─ delete-message.handler.ts
│  │  │  │  │  ├─ mark-read
│  │  │  │  │  │  ├─ mark-read.command.ts
│  │  │  │  │  │  └─ mark-read.handler.ts
│  │  │  │  │  └─ send-message
│  │  │  │  │     ├─ send-message.command.ts
│  │  │  │  │     └─ send-message.handler.ts
│  │  │  │  ├─ queries
│  │  │  │  │  ├─ get-conversations
│  │  │  │  │  │  ├─ get-conversations.handler.ts
│  │  │  │  │  │  ├─ get-conversations.query.ts
│  │  │  │  │  │  └─ get-conversations.result.ts
│  │  │  │  │  └─ get-messages
│  │  │  │  │     ├─ get-messages.handler.ts
│  │  │  │  │     ├─ get-messages.query.ts
│  │  │  │  │     └─ get-messages.result.ts
│  │  │  │  └─ services
│  │  │  │     └─ chat.service.ts
│  │  │  ├─ chat.module.ts
│  │  │  └─ presentation
│  │  │     ├─ controllers
│  │  │     │  └─ conversation.controller.ts
│  │  │     ├─ dtos
│  │  │     ├─ gateways
│  │  │     │  └─ chat.gateway.ts
│  │  │     └─ schemas
│  │  │        ├─ conversation-response.dto.ts
│  │  │        ├─ create-conversation.dto.ts
│  │  │        ├─ message-response.dto.ts
│  │  │        └─ send-message.dto.ts
│  │  ├─ dispute
│  │  │  ├─ application
│  │  │  │  └─ commands
│  │  │  │     ├─ create-dispute
│  │  │  │     │  ├─ create-dispute.command.ts
│  │  │  │     │  ├─ create-dispute.handler.ts
│  │  │  │     │  └─ create-dispute.result.ts
│  │  │  │     ├─ dispute-session
│  │  │  │     │  ├─ dispute-session.command.ts
│  │  │  │     │  ├─ dispute-session.handler.ts
│  │  │  │     │  └─ dispute-session.result.ts
│  │  │  │     ├─ resolve-dispute
│  │  │  │     │  ├─ resolve-dispute.command.ts
│  │  │  │     │  ├─ resolve-dispute.handler.ts
│  │  │  │     │  └─ resolve-dispute.result.ts
│  │  │  │     └─ send-dispute-message
│  │  │  │        ├─ send-dispute-message.command.ts
│  │  │  │        ├─ send-dispute-message.handler.ts
│  │  │  │        └─ send-dispute-message.result.ts
│  │  │  ├─ dispute.module.ts
│  │  │  ├─ domain
│  │  │  │  └─ events
│  │  │  │     └─ dispute-events.ts
│  │  │  └─ presentation
│  │  │     ├─ controllers
│  │  │     │  ├─ admin-dispute.controller.ts
│  │  │     │  ├─ dispute-session.controller.ts
│  │  │     │  └─ dispute.controller.ts
│  │  │     └─ schemas
│  │  │        ├─ dispute-session.dto.ts
│  │  │        └─ dispute.dto.ts
│  │  ├─ health
│  │  │  ├─ health.controller.spec.ts
│  │  │  ├─ health.controller.ts
│  │  │  ├─ health.module.ts
│  │  │  ├─ prisma.health.ts
│  │  │  └─ redis.health.ts
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
│  │  │  │  ├─ event-handlers
│  │  │  │  │  ├─ booking-events.handler.ts
│  │  │  │  │  ├─ dispute-events.handler.ts
│  │  │  │  │  ├─ review-events.handler.ts
│  │  │  │  │  └─ tutor-request-events.handler.ts
│  │  │  │  ├─ services
│  │  │  │  │  ├─ notification.service.ts
│  │  │  │  │  └─ smtp-email.interface.ts
│  │  │  │  └─ templates
│  │  │  │     └─ views
│  │  │  │        ├─ course-status-updated.hbs
│  │  │  │        ├─ otp.hbs
│  │  │  │        ├─ tutor-application-approved.hbs
│  │  │  │        └─ tutor-application-rejected.hbs
│  │  │  ├─ domain
│  │  │  │  └─ notification.interfaces.ts
│  │  │  ├─ infrastructure
│  │  │  │  ├─ providers
│  │  │  │  │  └─ mail
│  │  │  │  │     └─ mailer.provider.ts
│  │  │  │  └─ services
│  │  │  │     └─ smtp-email.service.ts
│  │  │  ├─ notification.module.ts
│  │  │  └─ presentation
│  │  │     ├─ controllers
│  │  │     │  └─ notification.controller.ts
│  │  │     ├─ gateways
│  │  │     │  └─ notification.gateway.ts
│  │  │     └─ schemas
│  │  │        └─ notification-response.dto.ts
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
│  │  │  │  │  ├─ mock
│  │  │  │  │  │  └─ mock.gateway.ts
│  │  │  │  │  └─ payos
│  │  │  │  │     └─ payos.gateway.ts
│  │  │  │  └─ repositories
│  │  │  │     ├─ payment.repository.ts
│  │  │  │     └─ payment.repository.types.ts
│  │  │  ├─ payment.module.ts
│  │  │  └─ presentation
│  │  │     ├─ controllers
│  │  │     │  ├─ mock-payment.controller.ts
│  │  │     │  ├─ payment.controller.ts
│  │  │     │  └─ webhook.controller.ts
│  │  │     └─ schemas
│  │  │        └─ create-payment.dto.ts
│  │  ├─ recommendation
│  │  │  ├─ application
│  │  │  │  └─ queries
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
│  │  ├─ review
│  │  │  ├─ application
│  │  │  │  ├─ commands
│  │  │  │  │  ├─ create-review
│  │  │  │  │  │  ├─ create-review.command.ts
│  │  │  │  │  │  ├─ create-review.handler.ts
│  │  │  │  │  │  └─ create-review.result.ts
│  │  │  │  │  └─ delete-review
│  │  │  │  │     ├─ delete-review.command.ts
│  │  │  │  │     ├─ delete-review.handler.ts
│  │  │  │  │     └─ delete-review.result.ts
│  │  │  │  └─ queries
│  │  │  │     └─ get-tutor-reviews
│  │  │  │        ├─ get-tutor-reviews.handler.ts
│  │  │  │        ├─ get-tutor-reviews.query.ts
│  │  │  │        └─ get-tutor-reviews.result.ts
│  │  │  ├─ domain
│  │  │  │  ├─ entities
│  │  │  │  │  └─ review.entity.ts
│  │  │  │  ├─ events
│  │  │  │  │  └─ review-events.ts
│  │  │  │  └─ repositories
│  │  │  │     └─ review.repository.interface.ts
│  │  │  ├─ infrastructure
│  │  │  │  └─ repositories
│  │  │  │     └─ review.repository.impl.ts
│  │  │  ├─ presentation
│  │  │  │  ├─ controllers
│  │  │  │  │  └─ review.controller.ts
│  │  │  │  └─ schemas
│  │  │  │     ├─ create-review.dto.ts
│  │  │  │     ├─ get-tutor-reviews-query.dto.ts
│  │  │  │     └─ review-response.dto.ts
│  │  │  └─ review.module.ts
│  │  ├─ schedule-availability
│  │  │  ├─ application
│  │  │  │  ├─ commands
│  │  │  │  │  └─ update-schedule-availability
│  │  │  │  │     ├─ update-schedule-availability.command.ts
│  │  │  │  │     ├─ update-schedule-availability.handler.ts
│  │  │  │  │     └─ update-schedule-availability.result.ts
│  │  │  │  └─ queries
│  │  │  │     └─ get-schedule-availability
│  │  │  │        ├─ get-schedule-availability.handler.ts
│  │  │  │        ├─ get-schedule-availability.query.ts
│  │  │  │        └─ get-schedule-availability.result.ts
│  │  │  ├─ domain
│  │  │  │  ├─ entities
│  │  │  │  │  └─ user-availability.entity.ts
│  │  │  │  └─ repositories
│  │  │  │     └─ schedule-availability.repository.interface.ts
│  │  │  ├─ infrastructure
│  │  │  │  └─ repositories
│  │  │  │     └─ schedule-availability.repository.impl.ts
│  │  │  ├─ presentation
│  │  │  │  ├─ controllers
│  │  │  │  │  └─ schedule-availability.controller.ts
│  │  │  │  └─ schemas
│  │  │  │     └─ schedule-availability.dto.ts
│  │  │  └─ schedule-availability.module.ts
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
│  │  ├─ tutor-request
│  │  │  ├─ application
│  │  │  │  ├─ commands
│  │  │  │  │  ├─ accept-tutor-bid
│  │  │  │  │  │  ├─ accept-tutor-bid.command.ts
│  │  │  │  │  │  ├─ accept-tutor-bid.handler.ts
│  │  │  │  │  │  └─ accept-tutor-bid.result.ts
│  │  │  │  │  ├─ create-tutor-request
│  │  │  │  │  │  ├─ create-tutor-request.command.ts
│  │  │  │  │  │  ├─ create-tutor-request.handler.ts
│  │  │  │  │  │  └─ create-tutor-request.result.ts
│  │  │  │  │  └─ set-tutor-bid
│  │  │  │  │     ├─ set-tutor-bid.command.ts
│  │  │  │  │     ├─ set-tutor-bid.handler.ts
│  │  │  │  │     └─ set-tutor-bid.result.ts
│  │  │  │  └─ queries
│  │  │  │     ├─ get-tutor-request
│  │  │  │     │  ├─ get-tutor-request.handler.ts
│  │  │  │     │  ├─ get-tutor-request.query.ts
│  │  │  │     │  └─ get-tutor-request.result.ts
│  │  │  │     ├─ get-tutor-request-by-id
│  │  │  │     │  └─ get-tutor-request-by-id.query.ts
│  │  │  │     └─ get-tutor-requests
│  │  │  │        ├─ get-tutor-requests.handler.ts
│  │  │  │        ├─ get-tutor-requests.query.ts
│  │  │  │        └─ get-tutor-requests.result.ts
│  │  │  ├─ domain
│  │  │  │  ├─ entities
│  │  │  │  │  ├─ tutor-bid.entity.ts
│  │  │  │  │  └─ tutor-request.entity.ts
│  │  │  │  ├─ events
│  │  │  │  │  └─ tutor-request-events.ts
│  │  │  │  └─ repositories
│  │  │  │     └─ tutor-request.repository.interface.ts
│  │  │  ├─ infrastructure
│  │  │  │  └─ repositories
│  │  │  │     └─ tutor-request.repository.impl.ts
│  │  │  ├─ presentation
│  │  │  │  ├─ controllers
│  │  │  │  │  └─ tutor-request.controller.ts
│  │  │  │  └─ schemas
│  │  │  │     ├─ get-tutor-requests-query.dto.ts
│  │  │  │     ├─ tutor-request-response.dto.ts
│  │  │  │     └─ tutor-request.dto.ts
│  │  │  └─ tutor-request.module.ts
│  │  └─ user
│  │     ├─ application
│  │     │  ├─ commands
│  │     │  │  ├─ change-avatar
│  │     │  │  │  ├─ change-avatar.command.ts
│  │     │  │  │  ├─ change-avatar.handler.ts
│  │     │  │  │  └─ change-avatar.result.ts
│  │     │  │  ├─ submit-tutor-application
│  │     │  │  ├─ update-profile
│  │     │  │  │  ├─ update-profile.command.ts
│  │     │  │  │  ├─ update-profile.handler.ts
│  │     │  │  │  └─ update-profile.result.ts
│  │     │  │  ├─ update-student-profile
│  │     │  │  │  ├─ update-student-profile.command.ts
│  │     │  │  │  ├─ update-student-profile.handler.ts
│  │     │  │  │  └─ update-student-profile.result.ts
│  │     │  │  ├─ update-tutor-profile
│  │     │  │  │  ├─ update-tutor-profile.command.ts
│  │     │  │  │  ├─ update-tutor-profile.handler.ts
│  │     │  │  │  └─ update-tutor-profile.result.ts
│  │     │  │  └─ upgrade-tutor
│  │     │  │     ├─ upgrade-tutor.command.ts
│  │     │  │     ├─ upgrade-tutor.handler.ts
│  │     │  │     └─ upgrade-tutor.result.ts
│  │     │  ├─ events
│  │     │  │  └─ sync-tutor-view-to-rabbitmq.handler.ts
│  │     │  └─ queries
│  │     │     ├─ get-profile
│  │     │     │  ├─ get-profile.handler.ts
│  │     │     │  ├─ get-profile.query.ts
│  │     │     │  └─ get-profile.result.ts
│  │     │     ├─ get-tutor-by-id
│  │     │     │  ├─ get-tutor-by-id.handler.ts
│  │     │     │  ├─ get-tutor-by-id.query.ts
│  │     │     │  └─ get-tutor-by-id.result.ts
│  │     │     ├─ get-tutors
│  │     │     │  ├─ get-tutors.handler.ts
│  │     │     │  ├─ get-tutors.query.ts
│  │     │     │  └─ get-tutors.result.ts
│  │     │     ├─ get-user-profile-by-id
│  │     │     │  ├─ get-user-profile-by-id.handler.ts
│  │     │     │  ├─ get-user-profile-by-id.query.ts
│  │     │     │  └─ get-user-profile-by-id.result.ts
│  │     │     └─ get-users
│  │     │        ├─ get-users.handler.ts
│  │     │        ├─ get-users.query.ts
│  │     │        └─ get-users.result.ts
│  │     ├─ domain
│  │     │  ├─ entities
│  │     │  │  ├─ parent.entity.ts
│  │     │  │  ├─ tutor.entity.ts
│  │     │  │  ├─ user-identity.entity.ts
│  │     │  │  └─ user.entity.ts
│  │     │  ├─ events
│  │     │  │  ├─ tutor-viewed.domain-event.ts
│  │     │  │  └─ user-created.domain-event.ts
│  │     │  ├─ repositories
│  │     │  │  ├─ tutor.repository.interface.ts
│  │     │  │  ├─ user-identity.repository.interface.ts
│  │     │  │  └─ user.repository.interface.ts
│  │     │  ├─ services
│  │     │  └─ value-objects
│  │     ├─ infrastructure
│  │     │  ├─ mappers
│  │     │  │  ├─ user-identity.mapper.ts
│  │     │  │  └─ user.mapper.ts
│  │     │  ├─ repositories
│  │     │  │  ├─ tutor.repository.impl.ts
│  │     │  │  ├─ user-identity.repository.impl.ts
│  │     │  │  └─ user.repository.impl.ts
│  │     │  └─ user.infrastructure.module.ts
│  │     ├─ presentation
│  │     │  ├─ controllers
│  │     │  │  ├─ tutor.controller.ts
│  │     │  │  └─ user.controller.ts
│  │     │  └─ schemas
│  │     │     ├─ change-avatar-response.dto.ts
│  │     │     ├─ change-avatar.dto.ts
│  │     │     ├─ get-profile-response.dto.ts
│  │     │     ├─ get-tutors-query.dto.ts
│  │     │     ├─ get-user-profile-by-id-response.dto.ts
│  │     │     ├─ profile-response.dto.ts
│  │     │     ├─ tutor-response.dto.ts
│  │     │     ├─ update-profile.dto.ts
│  │     │     ├─ update-student-profile.dto.ts
│  │     │     ├─ update-tutor-profile.dto.ts
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
│  │     │  ├─ rate-limit.guard.ts
│  │     │  └─ ws-jwt.guard.ts
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
├─ tsconfig.json
└─ ~
   └─ .agentmemory
      └─ local.db

```