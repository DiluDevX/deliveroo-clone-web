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
