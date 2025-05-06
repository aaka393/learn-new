// Register.tsx
import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "../components/ThemeToggle";

interface IFormInput {
  username: string;
  email: string;
  password: string;
  confirmpassword: string;
}

const Register = () => {
  const { registerUser } = useAuthStore();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [storeError, setStoreError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (data: IFormInput) => {
    setStoreError(null);
    try {
      const res = await registerUser(data);
      if (res.code === 1046) {
        setTimeout(() => navigate("/login"), 1020);
      } else {
        setStoreError(res.message || "An unexpected error occurred. Please try again.");
      }
    } catch (error: any) {
      setStoreError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center overflow-hidden">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      <div className="absolute w-[600px] h-[600px] bg-gradient-to-tr from-pink-400 via-purple-400 to-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob top-[-10%] left-[-20%] dark:opacity-20"></div>
      <div className="absolute w-[400px] h-[400px] bg-gradient-to-tr from-indigo-400 via-sky-400 to-cyan-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-2000 bottom-[-10%] right-[-10%] dark:opacity-30"></div>

      <div className="w-full max-w-md p-10 backdrop-blur-xl bg-white/30 dark:bg-white/10 border border-white/20 dark:border-white/10 rounded-3xl shadow-xl z-10 animate-fade-in">
        <h2 className="text-center text-4xl font-extrabold text-gray-900 dark:text-white">
          Sign Up
        </h2>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
          Fill in the details to create a new account
        </p>

        {storeError && (
          <div className="mt-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 px-4 py-2 rounded-md text-sm">
            {storeError}
          </div>
        )}

        <form
          className="mt-8 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ username, email, password, confirmpassword });
          }}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full px-4 py-2 rounded-lg bg-white/80 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 rounded-lg bg-white/80 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 rounded-lg bg-white/80 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
            <input
              type="password"
              required
              value={confirmpassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 rounded-lg bg-white/80 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 text-white font-semibold rounded-lg shadow-md transition-all duration-300 flex items-center justify-center"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
