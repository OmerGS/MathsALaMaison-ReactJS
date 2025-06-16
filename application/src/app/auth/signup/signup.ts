import { PasswordUtil } from "@/utils/PasswordUtil";
import { register } from "@/services/authAPI";

export const handleSignUp = async (
  email: string,
  pseudo: string,
  password: string,
  confirmPassword: string
) => {
  if (!email || !pseudo || !password || !confirmPassword) {
    alert("Veuillez remplir tous les champs");
    return;
  }

  if (password !== confirmPassword) {
    alert("Les mots de passe ne correspondent pas");
    return;
  } else if (password.length < 8) {
    alert("Le mot de passe doit contenir au moins 8 caractères");
    return;
  }

  if (!checkMail(email.trim().toLowerCase())) {
    alert("L'adresse email est invalide");
    return;
  }

  try {
    const salt = await PasswordUtil.getSalt();
    const hashedPassword = PasswordUtil.hashPassword(password, salt);

    const response = await register(pseudo, email.trim().toLowerCase(), hashedPassword, salt);

    if (!response.data.success) {
      alert(response.data.message || "Erreur lors de l'inscription.");
      return null;
    } else {
      return response.data.pseudo;
    }
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Erreur inconnue lors de l'inscription.";
    alert(message);
    return null;
  }
};

function checkMail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}