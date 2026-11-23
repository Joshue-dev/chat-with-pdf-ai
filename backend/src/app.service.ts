import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import type { UploadedFile } from './config/types';

@Injectable()
export class AppService {
  private readonly client: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }
    this.client = new OpenAI({
      apiKey,
      baseURL: process.env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1',
    });
  }

  async uploadFileToOpenAI(file: UploadedFile): Promise<{ fileId: string; text: string }> {
    const fileBlob = new Blob([new Uint8Array(file.buffer)], { type: file.mimetype });
    const fileObj = new File([fileBlob], file.originalname, { type: file.mimetype });

    const response = await this.client.files.create({
      file: fileObj,
      purpose: 'user_data',
    });

    // Extract text locally since files.content() doesn't work with assistants/user_data purposes
    const text = new TextDecoder().decode(file.buffer);

    return { fileId: response.id, text };
  }

  async generateSuggestedQuestions(fileId: string, filename: string, text: string): Promise<Array<{id: string, question: string}>> {
    try {
      const response = await this.client.chat.completions.create({
        model: process.env.OPENAI_CHAT_MODEL || 'gpt-6.2-astra',
        messages: [
          {
            role: 'system',
            content: `Generate exactly 3 relevant questions a user might ask about a document. Return ONLY a JSON object with a "questions" array of 3 objects with "id" and "question" fields.`,
          },
          {
            role: 'user',
            content: `Generate 3 suggested questions for this document (filename: ${filename}):\n\n${text.slice(0, 8000)}`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const result = JSON.parse(response.choices[0].message.content || '{"questions": []}');
      return result.questions || [
        { id: '1', question: 'What is this document about?' },
        { id: '2', question: 'Can you summarize the key points?' },
        { id: '3', question: 'What are the main conclusions?' },
      ];
    } catch (error) {
      console.error('Failed to generate suggested questions:', error);
      throw new Error('Failed to generate suggested questions');
    }
  }
}
