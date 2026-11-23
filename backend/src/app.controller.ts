import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import 'multer';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('chat/upload')
  @UseInterceptors(FileInterceptor('file'))
  async initializeChat(@UploadedFile() file: Express.Multer.File): Promise<any> {
    const { fileId, text } = await this.appService.uploadFileToOpenAI(file);

    try {
      const suggestedQuestions = await this.appService.generateSuggestedQuestions(fileId, file.originalname, text);

      return { fileId, suggestedQuestions };
    } catch (error) {
      console.error('Error generating suggested questions:', error);
      throw error;
    }
  }
}
