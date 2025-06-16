import React, { useState, useRef } from "react";

type User = {
  id: number;
  pseudo: string;
  email: string;
  point: number;
  isPremium: boolean;
  nombrePartie: number;
  nombreVictoire: number;
  specialRole: string;
};

const placeholders: { label: string; value: keyof User }[] = [
  { label: "Pseudo", value: "pseudo" },
  { label: "Email", value: "email" },
  { label: "Points", value: "point" },
  { label: "Premium (true/false)", value: "isPremium" },
  { label: "Nombre parties", value: "nombrePartie" },
  { label: "Nombre victoires", value: "nombreVictoire" },
  { label: "Rôle spécial", value: "specialRole" },
];

export default function EmailGenerator() {
  const [users] = useState<User[]>([
    {
      id: 1,
      pseudo: "Alice",
      email: "alice@example.com",
      point: 250,
      isPremium: true,
      nombrePartie: 34,
      nombreVictoire: 18,
      specialRole: "VIP",
    },
    {
      id: 2,
      pseudo: "Bob",
      email: "bob@example.com",
      point: 150,
      isPremium: false,
      nombrePartie: 20,
      nombreVictoire: 5,
      specialRole: "Aucun",
    },
  ]);

  const [subject, setSubject] = useState("");
  const [content, setContent] = useState(
    "Bonjour {pseudo},\n\nMerci de vous être inscrit sur MathsALaMaison."
  );
  const [previewUserId, setPreviewUserId] = useState(users[0]?.id || 0);
  const [showPlaceholderMenu, setShowPlaceholderMenu] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function insertPlaceholder(placeholder: string) {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = content.substring(0, start);
    const after = content.substring(end);
    const newText = before + `{${placeholder}}` + after;
    setContent(newText);

    setTimeout(() => {
      textarea.focus();
      const pos = start + placeholder.length + 2;
      textarea.setSelectionRange(pos, pos);
    }, 0);

    setShowPlaceholderMenu(false);
  }

  function getRandomValueForPlaceholder(key: keyof User): string {
    switch (key) {
      case "pseudo":
        return ["Alice", "Bob", "Charlie", "Dora", "Eve"][Math.floor(Math.random() * 5)];
      case "email":
        return ["alice@mail.com", "bob@mail.com", "charlie@mail.com"][Math.floor(Math.random() * 3)];
      case "point":
        return String(Math.floor(Math.random() * 1000));
      case "isPremium":
        return Math.random() > 0.5 ? "true" : "false";
      case "nombrePartie":
        return String(Math.floor(Math.random() * 200));
      case "nombreVictoire":
        return String(Math.floor(Math.random() * 150));
      case "specialRole":
        return ["Admin", "Modérateur", "VIP", "Aucun"][Math.floor(Math.random() * 4)];
      default:
        return "";
    }
  }

  function replacePlaceholders(text: string, user: User) {
    return text.replace(/\{(\w+)\}/g, (_, key) => {
      const k = key as keyof User;
      const val = user[k];
      return val !== undefined && val !== null ? String(val) : "";
    });
  }

  function replacePlaceholdersWithRandom(text: string) {
    return text.replace(/\{(\w+)\}/g, (_, key) => {
      const k = key as keyof User;
      return getRandomValueForPlaceholder(k);
    });
  }

  function generateEmailHTML(text: string, user: User | string) {
    const contentHtml =
      typeof user === "string"
        ? user.replace(/\n/g, "<br>")
        : replacePlaceholders(text, user).replace(/\n/g, "<br>");

    return `
      <div class="bg-gray-50 p-6 min-h-[40vh] font-sans">
        <div class="relative max-w-xl mx-auto bg-white rounded-3xl shadow-lg p-6 text-gray-900">
          <h1 class="text-3xl font-semibold mb-6 text-blue-600 tracking-wide">MathsALaMaison</h1>
          <div class="text-lg leading-relaxed whitespace-pre-line">
            ${contentHtml}
          </div>
          <p class="mt-10 border-t border-gray-200 pt-4 text-gray-500 text-sm font-light tracking-wide">
            Cordialement,<br />
            L'équipe <strong>MathsALaMaison</strong>
          </p>
        </div>
      </div>
    `;
  }

  const previewUser = users.find((u) => u.id === previewUserId);
  const previewHtml = previewUser
    ? generateEmailHTML(content, previewUser)
    : generateEmailHTML(content, replacePlaceholdersWithRandom(content));


  function handleSend() {
    if (!subject.trim()) {
      alert("Le sujet est requis.");
      return;
    }
    if (!content.trim()) {
      alert("Le contenu du mail ne peut pas être vide.");
      return;
    }

    alert(`Simulation d'envoi :\nSujet : ${subject}\nNombre de mails : ${users.length}`);
  }

  return (
    <>
      <div className="max-w-4xl mx-auto my-12 p-6 sm:p-10 bg-white rounded-3xl shadow-xl select-none font-sans text-gray-900">
        <label className="block mb-3 font-semibold text-lg tracking-wide text-gray-700">
          Sujet :
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Sujet du mail"
          className="w-full p-4 text-lg rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-10 font-medium transition-colors"
        />

        <label className="block mb-3 font-semibold text-lg tracking-wide text-gray-700">
          Contenu (placeholders supportés)
        </label>

        <div className="relative mb-5">
          <button
            type="button"
            onClick={() => setShowPlaceholderMenu((v) => !v)}
            className="bg-blue-600 text-white rounded-lg py-2 px-5 font-semibold shadow-md hover:bg-blue-700 transition-colors select-none"
          >
            Insérer un placeholder
          </button>

          {showPlaceholderMenu && (
            <div className="absolute mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-30 w-60 max-h-56 overflow-y-auto">
              {placeholders.map(({ label, value }) => (
                <div
                  key={value}
                  onClick={() => insertPlaceholder(value)}
                  className="cursor-pointer px-4 py-3 hover:bg-blue-50 font-medium text-gray-900 select-none"
                  title={`Insérer le placeholder {${value}}`}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {label}
                </div>
              ))}
            </div>
          )}
        </div>

        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
          className="w-full p-5 rounded-3xl border border-gray-300 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-lg leading-relaxed text-gray-900"
        />

        <div className="mt-8 mb-6 flex flex-wrap items-center gap-5 text-gray-600 font-semibold select-none">
          {(
            <>
              <span className="font-normal">Choisir un utilisateur pour aperçu :</span>
              <select
                value={previewUserId}
                onChange={(e) => setPreviewUserId(Number(e.target.value))}
                className="text-gray-900 font-semibold px-3 py-1 rounded-lg border border-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.pseudo} ({user.email})
                  </option>
                ))}
              </select>
            </>
          )}
        </div>

        <button
          onClick={handleSend}
          className="w-full py-5 mt-4 bg-blue-600 text-white text-xl font-bold rounded-2xl shadow-lg hover:bg-blue-700 transition-colors select-none"
        >
          Envoyer à tous les utilisateurs
        </button>

        {/* Bouton mobile pour modal */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="mt-12 w-full md:hidden bg-gray-100 text-gray-900 py-4 rounded-3xl font-semibold shadow-md hover:bg-gray-200 transition-colors select-none"
          aria-label="Afficher la prévisualisation du mail"
        >
          Voir l’aperçu du mail
        </button>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-gradient-to-tr from-white/20 via-white/20 to-white/3 backdrop-blur-sm border border-white/30 shadow-lg rounded-2xl transition-opacity duration-300 ease-in-out flex items-center justify-center p-6
          ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full bg-white shadow-xl p-8 overflow-y-auto transition-transform duration-300 ease-in-out
          w-full max-w-md md:w-1/3
          ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidebar-title"
      >
        <h2 id="sidebar-title" className="text-2xl font-extrabold mb-6 text-blue-600 select-none">
          Aperçu du mail
        </h2>
        <div
          className="prose prose-blue max-w-none whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
          aria-label="Fermer l’aperçu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </aside>

      {/* Bouton flottant desktop */}
      <button
        onClick={() => setIsSidebarOpen((v) => !v)}
        aria-label={isSidebarOpen ? "Fermer l’aperçu" : "Afficher l’aperçu"}
        className="hidden md:flex fixed bottom-8 right-8 items-center justify-center w-14 h-14 bg-blue-600 rounded-full shadow-lg text-white hover:bg-blue-700 transition-colors focus:outline-none z-50"
      >
        {isSidebarOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        )}
      </button>
    </>
  );
}