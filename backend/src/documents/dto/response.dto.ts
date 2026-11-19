import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty({ description: 'OpenAI file ID' })
  id: string;

  @ApiProperty({ description: 'Object type' })
  object: string;

  @ApiProperty({ description: 'File size in bytes' })
  bytes: number;

  @ApiProperty({ description: 'Unix timestamp of creation' })
  createdAt: number;

  @ApiProperty({ description: 'File name' })
  filename: string;

  @ApiProperty({ description: 'Purpose of the file' })
  purpose: string;

  @ApiProperty({ description: 'File status' })
  status: string;

  @ApiProperty({ description: 'Status details', required: false })
  statusDetails?: string;
}

export class ChatCompletionResponseDto {
  @ApiProperty({ description: 'Completion ID' })
  id: string;

  @ApiProperty({ description: 'Object type' })
  object: string;

  @ApiProperty({ description: 'Unix timestamp of creation' })
  created: number;

  @ApiProperty({ description: 'Model used' })
  model: string;

  @ApiProperty({ description: 'Generated message content' })
  content: string;

  @ApiProperty({ description: 'Role of the generated message' })
  role: string;

  @ApiProperty({ description: 'Finish reason' })
  finishReason: string;

  @ApiProperty({ description: 'Token usage statistics', required: false })
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export class ErrorResponseDto {
  @ApiProperty({ description: 'Error code' })
  code: string;

  @ApiProperty({ description: 'Error message' })
  message: string;

  @ApiProperty({ description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ description: 'Additional error details', required: false })
  details?: Record<string, unknown>;
}

export class DocumentListResponseDto {
  @ApiProperty({ description: 'List of documents', type: [UploadResponseDto] })
  data: UploadResponseDto[];

  @ApiProperty({ description: 'Object type' })
  object: string;

  @ApiProperty({ description: 'First ID for pagination', required: false })
  firstId?: string;

  @ApiProperty({ description: 'Last ID for pagination', required: false })
  lastId?: string;

  @ApiProperty({ description: 'Whether there are more results', required: false })
  hasMore?: boolean;
}