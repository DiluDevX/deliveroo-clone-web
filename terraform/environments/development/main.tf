resource "azurerm_resource_group" "platform" {
  name     = var.resource_group_name
  location = var.location

  lifecycle {
    prevent_destroy = true
  }
}

resource "azurerm_container_registry" "platform" {
  name                = var.container_registry_name
  resource_group_name = azurerm_resource_group.platform.name
  location            = azurerm_resource_group.platform.location
  sku                 = "Basic"

  admin_enabled                 = true
  network_rule_bypass_option    = "AzureServices"
  public_network_access_enabled = true

  lifecycle {
    prevent_destroy = true
  }
}
