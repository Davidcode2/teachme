# Agent Instructions for Teachly Frontend

This is a React + TypeScript + Vite frontend application for Teachly, an educational material marketplace.

## Build Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Lint (ESLint)
npm run lint

# Preview production build locally
npm run preview
```

## Code Style Guidelines

### Imports

- Always use `.tsx` or `.ts` extensions in imports (e.g., `import Card from "./card.tsx"`)
- Use `type` prefix for type imports: `import type { JSX } from "react"`
- Group imports: React, third-party libraries, internal modules
- Use named imports from React: `import { useState, useEffect } from "react"`

### Formatting

- Single quotes for strings
- No semicolons
- 2-space indentation
- Prettier with Tailwind CSS plugin (`prettier-plugin-tailwindcss`)

### Types

- Strict TypeScript enabled (`strict: true` in tsconfig.json)
- Use explicit return types for functions (e.g., `function App(): JSX.Element`)
- Define types in `src/DTOs/` for data models
- Use PascalCase for types/interfaces
- Avoid `any` - use proper types or `unknown`

### Naming Conventions

- **Components**: PascalCase (e.g., `Card.tsx`, `AddMaterial.tsx`)
- **Services**: PascalCase (e.g., `AuthService.ts`, `CardService.ts`)
- **DTOs**: PascalCase (e.g., `Material.ts`, `User.ts`)
- **Actions/Loaders**: camelCase (e.g., `addMaterialAction.ts`, `materialLoader.ts`)
- **Hooks**: camelCase with `use` prefix (e.g., `useDebouncedValue.ts`)
- **Store hooks**: Prefix with `use` and suffix with `Store` (e.g., `useAccessTokenStore`)

### Component Patterns

- Use functional components with explicit JSX.Element return type
- Destructure props in function parameters
- Use React hooks for state management
- Wrap components with Zustand stores for global state

### Error Handling

- Use `useErrorStore` for global error management
- Custom errors should have `message` and `code` properties
- Log errors to console before adding to store

### Styling

- Tailwind CSS v4 with `@import "tailwindcss"` in index.css
- Use Tailwind utility classes for styling
- Support dark mode with `data-theme="dark"` attribute
- Custom fonts: `font-sans`, `font-serif`, `font-mono`, `font-handwriting`, `font-body`

### Environment Variables

- All env vars must start with `VITE_`
- Access via `import.meta.env.VITE_*`
- Required: `VITE_OIDC_AUTHORITY_URL`, `VITE_OIDC_CLIENT_ID`, `VITE_OIDC_REDIRECT_URL`

## Architecture

- **Vite** + **SWC** for fast builds
- **React Router v7** for routing
- **Zustand** for state management
- **Tailwind CSS v4** for styling
- **OIDC** authentication via `react-oidc-context`
- **SWR** for data fetching
- **GSAP** for animations

## Directory Structure

```
src/
  components/     # React components (grouped by feature)
  services/       # Business logic services
  actions/        # React Router actions
  loaders/        # React Router loaders
  DTOs/           # Type definitions
  hooks/          # Custom React hooks
  store.tsx       # Zustand stores
  routes.tsx      # Route definitions
```

## Deployment

The application is containerized with Docker and deployed using Nginx:

### Docker Build

```bash
# Build production image
docker build -t teachly-frontend .

# Run container
docker run -p 80:80 teachly-frontend
```

### GitHub Actions Deployment

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build
        env:
          VITE_OIDC_AUTHORITY_URL: ${{ secrets.VITE_OIDC_AUTHORITY_URL }}
          VITE_OIDC_CLIENT_ID: ${{ secrets.VITE_OIDC_CLIENT_ID }}
          VITE_OIDC_REDIRECT_URL: ${{ secrets.VITE_OIDC_REDIRECT_URL }}

      - name: Build and push Docker image
        run: |
          docker build -t ${{ secrets.DOCKER_REGISTRY }}/teachly-fe:${{ github.sha }} .
          docker push ${{ secrets.DOCKER_REGISTRY }}/teachly-fe:${{ github.sha }}

      - name: Deploy to server
        run: |
          ssh ${{ secrets.SSH_USER }}@${{ secrets.SSH_HOST }} "
            docker pull ${{ secrets.DOCKER_REGISTRY }}/teachly-fe:${{ github.sha }} &&
            docker stop teachly-fe || true &&
            docker rm teachly-fe || true &&
            docker run -d --name teachly-fe -p 80:80 ${{ secrets.DOCKER_REGISTRY }}/teachly-fe:${{ github.sha }}
          "
```

### Required Secrets

- `VITE_OIDC_AUTHORITY_URL`: OIDC provider URL
- `VITE_OIDC_CLIENT_ID`: OIDC client ID
- `VITE_OIDC_REDIRECT_URL`: OIDC redirect URL
- `DOCKER_REGISTRY`: Container registry URL
- `SSH_USER`, `SSH_HOST`: Deployment server credentials

## Testing

No test framework currently configured. To add testing:

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

## Notes

- API proxy configured in `vite.config.ts` for development
- Nginx serves built files and proxies `/api/*` to backend
- Uses React Router loaders/actions for data loading
- Supports OIDC authentication flow
