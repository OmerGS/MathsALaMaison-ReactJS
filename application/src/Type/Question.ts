export interface Question {
  id: number;
  typeQuestion: string;
  question: string;
  typeReponse: string;
  reponse: string;
  correction: string;
  image?: string | null;
}
