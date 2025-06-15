"use client";

import React from "react";
import { Question } from "@/Type/Question";
import { motion } from "framer-motion";

type QuestionOverviewProps = {
  question: Question;
  onClose: () => void;
};

export default function QuestionOverview({ question, onClose }: QuestionOverviewProps) {
  const getImageSrc = () => {
    if (!question.image) return null;
    if (typeof question.image === "string") return question.image;
    return `data:image/png;base64,${bufferToBase64(question.image)}`;
  };

  const imageSrc = getImageSrc();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="
        max-w-5xl mx-auto bg-white rounded-3xl p-6 md:p-10 shadow-lg 
        flex flex-col md:flex-row gap-8 md:gap-12
      "
    >
      {/* Texte + détails */}
      <div className="flex flex-col w-full md:w-2/3 gap-6">
        <button
          onClick={onClose}
          className="self-start text-indigo-600 font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
          aria-label="Retour à la liste des questions"
        >
          ← Retour
        </button>

        <h2
          className="
            text-3xl md:text-4xl font-extrabold mb-6 md:mb-8
            bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500
            bg-clip-text text-transparent select-text
          "
        >
          Question #{question.id}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-gray-800">
          <InfoItem label="Type de question" value={question.typeQuestion} />
          <InfoItem label="Question" value={question.question} />
          <InfoItem label="Type de réponse" value={question.typeReponse} />

          {/* Réponse */}
          {question.typeReponse === "QCM" ? (
            <div className="col-span-1 md:col-span-2">
              <p className="text-sm text-gray-500 mb-2">Réponse</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {question.reponse.split("|").map((rep, idx) => (
                  <div
                    key={idx}
                    className={`px-4 py-2 rounded-md font-semibold w-fit max-w-full
                      ${
                        idx === 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-700"
                      }
                    `}
                  >
                    {rep}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <InfoItem label="Réponse" value={question.reponse} />
          )}

          <InfoItem label="Correction" value={question.correction} />
        </div>
      </div>

      {/* Image */}
      {imageSrc && (
        <div className="md:w-1/3 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center max-h-[400px] mt-6 md:mt-0">
          <img
            src={imageSrc}
            alt={`Image associée à la question ${question.id}`}
            className="object-contain w-full h-full"
            loading="lazy"
          />
        </div>
      )}
    </motion.div>
  );
}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="break-words min-w-0">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-semibold break-words">{value}</p>
    </div>
  );
}

function bufferToBase64(buffer: Buffer | Uint8Array): string {
  if ("buffer" in buffer) {
    return buffer.toString("base64");
  } else {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}