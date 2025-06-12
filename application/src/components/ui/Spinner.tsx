"use client";

export default function Spinner() {
  return (
    <>
      <div className="spinner border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12 animate-spin"></div>

      <style jsx>{`
        .spinner {
          border-style: solid;
          border-width: 4px;
          border-color: #3b82f6 transparent transparent transparent; /* couleur bleu Tailwind */
          border-radius: 50%;
          width: 48px;
          height: 48px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}