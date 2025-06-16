"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Clock,
  HelpCircle,
  Mail,
  Settings,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  active: string;
  setActive: (id: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const sidebarItems = [
  { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { id: "users", label: "Utilisateurs", icon: Users },
  { id: "pending", label: "En attente", icon: Clock },
  { id: "question", label: "Question", icon: HelpCircle },
  { id: "send-mail", label: "Mail", icon: Mail },
  { id: "settings", label: "Paramètres", icon: Settings },
  {
    id: "home",
    label: "Sortir du panel",
    icon: LogOut,
    href: "/",
    danger: true,
  },
];

export default function Sidebar({
  active,
  setActive,
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) {
  const router = useRouter();

  const handleClick = (id: string, href?: string) => {
    setSidebarOpen(false);
    if (href) {
      router.push(href);
    } else {
      setActive(id);
    }
  };

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
        <h1
          className="mb-10 text-3xl font-bold text-blue-700 tracking-tight select-none cursor-pointer"
          onClick={() => router.push("/")}
        >
          Admin
        </h1>

        <div className="space-y-3">
          {sidebarItems.map(({ id, label, icon: Icon, href, danger }) => (
            <button
              key={id}
              onClick={() => handleClick(id, href)}
              className={`
                w-full flex items-center gap-3 text-left px-4 py-2 rounded-xl transition
                ${
                  danger
                    ? "text-red-600 hover:bg-red-100 hover:text-red-700"
                    : active === id
                    ? "bg-white/70 text-blue-700 font-semibold shadow-md"
                    : "hover:bg-white/50 text-gray-700"
                }
                backdrop-blur-md cursor-pointer
              `}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}