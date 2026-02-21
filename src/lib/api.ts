const BASE = "https://www.themealdb.com/api/json/v1/1";

export interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export interface Category {
  strCategory: string;
}

export interface MealDetail {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strYoutube: string;
  strTags: string | null;
  strSource: string | null;
  [key: string]: string | null;
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE}/categories.php`);
  const data = await res.json();
  return data.categories.map((c: any) => ({ strCategory: c.strCategory }));
}

export async function fetchMealsByCategory(category: string): Promise<MealSummary[]> {
  const res = await fetch(`${BASE}/filter.php?c=${category}`);
  const data = await res.json();
  return data.meals || [];
}

export async function fetchAllMeals(): Promise<MealSummary[]> {
  // API doesn't have a "list all" - fetch from search by first letter
  const res = await fetch(`${BASE}/search.php?s=`);
  const data = await res.json();
  return data.meals || [];
}

export async function fetchMealById(id: string): Promise<MealDetail | null> {
  const res = await fetch(`${BASE}/lookup.php?i=${id}`);
  const data = await res.json();
  return data.meals?.[0] || null;
}

export function getIngredients(meal: MealDetail): { ingredient: string; measure: string }[] {
  const ingredients: { ingredient: string; measure: string }[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({ ingredient: ingredient.trim(), measure: measure?.trim() || "" });
    }
  }
  return ingredients;
}

export function getYoutubeEmbedUrl(url: string | null): string | null {
  if (!url) return null;
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}
