import {
  Injectable,
  Logger,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ValidatedFile } from './guards/file-validation.pipe';
import { ChatCompletionDto, MessageRole } from './dto';
import {
  UploadResponseDto,
  ChatCompletionResponseDto,
  DocumentListResponseDto,
} from './dto/response.dto';

type FilePurpose = 'assistants' | 'batch' | 'vision' | 'fine-tune';

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);
  private readonly client: OpenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('app.openai.apiKey');
    const organization = this.configService.get<string>('app.openai.organization');
    const project = this.configService.get<string>('app.openai.project');
    const baseUrl = this.configService.get<string>('app.openai.baseUrl');

    if (!apiKey) {
      this.logger.error('OpenAI API key not configured');
      throw new InternalServerErrorException('OpenAI API key not configured');
    }

    this.client = new OpenAI({
      apiKey,
      organization,
      project,
      baseURL: baseUrl,
    });

    this.logger.log('OpenAI client initialized');
  }

  async uploadDocument(
    file: ValidatedFile,
    purpose: FilePurpose = 'assistants',
  ): Promise<UploadResponseDto> {
    try {
      this.logger.log(`Uploading document: ${file.originalname} (${file.size} bytes)`);

      // Convert Buffer to Uint8Array for File constructor
      const fileBlob = new Blob([new Uint8Array(file.buffer)], { type: file.mimetype });
      const fileObj = new File([fileBlob], file.originalname, { type: file.mimetype });

      const response = await this.client.files.create({
        file: fileObj,
        purpose,
      });

      this.logger.log(`Document uploaded successfully: ${response.id}`);

      return {
        id: response.id,
        object: response.object,
        bytes: response.bytes,
        createdAt: response.created_at,
        filename: response.filename,
        purpose: response.purpose,
        status: response.status,
        statusDetails: response.status_details,
      };
    } catch (error) {
      this.handleOpenAIError(error, 'upload document');
    }
  }

  async uploadMultipleDocuments(
    files: ValidatedFile[],
    purpose: FilePurpose = 'assistants',
  ): Promise<UploadResponseDto[]> {
    const results: UploadResponseDto[] = [];

    for (const file of files) {
      try {
        const result = await this.uploadDocument(file, purpose);
        results.push(result);
      } catch (error) {
        this.logger.error(`Failed to upload ${file.originalname}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw error;
      }
    }

    return results;
  }

  async listDocuments(purpose?: string, limit = 20, after?: string): Promise<DocumentListResponseDto> {
    try {
      this.logger.log('Listing documents');

      const response = await this.client.files.list({
        purpose: purpose as FilePurpose | undefined,
        limit,
        after,
      });

      return {
        data: response.data.map((file) => ({
          id: file.id,
          object: file.object,
          bytes: file.bytes,
          createdAt: file.created_at,
          filename: file.filename,
          purpose: file.purpose,
          status: file.status,
          statusDetails: file.status_details,
        })),
        object: 'list',
      };
    } catch (error) {
      this.handleOpenAIError(error, 'list documents');
    }
  }

  async getDocument(fileId: string): Promise<UploadResponseDto> {
    try {
      this.logger.log(`Retrieving document: ${fileId}`);

      const response = await this.client.files.retrieve(fileId);

      return {
        id: response.id,
        object: response.object,
        bytes: response.bytes,
        createdAt: response.created_at,
        filename: response.filename,
        purpose: response.purpose,
        status: response.status,
        statusDetails: response.status_details,
      };
    } catch (error) {
      if (error instanceof OpenAI.APIError && error.status === 404) {
        throw new NotFoundException(`Document with ID "${fileId}" not found`);
      }
      this.handleOpenAIError(error, 'retrieve document');
    }
  }

  async deleteDocument(fileId: string): Promise<{ id: string; deleted: boolean }> {
    try {
      this.logger.log(`Deleting document: ${fileId}`);

      const response = await this.client.files.delete(fileId);

      this.logger.log(`Document deleted: ${fileId}`);

      return {
        id: response.id,
        deleted: response.deleted,
      };
    } catch (error) {
      if (error instanceof OpenAI.APIError && error.status === 404) {
        throw new NotFoundException(`Document with ID "${fileId}" not found`);
      }
      this.handleOpenAIError(error, 'delete document');
    }
  }

  async downloadDocument(fileId: string): Promise<Buffer> {
    try {
      this.logger.log(`Downloading document: ${fileId}`);

      const response = await this.client.files.content(fileId);

      const buffer = Buffer.from(await response.arrayBuffer());

      this.logger.log(`Document downloaded: ${fileId} (${buffer.length} bytes)`);

      return buffer;
    } catch (error) {
      if (error instanceof OpenAI.APIError && error.status === 404) {
        throw new NotFoundException(`Document with ID "${fileId}" not found`);
      }
      this.handleOpenAIError(error, 'download document');
    }
  }

  async createChatCompletion(dto: ChatCompletionDto): Promise<ChatCompletionResponseDto> {
    try {
      this.logger.log(`Creating chat completion with model: ${dto.model}`);

      // Map our DTO messages to OpenAI's expected format
      const messages = dto.messages.map((msg) => ({
        role: msg.role as 'system' | 'user' | 'assistant' | 'tool',
        content: msg.content,
        ...(msg.name && { name: msg.name }),
      }));

      // Use non-streaming response by explicitly setting stream: false
      const response = await this.client.chat.completions.create({
        model: dto.model || this.configService.get<string>('app.chat.defaultModel', 'gpt-4o'),
        messages: messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
        max_tokens: dto.maxTokens ?? this.configService.get<number>('app.chat.maxTokens', 4096),
        temperature: dto.temperature ?? this.configService.get<number>('app.chat.temperature', 0.7),
        top_p: dto.topP,
        stream: false, // Explicitly request non-streaming response
      }) as OpenAI.Chat.Completions.ChatCompletion;

      const choice = response.choices[0];

      if (!choice.message.content) {
        throw new InternalServerErrorException('Empty response from OpenAI');
      }

      this.logger.log(`Chat completion created: ${response.id}`);

      return {
        id: response.id,
        object: response.object,
        created: response.created,
        model: response.model,
        content: choice.message.content,
        role: choice.message.role,
        finishReason: choice.finish_reason,
        usage: response.usage
          ? {
              promptTokens: response.usage.prompt_tokens,
              completionTokens: response.usage.completion_tokens,
              totalTokens: response.usage.total_tokens,
            }
          : undefined,
      };
    } catch (error) {
      this.handleOpenAIError(error, 'create chat completion');
    }
  }

  async createChatCompletionWithFiles(
    dto: ChatCompletionDto,
  ): Promise<ChatCompletionResponseDto> {
    // This method would integrate with OpenAI's Assistants API or file search
    // For now, it delegates to the standard chat completion
    // In a full implementation, you would:
    // 1. Create an Assistant with file_search tool
    // 2. Upload files to the Assistant
    // 3. Create a Thread and add messages
    // 4. Run the Assistant and get the response
    return this.createChatCompletion(dto);
  }

  private handleOpenAIError(error: unknown, operation: string): never {
    this.logger.error(`OpenAI error during ${operation}:`, error);

    if (error instanceof OpenAI.APIError) {
      switch (error.status) {
        case 400:
          throw new BadRequestException(`Invalid request: ${error.message}`);
        case 401:
          throw new BadRequestException('Invalid OpenAI API key');
        case 403:
          throw new BadRequestException('OpenAI API access forbidden');
        case 404:
          throw new NotFoundException(`Resource not found: ${error.message}`);
        case 429:
          throw new BadRequestException('Rate limit exceeded. Please try again later.');
        case 500:
        case 502:
        case 503:
          throw new InternalServerErrorException('OpenAI service temporarily unavailable');
        default:
          throw new InternalServerErrorException(`OpenAI API error: ${error.message}`);
      }
    }

    if (error instanceof Error) {
      throw new InternalServerErrorException(`Failed to ${operation}: ${error.message}`);
    }

    throw new InternalServerErrorException(`Unknown error during ${operation}`);
  }
}