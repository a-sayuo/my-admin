import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import ContactsPage from "./pages/ContactsPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ログインページ（Layout で囲まない） */}
        <Route path="/login" element={<LoginPage />} />

        {/* Layout で全ページを囲む */}
        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/users"
          element={
            <Layout>
              <UsersPage />
            </Layout>
          }
        />
        <Route
          path="/contacts"
          element={
            <ProtectedRoute>
              <Layout>
                <ContactsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout>
              <SettingsPage />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
