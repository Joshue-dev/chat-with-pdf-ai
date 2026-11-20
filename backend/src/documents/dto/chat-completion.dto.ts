import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, ValidateNested, IsInt, Min, Max, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum MessageRole {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant',
  TOOL = 'tool',
}

export class ChatMessageDto {
  @ApiProperty({
    description: 'Role of the message sender',
    enum: MessageRole,
  })
  @IsEnum(MessageRole)
  role: MessageRole;

  @ApiProperty({
    description: 'Content of the message',
    type: String,
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Optional name for the message sender',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;
}

export class ChatCompletionDto {
  @ApiProperty({
    description: 'Array of messages for the conversation',
    type: [ChatMessageDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  messages: ChatMessageDto[];

  @ApiProperty({
    description: 'OpenAI file IDs to attach as context (for file search/assistants)',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fileIds?: string[];

  @ApiProperty({
    description: 'Model to use for completion',
    required: false,
    default: 'gpt-4o',
  })
  @IsOptional()
  @IsString()
  model?: string = 'gpt-4o';

  @ApiProperty({
    description: 'Maximum tokens to generate',
    required: false,
    minimum: 1,
    maximum: 128000,
    default: 4096,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(128000)
  maxTokens?: number = 4096;

  @ApiProperty({
    description: 'Sampling temperature',
    required: false,
    minimum: 0,
    maximum: 2,
    default: 0.7,
  })
  @IsOptional()
  @Min(0)
  @Max(2)
  temperature?: number = 0.7;

  @ApiProperty({
    description: 'Nucleus sampling parameter',
    required: false,
    minimum: 0,
    maximum: 1,
  })
  @IsOptional()
  @Min(0)
  @Max(1)
  topP?: number;

  @ApiProperty({
    description: 'Whether to stream the response',
    required: false,
    default: false,
  })
  @IsOptional()
  stream?: boolean = false;
}