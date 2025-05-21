"use client";

import { useRouter } from "next/navigation";
import '../../globals.css'

export default function ChangeUsername() {
  const router = useRouter();

  return (
    <h3 className="text-20xl font-bold underline">
      Hello world!
      <button className="text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800">Submit</button>
    </h3>
    
  )
}