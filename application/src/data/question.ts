// data/questions.ts
export type Category = "Histoire" | "Géographie" | "Sport" | "Musique" | "Cinéma" | 'Littérature'| 'Science'| 'Art'|
  'Technologie' | 'Animaux'| 'Nature'| 'Cuisine'

interface Question {
  question: string;
  options: string[];
  answer: string;
}

export const questionsByCategory: Record<Category, Question[]> = {
  Histoire: [
    {
      question: "En quelle année a eu lieu la Révolution française ?",
      options: ["1789", "1815"],
      answer: "1789",
    },
  ],
  Géographie: [
    {
      question: "Quel est le plus grand désert du monde ?",
      options: ["Sahara", "Antarctique"],
      answer: "Antarctique",
    },
  ],
  Sport: [
    {
      question: "Combien de joueurs dans une équipe de football ?",
      options: ["11", "7"],
      answer: "11",
    },
  ],
  Musique: [
    {
      question: "Qui a chanté 'Thriller' ?",
      options: ["Michael Jackson", "Elvis Presley"],
      answer: "Michael Jackson",
    },
  ],
  Cinéma: [
    {
      question: "Qui a réalisé 'Inception' ?",
      options: ["Christopher Nolan", "Steven Spielberg"],
      answer: "Christopher Nolan",
    },
  ],
  Littérature: [],
  Science: [],
  Art: [],
  Technologie: [],
  Animaux: [],
  Nature: [],
  Cuisine: []
};
