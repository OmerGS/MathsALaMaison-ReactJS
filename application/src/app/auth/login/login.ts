import { PasswordUtil } from "@/utils/PasswordUtil";
import { login, getSaltByIdentifier } from "@/services/authAPI";
import { User } from "@/Type/User";

export async function handleLogin(identifier: string, password: string): Promise<User | null> { 
    if(!identifier || !password) {
        alert("Veuillez remplir tous les champs.");
        return null;
    }

    let response = await getSaltByIdentifier(identifier);

    if(!response.data.success) {
        alert(response.data.message);
    } else {
        let hashedPassword = PasswordUtil.hashPassword(password, response.data.salt);
        let loginResponse = await login(identifier, hashedPassword);

        if(!loginResponse.data.success){
            alert(loginResponse.data.message);
        } else {
            return loginResponse.data.user;
        }
    }

    return null;
}