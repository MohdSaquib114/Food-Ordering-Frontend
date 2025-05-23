
# 📦 Food Ordering App – Frontend Setup

This is the frontend for the full-stack Food Ordering assignment built with **React + Vite + Tailwind CSS**.

---

##  Features

- 🍽️ Role-based UI for **Admin**, **Manager**, and **Member**
- 🛒 Restaurant browsing and menu ordering
- 📦 Order management with status updates
- 💳 Admin-only payment method configuration
- 🔐 JWT authentication via backend
- 🌐 Centralized Axios API

---

##  Project Structure (Quick Look)

```
src/
├── components/         # Reusable components
├── context/            # Auth & Cart context
├── lib/axios.js        # Axios config with token
├── pages/              # React Router pages
├── routes/             # Route configuration
├── App.jsx
├── main.jsx
.env                    # VITE_API_URL, etc.
```

---

##  Prerequisites

- Node.js v18+ recommended  
- Backend running on port 9000 or available remotely

---

##  Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/your-username/food-ordering-frontend.git
cd food-ordering-frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root of the project:

```
VITE_API_URL=http://localhost:9000/api
```

Or use your deployed backend URL if hosted on Render, etc.

---

##  Run the Frontend Locally

```bash
npm run dev
```

The app will be available at:  
📍 http://localhost:5173

---

##  Authentication Notes

- The app uses **JWT-based auth** via `localStorage`.  
- Roles supported: **ADMIN**, **MANAGER**, **MEMBER**  
- Auth headers are automatically injected using a central Axios instance.

---

##  API Connection

- The frontend uses a custom Axios instance at `src/lib/axios.js`  
- JWT is injected into all API calls via `AuthContext`

---
