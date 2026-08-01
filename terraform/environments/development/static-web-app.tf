resource "azurerm_static_web_app" "frontend" {
  name                = "deliveroo-web-dev"
  resource_group_name = azurerm_resource_group.platform.name
  location            = "eastasia"

  sku_tier = "Free"
  sku_size = "Free"

  configuration_file_changes_enabled = true
  preview_environments_enabled       = true
  public_network_access_enabled      = true

  lifecycle {
    prevent_destroy = true

    ignore_changes = [
      repository_branch,
      repository_url,
    ]
  }
}
