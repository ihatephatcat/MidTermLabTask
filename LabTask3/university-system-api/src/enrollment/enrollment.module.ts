import { Module } from '@nestjs/common';
import { EnrollmentController } from './enrollment.controller';
import { CourseModule } from '../course/course.module';
import { EnrollmentService } from './enrollment.service';

@Module({
  imports: [CourseModule],
  controllers: [EnrollmentController],
  providers: [EnrollmentService]
})
export class EnrollmentModule {}
