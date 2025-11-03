# ConceptsPro Frontend

React-based frontend for the ConceptsPro Learning Management System.

## 🚀 Features

- **Modern React 18** with Vite
- **Tailwind CSS** for styling
- **Component-based Architecture** - Reusable UI components
- **Context API** - User state management
- **API Integration** - Connected to backend API
- **Responsive Design** - Mobile-first approach
- **Interactive Visualizations** - Data communication framework visuals

## 📁 Project Structure

```
frontend/
├── src/
│   ├── assets/
│   │   ├── images/          # Image assets
│   │   └── styles/          # CSS files
│   ├── components/
│   │   ├── common/          # Reusable components
│   │   ├── visuals/         # Visualization components
│   │   ├── ChatBot.jsx      # AI assistant
│   │   └── Navigation.jsx   # Navigation bar
│   ├── config/              # Configuration files
│   │   ├── api.js           # API configuration
│   │   └── data/            # Static data (courses, frameworks)
│   ├── context/             # React Context providers
│   │   └── UserContext.jsx  # User authentication context
│   ├── hooks/                # Custom React hooks
│   ├── pages/                # Page components
│   │   ├── HomePage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── CoursesPage.jsx
│   │   ├── CoursePage.jsx
│   │   ├── CalendarPage.jsx
│   │   └── ...
│   ├── services/             # API service layer
│   │   └── api.js           # API client functions
│   ├── utils/                # Utility functions
│   │   ├── helpers.js       # Helper functions
│   │   └── constants.js    # App constants
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
├── index.html               # HTML template
├── package.json
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── postcss.config.js       # PostCSS configuration
```

## 🛠️ Installation

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

3. **Start development server:**
```bash
npm run dev
```

The app will open at `http://localhost:5173` (or configured port).

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Configuration

### API Integration

The frontend connects to the backend API. Configure the API URL in `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Authentication

The app uses JWT tokens stored in localStorage. The `UserContext` manages authentication state.

### Styling

- **Tailwind CSS** - Utility-first CSS framework
- **Responsive Design** - Mobile-first breakpoints
- **Custom Components** - Reusable styled components

## 📚 Key Components

### Pages
- **HomePage** - Landing page with login
- **DashboardPage** - User dashboard with overview
- **CoursesPage** - List of all courses
- **CoursePage** - Individual course view
- **CalendarPage** - Course calendar
- **FrameworkVisualPage** - Interactive framework visualizations

### Components
- **Navigation** - Main navigation bar
- **ChatBot** - AI assistant chat interface
- **Visuals** - Encryption, Encoding, Modulation, Multiplexing visuals

### Services
- **api.js** - Centralized API client with all endpoints

## 🔌 API Integration

All API calls go through the service layer in `src/services/api.js`:

```javascript
import { coursesAPI } from '@/services/api';

// Get all courses
const courses = await coursesAPI.getAll();

// Create course
const course = await coursesAPI.create(courseData);

// Enroll in course
await coursesAPI.enroll(courseId);
```

## 🎨 Styling Guide

The app uses Tailwind CSS. Common patterns:

```jsx
// Container
<div className="max-w-7xl mx-auto px-4 py-8">

// Card
<div className="bg-white rounded-lg shadow p-6">

// Button
<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
```

## 🚀 Building for Production

```bash
npm run build
```

Output will be in the `dist/` directory, ready to be deployed.

## 🌐 Deployment

The built files can be deployed to:
- **Vercel** - Recommended for React apps
- **Netlify** - Static site hosting
- **AWS S3 + CloudFront** - Scalable hosting
- **GitHub Pages** - Free hosting

## 📝 Environment Variables

- `VITE_API_URL` - Backend API URL (required)
- `VITE_APP_NAME` - Application name
- `VITE_NODE_ENV` - Environment (development/production)

## 🤝 Integration with Backend

Ensure the backend is running before starting the frontend:

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`

The frontend will automatically connect to the backend API.

## 📖 Documentation

- See `BACKEND_SUMMARY.md` for backend API documentation
- See component files for individual component documentation

## 🐛 Troubleshooting

**API connection errors:**
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in `.env`
- Verify CORS is configured in backend

**Build errors:**
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (requires 16+)

**Styling issues:**
- Ensure Tailwind is configured correctly
- Check `tailwind.config.js` includes all content paths

---

Made with ❤️ for the ConceptsPro LMS

