# Chemistry Study Guide Website

A comprehensive IB Chemistry study guide built with React, TypeScript, and Vite.

## Features

- **Interactive Topics**: Explore IB Chemistry topics with detailed explanations
- **Practice Quizzes**: Test your knowledge with difficulty-based quizzes
- **Progress Tracking**: Monitor your learning progress with localStorage
- **Responsive Design**: Works on desktop and mobile devices
- **Static Deployment**: No backend required - fully client-side

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Radix UI components
- **Routing**: Wouter (lightweight React router)
- **State Management**: React hooks + localStorage
- **3D Graphics**: Three.js for molecular visualizations

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## Deployment

This project is configured for static deployment on Vercel.

### Vercel Configuration

The `vercel.json` file is configured for:

- Static file serving from `dist/public`
- Client-side routing support (all routes redirect to `index.html`)
- Vite build process

### Deployment Steps

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically:
   - Install dependencies
   - Run `npm run build`
   - Serve files from `dist/public`
   - Handle client-side routing

### Build Output

The build process creates:

- `dist/public/index.html` - Main HTML file
- `dist/public/assets/` - Compiled CSS and JS files
- All static assets optimized for production

## Project Structure

```
StudyGuide/
├── client/                 # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and data
│   │   └── hooks/         # Custom React hooks
│   └── index.html         # Entry HTML file
├── shared/                # Shared TypeScript types
├── vercel.json           # Vercel deployment config
├── vite.config.ts        # Vite build configuration
└── package.json          # Dependencies and scripts
```

## Data Sources

All data is static and included in the build:

- **Topics**: Defined in `client/src/lib/topics.ts`
- **Quiz Questions**: Defined in `client/src/lib/quiz-data.ts`
- **Topic Quizzes**: Defined in `client/src/lib/topic-quiz-data.ts`
- **Chemistry Data**: Defined in `client/src/lib/chemistry-data.ts`

## Browser Support

- Modern browsers with ES2020 support
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## License

MIT License
