import { register } from "@/services/authAPI";
import toast from "react-hot-toast";

export const handleSignUp = async (
  email: string,
  pseudo: string,
  password: string,
  confirmPassword: string
) => {
  if (!email || !pseudo || !password || !confirmPassword) {
    toast.error("Veuillez remplir tous les champs");
    return;
  }

  if(pseudo.length < 2 || pseudo.length > 16) {
    toast.error("Le pseudo doit contenir entre 2 et 16 caractères");
    return;
  }

  if (password !== confirmPassword) {
    toast.error("Les mots de passe ne correspondent pas");
    return;
  } else if (password.length < 10) {
    toast.error("Le mot de passe doit contenir au moins 10 caractères");
    return;
  }

  if (!checkMail(email.trim().toLowerCase())) {
    toast.error("L'adresse email est invalide");
    return;
  }

  try {
    const response = await register(pseudo, email.trim().toLowerCase(), password);

    if (!response.data.success) {
      toast.error(response.data.message || "Erreur lors de l'inscription.");
      return null;
    } else {
      return response.data.pseudo;
    }
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Erreur inconnue lors de l'inscription.";
    toast.error(message);
    return null;
  }
};

function checkMail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}