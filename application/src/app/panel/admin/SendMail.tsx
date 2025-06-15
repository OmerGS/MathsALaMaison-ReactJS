import { sendEmailToEveryone } from "@/services/adminAPI";
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
  const [previewRandom, setPreviewRandom] = useState(false);

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
      <div style="
        background: #f7f9fc;
        padding: 40px 20px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        min-height: 40vh;
      ">
        <div style="
          position: relative;
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
          padding: 32px 36px;
          color: #1a1a1a;
          z-index: 1;
        ">

          <h1 style="
            font-weight: 700;
            font-size: 28px;
            margin-top: 0;
            margin-bottom: 20px;
            color: #1769aa;
          ">MathsALaMaison</h1>

          <div style="font-size: 17px; line-height: 1.6;">
            ${contentHtml}
          </div>

          <p style="
            margin-top: 36px;
            font-style: italic;
            color: #666666;
            font-size: 15px;
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
          ">
            Cordialement,<br />
            L'équipe <strong>MathsALaMaison</strong>
          </p>
        </div>

        <!-- Fond géométrique léger -->
        <svg style="
          position: absolute;
          top: 20px;
          right: 20px;
          width: 180px;
          height: 180px;
          opacity: 0.12;
          pointer-events: none;
          z-index: 0;
        " viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="30" cy="30" r="20" fill="#1769aa"/>
          <rect x="110" y="40" width="40" height="40" fill="#64b5f6" />
          <polygon points="60,140 90,100 120,140" fill="#90caf9" />
          <circle cx="140" cy="130" r="15" fill="#bbdefb" />
        </svg>
      </div>
    `;
  }

  async function handleSend() {
    if (!subject.trim()) {
      alert("Le sujet est requis.");
      return;
    }
    if (!content.trim()) {
      alert("Le contenu du mail ne peut pas être vide.");
      return;
    }

    const mailsByUserId: { [key: number]: string } = {};
    users.forEach((user) => {
      mailsByUserId[user.id] = generateEmailHTML(content, user);
    });

    const htmlWithPlaceholders = generateEmailHTML(content, content);
    await sendEmailToEveryone(subject, htmlWithPlaceholders);

    alert(`Simulation d'envoi :\nSujet : ${subject}\nNombre de mails : ${users.length}`);
    console.log("Mails générés :", mailsByUserId);
  }

  const previewUser = users.find((u) => u.id === previewUserId);
  const previewHtml = previewRandom
    ? generateEmailHTML(content, replacePlaceholdersWithRandom(content))
    : previewUser
    ? generateEmailHTML(content, previewUser)
    : "";

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "40px auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f9fafb",
        padding: 32,
        borderRadius: 12,
        boxShadow: "0 6px 30px rgba(0,0,0,0.05)",
        color: "#222",
      }}
    >
      <label style={{ fontWeight: 600, display: "block", marginBottom: 8 }}>Sujet :</label>
      <input
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Sujet du mail"
        style={{
          width: "100%",
          padding: 14,
          fontSize: 16,
          borderRadius: 6,
          border: "1px solid #ccc",
          marginBottom: 24,
          boxSizing: "border-box",
          outlineColor: "#0070f3",
        }}
      />

      <label style={{ fontWeight: 600, display: "block", marginBottom: 8 }}>
        Contenu (placeholders supportés)
      </label>

      <div style={{ position: "relative", marginBottom: 12 }}>
        <button
          type="button"
          onClick={() => setShowPlaceholderMenu((v) => !v)}
          style={{
            backgroundColor: "#0070f3",
            border: "none",
            color: "white",
            padding: "8px 14px",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: "600",
            marginBottom: 8,
          }}
        >
          Insérer un placeholder
        </button>

        {showPlaceholderMenu && (
          <div
            style={{
              position: "absolute",
              backgroundColor: "white",
              border: "1px solid #ddd",
              borderRadius: 6,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              zIndex: 20,
              width: 220,
              maxHeight: 180,
              overflowY: "auto",
            }}
          >
            {placeholders.map(({ label, value }) => (
              <div
                key={value}
                onClick={() => insertPlaceholder(value)}
                style={{
                  padding: "10px 14px",
                  cursor: "pointer",
                  fontSize: 14,
                  borderBottom: "1px solid #eee",
                  userSelect: "none",
                }}
                onMouseDown={(e) => e.preventDefault()}
                title={`Insérer le placeholder {${value}}`}
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
        rows={10}
        style={{
          width: "100%",
          fontSize: 16,
          fontFamily: "monospace, Consolas, 'Courier New', Courier, monospace",
          padding: 16,
          borderRadius: 8,
          border: "1px solid #ccc",
          resize: "vertical",
          boxSizing: "border-box",
          color: "#222",
          backgroundColor: "white",
        }}
      />

      <div
        style={{
          marginTop: 24,
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <label style={{ fontWeight: 600 }}>
          Aperçu pour :
          <select
            value={previewUserId}
            onChange={(e) => setPreviewUserId(Number(e.target.value))}
            disabled={previewRandom}
            style={{
              marginLeft: 12,
              padding: "6px 12px",
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.pseudo} ({user.email})
              </option>
            ))}
          </select>
        </label>

        <label style={{ fontWeight: 600, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={previewRandom}
            onChange={(e) => setPreviewRandom(e.target.checked)}
            style={{ marginRight: 6, cursor: "pointer" }}
          />
          Valeurs aléatoires
        </label>
      </div>

      <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 12 }}>Aperçu du mail</h3>

      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #ddd",
          borderRadius: 8,
          minHeight: 250,
          padding: 24,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          overflowY: "auto",
          maxWidth: 600,
          margin: "auto",
          fontSize: 16,
          color: "#222",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          lineHeight: 1.5,
        }}
        dangerouslySetInnerHTML={{ __html: previewHtml }}
      />

      <button
        onClick={handleSend}
        style={{
          marginTop: 36,
          backgroundColor: "#0070f3",
          color: "white",
          padding: "14px 28px",
          fontSize: 17,
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontWeight: "700",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          transition: "background-color 0.3s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#005bb5")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0070f3")}
      >
        Envoyer à tous les joueurs
      </button>
    </div>
  );
}