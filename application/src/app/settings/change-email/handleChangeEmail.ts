import toast from "react-hot-toast";
import { updateUserInfo } from "@/services/userAPI";

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
    const response = await updateUserInfo('mail', 'ask', { password, newValue: email} );

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

export async function validateEmailCodeWrapper(code: string): Promise<boolean> {
  try {
    const response = await updateUserInfo('mail', 'validate', { code });;
    return response.status === 200;
  } catch {
    return false;
  }
}