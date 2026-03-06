import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import LogMeal from "./pages/LogMeal";
import MealHistory from "./pages/MealHistory";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";

function AppLayout({ children }) {
    return (
        <>
            <Navbar />
            <main className="app-main">{children}</main>
        </>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected routes with Navbar */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <AppLayout><Dashboard /></AppLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/log-meal" element={
                        <ProtectedRoute>
                            <AppLayout><LogMeal /></AppLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/history" element={
                        <ProtectedRoute>
                            <AppLayout><MealHistory /></AppLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/analytics" element={
                        <ProtectedRoute>
                            <AppLayout><Analytics /></AppLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <AppLayout><Profile /></AppLayout>
                        </ProtectedRoute>
                    } />

                    {/* Default redirect */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
