import { PasswordUtil } from "@/utils/PasswordUtil";
import { login, getSaltByIdentifier } from "@/services/authAPI";

export async function handleLogin(identifier: string, password: string): Promise<boolean> {
    if (!identifier || !password) {
        alert("Veuillez remplir tous les champs !");
        return false;
    }

    try {
        const response = await getSaltByIdentifier(identifier);
        const data = response.data;

        if (!data.success) {
            alert(data.message);
            return false;
        }

        const hashedPassword = PasswordUtil.hashPassword(password, data.salt);

        try {
            const loginResponse = await login(identifier, hashedPassword);
            const loginData = loginResponse.data;

            if (!loginData.success) {
                alert(loginData.message);
                return false;
            }

            return true;

        } catch (error: any) {
            const message = error?.response?.data?.message || "Erreur lors de la connexion.";
            alert(message);
            return false;
        }

    } catch (error: any) {
        const message = error?.response?.data?.message || "Erreur lors de la récupération du sel.";
        alert(message);
        return false;
    }
}