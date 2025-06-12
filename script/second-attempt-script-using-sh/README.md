
````markdown
# 🧠 Full Stack Automation (Strapi + React + Tailwind)

This project automates the full setup of a **Strapi backend** and a **Vite + React + Tailwind frontend** for the Yensi Solution platform.
````
---

### 1️⃣ Run Backend Bootstrap Script

In your Git Bash or terminal, execute:

```bash
./setup_strapi.sh
````

This will:

* Scaffold and start the Strapi backend on `http://localhost:1337`
* Wait until the server is fully ready

---

### 2️⃣ Register Admin Manually

After the backend starts:

1. Open your browser and go to: [http://localhost:1337/admin](http://localhost:1337/admin)
2. Complete the **admin registration** process
3. Login to the admin panel
4. Copy the **JWT token** from the browser dev tools (`Authorization: Bearer <token>`)

---

### 3️⃣ Run Collection + Content Creator

Back in the terminal, run:

```bash
./create_collections.sh
```

This script will:

* Prompt you to paste the JWT token
* Create:

  * `nav-item` component
  * `Header`, `Footer`, and `Main` collection types
  * Sample content in all collections
* Start the frontend app (`npm run dev`) from the `frontend-apple-template` folder

---

## ⚙️ Permissions (Important)

Before content is visible on the UI:

1. Go to Strapi Admin Panel → **Settings**
2. Open: **Users & Permissions Plugin** → **Roles** → **Public**
3. Scroll down to each created collection type (`header`, `footer`, `main`)
4. Enable **Find / Find One** permissions
5. Click **Save**

---

## 🖥️ Frontend

The frontend will be served automatically at:

```bash
http://localhost:5174
```

Make sure your `.env` or `serviceBaseUrl` points to `http://localhost:1337` for API access.

---

## ✅ Result

* Fully structured Strapi backend with real content
* React + Tailwind frontend rendering dynamic data
* Minimal manual steps — everything is script-driven and production-ready

---

> Built with ❤️ for speed, automation, and maintainability.

