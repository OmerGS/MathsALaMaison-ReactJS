export type User = {
  id: number;
  pseudo: string;
  email: string;
  password: string;
  salt: string;
  point: number;
  isPremium: boolean;
  nombrePartie: number;
  nombreVictoire: number;
  photoDeProfil: number;
};