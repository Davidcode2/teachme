# Teachme Kubernetes Migration Plan

## Overview

This plan outlines the migration of the teachme application from Docker Compose deployment to a Kubernetes cluster using the ArgoCD app-of-apps pattern.

## Current Architecture

The teachme application consists of 4 services:

1. **Backend** (`be/`): Node.js/NestJS API (port 3000)
   - Uses Ghostscript, GraphicsMagick, Poppler for PDF processing
   - Stores assets in volume
   
2. **Frontend** (`fe/`): Vue.js SPA served by nginx (port 80)
   - Built with Node.js, served as static files
   
3. **Keycloak** (`keycloak/`): Authentication/Authorization service (port 8080/8443)
   - Custom image with startup script
   
4. **Keycloak DB** (`keycloak_db/`): PostgreSQL database for Keycloak
   - Persists data in volume

## Current Deployment

- GitHub Actions workflows SSH into a server
- Build containers on the server using docker-compose
- Deploy via `docker compose up -d`

## Target Architecture (Kubernetes)

Following the patterns from `home-at-sea` and `app-of-apps`:

### 1. Container Registry Setup

Build and push images to GitHub Container Registry (ghcr.io):

```yaml
# New workflow: .github/workflows/build-and-push.yml
# Reusable workflow similar to home-at-sea
# Build and push: teachme-backend, teachme-frontend, teachme-keycloak
```

### 2. Kubernetes Manifests Structure

Create `k8s/` directory in this repository with the following structure:

```
k8s/
├── namespace.yaml              # teachme namespace
├── backend/
│   ├── deployment.yaml         # Backend app deployment
│   ├── service.yaml            # ClusterIP service
│   ├── ingress.yaml            # Ingress with TLS
│   └── configmap.yaml          # Non-sensitive env vars
├── frontend/
│   ├── deployment.yaml         # Frontend (nginx) deployment
│   ├── service.yaml            # ClusterIP service
│   └── ingress.yaml            # Ingress with TLS
├── keycloak/
│   ├── deployment.yaml         # Keycloak deployment
│   ├── service.yaml            # ClusterIP service
│   ├── ingress.yaml            # Ingress with TLS
│   └── configmap.yaml          # Keycloak configuration
└── keycloak-db/
    ├── deployment.yaml         # PostgreSQL deployment
    ├── service.yaml            # ClusterIP service
    ├── pvc.yaml                # Persistent volume claim
    └── secret.yaml             # Database credentials
```

### 3. Detailed Component Specifications

