import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationModule } from './notification.module';
import { NotificationService } from './notification.service';

describe('NotificationController', () => {
  let controller: NotificationController;
  let service: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NotificationModule],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
    service = module.get<NotificationService>(NotificationService);
  });

  it('passes the recipient and message to NotificationService', () => {
    const sendNotification = jest.spyOn(service, 'sendNotification');
    controller.sendNotification({ studentName: 'Jane Doe', message: 'Hello!' });
    expect(sendNotification).toHaveBeenCalledWith('Jane Doe', 'Hello!');
  });

  it('passes the student and course to the enrollment check', () => {
    const checkEnrollmentAndNotify = jest.spyOn(
      service,
      'checkEnrollmentAndNotify',
    );
    controller.checkEnrollmentAndNotify({
      studentName: 'Jane Doe',
      courseId: '202',
    });
    expect(checkEnrollmentAndNotify).toHaveBeenCalledWith('Jane Doe', '202');
  });
});
