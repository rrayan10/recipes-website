import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchMealById, getIngredients } from "@/lib/api";
import Header from "@/components/Header";
import { ArrowLeft, Globe, Tag, AlertTriangle, Youtube, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const MealDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isValidId = !!id && /^\d+$/.test(id);

  const { data: meal, isLoading, isError } = useQuery({
    queryKey: ["meal", id],
    queryFn: () => fetchMealById(id!),
    enabled: isValidId,
    retry: false,
  });

  if (!isValidId || (!isLoading && !meal) || isError) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-5">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Meal Not Found
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            The meal ID "<span className="font-medium text-foreground">{id}</span>" doesn't exist or is invalid. Please check the URL and try again.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            Browse All Recipes
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-muted rounded" />
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted rounded-2xl" />
              <div className="space-y-4">
                <div className="h-10 w-3/4 bg-muted rounded" />
                <div className="h-6 w-1/2 bg-muted rounded" />
                <div className="h-40 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const ingredients = getIngredients(meal);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to recipes
        </Link>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              className="w-full rounded-2xl shadow-lg object-cover aspect-square"
            />
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-6"
          >
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                {meal.strMeal}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Tag className="w-3.5 h-3.5" />
                  {meal.strCategory}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                  <Globe className="w-3.5 h-3.5" />
                  {meal.strArea}
                </span>
                {meal.strTags && meal.strTags.split(",").map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                Ingredients
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ingredients.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-secondary/60"
                  >
                    <img
                      src={`https://www.themealdb.com/images/ingredients/${item.ingredient}-Small.png`}
                      alt={item.ingredient}
                      className="w-10 h-10 rounded-lg object-contain bg-card"
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.ingredient}</p>
                      <p className="text-xs text-muted-foreground">{item.measure}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-12"
        >
          <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
            Instructions
          </h2>
          <div className="bg-card rounded-2xl p-6 md:p-8 border border-border/50">
            {meal.strInstructions.split("\n").filter(Boolean).map((para, i) => (
              <p key={i} className="text-foreground/85 leading-relaxed mb-4 last:mb-0">
                {para}
              </p>
            ))}
          </div>
        </motion.div>

        {/* Links */}
        {(meal.strYoutube || meal.strSource) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            {meal.strYoutube && (
              <a
                href={meal.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-destructive text-destructive-foreground font-medium hover:opacity-90 transition-opacity"
              >
                <Youtube className="w-5 h-5" />
                Watch on YouTube
              </a>
            )}
            {meal.strSource && (
              <a
                href={meal.strSource}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors border border-border"
              >
                <ExternalLink className="w-4 h-4" />
                Recipe Source
              </a>
            )}
          </motion.div>
        )}

      </main>

      {/* Footer spacing */}
      <div className="h-16" />
    </div>
  );
};

export default MealDetails;
