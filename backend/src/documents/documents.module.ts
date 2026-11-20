import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { FileValidationPipe } from './guards/file-validation.pipe';
import configuration from '../config/configuration';

@Module({
  imports: [
    ConfigModule.forFeature(configuration),
  ],
  controllers: [DocumentsController],
  providers: [
    DocumentsService,
    FileValidationPipe,
  ],
  exports: [DocumentsService],
})
export class DocumentsModule {}