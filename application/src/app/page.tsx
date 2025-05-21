'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
/*import AvatarProgressBar from '@/app/(tabs)/AvatarProgressBar';
import { User } from '@/components/model/User';
import API from '@/components/controller/ServerConnection';
import profileImages from '@/components/model/ProfilePicture';
import { playSound, isSoundPlaying, stopSound } from '@/components/controller/soundController';*/

type User = {
  pseudo: string;
  photoDeProfil: string;
  point: number;
  music: number;
  nbPartie: number;
  nbVictoire: number;
};


export default function Home() {
  const router = useRouter();
  const currentUser = {
  pseudo: 'Jean',
  point: 123,
};

  /*const [isPlaying, setIsPlaying] = useState(isSoundPlaying());*/
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isHoveredProfil, setIsHoveredProfil] = useState(false);
  const [isHoveredSetting, setIsHoveredSetting] = useState(false);
  const [isHoveredLeadBorad, setIsHoveredLeadBorad] = useState(false);
  const [isHoveredPlay, setIsHoveredPlay] = useState(false);
  const [isHoveredSelect, setIsHoveredSelect] = useState(false);

  const choices = [
    { label: "Les Questions", action: () => router.push('/play/') },
    { label: "Partie en ligne", action: () => router.push('/MatchmakingScreen') },
    { label: "Partie local", action: () => router.push('/LocalCreateGameScreen') },
    { label: "Entraînement", action: () => router.push('/TrainingScreen') },
  ];

  const [selectedAction, setSelectedAction] = useState(choices[1]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /*const loadUserSession = async () => {
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      const parsedSession = JSON.parse(userSession);
      setCurrentUser(parsedSession);

      if (parsedSession.music === 1 && !isSoundPlaying()) {
        await playSound();
        setIsPlaying(true);
      } else if (parsedSession.music === 0 && isSoundPlaying()) {
        await stopSound();
        setIsPlaying(false);
      }
    } else {
      setCurrentUser(null);
    }

    setLoading(false);
  };*/

 /* const fetchUserDetails = async () => {
    try {
      await API.fetchUsers();
      const userSession = localStorage.getItem('userSession');

      if (userSession) {
        const parsedSession: User = JSON.parse(userSession);
        const updatedUser = API.getUserByIdentifier(parsedSession.pseudo);
        if (!updatedUser) throw new Error("Utilisateur introuvable");

        const userWithStats = {
          ...parsedSession,
          point: updatedUser.getPoint(),
          nbPartie: updatedUser.getNbPartie(),
          nbVictoire: updatedUser.getNbVictoire(),
        };

        localStorage.setItem('userSession', JSON.stringify(userWithStats));
        setCurrentUser(userWithStats);
      }
    } catch (err) {
      console.error('Erreur lors du chargement utilisateur :', err);
    }
  };*/

  /*useEffect(() => {
    loadUserSession();
  }, []);

  useEffect(() => {
    if (!currentUser?.pseudo) return;

    API.checkOnlinePlayer(currentUser.pseudo);
    const intervalId = setInterval(() => {
      API.checkOnlinePlayer(currentUser.pseudo);
    }, 60 * 1000);

    return () => clearInterval(intervalId);
  }, [currentUser]);

  useEffect(() => {
    if (!localStorage.getItem('userSession')) {
      playSound();
      setIsPlaying(true);
    }
  }, []);

  useEffect(() => {
    fetchUserDetails();
  }, []);*/

return (
  <div style={styles.gradient}>
   {/* {!currentUser ? (
      <div style={styles.fullScreenLayout}>
          <div style={styles.preConnectLeftPanel}>
            <button
              style={styles.settingsButton}
              onClick={() => router.push('/SettingsScreen')}
            >
              ⚙️
            </button>

            <div style={styles.centerButtons}>
              <button
                style={styles.actionButton}
                onClick={() => router.push('/SignupScreen')}
              >
                S'inscrire
              </button>
              <p style={styles.orText}>OU</p>
              <button
                style={styles.actionButton}
                onClick={() => router.push('/LoginScreen')}
              >
                Se Connecter
              </button>
            </div>
          </div>

          <div style={styles.preConnectRightPanel}>
            <Image
              src="/icons/icon-192x192.png"
              alt="logo"
              width={200}
              height={200}
              priority
            />
            <button
              style={{ ...styles.actionButton, marginTop: '1rem' }}
              onClick={() => router.push('/TrainingScreen')}
            >
              Essayer
            </button>
          </div>
        </div>
    ) : (*/}
      <div style={styles.layout}>
        <div style={styles.leftPanel}>
          <div style={styles.topLeftGroup}>
           <button
              style={{
                ...styles.profileButton,
                ...(isHoveredProfil ? styles.profileButtonHover : {}),
                width: Math.max(200, Math.min(600, 100 + currentUser.pseudo.length * 20.0)),
                padding: '12px 18px',
                fontSize: '2.0rem'
              }}
              onClick={() => router.push('/profile')}
              onMouseEnter={() => setIsHoveredProfil(true)}
              onMouseLeave={() => setIsHoveredProfil(false)}
            >
              <Image src="/icons/icon-192x192.png" alt="profile" width={70} height={70} />
              <span>{currentUser.pseudo}</span>
            </button>

            <div style={styles.pointsBox}>
              <span style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{currentUser.point}</span>
              <Image src="/icons/icon-192x192.png" alt="digit" width={36} height={36} />
            </div>
          </div>

          {/* Si tu veux d'autres contenus en bas, tu peux les mettre ici */}
        </div>

        <div style={styles.middlePanel}>
          <div style={styles.middleLogoContainer}>
            <Image src="/icons/icon-512x512.png" alt="logo" width={500} height={500} />
          </div>

          <button 
            style={{
                        ...styles.selectButton,
                        ...(isHoveredSelect ? styles.selectButtonHover : {}),
                    }}
            onClick={() => setModalVisible(true)}
            onMouseEnter={() => setIsHoveredSelect(true)}
            onMouseLeave={() => setIsHoveredSelect(false)}>
            {selectedAction?.label || "Choisir un mode de jeu"}
          </button>

          {isModalVisible && (
            <div style={styles.modalOverlay}>
              <div style={styles.modalContent}>
                {choices.map((choice, index) => (
                  <button
                    key={index}
                    style={
                        styles.optionButton}
                    onClick={() => {
                      setSelectedAction(choice);
                      setModalVisible(false);
                    }}
                  >
                    {choice.label}
                  </button>
                ))}
                <button style={styles.closeButton} onClick={() => setModalVisible(false)}>
                  Fermer
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={styles.rightPanel}>
          <div style={styles.topRightGroup}>
            <button style={{
                ...styles.iconButton,
                ...(isHoveredSetting ? styles.iconButtonHover : {}),
            }}
              onClick={() => router.push('/settings')}
              onMouseEnter={() => setIsHoveredSetting(true)}
              onMouseLeave={() => setIsHoveredSetting(false)}>
              ⚙️
            </button>
            <button style={{
                ...styles.iconButton,
                ...(isHoveredLeadBorad ? styles.iconButtonHover : {}),
            }}
              onClick={() => router.push('/leaderboard')}
              onMouseEnter={() => setIsHoveredLeadBorad(true)}
              onMouseLeave={() => setIsHoveredLeadBorad(false)}>
              🏆
            </button>
          </div>

          <button
            style={{
              ...styles.playButton,
              ...(isHoveredPlay ? styles.playButtonHover : {}),
              opacity: selectedAction ? 1 : 0.5,
              cursor: selectedAction ? 'pointer' : 'not-allowed',
              marginTop: 'auto',
            }}
            onClick={() => selectedAction?.action()}
            onMouseEnter={() => setIsHoveredPlay(true)}
            onMouseLeave={() => setIsHoveredPlay(false)}
            disabled={!selectedAction}
          >
            Lancer
          </button>
        </div>
      </div>
    {/*)}*/}
  </div>
)};

const styles: Record<string, React.CSSProperties> = {
  gradient: {
    minHeight: '100vh',
    width: '100vw',
    background: 'linear-gradient(45deg, #e3f2fd, #bbdefb)',
    padding: '0',
    margin: '0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },

  fullScreenLayout: {
    display: 'flex',
    width: '100vw',
    height: '100vh',
  },

  preConnectLeftPanel: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#f0f4f8',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
  },

  settingsButton: {
    position: 'absolute',
    top: '1rem',
    left: '1rem',
    fontSize: '1.5rem',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },

  centerButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    alignItems: 'center',
  },

  actionButton: {
    padding: '0.75rem 2rem',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: '600',
    minWidth: '160px',
  },

  orText: {
    fontWeight: 'bold',
    fontSize: '1rem',
    margin: '0',
  },

  preConnectRightPanel: {
    flex: 1,
    backgroundColor: '#bbdefb',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    padding: '2rem',
  },

  layout: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100vw',
    height: '100vh',
    padding: '1rem',
    boxSizing: 'border-box',
    gap: '2rem',
    alignItems: 'stretch', // étire verticalement les panels
  },

  leftPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  topLeftGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    alignItems: 'flex-start',
  },

  profileButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 1.5rem',
    background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
    border: '2px solid #635D5D',
    borderRadius: '16px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#635D5D',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
  },

  // Ajoute aussi ce style pour l'effet hover (optionnel)
  profileButtonHover: {
    transform: 'scale(1.03)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
  },

  pointsBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 1.5rem',
    background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
    border: '2px solid #635D5D',
    borderRadius: '16px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#635D5D',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
  },

  middlePanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  middleLogoContainer: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectButton: {
    padding: '1.5rem 3rem',
    background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
    border: '2px solid #635D5D',
    color: '#635D5D',
    borderRadius: 10,
    cursor: 'pointer',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    width: '100%',
    maxWidth: '320px',
  },

  selectButtonHover: {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
  },

  rightPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  topRightGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    alignItems: 'flex-end',
  },

  iconButton: {
    display: 'flex',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
    border: '2px solid #635D5D',
    borderRadius: '16px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    fontSize: '3rem',
    color: '#635D5D',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
  },
  iconButtonHover: {
    transform: 'scale(1.1)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
  },

  playButton: {
    padding: '1.5rem 3rem',
    background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
    border: '2px solid #635D5D',
    color: '#635D5D',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    borderRadius: 12,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
    alignSelf: 'flex-end',
  },
  playButtonHover: {
    transform: 'scale(1.1)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
  },

  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
    border: '2px solid #635D5D',
    color: '#635D5D',
    padding: '2rem',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '90%',
    maxWidth: '400px',
  },

  optionButton: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
    border: '2px solid #635D5D',
    color: '#635D5D',
    fontSize: '1rem',
    borderRadius: '8px',
    cursor: 'pointer',
  },

  closeButton: {
    backgroundColor: '#ef5350',
    color: 'white',
    padding: '0.5rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};
