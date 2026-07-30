# FoodFlow Azure Infrastructure

This directory is the single Terraform owner for the shared FoodFlow Azure
platform. The frontend and all Node services deploy applications onto resources
created or adopted here; they must not create competing Terraform states for the
same resources.

Terraform provisions infrastructure. Application repositories remain
responsible for testing, building, publishing, and deploying their own container
images.

## Layout

```text
terraform/
├── bootstrap/
│   ├── backend.hcl.example
│   ├── main.tf
│   ├── outputs.tf
│   ├── providers.tf
│   ├── terraform.tfvars.example
│   └── variables.tf
└── environments/
    └── development/
        ├── backend.hcl.example
        ├── backend.tf
        ├── imports.tf
        ├── main.tf
        ├── outputs.tf
        ├── providers.tf
        ├── terraform.tfvars.example
        └── variables.tf
```

`bootstrap` creates the Azure Storage account and container used for remote
Terraform state. Its first apply uses local state because the remote backend
does not exist yet. After creation, migrate bootstrap state to
`foodflow/bootstrap.tfstate`.

`environments/development` will adopt and manage the existing development
platform. It intentionally contains no Azure resource blocks yet: defining
existing resources inaccurately and applying before importing could create
duplicates or replace the current VM.

## Prerequisites

- Terraform 1.10 or newer
- Azure CLI
- An Azure subscription where the current user can create role assignments

Authenticate and select the intended subscription:

```bash
az login
az account set --subscription "<subscription-name-or-id>"
az account show
```

## 1. Bootstrap remote state

Choose a globally unique, lowercase Storage account name:

```bash
cd terraform/bootstrap
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`, then run:

```bash
terraform init
terraform fmt -check
terraform validate
terraform plan -out=tfplan
terraform apply tfplan
```

The bootstrap grants the current Azure principal `Storage Blob Data
Contributor` on the dedicated state resource group before accessing the
Storage data plane. AzureRM uses Microsoft Entra ID for Blob operations, so
shared-key authentication remains disabled. It does not store Azure credentials
in Terraform variables.

Automatic Azure resource-provider registration is disabled in both Terraform
roots. The namespaces used by the existing platform are already registered in
the subscription, and this prevents plans from waiting on unrelated namespaces.
Register a newly required namespace deliberately before adding a resource from
an Azure service that the subscription has not used before.

Keep the bootstrap state secure. Do not commit it. The state resources have
`prevent_destroy` enabled because losing them can also remove environment state
history.

## 2. Migrate bootstrap state to Azure

```bash
cd terraform/bootstrap
cp backend.hcl.example backend.hcl
```

Fill `backend.hcl` with the bootstrap outputs and subscription ID, then migrate:

```bash
terraform init -migrate-state -backend-config=backend.hcl
```

Approve the state copy when prompted. Confirm `terraform state list` still
shows all bootstrap resources before continuing.

## 3. Configure the development backend

```bash
cd ../environments/development
cp backend.hcl.example backend.hcl
cp terraform.tfvars.example terraform.tfvars
```

Fill in both ignored files using the bootstrap outputs and the selected Azure
subscription ID. Then initialize:

```bash
terraform init -backend-config=backend.hcl
terraform fmt -check
terraform validate
```

Do not put passwords, database URLs, Stripe keys, Resend keys, API keys, or
other application secrets in Terraform variables. Terraform state may retain
sensitive values even when output is marked sensitive.

## 4. Adopt existing development resources

The following live resources were identified in `deliveroo-rg` and should be
adopted incrementally:

- `deliveroodevacr`
- `deliveroo-services-dev-vm_key`
- `deliveroo-services-dev-vm-nsg`
- `deliveroo-services-dev-vnet`
- `deliveroo-services-dev-vm`
- The VM public IP, network interface, and OS disk
- The VM auto-shutdown schedule
- `deliveroo-web-dev`

For each resource:

1. Write a resource block matching its current Azure configuration.
2. Add a declarative `import` block in `imports.tf`.
3. Run `terraform plan`.
4. Correct every unexpected update or replacement.
5. Apply only when the plan contains the intended import and no accidental
   infrastructure changes.

Do not import Azure-managed resources such as Network Watcher unless there is a
clear reason for this project to own their lifecycle.

## Workflow policy

- Pull requests changing `terraform/**` run formatting and validation checks.
- No automatic `terraform apply` workflow is included yet.
- Apply should be added only after remote state, imports, and GitHub-to-Azure
  OIDC authentication are working.
- Frontend release workflows ignore `terraform/**`, so an infrastructure-only
  commit does not publish a frontend version.

## Future environments

Do not extract a reusable module until the development configuration is
imported and stable. When production is required, extract the repeated platform
resources into `terraform/modules/azure-vm-platform` and call that module from
separate development and production roots with separate state files.
