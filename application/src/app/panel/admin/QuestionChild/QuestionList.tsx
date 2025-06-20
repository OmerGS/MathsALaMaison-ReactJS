import React, { useState, useEffect } from "react";
import { Question } from "@/Type/Question";
import { getAllQuestion } from "@/services/adminAPI";
import QuestionOverview from "./QuestionOverview";
import Loading from "@/components/ui/global/Loading";

const QUESTIONS_PER_PAGE = 10;

export default function QuestionsList() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [limit, setLimit] = useState(QUESTIONS_PER_PAGE);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const data = await getAllQuestion(page);
        setQuestions(data.questions);
        setTotalQuestions(data.total);
        setLimit(data.limit || QUESTIONS_PER_PAGE);
      } catch (error) {
        console.error("Erreur lors de la récupération des questions :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [page]);

  const totalPages = Math.ceil(totalQuestions / limit);

  const handleCloseDetail = () => setSelectedQuestion(null);

  if (selectedQuestion) {
    return (
      <QuestionOverview question={selectedQuestion} onClose={handleCloseDetail} />
    );
  }

  return (
    <div className="px-4 py-6 bg-gradient-to-b from-white to-blue-50 min-h-screen">
      {loading ? (
        <div className="flex items-center justify-center"><Loading /> </div>
      ) : questions.length === 0 ? (
        <p className="text-center text-gray-500">Aucune question trouvée.</p>
      ) : (
        <>
          {/* VERSION DESKTOP */}
          <div className="hidden md:block rounded-2xl overflow-hidden shadow-xl bg-white/50 backdrop-blur-md">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-white/70 text-gray-800 font-semibold">
                <tr>
                  <th className="border-b border-gray-300 px-6 py-4 text-left">ID</th>
                  <th className="border-b border-gray-300 px-6 py-4 text-left">Type</th>
                  <th className="border-b border-gray-300 px-6 py-4 text-left">Question</th>
                  <th className="border-b border-gray-300 px-6 py-4 text-left">Type Réponse</th>
                  <th className="border-b border-gray-300 px-6 py-4 text-left">Image</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr
                    key={q.id}
                    className="hover:bg-blue-100/70 transition cursor-pointer"
                    onClick={() => setSelectedQuestion(q)}
                  >
                    <td className="px-6 py-4 border-b border-gray-200">{q.id}</td>
                    <td className="px-6 py-4 border-b border-gray-200">{q.typeQuestion}</td>
                    <td className="px-6 py-4 border-b border-gray-200 break-words">{q.question}</td>
                    <td className="px-6 py-4 border-b border-gray-200">{q.typeReponse}</td>
                    <td className="px-6 py-4 border-b border-gray-200">
                      {q.image ? (
                        <span className="text-green-600 font-medium">Oui</span>
                      ) : (
                        <span className="text-gray-400 italic">Non</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* VERSION MOBILE */}
          <div className="md:hidden space-y-4 mt-4">
            {questions.map((q) => (
              <div
                key={q.id}
                onClick={() => setSelectedQuestion(q)}
                className="bg-white/60 p-4 rounded-xl shadow-md backdrop-blur-sm hover:bg-white/80 transition cursor-pointer"
              >
                <div className="text-sm text-gray-500">ID: {q.id}</div>
                <div className="font-semibold text-blue-900">{q.typeQuestion}</div>
                <div className="text-gray-800 break-words">{q.question}</div>
                <div className="mt-2 text-sm font-medium text-gray-600">
                  Type de réponse : {q.typeReponse}
                </div>
                <div className="mt-2">
                  {q.image ? (
                    <img
                      src={q.image}
                      alt={`Image de la question ${q.id}`}
                      className="w-full h-40 object-cover rounded-lg shadow-md"
                    />
                  ) : (
                    <div className="text-sm text-gray-400 italic">Aucune image</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="mt-8 flex flex-wrap justify-center items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className={`px-3 py-1 rounded-full bg-white/70 border font-medium text-gray-700 hover:bg-white ${
                page === 1 ? "opacity-40 cursor-not-allowed" : ""
              }`}
            >
              ⬅
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => Math.abs(p - page) <= 2 || p === 1 || p === totalPages)
            .reduce((acc: (number | "...")[], p, i, arr) => {
              if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
              acc.push(p);
              return acc;
            }, [])
            .map((p, idx) =>
              p === "..." ? (
                <span key={`dots-${idx}`} className="px-2 text-gray-400">...</span>
              ) : (
                <button
                  key={`page-${p}-${idx}`}
                  onClick={() => setPage(p as number)}
                  className={`px-3 py-1 rounded-full font-medium ${
                    p === page
                      ? "bg-blue-600 text-white"
                      : "bg-white/70 border text-gray-700 hover:bg-white"
                  }`}
                >
                  {p}
                </button>
              )
            )}

            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded-full bg-white/70 border font-medium text-gray-700 hover:bg-white ${
                page === totalPages ? "opacity-40 cursor-not-allowed" : ""
              }`}
            >
              ➡
            </button>
          </div>
        </>
      )}
    </div>
  );
}