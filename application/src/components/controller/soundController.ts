import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Alert } from 'react-native';

let sound: Audio.Sound | null = null;
let isPlaying = false;
let currentTrackIndex = 0;
let shuffledTracks: string | any[] = [];
let isSwitchingTrack = false; // Pour empêcher les appels simultanés
let debounceTimeout: NodeJS.Timeout | null = null;

const audioTracks = [
  require('../../assets/music/mainMenu/mainMenu2.mp3'),
  require('../../assets/music/mainMenu/mainMenu3.mp3'),
  require('../../assets/music/mainMenu/mainMenu4.mp3'),
  require('../../assets/music/mainMenu/mainMenu5.mp3'),
  require('../../assets/music/mainMenu/mainMenu6.mp3'),
  require('../../assets/music/mainMenu/mainMenu7.mp3'),
  require('../../assets/music/mainMenu/mainMenu8.mp3'),
  require('../../assets/music/mainMenu/mainMenu9.mp3'),
];

// Mélanger les pistes
const shuffleArray = (array) => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

// Initialiser la playlist
const initializeShuffledTracks = () => {
  shuffledTracks = shuffleArray(audioTracks);
  currentTrackIndex = 0;
};

// Jouer une piste
const playCurrentTrack = async () => {
  if (sound) {
    await sound.unloadAsync(); // Décharger le son précédent
    sound = null;
  }

  if (currentTrackIndex >= shuffledTracks.length) {
    initializeShuffledTracks();
  }

  const currentTrack = shuffledTracks[currentTrackIndex];
  const { sound: newSound } = await Audio.Sound.createAsync(
    currentTrack,
    { shouldPlay: true, isLooping: false }
  );

  sound = newSound;
  isPlaying = true;

  sound.setOnPlaybackStatusUpdate(async (status) => {
    if (status.didJustFinish && !status.isLooping) {
      await nextTrack();
    }
  });
};

// Passer à la piste suivante
export const nextTrack = async () => {
  if (isSwitchingTrack) return; // Empêche les changements multiples
  isSwitchingTrack = true;

  try {
    if (isSoundPlaying()) {
      if (sound) {
        await sound.unloadAsync();
        sound = null;
      }

      currentTrackIndex++;
      if (currentTrackIndex >= shuffledTracks.length) {
        currentTrackIndex = 0;
      }

      await playCurrentTrack();
    } else {
      Alert.alert("La musique n'est pas activée.");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  } finally {
    isSwitchingTrack = false; // Libérer le verrou
  }
};

// Passer à la piste suivante avec un debounce
export const nextTrackWithDebounce = () => {
  if (debounceTimeout) return;

  debounceTimeout = setTimeout(() => {
    nextTrack();
    debounceTimeout = null;
  }, 500); // 500 ms de délai
};

// Démarrer la musique
export const playSound = async () => {
  if (!sound) {
    initializeShuffledTracks();
    await playCurrentTrack();
  } else {
    await sound.playAsync();
    isPlaying = true;
  }
  await updateMusicSetting(1);
};

// Arrêter la musique
export const stopSound = async () => {
  if (sound && isPlaying) {
    await sound.stopAsync();
    isPlaying = false;
    await updateMusicSetting(0);
  }
};

export const toggleSound = async () => {
  isPlaying ? await stopSound() : await playSound();
};

// Mettre à jour les paramètres de musique dans AsyncStorage
export const updateMusicSetting = async (musicStatus: number) => {
  const userSession = await AsyncStorage.getItem('userSession');
  if (userSession) {
    const currentUser = JSON.parse(userSession);
    const updatedSession = { ...currentUser, music: musicStatus };
    await AsyncStorage.setItem('userSession', JSON.stringify(updatedSession));
  }
};

// Décharger le son
export const unloadSound = async () => {
  if (sound) {
    await sound.unloadAsync();
    sound = null;
  }
};

// Régler le volume
export const setVolume = (level: number) => {
  if (sound) {
    sound.setVolumeAsync(level);
  }
};

// Vérifier si le son est actif
export const isSoundPlaying = () => isPlaying;
