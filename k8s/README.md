# Teachme Kubernetes Manifests

This directory contains Kubernetes manifests for deploying the teachme application to a Kubernetes cluster using ArgoCD.

## Directory Structure

```
k8s/
├── namespace.yaml              # teachme namespace
├── backend/
│   ├── deployment.yaml         # Backend API deployment
│   ├── service.yaml            # ClusterIP service (port 80 → 3000)
│   ├── ingress.yaml            # Ingress with TLS (api.teachme.io)
│   ├── configmap.yaml          # Non-sensitive env vars
│   ├── secret.yaml             # Sensitive env vars (TEMPLATE - update!)
│   └── pvc.yaml                # Assets persistent volume claim
├── frontend/
│   ├── deployment.yaml         # Frontend (nginx) deployment
│   ├── service.yaml            # ClusterIP service
│   ├── ingress.yaml            # Ingress with TLS (app.teachme.io)
│   └── configmap.yaml          # Frontend configuration
├── keycloak/
│   ├── deployment.yaml         # Keycloak deployment
│   ├── service.yaml            # ClusterIP service (ports 8080, 9000)
│   ├── ingress.yaml            # Ingress with TLS (auth.teachme.io)
│   ├── configmap.yaml          # Keycloak configuration
│   └── secret.yaml             # Keycloak secrets (TEMPLATE - update!)
└── keycloak-db/
    ├── deployment.yaml         # PostgreSQL deployment
    ├── service.yaml            # ClusterIP service (port 5432)
    ├── pvc.yaml                # Database persistent volume claim
    └── secret.yaml             # Database credentials (TEMPLATE - update!)
```

## Prerequisites

1. Kubernetes cluster with:
   - NGINX Ingress Controller
   - cert-manager for TLS certificates
   - ArgoCD for GitOps deployment

2. GitHub Container Registry access:
   - Images will be pushed to `ghcr.io/davidcode2/teachme-*`

## Configuration Required

### 1. Update Secrets

**IMPORTANT:** The `secret.yaml` files contain placeholder values. You must update them with real values before deployment.

Generate base64-encoded secrets:
```bash
# Example: encode a password
echo -n 'your-password' | base64
```

Or use `stringData` (as in the templates) for plain text that Kubernetes will encode.

Required secrets:
- `teachme-backend-secret`: JWT secrets, API keys, Keycloak client secrets
- `teachme-keycloak-secret`: Admin credentials, database credentials
- `teachme-keycloak-db-secret`: PostgreSQL database credentials

### 2. Update ConfigMaps

Review and update:
- `backend/configmap.yaml`: Keycloak realm, API URLs
- `frontend/configmap.yaml`: API endpoint URL
- `keycloak/configmap.yaml`: Hostname, proxy settings

### 3. Update Ingress Hosts

The ingress files use `teachme.io` subdomains. Update to your actual domains:
- `api.teachme.io` → backend
- `app.teachme.io` → frontend
- `auth.teachme.io` → keycloak

## Deployment

### Automatic (ArgoCD)

1. The app-of-apps repository contains the ArgoCD Application manifest
2. ArgoCD will automatically sync the manifests from this repository
3. Changes to this `k8s/` directory will be automatically applied

### Manual (kubectl)

For testing or initial setup:

```bash
# Apply all manifests
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/backend/
kubectl apply -f k8s/frontend/
kubectl apply -f k8s/keycloak/
kubectl apply -f k8s/keycloak-db/

# Verify deployment
kubectl get pods -n teachme
kubectl get svc -n teachme
kubectl get ingress -n teachme
```

## Data Migration

When migrating from Docker Compose:

1. **Backup current data**:
   ```bash
   # From the current server
   docker exec teachme_keycloak_db pg_dump -U keycloak keycloak > keycloak_backup.sql
   docker cp teachme_backend:/app/assets ./assets_backup
   ```

2. **Restore to Kubernetes**:
   ```bash
   # Copy backup to keycloak-db pod
   kubectl cp keycloak_backup.sql teachme/<keycloak-db-pod>:/tmp/
   
   # Restore database
   kubectl exec -it <keycloak-db-pod> -- psql -U keycloak -d keycloak -f /tmp/keycloak_backup.sql
   
   # Restore assets
   kubectl cp ./assets_backup/* teachme/<backend-pod>:/app/assets/
   ```

## Troubleshooting

### Check pod logs
```bash
kubectl logs -n teachme -l app=teachme-backend
kubectl logs -n teachme -l app=teachme-frontend
kubectl logs -n teachme -l app=teachme-keycloak
kubectl logs -n teachme -l app=teachme-keycloak-db
```

### Check ingress
```bash
kubectl get ingress -n teachme
kubectl describe ingress -n teachme teachme-backend-ingress
```

### Check certificates
```bash
kubectl get certificates -n teachme
kubectl describe certificate -n teachme teachme-backend-tls
```

### Port forwarding for debugging
```bash
# Access backend locally
kubectl port-forward -n teachme svc/teachme-backend-service 3000:80

# Access keycloak admin console
kubectl port-forward -n teachme svc/teachme-keycloak-service 8080:8080
```

## Resource Limits

Current resource requests/limits:

| Component | CPU Request | CPU Limit | Memory Request | Memory Limit |
|-----------|-------------|-----------|----------------|--------------|
| Backend | 250m | 500m | 256Mi | 512Mi |
| Frontend | 100m | 200m | 64Mi | 128Mi |
| Keycloak | 250m | 500m | 512Mi | 1Gi |
| Keycloak DB | 100m | 250m | 256Mi | 512Mi |

Adjust these based on actual usage patterns.
