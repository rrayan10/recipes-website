import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { MealSummary } from "@/lib/api";

interface MealCardProps {
  meal: MealSummary;
  index: number;
}

const MealCard = ({ meal, index }: MealCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
    >
      <Link to={`/meal/${meal.idMeal}`} className="block group">
        <div className="bg-card rounded-2xl overflow-hidden card-hover border border-border/50">
          <div className="relative overflow-hidden aspect-square">
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="p-4 text-center">
            <h3 className="font-display text-lg font-semibold text-card-foreground leading-tight line-clamp-2">
              {meal.strMeal}
            </h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MealCard;
