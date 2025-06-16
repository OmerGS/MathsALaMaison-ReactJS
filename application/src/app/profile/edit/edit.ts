import { updateProfilePicture } from "@/services/userAPI";

export async function handleProfilePictureChange(id: number): Promise<boolean> {
  try {
    const response = await updateProfilePicture(id);
    console.log(response);

    if (!response.data.success) {
      alert(response.data.message || "Une erreur est survenue.");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la photo de profil :", error);
    alert("Impossible de mettre à jour la photo de profil.");
    return false;
  }
}
