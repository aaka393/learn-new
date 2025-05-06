import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { ApiResponseBlank } from "../types/apiResponse";
import { ThemeToggle } from "../components/ThemeToggle";

interface IFormInput {
  username: string;
  password: string;
}

export function Login() {
  const { verifyToken, loginUser, isLoggedIn, isLoading } = useAuthStore();
  const [storeError, setStoreErrorState] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();
  const navigate = useNavigate();

  useEffect(() => {
    verifyToken()
      .then((isValid) => {
        if (isValid) {
          navigate("/push");
        } else {
          navigate("/login");
        }
      })
      .catch(() => {
        navigate("/login");
      });
  }, [verifyToken, navigate]);

  const onLogin: SubmitHandler<IFormInput> = async (data) => {
    setStoreErrorState(null);
    try {
      const res = await loginUser({
        username: data.username,
        password: data.password,
      });

      if (res.code === 1003 && isLoggedIn) {
        const role = res.result?.role;
        if (role === "admin") {
          navigate("/adminNotification");
        } else {
          navigate("/push");
        }
      } else {
        setStoreErrorState(res.message || "Invalid credentials. Please try again.");
      }
    } catch (error: any) {
      if (error.response?.data) {
        const apiResponse: ApiResponseBlank = error.response.data;
        const { code, message } = apiResponse;
        setStoreErrorState(
          code === 1004
            ? "Invalid username or password"
            : message || "An unexpected error occurred. Please try again."
        );
      } else {
        setStoreErrorState("An unexpected error occurred. Please try again.");
      }
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
          Sign In
        </h2>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
          Enter your credentials to access your account
        </p>

        {storeError && (
          <div className="mt-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 px-4 py-2 rounded-md text-sm">
            {storeError}
          </div>
        )}

        <form onSubmit={handleSubmit(onLogin)} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="text"
              {...register("username", { required: "Username is required" })}
              className="mt-1 w-full px-4 py-2 rounded-lg bg-white/80 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              disabled={isLoading}
            />
            {errors.username && <p className="text-sm text-red-600 mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="mt-1 w-full px-4 py-2 rounded-lg bg-white/80 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              disabled={isLoading}
            />
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 text-white font-semibold rounded-lg shadow-md transition-all duration-300 flex items-center justify-center"
          >
            {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
