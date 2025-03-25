# Claude Guide for React Native Boilerplate

## Commands
- **Development**: `npm run dev` / `dev:ios` / `dev:android` / `dev:web`
- **Building**: `npm run dev:build:mobile` / `dev:build:web` 
- **Linting**: `npm run lint` (ESLint), `npm run format` (Prettier)
- **Testing**: `npm run test` (all tests), `npm run test:watch` (watch mode)
- **Single test**: `npx jest -t "test name or pattern"` or `npx jest path/to/test.tsx`

## Code Style
- **TypeScript**: Strong typing with `strict: true`
- **Formatting**: Prettier with 2-space indent, 100 char line width, single quotes
- **Imports**: Use path aliases (`@/*`) for app root imports
- **Error handling**: Use try/catch with typed errors
- **Components**: Functional components with hooks, avoid class components
- **Naming**: PascalCase for components/types, camelCase for variables/functions
- **Testing**: Jest with @testing-library/react-native

## Project Structure
- **app/**: Expo Router routes
- **components/**: Reusable UI elements
- **hooks/**: Custom React hooks
- **services/**: API/external service integrations
- **slices/**: Redux Toolkit state slices
- **theme/**: Global styling constants