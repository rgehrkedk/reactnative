# Claude Guide for React Native Boilerplate

## Commands

- **Development**: `npm run dev` | `dev:ios` | `dev:android` | `dev:web`
- **Building**: `npm run dev:build:mobile` | `dev:build:web`
- **Linting**: `npm run lint` (ESLint) | `npm run format` (Prettier)
- **Testing**: `npm run test` (all) | `npm run test:watch` (watch mode)
- **Single test**: `npx jest -t "test name"` | `npx jest path/to/test.tsx`
- **Environment**: `npm run dev:config:public` (show config)

## Code Style

- **TypeScript**: Strong typing with `strict: true` in tsconfig.json
- **Formatting**: Prettier with 2-space indent, single quotes
- **Imports**: Use path aliases (`@/*`) for app root imports
- **State Management**: Redux Toolkit with typed slices
- **Error Handling**: Try/catch with typed errors, avoid throwing untyped errors
- **Components**: Functional components with hooks, avoid class components
- **Naming**: PascalCase for components/types, camelCase for variables/functions
- **Testing**: Jest with @testing-library/react-native

## Project Structure

- **app/**: Expo Router routes (folder-based routing)
- **components/**: Reusable UI elements (elements/, layouts/)
- **hooks/**: Custom React hooks
- **services/**: API/external service integrations
- **slices/**: Redux Toolkit state slices
- **theme/**: Global styling constants
