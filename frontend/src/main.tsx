import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";

import HomePage from "./pages/HomePage.tsx";
import RecordPage from "./pages/RecordPage.tsx";
import StatsPage from "./pages/StatsPage.tsx";
import ChallengesPage from "./pages/ChallengesPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "record", element: <RecordPage /> },
      { path: "stats", element: <StatsPage /> },
      { path: "challenges", element: <ChallengesPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
