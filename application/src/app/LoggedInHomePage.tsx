  "use client";

  import React, { useState, useEffect } from "react";
  import { useRouter } from "next/navigation";
  import { useUser } from "@/context/UserContext";
  import ProtectedRoute from "@/components/ProtectedRoute";
  import { useMediaQuery } from "react-responsive";

  import ProfileCard from "@/components/ui/ProfileCard";
  import PointsCard from "@/components/ui/PointsCard";
  import SettingsButton from "@/components/ui/SettingsButton";
  import ModeSelector from "@/components/ui/ModeSelector";
  import PlayButton from "@/components/ui/PlayButton";
  import ModeChoiceModal from "@/components/ui/ModeChoiceModal";
  import ClassementButton from "@/components/ui/ClassementButton";
  import AdminButtton from "@/components/ui/AdminButton"
  import SettingsButtonMobile from "@/components/ui/SettingsButtonMobile";
  import ProfileCardMobile from "@/components/ui/ProfileCardMobile";
  import ClassementButtonMobile from "@/components/ui/ClassementButtonMobile";
  import ModeSelectorMobile from "@/components/ui/ModeSelectorMobile";
  import PlayButtonMobile from "@/components/ui/PlayButtonMobile";
  import AdminButtonMobile from "@/components/ui/AdminButtonMobile";

  export default function LoggedInHomePage() {
    return (
      <ProtectedRoute>
        <DashboardContent />
      </ProtectedRoute>
    );
  }

  function DashboardContent() {
    const { user, loading } = useUser();
    const router = useRouter();
    const isMobile = useMediaQuery({ maxWidth: 767 });

    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedMode, setSelectedMode] = useState<null | {
      label: string;
      action: () => void;
    }>(null);


  const choices = [
    { 
      label: "Partie en ligne", 
      action: () => router.push("/play/matchmaking"),
      description: "Jouez contre d'autres joueurs en temps réel via un matchmaking rapide."
    },
    { 
      label: "Partie local", 
      action: () => router.push("/play/local"),
      description: "Créez une partie locale pour jouer entre amis sur le même appareil."
    },
    { 
      label: "Entraînement", 
      action: () => router.push("/play/training"),
      description: "Mode d'entraînement pour s'exercer sans pression et améliorer vos compétences."
    },
  ];
    const choices = [
      { 
        label: "Les Questions", 
        action: () => router.push("/play/question-list"),
        description: "Accédez à une liste de questions pour tester vos connaissances à votre rythme."
      },
      { 
        label: "Partie en ligne", 
        action: () => router.push("/play/matchmaking"),
        description: "Jouez contre d'autres joueurs en temps réel via un matchmaking rapide."
      },
      { 
        label: "Partie local", 
        action: () => router.push("/play/create"),
        description: "Créez une partie locale pour jouer entre amis sur le même appareil."
      },
      { 
        label: "Entraînement", 
        action: () => router.push("/play/training"),
        description: "Mode d'entraînement pour s'exercer sans pression et améliorer vos compétences."
      },
    ];


    useEffect(() => {
      if (!loading && !user) {
        router.replace("/auth/login");
      }
    }, [user, loading, router]);

    if (!user) return null;

    const handlePlay = () => {
      if (!selectedMode) {
        alert("Veuillez sélectionner un mode de jeu avant de jouer.");
        return;
      }
      selectedMode.action();
    };

    return (
      <div >
        {isMobile ? 
        <div className="relative min-h-screen w-screen font-sans grid grid-cols-3 grid-rows-2 text-[clamp(1rem,2.5vw,1.75rem)] p-4 gap-4 bg-gradient-to-l from-custom to-custom">

          {/* LOGO EN ARRIÈRE-PLAN */}
          <img
            src="/icons/icon-512x512.png"
            alt=""
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      opacity-40 z-0 pointer-events-none
                      w-[40vw] max-w-[500px] h-auto select-none
                      animate-pulse-slow"
          />

          {/* PROFIL ET POINTS */}
          <div className="relative z-10 col-start-1 row-start-1 flex flex-col items-start gap-4">
            <ProfileCardMobile user={user} />
            <PointsCard points={user.point} />
          </div>

          {/* PARAMÈTRES ET CLASSEMENT */}
          <div className="relative z-10 row-start-1 col-start-3 flex flex-col gap-2 items-end">
            <SettingsButtonMobile />
            <ClassementButtonMobile />
            {user.specialRole === "admin" ? (
              <AdminButtonMobile />
            ):(
              <></>
            )}
          </div>

          {/* BOUTON MODE (digit) — plus petit */}
          {/* MODE SELECTIONNÉ OU BOUTON SÉLECTEUR */}
          <div className="relative z-10 row-start-2 col-start-2 flex justify-center items-end
          ">
            {selectedMode ? (
              <div
                className="btn-primary px-6 py-3 rounded-full text-white cursor-pointer w-[30rem] text-center"
                onClick={() => setModalVisible(true)}
              >
                Mode : {selectedMode.label}
              </div>
            ) : (
              <ModeSelectorMobile onClick={() => setModalVisible(true)} />
            )}
          </div>

          {/* BOUTON JOUER — agrandi */}
          <div className="relative z-10 row-start-2 col-start-2 flex flex-col justify-center items-center">
              <PlayButtonMobile onClick={handlePlay}/>
          </div>

          {/* MODAL */}
          {isModalVisible && (
            <ModeChoiceModal
              choices={choices}
              onClose={() => setModalVisible(false)}
              onSelect={(choice) => {
                setSelectedMode(choice);
                setModalVisible(false);
              }}
            />
          )}
        </div>
      :
        <div className="relative min-h-screen w-screen font-sans grid grid-cols-3 grid-rows-3 text-[clamp(1rem,2.5vw,1.75rem)] p-4 gap-4 bg-gradient-to-l from-custom to-custom">
        
          {/* LOGO EN ARRIÈRE-PLAN */}
          <img
            src="/icons/icon-512x512.png"
            alt=""
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      opacity-40 z-0 pointer-events-none
                      w-[40vw] max-w-[500px] h-auto select-none
                      animate-pulse-slow"
          />

          {/* PROFIL ET POINTS */}
          <div className="relative z-10 col-start-1 row-start-1 flex flex-col items-start gap-4">
            <ProfileCard user={user} />
            <PointsCard points={user.point} />
          </div>

          {/* PARAMÈTRES ET CLASSEMENT */}
          <div className="relative z-10 row-start-1 col-start-3 flex flex-col gap-2 items-end">
            <SettingsButton />
            <ClassementButton />
            {user.specialRole === "admin" ? (
              <AdminButtton />
            ):(
              <></>
            )}
          </div>

          {/* BOUTON MODE (digit) — plus petit */}
          {/* MODE SELECTIONNÉ OU BOUTON SÉLECTEUR */}
          <div className="relative z-10 row-start-3 col-start-2 flex justify-center items-end">
            {selectedMode ? (
              <div
                className="btn-primary px-6 py-3 rounded-full text-white cursor-pointer w-[30rem] text-center"
                onClick={() => setModalVisible(true)}
              >
                Mode : {selectedMode.label}
              </div>
            ) : (
              <ModeSelector onClick={() => setModalVisible(true)} />
            )}
          </div>

          {/* BOUTON JOUER — agrandi */}
          <div className="relative z-10 row-start-3 col-start-3 flex flex-col justify-end items-end">
              <PlayButton onClick={handlePlay}/>
          </div>

          {/* MODAL */}
          {isModalVisible && (
            <ModeChoiceModal
              choices={choices}
              onClose={() => setModalVisible(false)}
              onSelect={(choice) => {
                setSelectedMode(choice);
                setModalVisible(false);
              }}
            />
          )}
        </div>}
      </div>

      
    );
  }
