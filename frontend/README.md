# FreeRADIUS React Frontend

A modern web dashboard for managing FreeRADIUS users, built with **React**, **Vite**, and **Tailwind CSS**. Connects to the [FreeRADIUS FastAPI Backend](https://github.com/sumantagogoi/freeradius-fastapi-backend) for all data operations.

---

## Features

- **Login** — JWT-based authentication against the backend API
- **Dashboard** — Overview card showing total users (placeholders for active sessions and historical logins — coming with accounting)
- **User Management** — Full CRUD for RADIUS users with a clean table UI
- **Search & Sort** — Filter users by username/password, sort by ID or name
- **Password Reveal** — Hover over the eye icon to temporarily reveal a password
- **Extra Attributes** — Store Full Name, Email, Phone, and Notes alongside each user
- **User Detail Modal** — Click any user to view and edit all stored attributes
- **Dark Theme** — Easy on the eyes, built with Tailwind CSS

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS 3 |
| Routing | React Router 7 |
| HTTP | Axios (with JWT interceptor) |

## Quick Start

```bash
git clone git@github.com:sumantagogoi/freeradius-simplefront-react.git
cd freeradius-simplefront-react

npm install
npm run dev
```

The dev server runs at `http://localhost:5173`. It proxies `/api/*` requests to the backend at `http://localhost:8001`.

### Prerequisites

Make sure the [FreeRADIUS FastAPI Backend](https://github.com/sumantagogoi/freeradius-fastapi-backend) is running on port 8001 (or update the proxy target in `vite.config.js`).

### Seed the admin user

After starting the backend:

```bash
curl -X POST http://localhost:5173/api/auth/seed \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

Then log in at `http://localhost:5173` with `admin` / `admin123`.

## Screens

### Login
Simple credential form. JWT is stored in localStorage and automatically attached to all API requests.

### Dashboard
Shows total user count from the database. Session statistics will populate once RADIUS accounting is enabled on the server.

### Users
- Table with ID, Username, and Password columns
- Sortable by ID or Username
- Search filters by username or password text
- **Add User** button opens a modal with fields for:
  - Full Name, Username, Password, Email, Phone, Notes
- Click any row to open a detail modal showing all attributes
- Hover the eye 👁️ to reveal password, move away to hide
- Delete button with confirmation dialog

## Project Structure

```
src/
├── api/
│   ├── client.js       # Axios instance with JWT interceptor
│   ├── auth.js         # Login API
│   ├── users.js        # User CRUD API
│   └── stats.js        # Dashboard stats API
├── components/
│   ├── Layout.jsx      # Sidebar + nav shell
│   ├── UserModal.jsx   # User detail/edit modal
│   └── AddUserModal.jsx # New user form modal
├── context/
│   └── AuthContext.jsx  # Auth state management
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   └── Users.jsx
├── App.jsx             # Router setup
├── main.jsx            # Entry point
└── index.css           # Tailwind base + custom scrollbar
```

## Related

- [FreeRADIUS FastAPI Backend](https://github.com/sumantagogoi/freeradius-fastapi-backend) — REST API that powers this dashboard
- [FreeRADIUS Project](https://freeradius.org/) — The RADIUS server

## License

[MIT](LICENSE)
