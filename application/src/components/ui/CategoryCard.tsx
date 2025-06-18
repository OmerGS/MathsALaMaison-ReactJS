import React from "react";

interface CategoryCardProps {
  name: string;
  imageUrl: string;
  isSelected: boolean;
  onClick: () => void;
  large?: boolean;
}

export default function CategoryCard({
  name,
  imageUrl,
  isSelected,
  onClick,
  large = false,
}: CategoryCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        relative
        cursor-pointer
        rounded-xl
        p-4
        shadow-md
        bg-gradient-div
        transition-transform
        duration-300
        flex flex-col items-center
        ${isSelected ? "scale-105 ring-4 ring-blue-500" : "hover:scale-105 hover:shadow-lg"}
        max-w-full
      `}
      style={{ width: large ? "100%" : 180 }}
    >
      {/* Nom au-dessus de l'image */}
      <span
        className={`mb-4 text-game font-semibold text-center select-none
          ${large ? "text-2xl" : "text-base"}
        `}
      >
        {name}
      </span>

      {/* Image affichée entièrement */}
      <div
        className="w-full rounded-lg overflow-hidden bg-gray-100 flex justify-center items-center"
        style={{ aspectRatio: "4 / 3", maxHeight: large ? 380 : 160 }}
      >
        <img
          src={imageUrl}
          alt={name}
          className="object-contain w-full h-full select-none"
          loading="lazy"
          draggable={false}
        />
      </div>
    </div>
  );
}
