import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Revenue from "./pages/Revenue";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Setting";
import Accounts from "./pages/Accounts";
import Decks from "./pages/Decks";
import ReviewRequest from "./pages/ReviewRequest";
import AdminLogin from "./pages/AdminLogin";
import Notification from "./pages/Notification";
import { Toaster } from "sonner";
import Packages from "./pages/Packages";
import Withdrawals from "./pages/Withdrawals";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = !!localStorage.getItem("token");

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const protectedRoutes = [
    { path: "/", element: <Index /> },
    { path: "/accounts", element: <Accounts /> },
    { path: "/revenue", element: <Revenue /> },
    { path: "/decks", element: <Decks /> },
    { path: "/settings", element: <Settings /> },
    { path: "/review/:id", element: <ReviewRequest /> },
    { path: "/packages", element: <Packages /> },
    { path: "/notification", element: <Notification /> },
    { path: "/withdrawals", element: <Withdrawals /> },
];

const publicRoutes = [
    { path: "/login", element: <AdminLogin /> },
    { path: "*", element: <NotFound /> },
];

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster
                richColors
                toastOptions={{
                    style: {
                        backgroundColor: "#ffffff",
                        color: "#1f2937",
                        fontWeight: "bold",
                        boxShadow: "0 4px 12px rgba(31, 41, 55, 0.3)",
                    },
                }}
            />
            <BrowserRouter>
                <Routes>
                    {/* Public routes */}
                    {publicRoutes.map(({ path, element }) => (
                        <Route key={path} path={path} element={element} />
                    ))}

                    {/* Protected routes */}
                    {protectedRoutes.map(({ path, element }) => (
                        <Route
                            key={path}
                            path={path}
                            element={<ProtectedRoute>{element}</ProtectedRoute>}
                        />
                    ))}
                </Routes>
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
