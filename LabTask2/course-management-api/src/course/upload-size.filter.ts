import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  PayloadTooLargeException,
} from '@nestjs/common';
import type { Response } from 'express';

// Nest maps Multer's size limit to 413; this lab explicitly requires 400.
@Catch(PayloadTooLargeException)
export class UploadSizeFilter implements ExceptionFilter {
  catch(_exception: PayloadTooLargeException, host: ArgumentsHost) {
    const error = new BadRequestException('File must be no larger than 2 MB');
    host
      .switchToHttp()
      .getResponse<Response>()
      .status(400)
      .json(error.getResponse());
  }
}
