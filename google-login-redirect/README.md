Perfect 👌
Based on your flow, here’s a **README.md** file that documents the **Google Authentication setup and flow** in your project.

---

````markdown
# 🔐 Google Authentication Flow (React + Zustand + Backend)

This project integrates **Google OAuth login** with a frontend built in **React + Zustand** and a backend that handles token verification.  
The flow ensures secure login, session verification, and automatic logout on session timeout.

---

## 🚀 Authentication Flow

### 1. User Clicks "Continue with Google"
- Component: `Login.tsx`
- Action: Calls `loginWithProvider("google")` from `useAuthStore`.

```tsx
const handleContinueWithGoogle = () => {
  loginWithProvider("google");
};
````

This triggers a **redirect** to the backend provider route:

```ts
loginWithProvider: (provider: string) => {
  const redirectUrl = `${serviceBaseUrl}/auth/provider?provider=${provider}`;
  window.location.href = redirectUrl;
}
```

---

### 2. Backend Handles Google Login

* Backend authenticates with Google.
* On success → redirects user back to `/`.

---

### 3. Verify Token After Login

* Page: `Home.tsx`
* On mount, it calls `verifyTokenAfterLogin()` once.

```tsx
useEffect(() => {
  verifyTokenAfterLogin();
}, [verifyTokenAfterLogin]);
```

* This step **verifies the token** with backend (`verifyTokenForLoginService`) and stores user details in Zustand.

```ts
verifyTokenAfterLogin: async () => {
  const data = await verifyTokenForLoginService();
  if (data?.code === 1040) {
    set({ user: data.result });
  } else {
    set({ user: null });
  }
}
```

✅ Result: Logged-in user is stored in global state.

---

### 4. Periodic Session Verification

* Implemented in `App.tsx`:

```tsx
useEffect(() => {
  if (!user) return;
  const interval = setInterval(() => {
    verifySessionPeriodically();
  }, 5000);
  return () => clearInterval(interval);
}, [user]);
```

* Runs **every 5 seconds** to check if the session is still valid.
* If expired → user is logged out and client storage cleared.

```ts
verifySessionPeriodically: async () => {
  const data = await verifyTokenService();
  if (data.code !== 1040) {
    get().logout();
  }
}
```

---

### 5. Logout Flow

* Clears Zustand state + storage (`localStorage`, `sessionStorage`).
* Calls backend `logoutService()`.

```ts
logout: async () => {
  set({ user: null, isLoading: false });
  await logoutService();
  useAuthStore.persist.clearStorage();
  sessionStorage.clear();
  localStorage.clear();
}
```

---

### 6. Protected Routes

* `ProtectedRoute.tsx` ensures restricted pages are accessible only if `user` exists.
* If not logged in → redirects to `/login`.

```tsx
if (!user) {
  navigate('/login');
}
```

Example:

```tsx
<Route
  path="/booking"
  element={
    <ProtectedRoute>
      <Booking />
    </ProtectedRoute>
  }
/>
```

---

## 🔑 Summary of Flow

1. **Click Google Button** → Redirects to backend OAuth.
2. **Backend Auth** → Redirects back to `/`.
3. **`Home.tsx` Mounted** → Calls `verifyTokenAfterLogin()` to store user.
4. **`App.tsx` Interval** → Calls `verifySessionPeriodically()` every 5s.
5. **If Invalid Session** → User logged out automatically.
6. **Protected Routes** → Only accessible if user is authenticated.

---

## 🛡 Benefits

* 🔄 Automatic session refresh checks
* ❌ Auto logout on session timeout
* 🔐 Protected routes with redirect
* 🗄 Centralized state management with Zustand

---



