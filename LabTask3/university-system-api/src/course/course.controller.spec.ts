import { Test, TestingModule } from '@nestjs/testing';
import { CourseController } from './course.controller';
import { CourseModule } from './course.module';
import { CourseService } from './course.service';

describe('CourseController', () => {
  let controller: CourseController;
  let service: CourseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CourseModule],
    }).compile();

    controller = module.get<CourseController>(CourseController);
    service = module.get<CourseService>(CourseService);
  });

  it('delegates the course list to CourseService', () => {
    const getAllCourses = jest.spyOn(service, 'getAllCourses');
    expect(controller.getAllCourses()).toEqual({
      message: 'All courses fetched',
      data: [],
    });
    expect(getAllCourses).toHaveBeenCalledTimes(1);
  });

  it('passes the course ID to CourseService', () => {
    const getCourseById = jest.spyOn(service, 'getCourseById');
    controller.getCourseById('202');
    expect(getCourseById).toHaveBeenCalledWith('202');
  });

  it('passes the body fields to CourseService', () => {
    const createCourse = jest.spyOn(service, 'createCourse');
    controller.createCourse({ name: 'TypeScript', code: 'CS302' });
    expect(createCourse).toHaveBeenCalledWith('TypeScript', 'CS302');
  });
});
