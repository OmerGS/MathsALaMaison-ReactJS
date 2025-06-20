import React from "react";
import CategoryCard from "./CategoryCard";
import { CategoryData } from "@/Type/Category";

interface CategoryStartProps {
  category: CategoryData;
  onStartQuestion: () => void;
}

export default function CategoryStart({ category, onStartQuestion }: CategoryStartProps) {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md">
      <CategoryCard
        name={category.name}
        imageUrl={category.imageUrl}
        isSelected={true}
        onClick={() => {}}
        large={true}
      />
      <button
        className="btn btn-primary w-full"
        onClick={onStartQuestion}
        type="button"
      >
        Commencer la question
      </button>
    </div>
  );
}
