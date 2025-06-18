"use client";

import React from "react";

const Contact = () => {
  const handleSendMail = () => {
    window.location.href = "mailto:am@mathsalamaison.fr";
  };

  return (
    <div className="flex flex-col items-center space-y-4 text-gray-800">
      <h2 className="text-2xl font-semibold">Contact</h2>
      <p className="text-center max-w-xs">
        Pour toute question ou demande, vous pouvez nous contacter à l’adresse email suivante :
      </p>
      <p className="font-mono text-blue-600 select-all cursor-text">am@mathsalamaison.fr</p>
      <button
        onClick={handleSendMail}
        className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2 px-6 rounded-md transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300"
        aria-label="Envoyer un email à MathsALaMaison"
      >
        Envoyer un mail
      </button>
      <p className="mt-6 text-sm text-gray-500">
        Site web :{" "}
        <a
          href="https://www.mathsalamaison.fr"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          www.mathsalamaison.fr
        </a>
      </p>
    </div>
  );
};

export default Contact;