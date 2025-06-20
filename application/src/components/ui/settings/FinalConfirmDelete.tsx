"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FinalConfirmDeleteProps {
  show: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function FinalConfirmDelete({
  show,
  onCancel,
  onConfirm,
  loading = false,
}: FinalConfirmDeleteProps) {
  const [input, setInput] = useState("");

  const isValid = input.trim().toUpperCase() === "CONFIRMER";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 backdrop-blur-sm bg-black/10 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg space-y-4 text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2 className="text-lg font-bold text-red-700">Suppression définitive</h2>
            <p className="text-sm text-gray-700">
              Pour confirmer la suppression de ton compte, écris <span className="font-semibold">CONFIRMER</span> ci-dessous.
            </p>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Écris "CONFIRMER"'
              className="w-full border rounded-lg px-3 py-2 text-center border-gray-300 focus:outline-none focus:ring focus:ring-red-400"
              disabled={loading}
            />

            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={onCancel}
                disabled={loading}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                onClick={onConfirm}
                disabled={!isValid || loading}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                Supprimer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}