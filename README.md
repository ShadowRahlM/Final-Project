# Diary App (Frontend)

An interactive Diary App frontend built with HTML, CSS, and JavaScript.  
Connects to a backend API for user authentication and diary management.

## Features

- User authentication (login/logout)
- Create, read, update, and delete diary entries
- Responsive, modern UI
- Clean code structure

## Folder Structure

```
index.html          # Landing page
pages/              # App pages (HTML)
services/           # API calls and utilities (JS modules)
styles/
├── reset.css       # CSS reset
├── base.css        # Shared styles (gradient, buttons, forms)
├── landing.css     # Landing page styles
├── login.css       # Login/signup form styles
└── diary.css       # Diary page styles
```

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd <project-folder>
   ```

2. **Open `index.html` in your browser**  
   (No build step required for vanilla JS/CSS/HTML)

## API Reference

- **Base URL:**  
  `https://tunga-diary-api.onrender.com/api/fullstack/`

- **Endpoints:**  
  - `POST /auth/login` — User login
  - `POST /auth/signup` — User registration
  - `GET /diary` — Fetch all entries
  - `GET /diary/:id` — Get single entry
  - `POST /diary` — Create new entry
  - `PUT /diary/:id` — Update entry
  - `DELETE /diary/:id` — Delete entry

## Customization

- Edit landing styles in `styles/landing.css`
- Edit shared styles in `styles/base.css`
- Add new pages in the `pages/` folder
- Update API logic in `services/`

## Credits

- ShadowRahlM(Edwin Mugabi)

---

**Enjoy your journaling!**