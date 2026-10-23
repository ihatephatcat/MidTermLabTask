import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentModule } from './enrollment.module';
import { CourseService } from '../course/course.service';
import { NotificationService } from '../notification/notification.service';

describe('EnrollmentService', () => {
  let service: EnrollmentService;
  let courseService: CourseService;
  let notificationService: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EnrollmentModule],
    }).compile();

    service = module.get<EnrollmentService>(EnrollmentService);
    courseService = module.get<CourseService>(CourseService);
    notificationService = module.get<NotificationService>(NotificationService);
  });

  it('returns the required empty enrollment list', () => {
    expect(service.getEnrollments()).toEqual({
      message: 'All enrollments fetched',
      data: [],
    });
  });

  it('uses the injected course response and sends a notification afterwards', () => {
    const course = { message: 'Course fetched by provider', id: '202' };
    const notification = {
      message: 'Notification confirmed by provider',
      student: 'Jane Doe',
      content: 'Enrollment confirmation',
    };
    const getCourseById = jest
      .spyOn(courseService, 'getCourseById')
      .mockReturnValue(course);
    const sendNotification = jest
      .spyOn(notificationService, 'sendNotification')
      .mockReturnValue(notification);

    expect(service.enrollStudent('Jane Doe', '202')).toEqual({
      message: 'Student enrolled successfully',
      student: 'Jane Doe',
      course,
      notification,
    });
    expect(getCourseById).toHaveBeenCalledWith('202');
    expect(sendNotification).toHaveBeenCalledWith(
      'Jane Doe',
      'You have been enrolled in course 202.',
    );
    expect(getCourseById.mock.invocationCallOrder[0]).toBeLessThan(
      sendNotification.mock.invocationCallOrder[0],
    );
  });

  it('keeps the required list empty after an enrollment', () => {
    service.enrollStudent('John Doe', '101');
    expect(service.getEnrollments().data).toEqual([]);
  });
});
