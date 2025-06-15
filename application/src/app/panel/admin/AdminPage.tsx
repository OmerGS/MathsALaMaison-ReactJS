"use client";

import React, { useState, useEffect } from "react";
import '@/app/globals.css';
import { User } from "@/Type/User";
import { getAllUsers } from "@/services/adminAPI";
import { useUser } from "@/context/UserContext";

import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import UsersList from "./UserList";
import PendingList from "./PendingList";
import Question from "./Question";
import Settings from "./Settings";

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
          <h2 className="mb-1 text-4xl font-semibold tracking-tight">
            {(() => {
              switch (active) {
                case "dashboard":
                  return "Tableau de bord";
                case "users":
                  return "Utilisateurs";
                case "pending":
                  return "En attente";
                case "question":
                  return "Liste des questions";
                case "settings":
                  return "Paramètres";
                default:
                  return "";
              }
            })()}
          </h2>
          <hr className="border-gray-300" />
        </header>

        {active === "dashboard" && <Dashboard />}
        {active === "users" && <UsersList />}
        {active === "pending" && (
          <PendingList />
        )}
        {active === "question" && <Question />}
        {active === "settings" && <Settings />}
      </main>
    </>
  );
}