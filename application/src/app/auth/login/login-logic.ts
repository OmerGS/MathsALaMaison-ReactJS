import { login } from "@/services/authAPI";

export async function handleLogin(identifier: string, password: string): Promise<any | null> {
  if (!identifier || !password) {
    alert("Veuillez remplir tous les champs.");
    return null;
  }

  try {
    const loginResponse = await login(identifier, password);

    if (!loginResponse.data.success) {
      alert(loginResponse.data.message || "Identifiants incorrects.");
      return null;
    }

    return loginResponse.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      `Erreur réseau (${error.response?.status || "inconnue"})`;
    alert(message);
    console.error("Erreur handleLogin:", error);
    return null;
  }
}