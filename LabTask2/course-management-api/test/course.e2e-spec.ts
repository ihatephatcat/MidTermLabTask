import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { readFile, readdir, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { uploadDirectory } from '../src/course/course-upload.options';

const validCourse = {
  name: 'NestJS Fundamentals',
  code: 'CS101',
  instructor: 'John Doe',
  credits: 3,
};

describe('Course API (HTTP)', () => {
  let app: INestApplication<App>;
  const createdFiles: string[] = [];

  async function uploadedNames() {
    try {
      return (await readdir(uploadDirectory)).sort();
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
      throw error;
    }
  }

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.listen(0, '127.0.0.1');
  });

  afterAll(async () => {
    // Remove only files returned by this test run, preserving existing materials.
    await Promise.all(
      createdFiles.map((filename) => unlink(join(uploadDirectory, filename))),
    );
    await app.close();
  });

  it('GET /course returns the empty list response', async () => {
    await request(app.getHttpServer()).get('/course').expect(200).expect({
      message: 'All courses fetched successfully',
      data: [],
    });
  });

  it('GET /course/5 returns its ID', async () => {
    await request(app.getHttpServer()).get('/course/5').expect(200).expect({
      message: 'Course fetched successfully',
      id: '5',
    });
  });

  it('POST /course returns the validated data', async () => {
    await request(app.getHttpServer())
      .post('/course')
      .send(validCourse)
      .expect(201)
      .expect({
        message: 'Course created successfully',
        data: validCourse,
      });
  });

  it('preserves an optional description', async () => {
    const dto = {
      ...validCourse,
      description: 'Course materials and exercises',
    };
    await request(app.getHttpServer())
      .post('/course')
      .send(dto)
      .expect(201)
      .expect({
        message: 'Course created successfully',
        data: dto,
      });
  });

  it('transforms numeric credits strings and trims required strings', async () => {
    await request(app.getHttpServer())
      .post('/course')
      .send({ ...validCourse, name: ' NestJS Fundamentals ', credits: '3' })
      .expect(201)
      .expect({ message: 'Course created successfully', data: validCourse });
  });

  it.each([1, 6, 2.5])(
    'accepts allowed numeric credits %s',
    async (credits) => {
      const dto = { ...validCourse, credits };
      await request(app.getHttpServer())
        .post('/course')
        .send(dto)
        .expect(201)
        .expect({ message: 'Course created successfully', data: dto });
    },
  );

  it('PUT /course/5 accepts a partial DTO as required by the assignment', async () => {
    const dto = { name: 'NestJS Advanced', code: 'CS201' };
    await request(app.getHttpServer())
      .put('/course/5')
      .send(dto)
      .expect(200)
      .expect({
        message: 'Course updated successfully',
        id: '5',
        data: dto,
      });
  });

  it('PATCH /course/5 lists exactly the provided fields', async () => {
    await request(app.getHttpServer())
      .patch('/course/5')
      .send({ name: 'NestJS Advanced', credits: '4' })
      .expect(200)
      .expect({
        message: 'Course patched successfully',
        id: '5',
        updatedFields: ['name', 'credits'],
      });
  });

  it('PATCH includes description when it is supplied', async () => {
    await request(app.getHttpServer())
      .patch('/course/5')
      .send({ description: 'Updated' })
      .expect(200)
      .expect({
        message: 'Course patched successfully',
        id: '5',
        updatedFields: ['description'],
      });
  });

  it.each(['put', 'patch'] as const)(
    '%s accepts an empty optional update',
    async (method) => {
      const response = await request(app.getHttpServer())
        [method]('/course/5')
        .send({})
        .expect(200);
      expect(response.body).toEqual(
        method === 'put'
          ? { message: 'Course updated successfully', id: '5', data: {} }
          : {
              message: 'Course patched successfully',
              id: '5',
              updatedFields: [],
            },
      );
    },
  );

  it('DELETE /course/5 returns its ID', async () => {
    await request(app.getHttpServer()).delete('/course/5').expect(200).expect({
      message: 'Course deleted successfully',
      id: '5',
    });
  });

  it.each([
    ['empty name', { name: '' }, 'name should not be empty'],
    ['blank name', { name: ' \t\n ' }, 'name should not be empty'],
    ['blank code', { code: '  ' }, 'code should not be empty'],
    [
      'blank instructor',
      { instructor: '  ' },
      'instructor should not be empty',
    ],
    [
      'credits above maximum',
      { credits: 10 },
      'credits must not be greater than 6',
    ],
    [
      'credits below minimum',
      { credits: 0 },
      'credits must not be less than 1',
    ],
    ['unknown field', { extra: true }, 'property extra should not exist'],
    ['non-string name', { name: 42 }, 'name must be a string'],
    ['non-string code', { code: [] }, 'code must be a string'],
    [
      'non-string instructor',
      { instructor: false },
      'instructor must be a string',
    ],
    [
      'non-string description',
      { description: {} },
      'description must be a string',
    ],
    ['nonnumeric credits', { credits: 'many' }, 'credits must be a number'],
    ['array credits', { credits: [3] }, 'credits must be a number'],
    ['null name', { name: null }, 'name should not be empty'],
  ])('rejects POST with %s', async (_label, overrides, expectedMessage) => {
    const response = await request(app.getHttpServer())
      .post('/course')
      .send({ ...validCourse, ...overrides })
      .expect(400);
    expect(response.body).toMatchObject({
      statusCode: 400,
      error: 'Bad Request',
    });
    expect((response.body as { message: string | string[] }).message).toEqual(
      expect.arrayContaining([expect.stringContaining(expectedMessage)]),
    );
  });

  it('lists every missing required field', async () => {
    const response = await request(app.getHttpServer())
      .post('/course')
      .send({})
      .expect(400);
    for (const field of ['name', 'code', 'instructor', 'credits']) {
      expect((response.body as { message: string | string[] }).message).toEqual(
        expect.arrayContaining([expect.stringContaining(field)]),
      );
    }
  });

  it.each(['put', 'patch'] as const)(
    'rejects invalid provided %s fields',
    async (method) => {
      const response = await request(app.getHttpServer())
        [method]('/course/5')
        .send({ name: ' ', credits: 10, unknown: true })
        .expect(400);
      expect((response.body as { message: string | string[] }).message).toEqual(
        expect.arrayContaining([
          'name should not be empty',
          'credits must not be greater than 6',
          'property unknown should not exist',
        ]),
      );
    },
  );

  it.each(['name', 'code', 'instructor', 'credits'])(
    'rejects explicitly null %s on updates',
    async (field) => {
      const response = await request(app.getHttpServer())
        .patch('/course/5')
        .send({ [field]: null })
        .expect(400);
      expect((response.body as { message: string | string[] }).message).toEqual(
        expect.arrayContaining([expect.stringContaining(field)]),
      );
    },
  );

  it.each(['pdf', 'jpg', 'jpeg', 'png', 'PDF'])(
    'stores an allowed .%s upload with matching response metadata',
    async (extension) => {
      const contents = Buffer.from(`upload fixture for .${extension}`);
      const response = await request(app.getHttpServer())
        .post('/course/5/upload')
        .attach('file', contents, `notes.${extension}`)
        .expect(201);
      const body = response.body as {
        message: string;
        courseId: string;
        filename: string;
        path: string;
      };
      createdFiles.push(body.filename);
      expect(body).toEqual({
        message: 'Material uploaded successfully',
        courseId: '5',
        filename: body.filename,
        path: `src/uploads/${body.filename}`,
      });
      expect(body.filename).toMatch(
        new RegExp(`^[0-9a-f-]{36}\\.${extension.toLowerCase()}$`),
      );
      expect(await readFile(join(uploadDirectory, body.filename))).toEqual(
        contents,
      );
      expect(await readFile(join(process.cwd(), body.path))).toEqual(contents);
    },
  );

  it('generates distinct filenames for identical client names', async () => {
    const names: string[] = [];
    for (let i = 0; i < 2; i++) {
      const response = await request(app.getHttpServer())
        .post('/course/5/upload')
        .attach('file', Buffer.from('same name'), 'notes.pdf')
        .expect(201);
      const { filename } = response.body as { filename: string };
      names.push(filename);
      createdFiles.push(filename);
    }
    expect(names[0]).not.toBe(names[1]);
  });

  it.each(['txt', 'exe'])(
    'rejects .%s without leaving a file',
    async (extension) => {
      const before = await uploadedNames();
      const response = await request(app.getHttpServer())
        .post('/course/5/upload')
        .attach('file', Buffer.from('not allowed'), `material.${extension}`)
        .expect(400);
      expect(
        (response.body as { message: string | string[] }).message,
      ).toContain('Only .jpg, .jpeg, .png and .pdf');
      expect(await uploadedNames()).toEqual(before);
    },
  );

  it('accepts a file exactly 2 MB', async () => {
    const contents = Buffer.alloc(2 * 1024 * 1024, 1);
    const response = await request(app.getHttpServer())
      .post('/course/5/upload')
      .attach('file', contents, 'boundary.pdf')
      .expect(201);
    const { filename } = response.body as { filename: string };
    createdFiles.push(filename);
    expect(await readFile(join(uploadDirectory, filename))).toEqual(contents);
  });

  it('returns 400 for a file one byte over 2 MB and removes partial output', async () => {
    const before = await uploadedNames();
    const response = await request(app.getHttpServer())
      .post('/course/5/upload')
      .attach('file', Buffer.alloc(2 * 1024 * 1024 + 1), 'large.pdf')
      .expect(400);
    expect(response.body).toEqual({
      statusCode: 400,
      error: 'Bad Request',
      message: 'File must be no larger than 2 MB',
    });
    expect(await uploadedNames()).toEqual(before);
  });

  it('rejects a missing upload', async () => {
    const before = await uploadedNames();
    const response = await request(app.getHttpServer())
      .post('/course/5/upload')
      .expect(400);
    expect((response.body as { message: string | string[] }).message).toBe(
      'A material file is required in the file field',
    );
    expect(await uploadedNames()).toEqual(before);
  });

  it('rejects an unexpected multipart file field', async () => {
    const before = await uploadedNames();
    const response = await request(app.getHttpServer())
      .post('/course/5/upload')
      .attach('material', Buffer.from('wrong field'), 'notes.pdf')
      .expect(400);
    expect((response.body as { message: string | string[] }).message).toBe(
      'Unexpected file field - material',
    );
    expect(await uploadedNames()).toEqual(before);
  });
});
