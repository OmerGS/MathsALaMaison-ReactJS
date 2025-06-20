import React, { useState } from 'react';
import Image from 'next/image';
import Question from '@/Type/model/Question';

type QuestionCardProps = {
  question: Question;
  possiblereponses: string[];
  onCheckSelection: (reponse: string) => void;
  onCheckText: (reponse: string) => void;
  onCheckMultipleText: (reponses: string[]) => void;
};

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  possiblereponses,
  onCheckSelection,
  onCheckText,
  onCheckMultipleText,
}) => {
  const [userreponse, setUserreponse] = useState('');
  const [userreponses, setUserreponses] = useState<string[]>(
    new Array(possiblereponses.length).fill('')
  );

  const handleMultipleChange = (index: number, value: string) => {
    const updated = [...userreponses];
    updated[index] = value;
    setUserreponses(updated);
  };

  return (
    <div
      className="w-full max-w-2xl mt-12 p-8 bg-white rounded-3xl
                 shadow-md shadow-gray-300
                 ring-1 ring-gray-200
                 flex flex-col items-center
                 transition-transform hover:shadow-lg hover:-translate-y-1 duration-300"
    >
      {question.image_data && (
        <div
          className="w-full h-64 relative rounded-xl overflow-hidden shadow-sm mb-8 border border-gray-200"
        >
          <Image
            src={question.image_data}
            alt="question image"
            fill
            className="object-contain"
          />
        </div>
      )}

      <h1
        className="text-3xl font-semibold text-gray-800 mb-10 text-center
                   tracking-wide leading-relaxed"
      >
        {question.question}
      </h1>

      {(question.typeReponse === 'QCM' || question.typeReponse === 'VF') && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {possiblereponses.map((reponse, index) => (
            <button
              key={index}
              onClick={() => onCheckSelection(reponse)}
              className="w-full max-w-md bg-blue-500 text-white font-semibold py-4 px-6 rounded-xl
                        shadow-md hover:bg-blue-600 active:scale-95 active:bg-blue-700
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            >
              {reponse}
            </button>
          ))}
        </div>
      )}

      {question.typeReponse === 'RDS' && (
        <div className="w-full flex flex-col items-center gap-6">
          <input
            type="text"
            value={userreponse}
            onChange={(e) => setUserreponse(e.target.value)}
            placeholder="Entrez votre réponse"
            className="w-full max-w-md p-4 rounded-lg border border-gray-300
                       shadow-sm text-gray-900 placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
          />
          <button
            onClick={() => onCheckText(userreponse)}
            className="btn-primary w-full max-w-md mt-6 focus:outline-none focus:ring-2 focus:ring-violet-700"
          >
            Vérifier la réponse
          </button>
        </div>
      )}

      {question.typeReponse === 'RCV' && (
        <div className="w-full flex flex-wrap justify-center gap-6">
          {possiblereponses.map((_, index) => (
            <input
              key={index}
              type="text"
              value={userreponses[index] || ''}
              onChange={(e) => handleMultipleChange(index, e.target.value)}
              placeholder={`Réponse ${index + 1}`}
              className="w-24 p-3 rounded-lg border border-gray-300
                         shadow-sm text-center text-gray-900 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            />
          ))}
          <button
            onClick={() => onCheckMultipleText(userreponses)}
            className="btn-primary w-full max-w-md mt-6 focus:outline-none focus:ring-2 focus:ring-violet-700"
          >
            Vérifier la réponse
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;