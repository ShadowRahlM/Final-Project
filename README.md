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
index.html
pages/        # App pages (HTML/JS)
services/     # API calls and utilities
styles/       # CSS files
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
  - `GET /diary` — Fetch all entries
  - `GET /diary/:id` — Get single entry
  - `POST /diary` — Create new entry
  - `PUT /diary/:id` — Update entry
  - `DELETE /diary/:id` — Delete entry

## Customization

- Edit styles in `styles/landing.css`
- Add new pages in the `pages/` folder
- Update API logic in `services/`

## Credits

- ShadowRahlM(Edwin Mugabi)

---

**Enjoy your journaling!**