#### Namespace
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: teachme
```

#### Backend
- **Image**: `ghcr.io/davidcode2/teachme-backend:latest`
- **Port**: 3000
- **Environment**: From ConfigMap and Secret
- **Volumes**: 
  - PVC for `/app/assets` (file uploads)
- **Resources**: (to be determined based on usage)

#### Frontend
- **Image**: `ghcr.io/davidcode2/teachme-frontend:latest`
- **Port**: 80
- **Environment**: API_URL pointing to backend service
- **No volumes needed** (static files in container)

#### Keycloak
- **Image**: `ghcr.io/davidcode2/teachme-keycloak:latest`
- **Port**: 8080
- **Environment**: Database connection, realm config
- **Command**: Custom startup script

#### Keycloak DB
- **Image**: `postgres:16-alpine` (or latest)
- **Port**: 5432
- **Storage**: 10Gi PVC for `/var/lib/postgresql/data`
- **Credentials**: Stored in Secret

### 4. Ingress Configuration

Option A: Separate subdomains
- `api.teachme.io` → backend
- `app.teachme.io` → frontend
- `auth.teachme.io` → keycloak

Option B: Path-based routing
- `teachme.io/api/*` → backend
- `teachme.io/auth/*` → keycloak
- `teachme.io/*` → frontend

**Recommendation**: Option A (subdomains) for cleaner separation and easier CORS handling.

### 5. Secrets Management

Create the following secrets (base64 encoded):

- `teachme-backend-secret`: API keys, JWT secrets
- `teachme-keycloak-db-secret`: POSTGRES_USER, POSTGRES_PASSWORD, connection strings
- `teachme-keycloak-secret`: Keycloak admin credentials, realm secrets

### 6. ConfigMaps

- `teachme-backend-config`: NODE_ENV, LOG_LEVEL, etc.
- `teachme-frontend-config`: API_BASE_URL
- `teachme-keycloak-config`: KC_HOSTNAME, KC_PROXY, etc.

### 7. Persistent Volume Claims

- `teachme-assets-pvc`: 10Gi for backend file uploads
- `teachme-keycloak-db-pvc`: 10Gi for Keycloak database

## Migration Steps

### Phase 1: Preparation (No downtime)

1. **Create Kubernetes manifests** in `k8s/` directory
2. **Update GitHub workflows**:
   - Replace SSH deployment with build-and-push to ghcr.io
   - Create reusable workflow similar to home-at-sea
   - Separate workflows for backend, frontend, and keycloak
3. **Add secrets** to GitHub repository for ghcr.io access
4. **Test image builds** locally

### Phase 2: App-of-Apps Registration (No downtime)

1. **Create teachme app in app-of-apps repo**:
   ```
   app-of-apps/
   └── teachme/
       ├── teachme-namespace.yaml
       ├── teachme-backend-deployment.yaml
       ├── teachme-backend-service.yaml
       ├── teachme-backend-ingress.yaml
       ├── teachme-frontend-deployment.yaml
       ├── teachme-frontend-service.yaml
       ├── teachme-frontend-ingress.yaml
       ├── teachme-keycloak-deployment.yaml
       ├── teachme-keycloak-service.yaml
       ├── teachme-keycloak-ingress.yaml
       ├── teachme-keycloak-db-deployment.yaml
       ├── teachme-keycloak-db-service.yaml
       └── teachme-keycloak-db-pvc.yaml
   ```
2. **Create Application manifest** in app-of-apps root:
   ```yaml
   apiVersion: argoproj.io/v1alpha1
   kind: Application
   metadata:
     name: teachme
     namespace: argocd
   spec:
     project: default
     source:
       repoURL: https://github.com/Davidcode2/app-of-apps.git
       targetRevision: HEAD
       path: teachme
     destination:
       server: https://kubernetes.default.svc
       namespace: teachme
     syncPolicy:
       automated:
         prune: true
         selfHeal: true
   ```

### Phase 3: Data Migration (Downtime required)

1. **Schedule maintenance window**
2. **Backup current data**:
   ```bash
   # On current server
   docker exec teachme_keycloak_db pg_dump -U keycloak keycloak > keycloak_backup.sql
   docker cp teachme_backend:/app/assets ./assets_backup
   ```
3. **Stop current deployment**:
   ```bash
   cd /root/teachme/deploy
   docker compose down
   ```
4. **Deploy to Kubernetes**: ArgoCD will automatically sync
5. **Restore data**:
   ```bash
   # Import database to new PostgreSQL
   kubectl cp keycloak_backup.sql teachme/<keycloak-db-pod>:/tmp/
   kubectl exec -it <keycloak-db-pod> -- psql -U keycloak -d keycloak -f /tmp/keycloak_backup.sql
   
   # Restore assets
   kubectl cp ./assets_backup/* teachme/<backend-pod>:/app/assets/
   ```

### Phase 4: DNS Cutover

1. **Update DNS records** to point to Kubernetes ingress IP
2. **Verify SSL certificates** are issued by cert-manager
3. **Monitor logs** for errors
4. **Test all functionality**:
   - User registration/login
   - File uploads
   - API endpoints
   - Frontend routing

### Phase 5: Cleanup

1. **Verify stability** (wait 24-48 hours)
2. **Remove old server deployment**:
   ```bash
   rm -rf /root/teachme
   ```
3. **Update DNS** if temporary records were used
4. **Document** any manual steps taken

## Configuration Changes Required

### Backend Changes

1. **Environment variables**:
   - Update database connection strings
   - Update Keycloak URL
   - Update CORS origins

2. **Dockerfile optimization**:
   - Consider multi-stage build to reduce image size
   - Already has good structure, verify it works with ghcr.io

### Frontend Changes

1. **API URL configuration**:
   - Update `nginx.conf` or env vars to point to new backend service
   - Consider runtime configuration vs build-time

### Keycloak Changes

1. **Hostname configuration**:
   - Update KC_HOSTNAME to new ingress domain
   - Configure KC_PROXY for nginx ingress

## Rollback Plan

If issues occur during migration:

1. **Immediate rollback** (DNS level):
   - Revert DNS to old server IP
   - `docker compose up -d` on old server
   
2. **Data consistency**:
   - Ensure database backups are taken before migration
   - Document any data written during partial migration

## Estimated Timeline

- **Phase 1** (Preparation): 2-3 days
- **Phase 2** (App-of-Apps): 1 day
- **Phase 3** (Data Migration): 2-4 hours (including downtime)
- **Phase 4** (DNS Cutover): 30 minutes
- **Phase 5** (Cleanup): 1 day after stability confirmed

**Total**: ~1 week including testing and buffer time

## Open Questions

1. What domain names should be used for the ingresses?
2. What are the resource requirements (CPU/memory) for each service?
3. Are there any other environment variables or secrets not documented?
4. Is there a staging environment to test the migration first?
5. What is the acceptable downtime window?

## References

- `home-at-sea` repository: Reusable build workflow pattern
- `app-of-apps` repository: Kubernetes manifest patterns
- Current `deploy/docker-compose.yml`: Service definitions and environment variables
