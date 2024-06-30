import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import { Layout } from "./components/Layout/Layout";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import PetitionsPage from "./pages/PetitionsPage/PetitionsPage";
import AboutPage from "./pages/AboutPage/AboutPage";
import { ExternalLoginPage } from "./pages/LoginPage/ExternalLoginPage";
import PetitionEditPage from "./pages/PetitionEditPage/PetitionEditPage";
import PetitionsAnalytics from "./pages/PetitionsAnalytics/PetitionsAnalytics";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/external-login-page/:token"
          element={<ExternalLoginPage />}
        />
        <Route element={<PrivateRoute />}>
          <Route path="/petitions" element={<PetitionsPage />} />
          <Route
            path="/petitions/edit/:petitionId"
            element={<PetitionEditPage />}
          />
          <Route path="/analytics" element={<PetitionsAnalytics />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </>
  )
);
