import { useState } from "react";
import { Building2, Lock, Mail, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "../supabase";

interface LoginPageProps {
  onSuccess: (user: { id: string; email: string }) => void;
}

export function LoginPage({ onSuccess }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error || !data.user) {
      setError("Invalid credentials or user does not exist.");
      return;
    }

    onSuccess({ id: data.user.id, email: data.user.email! });

    if (remember) localStorage.setItem("supabaseSession", JSON.stringify(data.session));
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="1209 (1).mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-pink-800/70 to-orange-700/80" />

      {/* Login Card */}
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-3xl mb-4 shadow-2xl"
            >
              <Building2 className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-white mb-2 text-2xl font-bold">🏠 RentMaster Pro</h1>
            <p className="text-purple-100">Login with your credentials</p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-4 border-white/50"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300"
                    placeholder="••••"
                    required
                  />
                </div>
              </div>

              {/* Remember Me */}
              <div
                className="flex items-center gap-3 cursor-pointer select-none"
                onClick={() => setRemember(!remember)}
              >
                <div className="relative w-10 h-6">
                  <motion.div
                    className={`absolute inset-0 rounded-full ${
                      remember ? "bg-purple-600" : "bg-gray-300"
                    }`}
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                  <motion.div
                    className="absolute w-5 h-5 bg-white rounded-full top-0.5 left-0.5 shadow-md"
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    animate={{ x: remember ? 20 : 0 }}
                  />
                </div>
                <span className="text-gray-700">Remember Me</span>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-4 rounded-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-gray-600">
              Developed with ❤️ by Rodney Swaji
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
