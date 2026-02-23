# AGENTS.md - Teachly Project Overview

This document provides a high-level overview of the Teachly educational material marketplace architecture. It covers the overall system design, main use cases, and request flows.

For detailed implementation guidelines, see:
- [Frontend AGENTS.md](./fe/AGENTS.md) - React + Vite specifics
- [Backend AGENTS.md](./be/AGENTS.md) - NestJS + TypeORM specifics

## Architecture Overview

Teachly is a full-stack marketplace platform where teachers can upload, browse, and purchase educational materials (PDFs). The system follows a microservices-inspired architecture with clear separation of concerns.

### System Context

**Core Actors:**
- **Teachers/Refendars** - Upload, browse, and buy teaching materials
- **Payment Provider (Stripe)** - Handles secure payment processing

**Key Domain Concepts:**
- **Materials** - PDF teaching resources with metadata, previews, and thumbnails
- **Authors** - Users who upload materials
- **Consumers** - Users who purchase materials
- **Carts** - Shopping cart functionality for purchasing multiple materials

### Container Architecture

The system consists of the following containers:

1. **Web Frontend (fe/)** - React SPA served by nginx
   - Entry point: `https://app.teachly.store`
   - See: [fe/AGENTS.md](./fe/AGENTS.md)

2. **Web API (be/)** - NestJS REST API
   - Entry point: `https://api.teachly.store`
   - See: [be/AGENTS.md](./be/AGENTS.md)

3. **Identity Provider (keycloak/)** - Keycloak for authentication/authorization
   - Entry point: `https://auth.teachly.store`

4. **Backend Database** - PostgreSQL for application data
   - Stores: users, materials, carts, transactions

5. **Keycloak Database** - PostgreSQL for identity data
   - Stores: user credentials, realms, clients

6. **File Storage** - Docker volume for PDFs and generated images
   - Path: `/app/assets` (in backend container)

### Infrastructure

**SSL Termination:**
- Nginx reverse proxy handles SSL termination
- Certbot manages Let's Encrypt certificates
- All traffic is HTTPS-only

**Network Flow:**
```
User → Nginx Reverse Proxy (SSL) → Frontend (port 80)
                                → Backend API (port 3000)
                                → Keycloak (port 8080)
```

## Main Use Cases & Flows

### 1. Browse Materials
1. User accesses `https://app.teachly.store`
2. Frontend loads and fetches materials from `/api/materials`
3. Backend queries database and returns material metadata
4. Frontend displays materials with preview images

### 2. Upload Material
1. Authenticated user clicks "Upload"
2. Frontend redirects to Keycloak if not logged in
3. User fills form with title, description, price, and PDF file
4. Frontend POSTs to `/api/materials` with multipart/form-data
5. Backend:
   - Validates JWT token with Keycloak
   - Saves PDF to file storage
   - Generates preview images (PNG thumbnails)
   - Stores metadata in database
6. Returns success response

### 3. Purchase Material
1. User adds materials to cart
2. Frontend maintains cart state in Zustand store
3. User proceeds to checkout
4. Frontend POSTs to `/api/stripe/create-checkout-session`
5. Backend:
   - Creates Stripe Checkout session
   - Stores pending transaction
   - Returns checkout URL
6. Frontend redirects to Stripe
7. After payment, Stripe webhook calls `/api/stripe/webhook`
8. Backend:
   - Verifies webhook signature
   - Grants access to purchased materials
   - Updates transaction status

### 4. Download Material
1. Authenticated user accesses purchased materials
2. Frontend requests download from `/api/materials/:id/download`
3. Backend:
   - Verifies user has purchased the material
   - Streams PDF from file storage
4. Frontend triggers browser download

## Request Flow: Frontend → Backend

### Authentication Flow
```
1. User clicks "Sign In"
2. Frontend redirects to: https://auth.teachly.store/realms/teachly/protocol/openid-connect/auth
3. Keycloak authenticates user and redirects back to frontend with tokens
4. Frontend stores access token in memory (via react-oidc-context)
5. Subsequent API calls include Authorization header: "Bearer {access_token}"
6. Backend validates token by calling Keycloak's userinfo endpoint
```

