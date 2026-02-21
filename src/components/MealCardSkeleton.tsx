const MealCardSkeleton = () => {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border/50 animate-pulse">
      <div className="aspect-square bg-muted" />
      <div className="p-4 flex flex-col items-center gap-2">
        <div className="h-5 w-3/4 bg-muted rounded" />
      </div>
    </div>
  );
};

export default MealCardSkeleton;
