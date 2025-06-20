import { updateProfilePicture } from "@/services/userAPI";
import toast from "react-hot-toast";

export async function handleProfilePictureChange(id: number): Promise<boolean> {
  try {
    const response = await updateProfilePicture(id);

    if (!response.data.success) {
      toast.error(response.data.message || "Une erreur est survenue.");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la photo de profil :", error);
    toast.error("Impossible de mettre à jour la photo de profil.");
    return false;
  }
}
