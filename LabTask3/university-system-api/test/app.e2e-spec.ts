import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Server } from 'node:http';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { CourseModule } from '../src/course/course.module';
import { CourseService } from '../src/course/course.service';
import { EnrollmentModule } from '../src/enrollment/enrollment.module';
import { EnrollmentService } from '../src/enrollment/enrollment.service';
import { NotificationModule } from '../src/notification/notification.module';
import { NotificationService } from '../src/notification/notification.service';

describe('UniversitySystemAPI (HTTP and dependency injection)', () => {
  let app: INestApplication<Server>;
  const notification = {
    message: 'Notification sent successfully',
    student: 'John Doe',
    content: 'You have been enrolled in course 101.',
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication<INestApplication<Server>>();
    await app.listen(0, '127.0.0.1');
  });

  afterEach(() => jest.restoreAllMocks());

  afterAll(async () => {
    if (app) await app.close();
  });

  it('GET /course returns all courses', async () => {
    await request(app.getHttpServer())
      .get('/course')
      .expect(200)
      .expect({ message: 'All courses fetched', data: [] });
  });

  it('GET /course/101 returns the course ID', async () => {
    await request(app.getHttpServer())
      .get('/course/101')
      .expect(200)
      .expect({ message: 'Course fetched', id: '101' });
  });

  it('POST /course returns the submitted course', async () => {
    await request(app.getHttpServer())
      .post('/course')
      .send({ name: 'NestJS', code: 'CS301' })
      .expect(201)
      .expect({
        message: 'Course created',
        data: { name: 'NestJS', code: 'CS301' },
      });
  });

  it('GET /enrollment returns all enrollments', async () => {
    await request(app.getHttpServer())
      .get('/enrollment')
      .expect(200)
      .expect({ message: 'All enrollments fetched', data: [] });
  });

  it('POST /enrollment includes the course and notification confirmation', async () => {
    await request(app.getHttpServer())
      .post('/enrollment')
      .send({ studentName: 'John Doe', courseId: '101' })
      .expect(201)
      .expect({
        message: 'Student enrolled successfully',
        student: 'John Doe',
        course: { message: 'Course fetched', id: '101' },
        notification,
      });
  });

  it('POST /notification/send confirms the notification', async () => {
    await request(app.getHttpServer())
      .post('/notification/send')
      .send({ studentName: 'John Doe', message: 'Welcome!' })
      .expect(201)
      .expect({ ...notification, content: 'Welcome!' });
  });

  it('POST /notification/check includes the enrollment result and notification', async () => {
    await request(app.getHttpServer())
      .post('/notification/check')
      .send({ studentName: 'John Doe', courseId: '101' })
      .expect(201)
      .expect({
        message: 'Enrollment check completed',
        student: 'John Doe',
        courseId: '101',
        enrollments: { message: 'All enrollments fetched', data: [] },
        notification: {
          ...notification,
          content: 'Enrollment check completed for course 101.',
        },
      });
  });

  it('uses the providers exported by their own modules in both directions', async () => {
    const courseService = app
      .select(CourseModule)
      .get(CourseService, { strict: true });
    const enrollmentService = app
      .select(EnrollmentModule)
      .get(EnrollmentService, { strict: true });
    const notificationService = app
      .select(NotificationModule)
      .get(NotificationService, { strict: true });
    const courseLookup = jest.spyOn(courseService, 'getCourseById');
    const sendNotification = jest.spyOn(
      notificationService,
      'sendNotification',
    );
    const getEnrollments = jest.spyOn(enrollmentService, 'getEnrollments');

    await request(app.getHttpServer())
      .post('/enrollment')
      .send({ studentName: 'Jane Doe', courseId: '202' })
      .expect(201);
    expect(courseLookup).toHaveBeenCalledWith('202');
    expect(sendNotification).toHaveBeenCalledWith(
      'Jane Doe',
      'You have been enrolled in course 202.',
    );

    await request(app.getHttpServer())
      .post('/notification/check')
      .send({ studentName: 'Jane Doe', courseId: '202' })
      .expect(201);
    expect(getEnrollments).toHaveBeenCalledTimes(1);
  });

  it('keeps both lists empty after create/enroll operations', async () => {
    await request(app.getHttpServer())
      .post('/course')
      .send({ name: 'TypeScript', code: 'CS302' })
      .expect(201);
    await request(app.getHttpServer())
      .post('/enrollment')
      .send({ studentName: 'Jane Doe', courseId: '202' })
      .expect(201);
    await request(app.getHttpServer())
      .get('/course')
      .expect(200)
      .expect({ message: 'All courses fetched', data: [] });
    await request(app.getHttpServer())
      .get('/enrollment')
      .expect(200)
      .expect({ message: 'All enrollments fetched', data: [] });
  });
});
