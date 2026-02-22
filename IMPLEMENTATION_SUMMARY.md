# Kubernetes Migration - Implementation Summary

## ✅ Completed

### 1. Kubernetes Manifests (`k8s/` directory)

Created 16 manifest files organized by component:

```
k8s/
├── namespace.yaml                    # teachme namespace
├── argocd-application.yaml           # ArgoCD Application (for ref)
├── README.md                         # Documentation
├── backend/
│   ├── deployment.yaml              # Backend API (ghcr.io/davidcode2/teachme-backend)
│   ├── service.yaml                 # ClusterIP on port 80 → 3000
│   ├── ingress.yaml                 # api.teachme.io with TLS
│   ├── configmap.yaml               # NODE_ENV, KEYCLOAK_URL
│   ├── secret.yaml                  # ⚠️ TEMPLATE - update before deploy
│   └── pvc.yaml                     # 10Gi for assets
├── frontend/
│   ├── deployment.yaml              # Frontend nginx (ghcr.io/davidcode2/teachme-frontend)
│   ├── service.yaml                 # ClusterIP on port 80
│   ├── ingress.yaml                 # app.teachme.io with TLS
│   └── configmap.yaml               # VITE_API_URL
├── keycloak/
│   ├── deployment.yaml              # Keycloak (ghcr.io/davidcode2/teachme-keycloak)
│   ├── service.yaml                 # ClusterIP ports 8080, 9000
│   ├── ingress.yaml                 # auth.teachme.io with TLS
│   ├── configmap.yaml               # KC_HOSTNAME, KC_PROXY, etc.
│   └── secret.yaml                  # ⚠️ TEMPLATE - update before deploy
└── keycloak-db/
    ├── deployment.yaml              # PostgreSQL 16-alpine
    ├── service.yaml                 # ClusterIP port 5432
    ├── pvc.yaml                     # 10Gi for database
    └── secret.yaml                  # ⚠️ TEMPLATE - update before deploy
```

### 2. GitHub Workflows (`.github/workflows/`)

**Reusable Workflow:**
- `build-and-push-reusable.yml` - Generic workflow for building and pushing to ghcr.io

**Component Workflows (trigger on path changes to main/master):**
- `build-backend.yml` - Triggers on `be/**` changes
- `build-frontend.yml` - Triggers on `fe/**` changes  
- `build-keycloak.yml` - Triggers on `keycloak/**` changes

Images will be tagged as:
- `ghcr.io/davidcode2/teachme-backend:latest`, `:sha`, `:version`
- `ghcr.io/davidcode2/teachme-frontend:latest`, `:sha`, `:version`
- `ghcr.io/davidcode2/teachme-keycloak:latest`, `:sha`, `:version`

### 3. App-of-Apps Integration

**In `app-of-apps` repository:**

Created `teachme-app.yaml` - ArgoCD Application manifest pointing to the `teachme/` directory.

Created `teachme/` directory with all Kubernetes manifests copied from the teachme repo.

## ⚠️ Action Required Before Deployment

### 1. Update Secrets

Three secret files need real values:

**`k8s/backend/secret.yaml`** (also in `app-of-apps/teachme/`):
```yaml
stringData:
  JWT_SECRET: your-jwt-secret-here
  KEYCLOAK_CLIENT_SECRET: your-keycloak-client-secret
  # Add other backend secrets
```

**`k8s/keycloak/secret.yaml`** (also in `app-of-apps/teachme/`):
```yaml
stringData:
  KEYCLOAK_ADMIN: admin
  KEYCLOAK_ADMIN_PASSWORD: strong-admin-password
  KC_DB_USERNAME: keycloak
  KC_DB_PASSWORD: strong-db-password
```

**`k8s/keycloak-db/secret.yaml`** (also in `app-of-apps/teachme/`):
```yaml
stringData:
  POSTGRES_DB: keycloak
  POSTGRES_USER: keycloak
  POSTGRES_PASSWORD: strong-db-password  # Must match KC_DB_PASSWORD above
```

### 2. Verify Domain Names

Update ingress hosts in:
- `k8s/backend/ingress.yaml`: `api.teachme.io`
- `k8s/frontend/ingress.yaml`: `app.teachme.io`
- `k8s/keycloak/ingress.yaml`: `auth.teachme.io`

Update configmap references:
- `k8s/backend/configmap.yaml`: `KEYCLOAK_URL` → `https://auth.teachme.io`
- `k8s/frontend/configmap.yaml`: `VITE_API_URL` → `https://api.teachme.io`
- `k8s/keycloak/configmap.yaml`: `KC_HOSTNAME` → `auth.teachme.io`

### 3. Git Workflow

**Commit and push teachme repo:**
```bash
cd /path/to/teachme
git add k8s/ .github/workflows/K8S_MIGRATION_PLAN.md IMPLEMENTATION_SUMMARY.md
git commit -m "feat: add Kubernetes manifests and build workflows

- Add k8s/ directory with all deployment manifests
- Add reusable build-and-push workflow
- Add component-specific build workflows
- Add migration plan and implementation summary"
git push origin main
```

