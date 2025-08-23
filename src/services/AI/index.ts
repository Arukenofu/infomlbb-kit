import { ofetch } from 'ofetch';
import { AIResponse } from './types/response';
import { SystemContext, UserContext, UserPart, } from './types/context';
import { getMimeTypeFromDataURI } from '../../shared/helpers/base64';

interface AIServiceOptions {
  scenario?: string;
}

export class AIService {
  constructor(
    private readonly API_KEY: string | undefined,
    private readonly options: AIServiceOptions = {}
  ) {}

  private buildUserContext(base64Images: string[], text?: string): UserContext {
    const parts: UserPart[] = base64Images.map((imageBase64) => {
      const mimeType = getMimeTypeFromDataURI(imageBase64);
      if (!mimeType) throw new Error('Invalid image format');

      return {
        inline_data: {
          mime_type: mimeType,
          data: imageBase64.split(',')[1],
        },
      };
    });

    if (text) {
      parts.push({ text });
    }

    return { role: 'user', parts };
  }

  private buildSystemContext(): SystemContext | null {
    const scenario = this.options.scenario;

    if (!scenario) return null;

    return {
      parts: [
        {
          text: scenario,
        },
      ],
    };
  }

  async makeRequest(userContext: UserContext) {
    const body = {
      contents: [userContext],
      system_instruction: this.buildSystemContext(),
    };

    return ofetch<AIResponse>(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': this.API_KEY!,
        },
        body,
      }
    );
  }

  readResponse(response: AIResponse) {
    return response.candidates[0].content.parts[0].text;
  }

  /** Отправить только текст */
  async sendText(text: string) {
    return this.makeRequest(this.buildUserContext([], text));
  }

  /** Отправить одно изображение (и опционально подпись) */
  async sendImage(base64Image: string, text?: string) {
    return this.makeRequest(this.buildUserContext([base64Image], text));
  }

  /** Отправить несколько изображений (и опционально подпись) */
  async sendImages(base64Images: string[], text?: string) {
    return this.makeRequest(this.buildUserContext(base64Images, text));
  }
}

export const ai = new AIService(process.env.AI_SERVICE_KEY as string);