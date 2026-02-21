import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchMealsByCategory, fetchAllMeals } from "@/lib/api";
import type { MealSummary } from "@/lib/api";
import Header from "@/components/Header";
import CategoryTabs from "@/components/CategoryTabs";
import MealCard from "@/components/MealCard";
import MealCardSkeleton from "@/components/MealCardSkeleton";
import { Search } from "lucide-react";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { data: meals = [], isLoading } = useQuery<MealSummary[]>({
    queryKey: ["meals", activeCategory],
    queryFn: () =>
      activeCategory === "All"
        ? fetchAllMeals()
        : fetchMealsByCategory(activeCategory),
  });

  const filteredMeals = meals.filter((m) =>
    m.strMeal.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero */}
        <div className="mb-10">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">
            Discover <span className="text-primary">Delicious</span> Recipes
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl">
            Explore meals from around the world. Pick a category or search for your favorite dish.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search meals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary text-secondary-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>

        {/* Category Tabs */}
        <div className="mb-8">
          <CategoryTabs
            categories={categories.map((c) => c.strCategory)}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
          />
        </div>

        {/* Meal Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <MealCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredMeals.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-xl">No meals found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {filteredMeals.map((meal, i) => (
              <MealCard key={meal.idMeal} meal={meal} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
