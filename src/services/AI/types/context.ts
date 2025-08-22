export interface UserPart {
  inline_data?: {
    mime_type: string;
    data: string;
  };
  text?: string;
}

export interface UserContext {
  role: 'user';
  parts: UserPart[];
}

export interface SystemContext {
  parts: { text: string }[];
}