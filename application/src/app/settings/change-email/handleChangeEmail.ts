import toast from "react-hot-toast";
import { updateEmailAsk } from "@/services/userAPI";

export const handleChangeEmail = async (
  password: string,
  email: string
): Promise<Boolean> => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    toast.error("Adresse email invalide.");
    return false;
  }

  if (!password) {
    toast.error("Mot de passe requis.");
    return false;
  }

  try {
    const response = await updateEmailAsk(password, email);

    if (response.status === 200) {
      toast.success("Un email de confirmation vous a été envoyé.");
      return true;
    } else {
      toast.error(response.data.message || "Erreur lors de la vérification.");
      return false;
    }
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Erreur serveur.");
    return false;
  }
};