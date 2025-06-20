"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import "../globals.css";

import SectionButton from "@/components/ui/global/SectionButton";
import BackButton from "@/components/ui/global/BackButton";
import MentionLegales from "./SettingsComponents/MentionsLegales";
import Contact from "./SettingsComponents/Contact";
import Compte from "./SettingsComponents/Compte";

export default function Settings() {
  const router = useRouter();
  const { user, loading, setUser } = useUser();
  const [selectedSection, setSelectedSection] = useState("COMPTE");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [user, loading, router]);

  const renderContent = () => {
    switch (selectedSection) {
      case "MENTIONS":
        return <MentionLegales></MentionLegales>
      case "CONTACT":
        return <Contact></Contact>
      case "COMPTE":
        return user ? (
          <Compte></Compte>
        ) : null;
      default:
        return null;
    }
  };

  const sections = user ? ["COMPTE", "MENTIONS", "CONTACT"] : ["MENTIONS", "CONTACT"];

  return (
    <div className="min-h-screen p-6 bg-gradient-to-l from-custom to-custom">
      <div className="mb-15">
        <BackButton />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {sections.map((section) => (
          <SectionButton
            key={section}
            active={selectedSection === section}
            onClick={() => setSelectedSection(section)}
          >
            {section}
          </SectionButton>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xl">{renderContent()}</div>
    </div>
  );
}