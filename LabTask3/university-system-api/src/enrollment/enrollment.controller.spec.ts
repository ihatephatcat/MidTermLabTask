import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentController } from './enrollment.controller';
import { EnrollmentModule } from './enrollment.module';
import { EnrollmentService } from './enrollment.service';

describe('EnrollmentController', () => {
  let controller: EnrollmentController;
  let service: EnrollmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EnrollmentModule],
    }).compile();

    controller = module.get<EnrollmentController>(EnrollmentController);
    service = module.get<EnrollmentService>(EnrollmentService);
  });

  it('delegates the list to EnrollmentService', () => {
    const getEnrollments = jest.spyOn(service, 'getEnrollments');
    expect(controller.getEnrollments()).toEqual({
      message: 'All enrollments fetched',
      data: [],
    });
    expect(getEnrollments).toHaveBeenCalledTimes(1);
  });

  it('passes the student and course from the body to EnrollmentService', () => {
    const enrollStudent = jest.spyOn(service, 'enrollStudent');
    controller.enrollStudent({ studentName: 'Jane Doe', courseId: '202' });
    expect(enrollStudent).toHaveBeenCalledWith('Jane Doe', '202');
  });
});
