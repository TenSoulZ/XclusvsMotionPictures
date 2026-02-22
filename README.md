# XclusvsMotionPictures

A professional video production portfolio website built with React (frontend) and Django (backend).

## Features

- 📹 Video portfolio with YouTube/Vimeo integration
- 📸 Photo gallery with lightbox
- 🎨 Modern glassmorphism design
- 🔐 Admin dashboard for content management
- 📱 Fully responsive design
- ⚡ Fast performance with optimized builds

## Tech Stack

### Frontend
- React 19
- Vite
- React Bootstrap
- Framer Motion
- Axios

### Backend
- Django 5.2
- Django REST Framework
- SQLite (development)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- pip

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Generate a new SECRET_KEY:
   ```bash
   python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
   ```
   
5. Update `.env` with your generated SECRET_KEY

6. Run migrations:
   ```bash
   python manage.py migrate
   ```

7. Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```

8. Start the development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (optional, copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Update environment variables with your social media links

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open http://localhost:5173 in your browser

## Development

### Backend API Endpoints

- `/api/videos/` - Video CRUD operations
- `/api/photos/` - Photo CRUD operations
- `/api/categories/` - Category management
- `/api/contact/` - Contact form messages
- `/admin/` - Django admin panel

### Frontend Routes

- `/` - Home page
- `/gallery` - Photo gallery
- `/videos` - Video portfolio
- `/services` - Services page
- `/about` - About page
- `/contact` - Contact form
- `/admin` - Admin dashboard (protected)
- `/login` - Login page

## Architecture

The project follows a decoupled architecture:

- **Backend**: A Django-based REST API providing data for all content types. It uses custom ViewSets and Serializers for efficient data handling and includes email notifications for contact inquiries.
- **Frontend**: A React application using Vite for fast builds. It features a modern design system with glassmorphism, Framer Motion for animations, and React Bootstrap for layout.
- **State Management**: React Hooks (useState, useEffect) are used for local state, and context is used for cross-cutting concerns like Toasts.

## Recent Improvements & Refactoring

### Admin Portal & Security (Latest Update)
- **Separate Portal Architecture**: The Admin Portal (`/admin` and `/login`) is now architecturally separated from the public website layout. It uses a dedicated clean layout without the public navigation bar or footer, creating a focused, professional workspace.
- **Strict Authentication**: Implemented a rigorous security model where the frontend strictly verifies the user's session with the backend using a dedicated endpoint (`/api/me/`).
- **No Bypass**: The backend endpoint (`/api/me/`) enforces `TokenAuthentication`, effectively preventing access via shared Django Admin session cookies. Access to the React Admin Panel is exclusively granted via tokens obtained through the portal's login form.
- **Enhanced Navigation**: Added "View Site" and "Log Out" functionality directly within the Admin Dashboard sidebar for better usability.

### Frontend Clean-up
- **Admin Dashboard**: The `AdminDashboard.jsx` component was refactored into smaller, manageable sub-components (`DashboardTable.jsx`, `DashboardModal.jsx`).
- **Documentation**: Comprehensive JSDoc comments added to core components to improve maintainability.
- **Code Cleanup**: Removed unused temporary files and logs.

### Backend Documentation
- Added detailed docstrings to all `models.py`, `views.py`, and `serializers.py` to explain data structures, permissions, and business logic.

## Building for Production

### Frontend

```bash
cd frontend
npm run build
```

The build output will be in `frontend/dist/`

### Backend

Ensure you:
1. Set `DEBUG=False` in `.env`
2. Configure proper `ALLOWED_HOSTS`
3. Set up proper CORS origins
4. Use a production database (PostgreSQL recommended)
5. Collect static files: `python manage.py collectstatic`

## Security Notes

⚠️ **Important:**
- Never commit `.env` files to version control
- Always use environment variables for sensitive data
- Change the default SECRET_KEY in production
- Configure proper CORS settings for production
- Use HTTPS in production

## License

Copyright © 2025 XclusvsMotionPictures. All rights reserved.

## Contact

For inquiries, visit the contact page on the website.
