"use client";

type FormButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

export default function FormButton({ children, onClick, disabled }: FormButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-4/5 max-w-md bg-dark text-white font-bold py-3 rounded-md  transition-opacity ${
        disabled ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
      }`}
    >
      {children}
    </button>
  );
}
