# Frontend Project Structure

## Overview

This document explains the organization of the frontend codebase.

## Directory Structure

```
frontend/
│
├── src/                          # Source code
│   │
│   ├── assets/                   # Static assets
│   │   ├── images/              # Image files
│   │   └── styles/              # CSS files
│   │       └── index.css        # Main stylesheet
│   │
│   ├── components/              # React components
│   │   ├── common/              # Reusable components
│   │   ├── visuals/             # Visualization components
│   │   │   ├── EncryptionVisual.jsx
│   │   │   ├── EncodingVisual.jsx
│   │   │   ├── ModulationVisual.jsx
│   │   │   └── MultiplexingVisual.jsx
│   │   ├── ChatBot.jsx          # AI assistant component
│   │   └── Navigation.jsx       # Navigation bar component
│   │
│   ├── config/                   # Configuration files
│   │   ├── api.js               # API configuration
│   │   └── data/                 # Static data
│   │       ├── courses.js       # Course data
│   │       └── frameworks.js    # Framework data
│   │
│   ├── context/                   # React Context providers
│   │   └── UserContext.jsx      # User authentication context
│   │
│   ├── hooks/                     # Custom React hooks
│   │   └── (add custom hooks here)
│   │
│   ├── pages/                     # Page components
│   │   ├── HomePage.jsx          # Landing/login page
│   │   ├── DashboardPage.jsx     # User dashboard
│   │   ├── CoursesPage.jsx       # Courses list
│   │   ├── CoursePage.jsx        # Individual course
│   │   ├── CalendarPage.jsx      # Calendar view
│   │   ├── FrameworkVisualPage.jsx # Framework visualizations
│   │   ├── DirectoryPage.jsx     # Directory/listing
│   │   ├── HelpPage.jsx          # Help/documentation
│   │   └── NotepadPage.jsx      # Note-taking
│   │
│   ├── services/                  # API service layer
│   │   └── api.js                # API client functions
│   │
│   ├── utils/                     # Utility functions
│   │   ├── helpers.js            # Helper functions
│   │   └── constants.js          # App constants
│   │
│   ├── App.jsx                    # Main app component
│   └── main.jsx                   # Application entry point
│
├── index.html                     # HTML template
├── package.json                   # Dependencies
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind CSS config
├── postcss.config.js             # PostCSS config
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
└── README.md                     # Documentation
```

## File Organization Principles

### 1. Components (`src/components/`)
- **common/** - Reusable UI components used across multiple pages
- **visuals/** - Specialized visualization components
- Component files use PascalCase (e.g., `Navigation.jsx`)

### 2. Pages (`src/pages/`)
- Each file represents a full page/route
- Pages compose components to create complete views
- Use PascalCase naming

### 3. Services (`src/services/`)
- API client functions
- All backend communication goes through here
- Organized by domain (auth, courses, assignments, etc.)

### 4. Utils (`src/utils/`)
- Helper functions
- Constants
- Pure functions with no side effects

### 5. Context (`src/context/`)
- React Context providers
- Global state management
- UserContext manages authentication

### 6. Config (`src/config/`)
- Configuration files
- Static data (can be moved to backend later)
- API configuration

### 7. Assets (`src/assets/`)
- Static files (images, fonts, etc.)
- CSS files
- Non-code resources

## Naming Conventions

- **Components**: PascalCase (e.g., `Navigation.jsx`)
- **Hooks**: camelCase starting with `use` (e.g., `useAuth.js`)
- **Utilities**: camelCase (e.g., `helpers.js`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_CONFIG`)
- **Files**: Match export name

## Import Patterns

### Relative Imports
```javascript
import Component from '../components/Component';
```

### Absolute Imports (Recommended)
```javascript
import Component from '@/components/Component';
import { helper } from '@/utils/helpers';
```

## Component Structure

```javascript
// 1. Imports
import React from 'react';
import { someHook } from '@/hooks/useHook';

// 2. Component definition
const ComponentName = ({ prop1, prop2 }) => {
  // 3. Hooks
  const [state, setState] = useState();
  
  // 4. Effects
  useEffect(() => {
    // effect code
  }, [dependencies]);
  
  // 5. Event handlers
  const handleClick = () => {
    // handler code
  };
  
  // 6. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

// 7. Export
export default ComponentName;
```

## Best Practices

1. **Keep components focused** - One responsibility per component
2. **Extract reusable logic** - Use hooks and utils
3. **Use services for API calls** - Don't call fetch directly in components
4. **Prop validation** - Use PropTypes or TypeScript
5. **Error boundaries** - Wrap routes in error boundaries
6. **Loading states** - Always handle loading and error states
7. **Accessibility** - Use semantic HTML and ARIA attributes

## Adding New Features

### Adding a New Page
1. Create file in `src/pages/PageName.jsx`
2. Add route in `App.jsx`
3. Add navigation link if needed

### Adding a New Component
1. Create file in appropriate directory
2. Export from barrel file if in `common/`
3. Import and use in parent component

### Adding API Integration
1. Add function to `src/services/api.js`
2. Use in component via hook or direct call
3. Handle loading/error states

### Adding Utilities
1. Add function to `src/utils/helpers.js` or new file
2. Export and import where needed

