export type Modality = 'TEXT' | 'IMAGE';

export interface PromptTokensDetails {
  modality: Modality;
  tokenCount: number;
}

export interface UsageMetadata {
  promptTokenCount: number;
  candidatesTokenCount: number;
  totalTokenCount: number;
  promptTokensDetails: PromptTokensDetails[];
  thoughtsTokenCount: number;
}

export interface Part {
  text: string;
}

export interface Content {
  parts: Part[];
  role: string;
}

export interface Candidate {
  content: Content;
  finishReason: string;
  index: number;
}

export interface AIResponse {
  candidates: Candidate[];
  usageMetadata: UsageMetadata;
  modelVersion: string;
  responseId: string;
}