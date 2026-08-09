variable "subscription_id" {
  description = "Azure subscription ID containing the FoodFlow development platform."
  type        = string

  validation {
    condition     = length(trimspace(var.subscription_id)) > 0
    error_message = "subscription_id must not be empty."
  }
}

variable "location" {
  description = "Primary Azure region for the development platform."
  type        = string
  default     = "southeastasia"
}

variable "environment" {
  description = "Deployment environment represented by this Terraform root."
  type        = string
  default     = "development"

  validation {
    condition     = var.environment == "development"
    error_message = "This Terraform root manages only the development environment."
  }
}

variable "resource_group_name" {
  description = "Existing FoodFlow development resource group to adopt."
  type        = string
  default     = "deliveroo-rg"
}

variable "container_registry_name" {
  description = "Existing Azure Container Registry used by FoodFlow services."
  type        = string
  default     = "deliveroodevacr"
}

variable "ssh_source_address_prefix" {
  description = "Public IP allowed to access the development VM over SSH."
  type        = string

  validation {
    condition = (
      can(cidrhost(trimspace(var.ssh_source_address_prefix), 0)) &&
      !contains(["0.0.0.0/0", "::/0"], trimspace(var.ssh_source_address_prefix))
    )
    error_message = "ssh_source_address_prefix must be a controlled IPv4 or IPv6 CIDR and must not allow the entire Internet."
  }
}

variable "vm_admin_ssh_public_key" {
  description = "Existing SSH public key configured on the development VM."
  type        = string
}

variable "static_web_app_location" {
  description = "Azure region of the existing development Static Web App."
  type        = string
  default     = "eastasia"

  validation {
    condition     = length(trimspace(var.static_web_app_location)) > 0
    error_message = "static_web_app_location must not be empty."
  }
}

variable "vm_shutdown_notification_email" {
  description = "Email receiving VM shutdown notifications."
  type        = string

  validation {
    condition     = length(trimspace(var.vm_shutdown_notification_email)) > 0
    error_message = "vm_shutdown_notification_email must not be empty."
  }
}
