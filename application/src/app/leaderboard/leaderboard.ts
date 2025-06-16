import { getLeaderBoardUser } from "@/services/userAPI";
import { User } from "@/Type/User";

export async function handleGetLeadBoardUser(sortBy: string): Promise<User[] | null> {
  try {
    let response = await getLeaderBoardUser(sortBy);
    console.log(response);

   

    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la photo de profil :", error);
    return null;
  }
}
