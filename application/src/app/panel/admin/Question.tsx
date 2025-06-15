import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import QuestionList from "./QuestionChild/QuestionList";
import AddQuestionForm from "./QuestionChild/AddQuestion";

export default function Question() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showForm, setShowForm] = useState(false);

  
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddQuestion = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <div className="mx-auto p-6 relative min-h-screen">
      <div className="flex justify-end mb-6">
        <button
          onClick={handleAddQuestion}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-md transition"
          aria-label="Ajouter une nouvelle question"
        >
          + Ajouter une question
        </button>
      </div>

      {showForm ? (
        <AddQuestionForm onClose={handleCloseForm} />
      ) : (
        <QuestionList />
      )}

      <motion.button
        onClick={scrollToTop}
        aria-label="Retour en haut de la page"
        type="button"
        style={{ willChange: "opacity, transform" }}
        animate={{
          opacity: showScrollTop ? 1 : 0,
          y: showScrollTop ? 0 : 8,
        }}
        transition={{
          duration: 0.4,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={`
          fixed bottom-6 right-6 z-[1001]
          flex items-center justify-center
          rounded-full
          bg-white/40 backdrop-blur-md
          shadow-lg shadow-black/20
          w-14 h-14
          cursor-pointer
          select-none
          transition
          duration-300
          ease-in-out
          hover:bg-white/60
          hover:shadow-blue-400/50
          active:scale-90
          focus:outline-none focus:ring-4 focus:ring-blue-300
          ${showScrollTop ? "pointer-events-auto" : "pointer-events-none"}
        `}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6 text-blue-700"
          viewBox="0 0 24 24"
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </motion.button>
    </div>
  );
}
