# voting-api

## Getting Started

### skaffold
1. Step 1
```
minikube start

minikube addon enable ingress

minikube tunnel
```

2. Step 2 
```
skaffold dev --no-prune=false --cache-artifacts=false --no-prune-children=false
```

### docker-compose
