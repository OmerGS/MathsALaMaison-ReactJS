import { PasswordUtil } from "@/utils/PasswordUtil";
import { login, getSaltByIdentifier } from "@/services/authAPI";
import { User } from "@/Type/User";

export async function handleLogin(identifier: string, password: string): Promise<User | null> {
  if (!identifier || !password) {
    alert("Veuillez remplir tous les champs.");
    return null;
  }

  try {
    const response = await getSaltByIdentifier(identifier);

    if (!response.data.success) {
      alert(response.data.message || "Erreur lors de la récupération du sel.");
      return null;
    }

    const hashedPassword = PasswordUtil.hashPassword(password, response.data.salt);

    const loginResponse = await login(identifier, hashedPassword);

    if (!loginResponse.data.success) {
      alert(loginResponse.data.message || "Identifiants incorrects.");
      return null;
    }

    return loginResponse.data.user;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      `Erreur réseau (${error.response?.status || "inconnue"})`;
    alert(message);
    console.error("Erreur handleLogin:", error);
    return null;
  }
}