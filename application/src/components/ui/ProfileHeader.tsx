"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProfilPicture from "@/config/ProfilePicture";
import { User } from "@/Type/User";

type Props = { user: User };

export default function ProfileHeader({ user }: Props) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center gap-5 mb-10">
      <div className="relative w-28 h-28 sm:w-32 sm:h-32">
        <Image
          src={ProfilPicture[user.photoDeProfil]}
          alt="Profil"
          fill
          className="rounded-full border-4 bg-gradient-to-r from-cyan-400 to-cyan-600 object-cover"
        />
        <button
          onClick={() => router.push("/profile/edit")}
          className="absolute bottom-1 right-1 bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-500"
        >
          ✎
        </button>
      </div>
      <div className="bg-gradient-to-r from-cyan-400 to-cyan-600 text-white px-4 py-2 rounded-xl text-lg sm:text-xl font-semibold">
        {user.pseudo}
      </div>
    </div>
  );
}
