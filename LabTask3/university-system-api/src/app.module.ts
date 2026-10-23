import { Module } from '@nestjs/common';
import { CourseModule } from './course/course.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [CourseModule, EnrollmentModule, NotificationModule],
})
export class AppModule {}
