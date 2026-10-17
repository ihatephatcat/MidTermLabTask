import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { randomUUID } from 'node:crypto';
import { mkdir } from 'node:fs';
import { extname, join } from 'node:path';
import { diskStorage } from 'multer';

// Both src/course and dist/course resolve to the project's src/uploads folder.
export const uploadDirectory = join(__dirname, '..', '..', 'src', 'uploads');

export const courseUploadOptions: MulterOptions = {
  storage: diskStorage({
    destination: (_request, _file, callback) => {
      mkdir(uploadDirectory, { recursive: true }, (error) => {
        callback(error, uploadDirectory);
      });
    },
    filename: (_request, file, callback) => {
      callback(
        null,
        `${randomUUID()}${extname(file.originalname).toLowerCase()}`,
      );
    },
  }),
  fileFilter: (_request, file, callback) => {
    const extension = extname(file.originalname).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.pdf'].includes(extension)) {
      return callback(
        new BadRequestException(
          'Only .jpg, .jpeg, .png and .pdf files are allowed',
        ),
        false,
      );
    }
    callback(null, true);
  },
  limits: { fileSize: 2 * 1024 * 1024 },
};
