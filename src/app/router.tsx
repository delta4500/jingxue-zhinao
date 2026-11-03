import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { CreateProjectPage } from "../pages/CreateProjectPage/CreateProjectPage";
import { DashboardPage } from "../pages/DashboardPage/DashboardPage";
import { FilesPage } from "../pages/FilesPage/FilesPage";
import { HistoryPage } from "../pages/HistoryPage/HistoryPage";
import { IdeaComparisonPage } from "../pages/IdeaComparisonPage/IdeaComparisonPage";
import { LandingPage } from "../pages/LandingPage/LandingPage";
import { NotFoundPage } from "../pages/NotFoundPage/NotFoundPage";
import { ProjectDetailPage } from "../pages/ProjectDetailPage/ProjectDetailPage";
import { ProposalEditorPage } from "../pages/ProposalEditorPage/ProposalEditorPage";
import { SettingsPage } from "../pages/SettingsPage/SettingsPage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="create" element={<CreateProjectPage />} />
        <Route path="ideas" element={<IdeaComparisonPage />} />
        <Route path="projects" element={<ProjectDetailPage />} />
        <Route path="proposal" element={<ProposalEditorPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="files" element={<FilesPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
