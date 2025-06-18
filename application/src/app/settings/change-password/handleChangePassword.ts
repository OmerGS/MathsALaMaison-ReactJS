import { updatePassword } from "@/services/userAPI";
import toast from "react-hot-toast";
import axios from "axios";

export const handleChangePassword = async (
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): Promise<boolean> => {
  if (!currentPassword) {
    toast.error("Veuillez entrer votre mot de passe actuel.");
    return false;
  }

  if (!newPassword || !confirmPassword) {
    toast.error("Veuillez remplir tous les champs du nouveau mot de passe.");
    return false;
  }

  if (newPassword.length < 10) {
    toast.error("Le nouveau mot de passe doit contenir au moins 10 caractères.");
    return false;
  }

  if (newPassword !== confirmPassword) {
    toast.error("Les mots de passe ne correspondent pas.");
    return false;
  }

  try {
    const response = await updatePassword(currentPassword, newPassword);

    if (response.status === 200) {
      toast.success("Mot de passe mis à jour avec succès !");
      return true;
    } else {
      toast.error(response.data?.message || "Échec de la mise à jour du mot de passe.");
      return false;
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        toast.error("Mot de passe actuel incorrect.");
      } else {
        toast.error("Une erreur est survenue. Veuillez réessayer.");
      }
    } else {
      toast.error("Une erreur inconnue est survenue.");
    }
    console.error("Erreur lors du changement de mot de passe :", error);
    return false;
  }
};