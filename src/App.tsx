import { useState, useEffect } from "react";
import { LoginPage } from "./components/LoginPage";
import { Dashboard } from "./components/Dashboard";

export interface User {
  email: string;
  token: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  // Check localStorage for logged-in user
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (email: string, password: string, remember: boolean) => {
  if (email === "swaji@gmail.com" && password === "5950") {
    const loggedInUser: User = {
      email,
      token: "mock-token-" + Date.now(),
    };
    setUser(loggedInUser);
    if (remember) localStorage.setItem("user", JSON.stringify(loggedInUser));
    return true;
  }
  return false;
};


  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
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
