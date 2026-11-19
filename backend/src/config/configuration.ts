import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    baseUrl: process.env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1',
  },
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB default
    allowedMimeTypes: [
      'application/pdf',
      'text/plain',
      'text/csv',
      'text/markdown',
      'application/json',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    allowedExtensions: ['.pdf', '.txt', '.csv', '.md', '.json', '.doc', '.docx'],
  },
  chat: {
    defaultModel: process.env.OPENAI_CHAT_MODEL || 'gpt-4o',
    maxTokens: parseInt(process.env.MAX_TOKENS || '4096', 10),
    temperature: parseFloat(process.env.TEMPERATURE || '0.7'),
  },
}));