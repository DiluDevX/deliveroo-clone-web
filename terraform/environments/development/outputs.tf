output "resource_group_id" {
  description = "ID of the imported FoodFlow development resource group."
  value       = azurerm_resource_group.platform.id
}

output "resource_group_location" {
  description = "Azure region of the FoodFlow development resource group."
  value       = azurerm_resource_group.platform.location
}

output "resource_group_name" {
  description = "Name of the imported FoodFlow development resource group."
  value       = azurerm_resource_group.platform.name
}

output "container_registry_id" {
  description = "ID of the imported FoodFlow Azure Container Registry."
  value       = azurerm_container_registry.platform.id
}

output "container_registry_login_server" {
  description = "Login server used by service image deployment workflows."
  value       = azurerm_container_registry.platform.login_server
}

output "container_registry_name" {
  description = "Name of the imported FoodFlow Azure Container Registry."
  value       = azurerm_container_registry.platform.name
}
