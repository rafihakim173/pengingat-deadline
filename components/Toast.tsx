"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";
import clsx from "clsx";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={clsx(
        "fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl max-w-sm transition-all duration-300",
        type === "success"
          ? "bg-green-500 text-white"
          : "bg-red-500 text-white",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      {type === "success" ? (
        <CheckCircle size={20} className="shrink-0" />
      ) : (
        <XCircle size={20} className="shrink-0" />
      )}
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 300);
        }}
        className="ml-2 opacity-80 hover:opacity-100 transition"
      >
        <X size={16} />
      </button>
    </div>
  );
}
