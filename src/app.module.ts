import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import { AcademicCatalogModule } from 'src/modules/academic-catalog/academic-catalog.module';
// TODO: Re-enable when Prisma models are defined
// import { CourseModule } from 'src/modules/course/course.module';
import { HealthModule } from 'src/modules/health/health.module';
// import { AssessmentModule } from 'src/modules/assessment/assessment.module';
// import { LessonModule } from 'src/modules/lesson/lesson.module';
import { NotificationModule } from 'src/modules/notification/notification.module';
import { TutorApplicationModule } from 'src/modules/tutor-application/tutor-application.module';
import { UserModule } from 'src/modules/user/user.module';
import { RateLimitGuard } from 'src/shared/presentation/guards/rate-limit.guard';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from './modules/auth/presentation/guards/roles.guard';
import { BookingModule } from './modules/booking/booking.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ScheduleAvailabilityModule } from './modules/schedule-availability/schedule-availability.module';
import { StorageModule } from './modules/storage/storage.module';
import { TutorRequestModule } from './modules/tutor-request/tutor-request.module';
import { AppConfigModule } from './shared/infrastructure/config/config.module';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { LoggerModule } from './shared/infrastructure/logger/logger.module';
// import { ResourceModule } from './modules/resource/resource.module';
import { RecommendationModule } from './modules/recommendation/recommendation.module';
import { ReviewModule } from './modules/review/review.module';
import { RabbitmqModule } from './shared/infrastructure/messaging/rabbitmq/rabbitmq.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [
    AppConfigModule,
    RabbitmqModule,
    DatabaseModule,
    LoggerModule,
    StorageModule,
    HealthModule,
    AuthModule,
    UserModule,
    NotificationModule,
    AcademicCatalogModule,
    // CourseModule,
    // EnrollmentModule,
    // LessonModule,
    // AssessmentModule,
    TutorApplicationModule,
    PaymentModule,
    ScheduleAvailabilityModule,
    BookingModule,
    TutorRequestModule,
    // ResourceModule,
    RecommendationModule,
    ReviewModule,
    ChatModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
