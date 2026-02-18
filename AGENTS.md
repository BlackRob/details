# AGENTS.md - Agent Coding Guidelines for Details

## Project Overview

This is a Next.js 12 project (details, a word game) using React with Mantine UI components. The project uses JavaScript/JSX primarily, with some TypeScript configuration available.

## Build, Lint, and Test Commands

### Development
```bash
npm run dev     # Start development server at http://localhost:3000
```

### Build
```bash
npm run build   # Build for production
npm run start   # Start production server
npm run export  # Build and export static site
```

### Linting
```bash
npm run lint    # Run ESLint (Next.js default configuration)
```

### Tests
**No test framework is currently configured.** If adding tests, use:
- Jest with React Testing Library (recommended for React)
- Vitest as an alternative

To run a single test file with Jest:
```bash
npx jest --testPathPattern="filename.test.js"
# or
npm test -- --testPathPattern="filename.test.js"
```

## Code Style Guidelines

### General
- Use **2 spaces** for indentation (standard in this codebase)
- Use **double quotes** for strings consistently
- Keep lines under 120 characters when practical

### File Organization
- Components: `components/` directory
- Pages: `pages/` directory  
- Data files: `data/` directory
- Utilities: co-locate with components or in appropriate modules

### Imports
```javascript
// React core first
import React from "react";

// External libraries (grouped together)
import { Stack, Box } from "@mantine/core";
import { IconX } from "@tabler/icons-react";

// Local components (relative paths)
import DrawSentence from "./Sentence";
import DrawCards from "./Cards";

// Local data/utilities
import sentences from "../data/sentences.json";
import { preInsertProcessing } from "./preInsertProcessing";
```

### Naming Conventions
- **Components**: PascalCase (e.g., `Game.jsx`, `DrawCards`)
- **Files**: PascalCase for components, camelCase for utilities
- **Functions**: camelCase
- **Constants**: camelCase or UPPER_SNAKE_CASE for true constants
- **CSS Classes**: kebab-case (e.g., `working_row_content`)

### React Patterns
- Prefer **functional components** with hooks for new code
- Use **class components** if extending React.Component (existing pattern in Game.jsx)
- Use **arrow functions** for inline callbacks
- Use **destructuring** for props

```javascript
// Functional component (preferred for new code)
const MyComponent = ({ title, onClick }) => {
  return <button onClick={onClick}>{title}</button>;
};

// Class component (existing pattern)
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = { /* ... */ };
    this.handleClick = this.handleClick.bind(this);
  }
}
```

### TypeScript
- TypeScript is configured but not enforced (`strict: false` in tsconfig.json)
- Use JSDoc comments for complex types if needed
- New components can use `.tsx` extension with TypeScript

### Error Handling
- Use `try/catch` for async operations
- Use React Error Boundary for component-level error catching
- Log errors appropriately without exposing sensitive data

### Mantine UI
- Use Mantine components as primary UI library
- Access theme via `useMantineTheme()` hook
- Use Mantine spacing system (xs, sm, md, lg, xl)
- Use Mantine colors from theme: `theme.colors[type]`

### CSS/Styling
- Use Mantine `style` prop for inline styles
- Use `<style jsx>` for component-scoped styles (existing pattern)
- Prefer CSS-in-JS approaches over separate CSS files

### State Management
- Use React `useState` for local component state
- Use React `useEffect` for side effects
- Use `this.setState` in class components (existing pattern)

### Best Practices
1. **Always** run `npm run lint` before committing
2. **Verify** build succeeds with `npm run build`
3. Use meaningful variable names
4. Keep components focused (single responsibility)
5. Extract reusable logic into utility functions
6. Use `JSON.parse(JSON.stringify(...))` for deep cloning (existing pattern)

## Project Structure
```
/components      - React components
/pages           - Next.js pages (including API routes)
/pages/api       - Serverless API functions
/data            - JSON data files
/public          - Static assets
/fonttrick      - (deleted) was utility for canvas fonts in Vercel
```

## Common Dependencies
- `@mantine/core` - UI components
- `@mantine/hooks` - React hooks
- `@tabler/icons-react` - Icons
- `react-error-boundary` - Error handling
- `satori` - SVG/PNG image generation
- `mp4-muxer` - Video encoding
