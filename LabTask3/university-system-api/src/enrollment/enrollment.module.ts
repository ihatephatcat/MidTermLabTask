import { forwardRef, Module } from '@nestjs/common';
import { EnrollmentController } from './enrollment.controller';
import { CourseModule } from '../course/course.module';
import { NotificationModule } from '../notification/notification.module';
import { EnrollmentService } from './enrollment.service';

@Module({
  imports: [CourseModule, forwardRef(() => NotificationModule)],
  controllers: [EnrollmentController],
  providers: [EnrollmentService],
  exports: [EnrollmentService],
})
export class EnrollmentModule {}
