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

export default function Sidebar({ active, setActive, sidebarOpen, setSidebarOpen }: SidebarProps) {
  return (
    <>
      {/* Hamburger */}
      <button
        aria-label="Toggle menu"
        className="fixed top-4 left-4 z-[1001] flex h-10 w-10 items-center justify-center rounded-md bg-blue-600 text-white text-2xl md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <nav
        className={`
          fixed top-0 left-0 z-[1000] flex h-full w-60 flex-col bg-white border-r border-gray-300 p-6 pt-10
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0 shadow-lg" : "-translate-x-full"}
          md:translate-x-0 md:shadow-none
        `}
      >
        <h1 className="mb-8 text-2xl font-semibold tracking-tight">Admin</h1>
        {sidebarItems.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => {
              setActive(id);
              setSidebarOpen(false);
            }}
            className={`mb-2 rounded-md px-3 py-2 text-left text-base transition-colors duration-200
              ${
                active === id
                  ? "font-semibold text-blue-600 shadow-[0_0_10px_rgba(0,113,227,0.2)]"
                  : "hover:bg-gray-100"
              }`}
          >
            {label}
          </button>
        ))}
      </nav>
    </>
  );
}