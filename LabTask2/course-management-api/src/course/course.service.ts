import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
  getAllCourses() {
    return { message: 'All courses fetched successfully', data: [] };
  }

  getCourseById(id: string) {
    return { message: 'Course fetched successfully', id };
  }

  createCourse(dto: CreateCourseDto) {
    return { message: 'Course created successfully', data: dto };
  }

  updateCourse(id: string, dto: UpdateCourseDto) {
    return { message: 'Course updated successfully', id, data: dto };
  }

  patchCourse(id: string, dto: UpdateCourseDto) {
    return {
      message: 'Course patched successfully',
      id,
      // Class instances can contain optional fields whose value is undefined.
      updatedFields: Object.keys(dto).filter((key) => dto[key] !== undefined),
    };
  }

  deleteCourse(id: string) {
    return { message: 'Course deleted successfully', id };
  }
}
