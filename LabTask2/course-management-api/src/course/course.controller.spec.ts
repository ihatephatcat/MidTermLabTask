import { Test, TestingModule } from '@nestjs/testing';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';

describe('CourseController', () => {
  let controller: CourseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseController],
      providers: [CourseService],
    }).compile();

    controller = module.get<CourseController>(CourseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates course requests to the injected service', () => {
    const dto = {
      name: 'NestJS Fundamentals',
      code: 'CS101',
      instructor: 'John Doe',
      credits: 3,
    };
    expect(controller.getAllCourses()).toEqual({
      message: 'All courses fetched successfully',
      data: [],
    });
    expect(controller.getCourseById('5')).toEqual({
      message: 'Course fetched successfully',
      id: '5',
    });
    expect(controller.createCourse(dto)).toEqual({
      message: 'Course created successfully',
      data: dto,
    });
    expect(controller.updateCourse('5', { code: 'CS201' })).toEqual({
      message: 'Course updated successfully',
      id: '5',
      data: { code: 'CS201' },
    });
    expect(controller.patchCourse('5', { credits: 4 })).toEqual({
      message: 'Course patched successfully',
      id: '5',
      updatedFields: ['credits'],
    });
    expect(controller.deleteCourse('5')).toEqual({
      message: 'Course deleted successfully',
      id: '5',
    });
  });
});
