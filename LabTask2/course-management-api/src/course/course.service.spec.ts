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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns the list response without persistent course storage', () => {
    expect(service.getAllCourses()).toEqual({
      message: 'All courses fetched successfully',
      data: [],
    });
  });

  it('returns the requested ID', () => {
    expect(service.getCourseById('5')).toEqual({
      message: 'Course fetched successfully',
      id: '5',
    });
  });

  it('returns the submitted create data including description', () => {
    const dto = {
      name: 'NestJS Fundamentals',
      code: 'CS101',
      instructor: 'John Doe',
      credits: 3,
      description: 'Introduction to NestJS',
    };
    expect(service.createCourse(dto)).toEqual({
      message: 'Course created successfully',
      data: dto,
    });
  });

  it('returns the submitted update data', () => {
    const dto = { name: 'NestJS Advanced', code: 'CS201' };
    expect(service.updateCourse('5', dto)).toEqual({
      message: 'Course updated successfully',
      id: '5',
      data: dto,
    });
  });

  it('lists only supplied patch fields, excluding undefined class properties', () => {
    expect(
      service.patchCourse('5', {
        name: 'NestJS Advanced',
        credits: 4,
        code: undefined,
      }),
    ).toEqual({
      message: 'Course patched successfully',
      id: '5',
      updatedFields: ['name', 'credits'],
    });
  });

  it('returns the deleted ID', () => {
    expect(service.deleteCourse('5')).toEqual({
      message: 'Course deleted successfully',
      id: '5',
    });
  });
});
