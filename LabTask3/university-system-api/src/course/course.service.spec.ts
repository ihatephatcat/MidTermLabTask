import { Test, TestingModule } from '@nestjs/testing';
import { CourseService } from './course.service';

describe('CourseService', () => {
  let service: CourseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseService],
    }).compile();

    service = module.get<CourseService>(CourseService);
  });

  it('returns the required empty course list', () => {
    expect(service.getAllCourses()).toEqual({
      message: 'All courses fetched',
      data: [],
    });
  });

  it('returns the supplied course ID', () => {
    expect(service.getCourseById('CS-202')).toEqual({
      message: 'Course fetched',
      id: 'CS-202',
    });
  });

  it('returns the supplied course name and code', () => {
    expect(service.createCourse('NestJS', 'CS301')).toEqual({
      message: 'Course created',
      data: { name: 'NestJS', code: 'CS301' },
    });
  });
});
