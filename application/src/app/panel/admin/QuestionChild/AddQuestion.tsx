import { addNewQuestion } from "@/services/adminAPI";
import React, { useState, ChangeEvent, FormEvent } from "react";

type QuestionType = "QCM" | "VF";

interface QcmAnswer {
  text: string;
  isCorrect: boolean;
}

type AddQuestionFormProps = {
  onClose: () => void;
};

export default function AddQuestionForm({ onClose }: AddQuestionFormProps) {
  const [typeQuestion, setTypeQuestion] = useState<QuestionType>("QCM");
  const [questionText, setQuestionText] = useState("");
  const [qcmAnswers, setQcmAnswers] = useState<QcmAnswer[]>([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);
  const [vfAnswer, setVfAnswer] = useState<"V" | "F">("V");
  const [correction, setCorrection] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const onChangeTypeQuestion = (e: ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as QuestionType;
    setTypeQuestion(val);
    setQuestionText("");
    setCorrection("");
    setImageFile(null);
    setImagePreview(null);
    if (val === "QCM") {
      setQcmAnswers([
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ]);
    } else {
      setVfAnswer("V");
    }
  };

  const addQcmAnswer = () => {
    if (qcmAnswers.length < 5) {
      setQcmAnswers([...qcmAnswers, { text: "", isCorrect: false }]);
    }
  };

  const removeQcmAnswer = (index: number) => {
    if (qcmAnswers.length > 3) {
      setQcmAnswers(qcmAnswers.filter((_, i) => i !== index));
    }
  };

  const updateQcmAnswer = (
    index: number,
    field: "text" | "isCorrect",
    value: string | boolean
  ) => {
    const newAnswers = [...qcmAnswers];
    if (field === "text") newAnswers[index].text = value as string;
    else if (field === "isCorrect") {
      newAnswers.forEach((a, i) => {
        newAnswers[i].isCorrect = i === index ? (value as boolean) : false;
      });
    }
    setQcmAnswers(newAnswers);
  };

  const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const buildReponseString = () => {
    if (typeQuestion === "QCM") {
      const sortedAnswers = [
        ...qcmAnswers.filter((a) => a.isCorrect),
        ...qcmAnswers.filter((a) => !a.isCorrect),
      ];
      return sortedAnswers.map((a) => a.text).join("|");
    } else {
      return vfAnswer;
    }
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!questionText.trim()) {
      alert("Merci de saisir la question.");
      return;
    }
    if (typeQuestion === "QCM") {
      if (
        qcmAnswers.some((a) => !a.text.trim()) ||
        !qcmAnswers.some((a) => a.isCorrect)
      ) {
        alert(
          "Merci de remplir toutes les réponses et de sélectionner la bonne réponse."
        );
        return;
      }
    }

    const dataToSend = {
      typeQuestion,
      question: questionText,
      typeReponse: typeQuestion,
      reponse: buildReponseString(),
      correction,
      image_data: imagePreview,
    };

    try {
      await addNewQuestion(dataToSend);
      alert("Question ajoutée avec succès !");
      onClose();
    } catch (err) {
      console.error("Erreur lors de l'ajout de la question :", err);
      alert("Une erreur est survenue lors de l'ajout de la question.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg
                 flex flex-col gap-6
                 sm:p-8"
    >

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Ajouter une question</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Annuler"
            title="Annuler"
            className="
              group
              px-3 py-1.5
              rounded-md
              border border-red-500
              text-red-500
              hover:bg-red-100
              hover:text-white
              active:bg-red-200
              focus:outline-none
              focus:ring-2 focus:ring-red-400
              focus:ring-offset-1
              transition
              duration-150
              ease-in-out
              cursor-pointer
              shadow-sm
              flex items-center justify-center
              select-none
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Annuler
          </button>
        </div>


      <div className="flex flex-col gap-2">
        <label className="font-semibold text-gray-700">Type de question</label>
        <select
          value={typeQuestion}
          onChange={onChangeTypeQuestion}
          className="w-full border border-gray-300 rounded px-3 py-2
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="QCM">QCM</option>
          <option value="VF">Vrai / Faux</option>
        </select>
      </div>

      {/* Question */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-gray-700">Question</label>
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 resize-none
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={3}
          placeholder="Tapez la question ici"
          required
        />
      </div>

      {/* Réponses QCM */}
      {typeQuestion === "QCM" && (
        <div className="flex flex-col gap-3">
          <label className="font-semibold text-gray-700">Réponses (choisir la bonne)</label>
          {qcmAnswers.map((answer, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="radio"
                name="correctAnswer"
                checked={answer.isCorrect}
                onChange={() => updateQcmAnswer(idx, "isCorrect", true)}
                className="w-4 h-4"
                aria-label={`Marquer la réponse ${idx + 1} comme correcte`}
              />
              <input
                type="text"
                value={answer.text}
                onChange={(e) => updateQcmAnswer(idx, "text", e.target.value)}
                className="flex-grow border border-gray-300 rounded px-2 py-1
                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder={`Réponse ${idx + 1}`}
                required
              />
              {qcmAnswers.length > 3 && (
                <button
                  type="button"
                  onClick={() => removeQcmAnswer(idx)}
                  className="text-red-600 hover:text-red-800 font-bold px-2 rounded
                             focus:outline-none focus:ring-2 focus:ring-red-400"
                  aria-label={`Supprimer la réponse ${idx + 1}`}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          {qcmAnswers.length < 5 && (
            <button
              type="button"
              onClick={addQcmAnswer}
              className="self-start px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              + Ajouter une réponse
            </button>
          )}
        </div>
      )}

      {/* Réponse Vrai / Faux */}
      {typeQuestion === "VF" && (
        <div className="flex flex-col gap-3">
          <label className="font-semibold text-gray-700">Bonne réponse</label>
          <div className="flex gap-8">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="vfAnswer"
                checked={vfAnswer === "V"}
                onChange={() => setVfAnswer("V")}
                className="w-4 h-4"
              />
              Vrai
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="vfAnswer"
                checked={vfAnswer === "F"}
                onChange={() => setVfAnswer("F")}
                className="w-4 h-4"
              />
              Faux
            </label>
          </div>
        </div>
      )}

      {/* Correction */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-gray-700">Correction (explication)</label>
        <textarea
          value={correction}
          onChange={(e) => setCorrection(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 resize-none
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={3}
          placeholder="Optionnel - explication de la réponse"
        />
      </div>

      {/* Upload image */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-gray-700">Image (optionnelle)</label>
        <input
          type="file"
          accept="image/*"
          onChange={onImageChange}
          className="block w-full text-sm text-gray-500
                     file:mr-4 file:py-2 file:px-4
                     file:rounded file:border-0
                     file:text-sm file:font-semibold
                     file:bg-indigo-50 file:text-indigo-700
                     hover:file:bg-indigo-100
                     cursor-pointer"
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Aperçu de l'image"
            className="mt-2 max-h-48 rounded border border-gray-300 object-contain"
          />
        )}
      </div>

      {/* Boutons ajouter + annuler */}
      <div className="flex justify-end gap-4 mt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100
                     focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Ajouter
        </button>
      </div>
    </form>
  );
}