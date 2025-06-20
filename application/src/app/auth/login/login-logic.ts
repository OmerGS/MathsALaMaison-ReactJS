import { login } from "@/services/authAPI";
import toast from "react-hot-toast";

export async function handleLogin(identifier: string, password: string): Promise<any | null> {
  if (!identifier || !password) {
    toast.error("Veuillez remplir tous les champs.");
    return null;
  }

  try {
    const loginResponse = await login(identifier, password);

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