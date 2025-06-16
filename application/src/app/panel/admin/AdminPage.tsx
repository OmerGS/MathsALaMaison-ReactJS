"use client";

import React, { useState, useEffect } from "react";
import '@/app/globals.css';
import { User } from "@/Type/User";
import { getAllUsers } from "@/services/adminAPI";
import { useUser } from "@/context/UserContext";

// Composants enfants
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import UsersList from "./UserList";
import PendingList from "./PendingList";
import Question from "./Question";
import Setting from "./Settings";
import SendMail from "./SendMail";

import {
  LayoutDashboard,
  Users,
  Clock,
  HelpCircle,
  Mail,
  Settings,
} from "lucide-react";

const tabConfig: Record<
  string,
  { label: string; icon: React.ElementType }
> = {
  dashboard: { label: "Tableau de bord", icon: LayoutDashboard },
  users: { label: "Utilisateurs", icon: Users },
  pending: { label: "En attente", icon: Clock },
  question: { label: "Liste des questions", icon: HelpCircle },
  "send-mail": { label: "Envoie de mail aux joueurs", icon: Mail },
  settings: { label: "Paramètres", icon: Settings },
};

export default function AdminPageContainer() {
  const [active, setActive] = useState("dashboard");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  return (
    <>
      <Sidebar
        active={active}
        setActive={setActive}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main
        className={`min-h-screen overflow-y-auto p-12 pt-20 transition-margin duration-300 md:ml-60 md:p-12 ${
          sidebarOpen ? "pointer-events-none" : ""
        }`}
        onClick={() => sidebarOpen && setSidebarOpen(false)}
      >
        <header className="mb-8">
          {tabConfig[active] && (
            <h2 className="mb-1 flex items-center gap-3 text-4xl font-semibold tracking-tight">
              {React.createElement(tabConfig[active].icon, {
                className: "w-8 h-8 text-black-700",
              })}
              {tabConfig[active].label}
            </h2>
          )}
          <hr className="border-gray-300 mt-2" />
        </header>

        {active === "dashboard" && <Dashboard />}
        {active === "users" && <UsersList />}
        {active === "pending" && <PendingList />}
        {active === "question" && <Question />}
        {active === "send-mail" && <SendMail />}
        {active === "settings" && <Setting />}
      </main>
    </>
  );
}