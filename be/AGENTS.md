# AGENTS.md - TeachMe Backend

Guidelines for AI agents working on this NestJS backend repository.

## Project Overview

TeachMe is an educational platform backend built with NestJS, TypeORM, and PostgreSQL.

## Build/Test/Lint Commands

```bash
# Install dependencies
npm install

# Development server (watch mode)
npm run start:dev

# Build for production
npm run build

# Run production build
npm run start:prod

# Linting (auto-fix enabled)
npm run lint

# Format code
npm run format

# Run all unit tests
npm run test

# Run single test file
npm run test -- src/users/usersService/users.service.spec.ts

# Run tests matching pattern
npm run test -- --testNamePattern="findAll"

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Debug tests
npm run test:debug

# Run e2e tests
npm run test:e2e
```

## Environment Setup

Node version: 20.9.0 (see `.nvmrc`)

Docker dependencies (from tmuxinator config):

- PostgreSQL: `docker start postgres`
- Keycloak: `docker start my_keycloak_local`

Environment variables (see `.env`):

- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`
- `JWT_SECRET`, `JWT_REFRESH_SECRET`
- `STRIPE_TEST`, `STRIPE_WEBHOOK_SECRET`
- `KEYCLOAK_REALM_URL`

## Code Style Guidelines

### Imports

- NestJS imports first (`@nestjs/*`)
- External libraries second
- Internal modules third
- Use single quotes
- Add trailing commas
- Group related imports

### Naming Conventions

- Classes: PascalCase (e.g., `UsersService`, `CreateUserDto`)
- Methods/Variables: camelCase
- Database entities: singular nouns (e.g., `User`, `Material`)
- Controllers: suffix with `Controller` (e.g., `UsersController`)
- Services: suffix with `Service` (e.g., `UsersService`)
- DTOs: suffix with `Dto` (e.g., `UpdateUserDto`)

### Formatting

- Prettier config: single quotes, trailing commas
- Indent: 2 spaces
- Line width: default (80)

### TypeScript

- Strict null checks: disabled (see tsconfig.json)
- Explicit return types: optional
- Use decorators for NestJS metadata
- Entity classes should use TypeORM decorators

### Module Structure

Each feature module should have:

- `[feature].module.ts` - Module definition
- `[feature].controller.ts` - HTTP routes
- `[feature].service.ts` - Business logic
- `[feature].entity.ts` - TypeORM entities
- Subdirectories for complex features (e.g., `usersService/`, `usersController/`)

### Testing Pattern

Follow Arrange-Act-Assert:

```typescript
describe('feature', () => {
  it('should do something', async () => {
    // Arrange
    const input = { id: '1' };
    mockRepo.find.mockResolvedValue(input);

    // Act
    const result = await service.method(input);

    // Assert
    expect(result).toEqual(input);
    expect(mockRepo.find).toHaveBeenCalledWith(input);
  });
});
```

### Error Handling

- Use NestJS exceptions (`BadRequestException`, `NotFoundException`)
- Validate DTOs using `class-validator` decorators
- Return null for "not found" in repository methods
- Throw errors for invalid business logic

### API Guidelines

- Use Swagger decorators for API documentation
- Use DTOs for request/response validation
- Controllers should delegate to services
- Services should contain business logic

## Deployment

### GitHub Actions

The backend is deployed via GitHub Actions when changes are pushed to `main` or `master` branches:

**Trigger:** Automatic deployment on push to `be/**` path

**Workflow:** `.github/workflows/deploy_backend.yml`

- Builds Docker image from `be/dockerfile`
- Uses Node 22 with Ghostscript, GraphicsMagick, and Poppler for PDF processing
- SSHs into production server
- Runs `docker compose build backend` in `/root/teachme/deploy`
- Restarts container with `docker compose stop backend && docker compose up -d backend`

**Docker Configuration:**

- Multi-stage build (base → build → production)
- Production command: `npm run start:prod`
- Exposes port 3000
- Assets persisted via Docker volume

**Infrastructure:**

- Deployment files located in `deploy/` directory (sibling to `be/`)
- Uses external Docker network `app-network`
- Connected to reverse proxy for SSL termination

## Related Projects

Frontend: `../fe` (React + Vite + TailwindCSS)
