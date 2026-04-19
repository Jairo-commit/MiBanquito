import { Routes, Route, Navigate } from "react-router-dom"
import { Login } from "./pages/login/login"
import { Register } from "./pages/register/register"
import { Home } from "./pages/home/home"
import { NotFound } from "./pages/notFound/notFound"
import { ProtectedRoute } from "./components/protectedRoute"

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

export function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/register" element={<RegisterAndLogout />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}