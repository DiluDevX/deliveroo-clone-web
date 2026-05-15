### Building and running your application

When you're ready, start your application by running:
`docker compose up --build`.

Your application will be available at http://localhost:8080.

### GitHub Actions deployment to Azure VM

This repo includes `.github/workflows/deploy-azure-vm.yml`.

When a pull request from `develop` into `main` is merged, the workflow:

1. Builds the frontend Docker image.
2. Pushes both the merge commit SHA and `latest` tags to Azure Container Registry.
3. Connects to an Azure VM over SSH.
4. Pulls the pushed image and replaces the running `deliveroo-clone-web` container.

Azure naming note: the Azure equivalent of AWS ECR is Azure Container Registry
(ACR). The Azure equivalent of an EC2 instance is an Azure Virtual Machine.

Required GitHub repository secrets:

```text
ACR_LOGIN_SERVER=your-registry.azurecr.io
ACR_USERNAME=your-acr-username
ACR_PASSWORD=your-acr-password
AZURE_VM_HOST=your-vm-public-ip-or-dns
AZURE_VM_USER=azureuser
AZURE_VM_SSH_KEY=private SSH key allowed to access the VM
VITE_BFF_API_KEY=frontend-facing BFF API key
VITE_FIREBASE_API_KEY=Firebase API key
VITE_FIREBASE_MESSAGING_SENDER_ID=Firebase messaging sender id
VITE_FIREBASE_APP_ID=Firebase app id
VITE_STRIPE_PUBLISHABLE_KEY=Stripe publishable key
```

Required GitHub repository variables:

```text
VITE_API_URL=https://your-bff-domain.example.com/api
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
```

The Azure VM must already have Docker installed and must allow inbound HTTP
traffic on port 80. The workflow runs the container with `-p 80:80`.

### Deploying your application to the cloud

First, build your image, e.g.: `docker build -t myapp .`.
If your cloud uses a different CPU architecture than your development
machine (e.g., you are on a Mac M1 and your cloud provider is amd64),
you'll want to build the image for that platform, e.g.:
`docker build --platform=linux/amd64 -t myapp .`.

Then, push it to your registry, e.g. `docker push myregistry.com/myapp`.

Consult Docker's [getting started](https://docs.docker.com/go/get-started-sharing/)
docs for more detail on building and pushing.

### References

- [Docker's Node.js guide](https://docs.docker.com/language/nodejs/)
