import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import CreatePage from "./pages/CreatePage";
import ScanPage from "./pages/ScanPage";
import ItemDetailPage from "./pages/ItemDetailPage";

import ZkLoginCallbackPage from "./pages/ZkLoginCallbackPage";

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="create" element={<CreatePage />} />
          <Route path="scan" element={<ScanPage />} />
          <Route path="item/:id" element={<ItemDetailPage />} />
          <Route path="auth/callback" element={<ZkLoginCallbackPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
