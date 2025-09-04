import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";

import HomePage from "./pages/HomePage.tsx";
import RecordPage from "./pages/RecordPage.tsx";
import StatsPage from "./pages/StatsPage.tsx";
import ListPage from "./pages/ListPage.tsx";
import ChallengesPage from "./pages/ChallengesPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage.tsx";
import TermsOfServicePage from "./pages/TermsOfServicePage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "record",
        element: (
          <ProtectedRoute>
            <RecordPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "stats",
        element: (
          <ProtectedRoute>
            <StatsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "list",
        element: (
          <ProtectedRoute>
            <ListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "challenges",
        element: (
          <ProtectedRoute>
            <ChallengesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "privacy-policy",
        element: <PrivacyPolicyPage />,
      },
      {
        path: "terms-of-service",
        element: <TermsOfServicePage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
