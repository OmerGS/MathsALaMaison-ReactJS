export interface ValidatePayload {
  code: string;
}

export interface AskPayload {
  password: string;
  newValue: string;
}

export type UpdateType = 'mail' | 'pseudo';
export type UpdateStep = 'ask' | 'validate';