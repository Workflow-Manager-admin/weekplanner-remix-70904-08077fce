import { Outlet, useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";
import { NAV_DAYS, dayNameFor } from "~/utils/days";
import ThemeToggle from "~/components/ThemeToggle";

// PUBLIC_INTERFACE
export default function PlannerLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Sidebar */}
      <aside className="w-52 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 hidden md:flex flex-col px-4 py-6 gap-2">
        <div className="mb-8 flex flex-col gap-1">
          <h1 className="text-xl font-bold text-primary">WeekPlanner</h1>
          <ThemeToggle />
        </div>
        <nav className="flex flex-col gap-2">
          <a
            href="/planner"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === "/planner"
                ? "bg-primary text-white"
                : "text-secondary hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            aria-current={location.pathname === "/planner" ? "page" : undefined}
          >
            Weekly Overview
          </a>
          {NAV_DAYS.map((day) => (
            <a
              key={day}
              href={`/planner/${day}`}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                location.pathname === `/planner/${day}`
                  ? "bg-primary text-white font-semibold"
                  : "text-secondary hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              aria-current={
                location.pathname === `/planner/${day}` ? "page" : undefined
              }
            >
              {dayNameFor(day)}
            </a>
          ))}
        </nav>
        <a
          href="/planner?reset=1"
          className="mt-auto text-xs text-accent hover:underline transition-colors"
        >
          Reset Week
        </a>
      </aside>
      {/* Mobile Sidebar */}
      <div className="md:hidden absolute z-40">
        <button
          aria-label="Open navigation"
          className="m-3 p-2 rounded focus:outline-none bg-primary text-white"
          onClick={() => setSidebarOpen((o) => !o)}
        >
          ☰
        </button>
        <div
          className={`fixed inset-0 bg-black bg-opacity-10 transition-opacity ${
            sidebarOpen ? "block" : "hidden"
          }`}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar overlay"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " " ? setSidebarOpen(false) : undefined)}
        />
        <div
          className={`fixed left-0 top-0 w-3/4 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-6 z-50 shadow-lg transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col gap-1 mb-6">
            <h1 className="font-bold text-lg text-primary">WeekPlanner</h1>
            <ThemeToggle />
          </div>
          <nav className="flex flex-col gap-2 mb-4">
            <a
              href="/planner"
              className={`px-3 py-2 rounded text-base font-medium ${
                location.pathname === "/planner"
                  ? "bg-primary text-white"
                  : "text-secondary hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              aria-current={location.pathname === "/planner" ? "page" : undefined}
            >
              Weekly Overview
            </a>
            {NAV_DAYS.map((day) => (
              <a
                key={day}
                href={`/planner/${day}`}
                className={`px-3 py-2 rounded text-base ${
                  location.pathname === `/planner/${day}`
                    ? "bg-primary text-white font-semibold"
                    : "text-secondary hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                aria-current={
                  location.pathname === `/planner/${day}` ? "page" : undefined
                }
              >
                {dayNameFor(day)}
              </a>
            ))}
          </nav>
          <a
            href="/planner?reset=1"
            className="mt-auto text-xs text-accent hover:underline"
          >
            Reset Week
          </a>
          <button
            aria-label="Close navigation"
            className="absolute right-6 top-6 p-2"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>
      </div>
      {/* Main Section */}
      <main className="flex-1 p-2 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
