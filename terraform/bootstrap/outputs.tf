output "backend_resource_group_name" {
  description = "Resource group to place in the development backend configuration."
  value       = azurerm_resource_group.state.name
}

output "backend_storage_account_name" {
  description = "Storage account to place in the development backend configuration."
  value       = azurerm_storage_account.state.name
}

output "backend_container_name" {
  description = "Blob container to place in the development backend configuration."
  value       = azurerm_storage_container.state.name
}
