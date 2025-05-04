# LearnAI Frontend

A modern, interactive frontend for the LearnAI platform - an intelligent learning system that leverages AI to create personalized educational experiences.

## Table of Contents
- [Overview](#overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
- [How to Run](#how-to-run)
  - [Development Mode](#development-mode)
  - [Production Preview](#production-preview)
  - [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Features](#features)
- [UI Components](#ui-components)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Testing](#testing)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Design Resources](#design-resources)

## Overview

The LearnAI Frontend provides a responsive, intuitive user interface for students, educators, and administrators. It connects to the LearnAI Backend to deliver personalized learning experiences powered by artificial intelligence.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher) or yarn
- A modern web browser

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/LearnAI-Project.git
   cd LearnAI-Project/LearnAI-Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

The application will open in your default browser at `http://localhost:3000`.

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_SOCKET_URL=http://localhost:8000
REACT_APP_ENVIRONMENT=development
```

## How to Run

### Development Mode

To run the application in development mode with hot-reloading:

```bash
npm run start
# or
yarn start
```

This will start the development server on http://localhost:3000. The page will automatically reload if you make changes to the code.

### Production Preview

To preview the production build locally:

```bash
npm run build
npm install -g serve
serve -s build
```

This will serve the production build on http://localhost:5000.

### Available Scripts

The project includes several useful scripts:

- `npm start` - Starts the development server
- `npm test` - Launches the test runner in interactive watch mode
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App configuration
- `npm run lint` - Runs ESLint to identify and report code issues
- `npm run format` - Formats code using Prettier
- `npm run analyze` - Analyzes the bundle size
- `npm run storybook` - Starts Storybook for component development

## Project Structure

```
LearnAI-Frontend/
├── public/             # Static files
├── src/                # Source files
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable UI components
│   ├── context/        # Context API providers
│   ├── hooks/          # Custom React hooks
│   ├── layouts/        # Page layouts
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── store/          # State management
│   ├── styles/         # Global styles
│   ├── utils/          # Utility functions
│   ├── App.js          # Main App component
│   └── index.js        # Entry point
├── .env                # Environment variables
├── package.json        # Dependencies and scripts
└── README.md           # This file
```

## Features

- **Adaptive Learning Interface**: Dynamically adjusts to user learning patterns
- **Interactive Lessons**: Engaging multimedia content with interactive exercises
- **Progress Tracking**: Visual analytics of learning progress
- **AI-Powered Recommendations**: Personalized content suggestions
- **Real-time Feedback**: Immediate responses to user actions
- **Collaborative Learning Tools**: Discussion boards and group projects
- **Accessibility Features**: Compliant with WCAG 2.1 standards
- **Multi-device Support**: Responsive design for all screen sizes

## UI Components

The frontend uses a component library that includes:

- Navigation menus
- Learning content viewers
- Interactive quizzes and assessments
- Progress indicators
- User dashboards
- Administrative tools
- Notification systems

Component documentation is available in the Storybook:

```bash
npm run storybook
# or
yarn storybook
```

## State Management

The application uses a combination of React Context API and Redux for state management:

- **Context API**: For theme, authentication, and user preferences
- **Redux**: For more complex state with many interactions

## API Integration

The frontend communicates with the backend through a service layer:

```javascript
// Example API call
import api from '../services/api';

const fetchCourses = async () => {
  try {
    const response = await api.get('/courses');
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};
```

## Testing

The project includes:

- Unit tests for components
- Integration tests for features
- End-to-end tests for user flows

Run tests with:

```bash
npm test
# or
yarn test
```

For coverage report:

```bash
npm run test:coverage
# or
yarn test:coverage
```

## Building for Production

Create an optimized production build:

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `build/` directory.

## Deployment

The frontend can be deployed to various hosting platforms:

### Vercel/Netlify (Recommended)

1. Connect your repository to Vercel or Netlify
2. Configure build settings:
   - Build command: `npm run build` or `yarn build`
   - Output directory: `build`
   - Environment variables: Add all variables from your `.env` file

### Manual Deployment

1. Build the project as described above
2. Upload the contents of the `build` directory to your web server
3. Configure the server to handle client-side routing:
   
   For Apache (.htaccess):
   ```
   RewriteEngine On
   RewriteBase /
   RewriteRule ^index\.html$ - [L]
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /index.html [L]
   ```
   
   For Nginx:
   ```
   location / {
     try_files $uri $uri/ /index.html;
   }
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the coding standards (run `npm run lint` to check)
4. Write tests for your changes
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Design Resources

- **Figma Designs**: [Link to Figma project]
- **UI Style Guide**: Available in `docs/style-guide.md`
- **Icon Set**: We use [Specific icon library] for icons
- **Color Palette**:
  - Primary: #3498db
  - Secondary: #2ecc71
  - Accent: #e74c3c
  - Background: #f5f7fa
  - Text: #2c3e50
