import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';

export type SupportedMimeType =
  | 'application/pdf'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  | 'text/plain'
  | 'text/markdown'
  | 'application/json'
  | 'text/csv'
  | 'text/xml'
  | 'application/xml';

export const TEXT_EXTRACTABLE_MIME_TYPES: SupportedMimeType[] = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/markdown',
  'application/json',
  'text/csv',
  'text/xml',
  'application/xml',
];

export function isTextExtractable(mimetype: string): mimetype is SupportedMimeType {
  return TEXT_EXTRACTABLE_MIME_TYPES.includes(mimetype as SupportedMimeType);
}

export async function extractTextFromBuffer(
  buffer: Buffer,
  mimetype: string,
): Promise<string> {
  switch (mimetype) {
    case 'application/pdf': {
      // pdf-parse v2.x uses class-based API with Uint8Array
      const parser = new PDFParse({ data: new Uint8Array(buffer) });
      const result = await parser.getText();
      await parser.destroy();
      return result.text;
    }
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }
    case 'text/plain':
    case 'text/markdown':
    case 'application/json':
    case 'text/csv':
    case 'text/xml':
    case 'application/xml': {
      return new TextDecoder().decode(buffer);
    }
    default: {
      // Fallback: try to decode as text for unknown types
      return new TextDecoder().decode(buffer);
    }
  }
}