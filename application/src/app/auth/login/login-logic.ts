import { PasswordUtil } from "@/utils/PasswordUtil";
import { login, getSaltByIdentifier } from "@/services/authAPI";
import { User } from "@/Type/User";
import toast from "react-hot-toast";

export async function handleLogin(identifier: string, password: string): Promise<any | null> {
  if (!identifier || !password) {
    toast.error("Veuillez remplir tous les champs.");
    return null;
  }

  try {
    const response = await getSaltByIdentifier(identifier);

    if (!response.data.success) {
      toast.error(response.data.message || "Erreur lors de la récupération du sel.");
      return null;
    }

    const hashedPassword = PasswordUtil.hashPassword(password, response.data.salt);

    const loginResponse = await login(identifier, hashedPassword);

    if (!loginResponse.data.success) {
      toast.error(loginResponse.data.message || "Identifiants incorrects.");
      return null;
    }

    return loginResponse.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      `Erreur réseau (${error.response?.status || "inconnue"})`;
    toast.error(message);
    console.error("Erreur handleLogin:", error);
    return null;
  }
}