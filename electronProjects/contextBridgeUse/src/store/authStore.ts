import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginUser, registerUser, logout, verifyTokenService } from "../services/authService";
import { LoginCredentials, RegisterData } from "../types/authTypes";
import { ApiResponseBlank } from "../types/apiResponse";

interface AuthState {
  user: any | null;
  username: string | null;
  email: string | null;
  profilePicture: string | null;
  message: string;
  isAuthenticated: boolean;
  isLoggedIn: boolean;
  authState: "notChecked" | "checking" | "valid" | "invalid";
  error: string | null;
  successMessage: string | null;
  isLoading: boolean;
  subscribed: boolean;
  loginUser: (credentials: LoginCredentials) => Promise<ApiResponseBlank>;
  checkForValidToken: () => Promise<ApiResponseBlank>;
  registerUser: (credentials: RegisterData) => Promise<ApiResponseBlank>;
  verifyToken: () => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      username: null,
      email: null,
      profilePicture: null,
      message: "",
      isAuthenticated: false,
      isLoggedIn: true,
      authState: "notChecked",
      error: null,
      successMessage: null,
      isLoading: false,
      subscribed: false,

      loginUser: async (credentials: LoginCredentials): Promise<ApiResponseBlank> => {
        set({ isLoading: true, authState: "checking" });
        try {
          const response = await loginUser(credentials);
          if (response.code === 1003) {
            const user = response.result;
            set({
              user,
              username: user.username,
              email: user.email,
              isAuthenticated: true,
              authState: "valid",
              message: response.message,
              subscribed: user.subscribed,
            });
      
          } else {
            set({
              isAuthenticated: false,
              authState: "invalid",
              error: response.message,
            });
          }
          set({ isLoading: false });
          return response;
        } catch (error: any) {
          set({
            isAuthenticated: false,
            authState: "invalid",
            isLoading: false,
            error: error.message || "Unable to login at the moment. Please try again later.",
          });
          return {
            code: 1000,
            message: error.message || "Login failed due to a network issue.",
          };
        }
      },

      checkForValidToken: async (): Promise<ApiResponseBlank> => {
        set({ isLoading: true, authState: "checking" });
        try {
          const response = await verifyTokenService();
          if (response.data.code === 1004) {
            set({
              user: response.data.code,
              isAuthenticated: true,
              authState: "valid",
              subscribed: response.data.result.subscribed,
            });
          } else {
            set({ authState: "invalid", isAuthenticated: false });
          }
          set({ isLoading: false });
          return response.data;
        } catch {
          set({
            isAuthenticated: false,
            authState: "invalid",
            isLoading: false,
          });
          return { code: 1000, message: "Token validation failed." };
        }
      },

      registerUser: async (credentials: RegisterData): Promise<ApiResponseBlank> => {
        set({ isLoading: true, authState: "checking" });
        try {
          const response = await registerUser(credentials);
          if (response.code === 1046) {
            set({
              user: response.result,
              isAuthenticated: true,
              authState: "valid",
              successMessage: response.message,
            });
          } else {
            set({
              isAuthenticated: false,
              authState: "invalid",
              error: response.message,
            });
          }
          set({ isLoading: false });
          return response;
        } catch (error: any) {
          set({
            isAuthenticated: false,
            authState: "invalid",
            isLoading: false,
            error: error.message || "Registration failed.",
          });
          return {
            code: 999,
            message: error.message || "Registration failed due to an issue.",
          };
        }
      },

      verifyToken: async (): Promise<boolean> => {
        set({ isLoading: true, error: null });
      
        try {
          console.debug("🔐 Starting token verification...");
      
          const result = await verifyTokenService();
          const responseData = result?.data;
      
          if (responseData?.code === 1040) {
            const newUser = responseData.result;
      
            set((state) => {
              const updatedSubscribed = newUser.subscribed;
      
              return {
                user: state.user ?? newUser,
                username: state.username ?? newUser.username,
                email: state.email ?? newUser.email,
                profilePicture: state.profilePicture ?? newUser.profilePicture,
                subscribed: updatedSubscribed, 
              };
            });
      
            set({ isLoading: false });
            return true;
          } else {
            console.warn(`❌ Token invalid: ${responseData?.message}`);
            document.cookie = "access_token=; Max-Age=0; path=/";
      
            set({
              user: null,
              username: null,
              email: null,
              error: responseData?.message || "Invalid token",
              authState: "invalid",
              isLoading: false,
            });
      
            return false;
          }
        } catch (error: any) {
          console.error("💥 Error during token verification:", error);
      
          set({
            error: "An error occurred during token verification",
            authState: "invalid",
            isLoading: false,
          });
      
          return false;
        }
      },
      
      logout: async () => {
        try {
          const responseCode = await logout();
          if (responseCode === 1005) {
            document.cookie = "access_token=; Max-Age=0; path=/; domain=" + window.location.hostname + "; Secure; SameSite=Lax";
            localStorage.removeItem("auth-storage");
            sessionStorage.clear();
            await useAuthStore.persist.clearStorage();
            set({
              user: null,
              username: null,
              email: null,
              profilePicture: null,
              isAuthenticated: false,
              authState: "invalid",
              isLoading: false,
            });
          } else {
            console.warn("Logout response code did not match expected value:", responseCode);
          }
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
    }),
    { name: "auth-storage" }
  )
);
