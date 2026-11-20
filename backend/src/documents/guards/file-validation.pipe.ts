import {
  Injectable,
  PipeTransform,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface MulterFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

export interface ValidatedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

@Injectable()
export class FileValidationPipe implements PipeTransform<MulterFile, ValidatedFile> {
  private readonly logger = new Logger(FileValidationPipe.name);

  constructor(private readonly configService: ConfigService) {}

  transform(file: MulterFile): ValidatedFile {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    this.validateFileSize(file);
    this.validateMimeType(file);
    this.validateExtension(file);

    this.logger.log(`File validated: ${file.originalname} (${file.size} bytes, ${file.mimetype})`);

    return {
      buffer: file.buffer,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };
  }

  private validateFileSize(file: MulterFile): void {
    const maxSize = this.configService.get<number>('app.upload.maxFileSize', 10485760);

    if (file.size > maxSize) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${this.formatBytes(maxSize)}. ` +
        `Received: ${this.formatBytes(file.size)}`,
      );
    }

    if (file.size === 0) {
      throw new BadRequestException('File is empty');
    }
  }

  private validateMimeType(file: MulterFile): void {
    const allowedMimeTypes = this.configService.get<string[]>('app.upload.allowedMimeTypes', [
      'application/pdf',
      'text/plain',
      'text/csv',
      'text/markdown',
      'application/json',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]);

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type "${file.mimetype}" is not allowed. ` +
        `Allowed types: ${allowedMimeTypes.join(', ')}`,
      );
    }
  }

  private validateExtension(file: MulterFile): void {
    const allowedExtensions = this.configService.get<string[]>('app.upload.allowedExtensions', [
      '.pdf', '.txt', '.csv', '.md', '.json', '.doc', '.docx',
    ]);

    const ext = this.getExtension(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      throw new BadRequestException(
        `File extension "${ext}" is not allowed. ` +
        `Allowed extensions: ${allowedExtensions.join(', ')}`,
      );
    }
  }

  private getExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.');
    if (lastDot === -1) return '';
    return filename.substring(lastDot);
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}