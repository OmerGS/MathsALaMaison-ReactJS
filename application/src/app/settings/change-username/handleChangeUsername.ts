import { updatePseudoAsk, updatePseudoCheck } from "@/services/userAPI";
import toast from "react-hot-toast";

export const handleChangePseudo = async (
  password: string,
  pseudo: string
): Promise<Boolean> => {
  if (!pseudo || pseudo.length < 2 || pseudo.length > 16) {
    toast.error("Pseudo invalide.");
    return false;
  }

  if (!password) {
    toast.error("Mot de passe requis.");
    return false;
  }

  try {
    const response = await updatePseudoAsk(password, pseudo);

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

export async function validatePseudoCodeWrapper(code: string): Promise<boolean> {
  try {
    const response = await updatePseudoCheck(code);
    return response.status === 200;
  } catch {
    return false;
  }
}