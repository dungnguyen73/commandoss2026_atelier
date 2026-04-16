import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import CreatePage from "./pages/CreatePage";
import ScanPage from "./pages/ScanPage";
import ItemDetailPage from "./pages/ItemDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="create" element={<CreatePage />} />
          <Route path="scan" element={<ScanPage />} />
          <Route path="item/:id" element={<ItemDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
