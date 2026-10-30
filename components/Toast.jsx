"use client";

import { useEffect, useState } from "react";
import { CircleCheck } from "lucide-react";

export default function Toast({ mensaje }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const temporizador = setTimeout(() => setVisible(false), 3500);
    return () => clearTimeout(temporizador);
  }, []);

  if (!visible || !mensaje) return null;

  return (
    <div
      role="status"
      className="fixed bottom-[25px] left-1/2 z-[100] flex -translate-x-1/2 items-center gap-2 rounded-[14px] bg-ink px-5 py-[13px] font-sans text-[14px] font-bold text-white shadow-toast"
    >
      <CircleCheck size={18} strokeWidth={2} aria-hidden="true" className="text-mint" />
      {mensaje}
    </div>
  );
}
