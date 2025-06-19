const enum Category{
    Centre = -1,
    Espace = 0,
    Proportionnalite = 1,
    Communiquer = 2,
    Transformation = 3,
    Geometrie = 4,
    CalculLitteral = 5,
    Informatique = 6,
    Nombres  = 7,
    Calculs = 8,
    Logique = 9,
    StatOuProbas = 10,
    Fonctions = 11,
}
export default Category;

export interface CategoryData {
  name: string;
  imageUrl: string;
}