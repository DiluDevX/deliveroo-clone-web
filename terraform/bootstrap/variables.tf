variable "subscription_id" {
  description = "Azure subscription ID that will contain the Terraform state resources."
  type        = string

  validation {
    condition     = length(trimspace(var.subscription_id)) > 0
    error_message = "subscription_id must not be empty."
  }
}

variable "location" {
  description = "Azure region for the Terraform state resources."
  type        = string
  default     = "southeastasia"
}

variable "resource_group_name" {
  description = "Resource group dedicated to Terraform state."
  type        = string
  default     = "deliveroo-terraform-state-rg"
}

variable "storage_account_name" {
  description = "Globally unique Azure Storage account name for Terraform state."
  type        = string

  validation {
    condition     = can(regex("^[a-z0-9]{3,24}$", var.storage_account_name))
    error_message = "storage_account_name must contain 3-24 lowercase letters or numbers."
  }
}

variable "container_name" {
  description = "Private Blob container used for Terraform state files."
  type        = string
  default     = "tfstate"

  validation {
    condition     = can(regex("^[a-z0-9](?:[a-z0-9-]{1,61}[a-z0-9])?$", var.container_name))
    error_message = "container_name must be a valid 3-63 character Azure container name."
  }
}