### API Request Flow
```
Browser → Frontend (nginx)
  │
  ├─ Static assets (JS, CSS, images) served directly by nginx
  │
  └─ API calls to /api/* 
       │
       └─ Nginx proxies to backend:3000
            │
            └─ Backend processes request
                 ├─ Validates JWT (calls Keycloak if needed)
                 ├─ Queries PostgreSQL database (TypeORM)
                 ├─ Accesses file storage (if needed)
                 └─ Returns JSON response
```

### API Proxy Configuration

The application supports three deployment configurations with different API routing strategies:

**1. Development (Vite Dev Server):**
```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    }
  }
}
```

**2. Docker Compose (Nginx Container):**

*Frontend Container Nginx (`fe/nginx.conf`):*
```nginx
location ~ /api/(?<section>.+) {
  proxy_pass http://172.17.0.1:3000/$section$is_args$args;
}
```

*Reverse Proxy Nginx (`deploy/reverse-proxy/nginx.conf`):*
```nginx
location ~ /api/(?<section>.+) {
  proxy_pass $scheme://172.17.0.1:3000/$section$is_args$args;
}
```

**3. Kubernetes (Ingress Controller) - Current Production:**

The Kubernetes ingress handles path-based routing at the cluster level:

```yaml
# teachme-frontend-ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    nginx.ingress.kubernetes.io/use-regex: "true"
    nginx.ingress.kubernetes.io/rewrite-target: /$2
spec:
  rules:
    - host: app.teachly.store
      http:
        paths:
          # API requests → backend service
          - path: /api(/|$)(.*)
            pathType: ImplementationSpecific
            backend:
              service:
                name: teachme-backend-service
                port:
                  number: 80
          # All other requests → frontend service
          - path: /
            pathType: Prefix
            backend:
              service:
                name: teachme-frontend-service
                port:
                  number: 80
```

**Routing Examples:**

| Request | Path Received by Backend |
|---------|-------------------------|
| `app.teachly.store/api/materials` | `/materials` |
| `app.teachly.store/api/cart/buy` | `/cart/buy` |
| `app.teachly.store/api/auth/login` | `/auth/login` |

**Benefits of Kubernetes Ingress Approach:**
- ✅ No code changes required in frontend or backend
- ✅ Single SSL certificate for frontend domain
- ✅ No CORS issues (same origin)
- ✅ Path-based routing at ingress controller level
- ✅ Independent scaling of frontend and backend services

## Key Files & Directories

```
teachme/
├── fe/                 # Frontend React application
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── services/   # API service layer
│   │   ├── DTOs/       # TypeScript types
│   │   └── ...
│   ├── nginx.conf      # Production nginx config (API proxy)
│   └── AGENTS.md       # Frontend-specific guidelines
│
├── be/                 # Backend NestJS application
│   ├── src/
│   │   ├── materials/  # Materials module (upload, download)
│   │   ├── users/      # Users module
│   │   ├── cart/       # Shopping cart module
│   │   ├── stripe/     # Payment integration
│   │   └── ...
│   └── AGENTS.md       # Backend-specific guidelines
│
├── keycloak/           # Keycloak configuration
│   └── start-keycloak.sh
│
├── deploy/             # Docker Compose deployments
│   ├── docker-compose.yml
│   └── reverse-proxy/
│       └── nginx.conf  # SSL reverse proxy config
│
└── AGENTS.md           # This file
```

## Technology Stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS + Zustand
- **Backend:** NestJS + TypeScript + TypeORM + PostgreSQL
- **Authentication:** Keycloak (OpenID Connect)
- **Payments:** Stripe
- **File Processing:** Ghostscript, GraphicsMagick, Poppler
- **Containerization:** Docker + Docker Compose
- **Cloud:** DigitalOcean

## Development Notes

### Local Development URLs
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`
- Keycloak: `http://localhost:8080`

### API Proxy in Development
The frontend uses Vite's dev server proxy for API calls during development. See `fe/vite.config.ts` for proxy configuration.

### File Storage
PDFs and generated thumbnails are stored in:
- **Local:** Docker volume mounted at `/app/assets`
- **Production:** PersistentVolumeClaim `teachme-assets-pvc`

### Database Migrations
TypeORM synchronize is enabled in development. For production, migrations should be managed manually.

## Deployment

The application is deployed using ArgoCD with GitOps workflow:
1. Push changes to main branch
2. GitHub Actions builds and pushes Docker images
3. Updates image tags in `app-of-apps` repository
4. ArgoCD automatically syncs Kubernetes manifests

See Kubernetes manifests in `../app-of-apps/teachme/` directory.
