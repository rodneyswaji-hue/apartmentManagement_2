import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { Dashboard } from "./components/Dashboard";

export interface User {
  email: string;
  token: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (email: string, password: string) => {
    // TODO: Replace with actual API call to backend
    // For now, mock authentication
    if (email && password) {
      setUser({
        email,
        token: "mock-token-" + Date.now(),
      });
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    // TODO: Add API call to invalidate token
    setUser(null);
  };

  return (
    <div className="min-h-screen">
      {!user ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}