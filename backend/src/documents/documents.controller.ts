import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { FileValidationPipe } from './guards/file-validation.pipe';
import type { ValidatedFile } from './guards/file-validation.pipe';
import { UploadDocumentDto, ChatCompletionDto } from './dto';
import {
  UploadResponseDto,
  ChatCompletionResponseDto,
  DocumentListResponseDto,
  ErrorResponseDto,
} from './dto/response.dto';

@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  private readonly logger = new Logger(DocumentsController.name);

  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a document to OpenAI' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Document file and optional metadata',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        name: {
          type: 'string',
          maxLength: 255,
        },
        purpose: {
          type: 'string',
          enum: ['assistants', 'batch', 'vision', 'fine-tune'],
          default: 'assistants',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Document uploaded successfully',
    type: UploadResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid file or request',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
    type: ErrorResponseDto,
  })
  async uploadDocument(
    @UploadedFile(FileValidationPipe) file: ValidatedFile,
    @Body() dto: UploadDocumentDto,
  ): Promise<UploadResponseDto> {
    this.logger.log(`Upload request: ${file.originalname}`);
    return this.documentsService.uploadDocument(file, dto.purpose);
  }

  @Post('upload/multiple')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 10 }]))
  @ApiOperation({ summary: 'Upload multiple documents to OpenAI' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Multiple document files and optional metadata',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
        purpose: {
          type: 'string',
          enum: ['assistants', 'batch', 'vision', 'fine-tune'],
          default: 'assistants',
        },
      },
      required: ['files'],
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Documents uploaded successfully',
    type: [UploadResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid files or request',
    type: ErrorResponseDto,
  })
  async uploadMultipleDocuments(
    @UploadedFiles(FileValidationPipe) files: { files: ValidatedFile[] },
    @Body('purpose') purpose: 'assistants' | 'batch' | 'vision' | 'fine-tune' = 'assistants',
  ): Promise<UploadResponseDto[]> {
    this.logger.log(`Multiple upload request: ${files.files.length} files`);
    return this.documentsService.uploadMultipleDocuments(files.files, purpose);
  }

  @Get()
  @ApiOperation({ summary: 'List uploaded documents' })
  @ApiQuery({ name: 'purpose', required: false, enum: ['assistants', 'batch', 'vision', 'fine-tune'] })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 20 })
  @ApiQuery({ name: 'after', required: false, type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of documents',
    type: DocumentListResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
    type: ErrorResponseDto,
  })
  async listDocuments(
    @Param('purpose') purpose?: string,
    @Param('limit') limit = 20,
    @Param('after') after?: string,
  ): Promise<DocumentListResponseDto> {
    this.logger.log('List documents request');
    return this.documentsService.listDocuments(purpose, limit, after);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document details by ID' })
  @ApiParam({ name: 'id', description: 'OpenAI file ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Document details',
    type: UploadResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Document not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
    type: ErrorResponseDto,
  })
  async getDocument(@Param('id') id: string): Promise<UploadResponseDto> {
    this.logger.log(`Get document request: ${id}`);
    return this.documentsService.getDocument(id);
  }

  @Get(':id/content')
  @ApiOperation({ summary: 'Download document content' })
  @ApiParam({ name: 'id', description: 'OpenAI file ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Document content',
    content: { 'application/octet-stream': {} },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Document not found',
    type: ErrorResponseDto,
  })
  async downloadDocument(@Param('id') id: string) {
    this.logger.log(`Download document request: ${id}`);
    const buffer = await this.documentsService.downloadDocument(id);
    return buffer;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a document' })
  @ApiParam({ name: 'id', description: 'OpenAI file ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Document deleted successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        deleted: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Document not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
    type: ErrorResponseDto,
  })
  async deleteDocument(@Param('id') id: string) {
    this.logger.log(`Delete document request: ${id}`);
    return this.documentsService.deleteDocument(id);
  }

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a chat completion with optional file context' })
  @ApiBody({ type: ChatCompletionDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Chat completion created successfully',
    type: ChatCompletionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
    type: ErrorResponseDto,
  })
  async createChatCompletion(@Body() dto: ChatCompletionDto): Promise<ChatCompletionResponseDto> {
    this.logger.log(`Chat completion request: ${dto.messages.length} messages, model: ${dto.model}`);
    return this.documentsService.createChatCompletion(dto);
  }

  @Post('chat/with-files')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a chat completion with file context (Assistants API)' })
  @ApiBody({ type: ChatCompletionDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Chat completion with files created successfully',
    type: ChatCompletionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
    type: ErrorResponseDto,
  })
  async createChatCompletionWithFiles(@Body() dto: ChatCompletionDto): Promise<ChatCompletionResponseDto> {
    this.logger.log(`Chat completion with files request: ${dto.messages.length} messages, files: ${dto.fileIds?.length || 0}`);
    return this.documentsService.createChatCompletionWithFiles(dto);
  }
}