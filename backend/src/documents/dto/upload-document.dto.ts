import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UploadDocumentDto {
  @ApiProperty({
    description: 'Optional custom name for the document',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiProperty({
    description: 'Optional purpose for the file (e.g., "assistants", "batch", "vision", "fine-tune")',
    required: false,
    enum: ['assistants', 'batch', 'vision', 'fine-tune'],
  })
  @IsOptional()
  @IsString()
  purpose?: 'assistants' | 'batch' | 'vision' | 'fine-tune' = 'assistants';
}