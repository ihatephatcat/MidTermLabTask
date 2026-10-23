import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { NotificationModule } from './notification.module';
import { EnrollmentService } from '../enrollment/enrollment.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let enrollmentService: EnrollmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NotificationModule],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    enrollmentService = module.get<EnrollmentService>(EnrollmentService);
  });

  it('confirms the supplied recipient and message', () => {
    expect(service.sendNotification('John Doe', 'Welcome!')).toEqual({
      message: 'Notification sent successfully',
      student: 'John Doe',
      content: 'Welcome!',
    });
  });

  it('uses the injected enrollment result and returns a check notification', () => {
    const enrollments = {
      message: 'Enrollments checked by provider',
      data: [],
    };
    const getEnrollments = jest
      .spyOn(enrollmentService, 'getEnrollments')
      .mockReturnValue(enrollments);
    const sendNotification = jest.spyOn(service, 'sendNotification');

    expect(service.checkEnrollmentAndNotify('Jane Doe', '202')).toEqual({
      message: 'Enrollment check completed',
      student: 'Jane Doe',
      courseId: '202',
      enrollments,
      notification: {
        message: 'Notification sent successfully',
        student: 'Jane Doe',
        content: 'Enrollment check completed for course 202.',
      },
    });
    expect(getEnrollments).toHaveBeenCalledTimes(1);
    expect(sendNotification).toHaveBeenCalledWith(
      'Jane Doe',
      'Enrollment check completed for course 202.',
    );
  });
});
