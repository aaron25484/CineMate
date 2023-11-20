import { Routes, Route } from "react-router-dom";
import { FC } from "react";
import PrivateRoutes from "./PrivateRoutes.routes";
import LandingPage from "../pages/LandingPage";
import ProfilePage from "../components/Profile";

const RoutesComponent: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/*"
        element={
          <PrivateRoutes>
            <Routes>
              <Route path="/user/profile" element={<ProfilePage />} />
            </Routes>
          </PrivateRoutes>
        }
      />
    </Routes>
  );
};

export default RoutesComponent;
