import React from "react";
import { Question } from "@/Type/Question";

type Props = {
  question: Question;
};

export default function QuestionCard({ question }: Props) {
  return (
    <div className="w-11/12 md:w-3/4 p-6 mb-4 border border-gray-200 rounded-xl bg-white shadow-sm transition-all hover:shadow-md">
      <div className="text-sm text-gray-600">ID : {question.id}</div>
      <div className="text-sm text-gray-600 mb-1">Type : {question.typeQuestion}</div>

      <p className="text-lg font-semibold mt-2">{question.question}</p>
      <p className="italic text-blue-800 mt-1 mb-1">Réponse : {question.reponse}</p>
      <p className="text-sm text-green-700 mb-3">Correction : {question.correction}</p>

      {question.image ? (
        <img
          src={question.image}
          alt={`Illustration de la question ${question.id}`}
          className="w-2/5 max-w-xs aspect-[4/3] rounded-lg bg-gray-100 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.png";
          }}
        />
      ) : (
        <p className="text-gray-400 text-sm">Pas d'image pour cette question</p>
      )}
    </div>
  );
}