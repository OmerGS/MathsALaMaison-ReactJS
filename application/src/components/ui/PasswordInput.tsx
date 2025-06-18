"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import clsx from "clsx";

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name?: string;
  autoComplete?: string;
  showStrength?: boolean;
};

export default function PasswordInput({
  value,
  onChange,
  placeholder,
  name,
  autoComplete,
  showStrength = false,
}: Props) {
  const [show, setShow] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const toggleVisibility = () => {
    if (!show) {
      setShow(true);
      timerRef.current = setTimeout(() => {
        setShow(false);
      }, 3000);
    } else {
      setShow(false);
      if (timerRef.current) clearTimeout(timerRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
  const strength = useMemo(() => {
    if (value.length === 0) return { label: "", color: "", width: "0%" };

    if (value.length < 8) return { label: "Faible", color: "bg-red-500", width: "25%" };

    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const checks = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;

    if (checks === 1) return { label: "Moyen", color: "bg-yellow-500", width: "50%" };
    if (checks === 2) return { label: "Bon", color: "bg-yellow-400", width: "75%" };
    if (checks >= 3) return { label: "Fort", color: "bg-green-600", width: "100%" };

    return { label: "Faible", color: "bg-red-500", width: "25%" };
  }, [value]);

  return (
    <div className="relative w-full max-w-md space-y-2">
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          className={clsx(
            "w-full p-3 border border-gray-300 rounded-xl bg-white text-black",
            "focus:outline-none focus:ring-2 focus:ring-blue-500"
          )}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          name={name}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
          tabIndex={-1}
          aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        >
          {show ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {showStrength && value.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Sécurité</span>
            <span className={clsx("text-sm font-semibold", strength.color.replace("bg-", "text-"))}>
              {strength.label}
            </span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-2">
            <div
              className={clsx("h-2 rounded-full transition-all duration-500 ease-in-out", strength.color)}
              style={{ width: strength.width }}
            />
          </div>
        </div>
      )}
    </div>
  );
}