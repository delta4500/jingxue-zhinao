import { Outlet } from "react-router-dom";
import { AppHeader } from "../components/layout/AppHeader";
import { AppSidebar } from "../components/layout/AppSidebar";

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-canvas text-ink-950">
      <AppSidebar />
      <AppHeader />
      <main className="min-h-[calc(100vh-4rem)] lg:ml-60">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
