import { useState, useEffect } from "react";
import { LoginPage } from "./components/LoginPage";
import { Dashboard } from "./components/Dashboard";
import { supabase } from "./supabase";

export interface User {
  id: string;
  email: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check Supabase session on load
  useEffect(() => {
    const restoreSession = async () => {
      const sessionData = supabase.auth.getSession();
      const localSession = localStorage.getItem("supabaseSession");

      let session: any = null;

      if (localSession) {
        session = JSON.parse(localSession);
      } else {
        const { data } = await sessionData;
        session = data.session;
      }

      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email! });
      }

      setLoading(false);
    };

    restoreSession();

    // Optional: listen for auth changes (sign-out / token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email! });
        localStorage.setItem("supabaseSession", JSON.stringify(session));
      } else {
        setUser(null);
        localStorage.removeItem("supabaseSession");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem("supabaseSession");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {!user ? (
        <LoginPage
          onSuccess={(loggedInUser) => {
            setUser(loggedInUser);
          }}
        />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}
