"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  CheckSquare,
  Calendar,
  LogOut,
  Menu,
  X,
  ClipboardList,
} from "lucide-react";
import { logout } from "@/lib/actions/auth";
import clsx from "clsx";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/tugas", label: "Tugas", icon: CheckSquare },
  { href: "/kalender", label: "Kalender", icon: Calendar },
];

export default function Sidebar({ userEmail }: { userEmail?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white shadow-md rounded-xl p-2.5 text-gray-700 hover:bg-gray-50 transition"
      >
        <Menu size={22} />
      </button>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 flex flex-col transition-transform duration-300",
          "lg:translate-x-0 lg:static lg:shadow-none lg:border-r lg:border-gray-100",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <ClipboardList size={18} className="text-white" />
            </div>
            <span className="font-bold text-gray-800 text-lg">DeadlineKu</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition",
                  active
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                )}
              >
                <Icon size={20} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div className="p-4 border-t border-gray-100">
          {userEmail && (
            <p className="text-xs text-gray-400 mb-3 px-2 truncate">
              {userEmail}
            </p>
          )}
          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 font-medium transition"
            >
              <LogOut size={20} />
              <span>Keluar</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
