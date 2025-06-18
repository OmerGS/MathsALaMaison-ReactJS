import Category, { CategoryData } from './Category';

export const categoryData: Record<Category, CategoryData> = {
  [Category.Centre]: { name: 'Centre', imageUrl: '/icons/icon-512x512.png' },
  [Category.Espace]: { name: 'Espace', imageUrl: '/icons/icon-192x192.png' },
  [Category.Proportionnalite]: { name: 'Proportionnalité', imageUrl: '/icons/icon-512x512.png' },
  [Category.Communiquer]: { name: 'Communiquer', imageUrl: '/icons/icon-192x192.png' },
  [Category.Transformation]: { name: 'Transformation', imageUrl: '/icons/icon-512x512.png' },
  [Category.Geometrie]: { name: 'Géométrie', imageUrl: '/icons/category/geometrie.png' },
  [Category.CalculLitteral]: { name: 'Calcul Littéral', imageUrl: '/icons/category/calcul.png' },
  [Category.Informatique]: { name: 'Informatique', imageUrl: '/icons/category/info.png' },
  [Category.Nombres]: { name: 'Nombres', imageUrl: '/icons/category/nombre.png' },
  [Category.Calculs]: { name: 'Calculs', imageUrl: '/icons/category/calculs.png' },
  [Category.Logique]: { name: 'Logique', imageUrl: '/icons/category/logique.png' },
  [Category.StatOuProbas]: { name: 'StatOuProbas', imageUrl: '/icons/category/stat.png' },
  [Category.Fonctions]: { name: 'Fonctions', imageUrl: '/icons/category/fonction.png' },
};