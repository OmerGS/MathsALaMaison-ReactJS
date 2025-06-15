import React from "react";

interface SidebarProps {
  active: string;
  setActive: (id: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const sidebarItems = [
  { id: "dashboard", label: "Tableau de bord" },
  { id: "users", label: "Utilisateurs" },
  { id: "pending", label: "En attente" },
  { id: "question", label: "Ajouter une question" },
  { id: "settings", label: "Paramètres" },
];

export default function Sidebar({
  active,
  setActive,
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) {
  return (
    <>
      {/* Hamburger (mobile) */}
      <button
        aria-label="Toggle menu"
        className="fixed top-4 left-4 z-[1001] flex h-10 w-10 items-center justify-center rounded-xl bg-white/30 backdrop-blur-md text-blue-700 text-2xl shadow-md md:hidden transition hover:bg-white/50 cursor-pointer"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <nav
        className={`
          fixed top-0 left-0 z-[1000] h-full w-64 p-6 pt-20 md:pt-10
          bg-white/30 backdrop-blur-xl shadow-lg border-r border-white/20
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <h1 className="mb-10 text-3xl font-bold text-blue-700 tracking-tight select-none">Admin</h1>
        <div className="space-y-3">
          {sidebarItems.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => {
                setActive(id);
                setSidebarOpen(false);
              }}
              className={`
                w-full text-left px-4 py-2 rounded-xl transition
                ${
                  active === id
                    ? "bg-white/70 text-blue-700 font-semibold shadow-md"
                    : "hover:bg-white/50 text-gray-700"
                }
                backdrop-blur-md cursor-pointer
              `}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}