**Commit and push app-of-apps repo:**
```bash
cd /path/to/app-of-apps
git add teachme/ teachme-app.yaml
git commit -m "feat: add teachme application to app-of-apps

- Add teachme ArgoCD Application manifest
- Add all Kubernetes manifests for teachme deployment"
git push origin main
```

## 🚀 Deployment Steps

### Phase 1: Build Images (No downtime)

1. Push the new workflows to main branch
2. GitHub Actions will automatically build and push images to ghcr.io
3. Or trigger manually via GitHub UI: Actions → Build and Push [Component] → Run workflow

### Phase 2: Register with ArgoCD (No downtime)

1. Apply the teachme Application manifest to the cluster:
   ```bash
   kubectl apply -f teachme-app.yaml
   ```
2. ArgoCD will sync the manifests and create the namespace + resources
3. Verify in ArgoCD UI that the app is synced

### Phase 3: Data Migration (Downtime required)

1. **Schedule maintenance window**
2. **Backup from current server:**
   ```bash
   # SSH to current server
   docker exec teachme_keycloak_db pg_dump -U keycloak keycloak > /tmp/keycloak_backup.sql
   docker cp teachme_backend:/app/assets /tmp/assets_backup
   ```
3. **Stop old deployment:**
   ```bash
   cd /root/teachme/deploy
   docker compose down
   ```
4. **Restore to Kubernetes:**
   ```bash
   # Copy backups to pods
   kubectl cp /tmp/keycloak_backup.sql teachme/<keycloak-db-pod>:/tmp/
   kubectl cp /tmp/assets_backup/* teachme/<backend-pod>:/app/assets/
   
   # Restore database
   kubectl exec -it <keycloak-db-pod> -- psql -U keycloak -d keycloak -f /tmp/keycloak_backup.sql
   ```
5. **Restart deployments** to pick up restored data:
   ```bash
   kubectl rollout restart deployment/teachme-backend -n teachme
   kubectl rollout restart deployment/teachme-keycloak -n teachme
   ```

### Phase 4: DNS Cutover

1. Update DNS A records to point to Kubernetes ingress IP
2. Wait for SSL certificates (cert-manager will issue them automatically)
3. Test all functionality

### Phase 5: Cleanup

After 24-48 hours of stability:
1. Remove old server deployment
2. Archive old docker-compose files

## 📋 Files Created

### In teachme repository:
```
k8s/
├── namespace.yaml
├── argocd-application.yaml
├── README.md
├── backend/
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── configmap.yaml
│   ├── secret.yaml
│   └── pvc.yaml
├── frontend/
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   └── configmap.yaml
├── keycloak/
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── configmap.yaml
│   └── secret.yaml
└── keycloak-db/
    ├── deployment.yaml
    ├── service.yaml
    ├── pvc.yaml
    └── secret.yaml

.github/workflows/
├── build-and-push-reusable.yml
├── build-backend.yml
├── build-frontend.yml
└── build-keycloak.yml

K8S_MIGRATION_PLAN.md
IMPLEMENTATION_SUMMARY.md
```

### In app-of-apps repository:
```
teachme-app.yaml
teachme/
├── teachme-namespace.yaml
├── teachme-backend-deployment.yaml
├── teachme-backend-service.yaml
├── teachme-backend-ingress.yaml
├── teachme-backend-configmap.yaml
├── teachme-backend-secret.yaml
├── teachme-backend-pvc.yaml
├── teachme-frontend-deployment.yaml
├── teachme-frontend-service.yaml
├── teachme-frontend-ingress.yaml
├── teachme-frontend-configmap.yaml
├── teachme-keycloak-deployment.yaml
├── teachme-keycloak-service.yaml
├── teachme-keycloak-ingress.yaml
├── teachme-keycloak-configmap.yaml
├── teachme-keycloak-secret.yaml
├── teachme-keycloak-db-deployment.yaml
├── teachme-keycloak-db-service.yaml
├── teachme-keycloak-db-pvc.yaml
└── teachme-keycloak-db-secret.yaml
```

## 🔧 Next Steps

1. ✅ Review and customize secrets
2. ✅ Update domain names in ingresses and configmaps
3. ✅ Commit and push both repositories
4. ⏳ Trigger initial image builds
5. ⏳ Apply ArgoCD Application manifest
6. ⏳ Schedule migration window
7. ⏳ Execute data migration
8. ⏳ DNS cutover

## 📚 References

- `home-at-sea/.github/workflows/build-and-push.yaml` - Reusable workflow pattern
- `app-of-apps/immoly/` - Kubernetes manifest pattern
- `app-of-apps/immoly-app.yaml` - ArgoCD Application pattern
