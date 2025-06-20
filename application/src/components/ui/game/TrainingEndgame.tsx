export const TrainingEndgame = ({
  correctAnswers,
  totalQuestions,
  onRestart,
  onBack,
}: {
  correctAnswers: number;
  totalQuestions: number;
  onRestart: () => void;
  onBack: () => void;
}) => {
  const percentage = (correctAnswers / totalQuestions) * 100;

  let message = '';
  let color = '';

  if (percentage >= 70) {
    message = '🎉 Félicitations ! 🎉';
    color = 'text-green-600';
  } else if (percentage >= 45) {
    message = 'Peut mieux faire !';
    color = 'text-yellow-500';
  } else {
    message = 'Continue à apprendre !';
    color = 'text-red-500';
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-white rounded shadow max-w-md mx-auto">
      <h1 className={`text-3xl font-extrabold mb-4 ${color}`}>{message}</h1>
      <p className="text-xl mb-6">
        Tu as obtenu <span className="font-bold">{correctAnswers}</span> bonnes réponses sur <span className="font-bold">{totalQuestions}</span> questions.
      </p>
      <button
        onClick={onRestart}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded mb-4"
      >
        Recommencer
      </button>
      <button
        onClick={onBack}
        className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded"
      >
        Retour
      </button>
    </div>
  );
};